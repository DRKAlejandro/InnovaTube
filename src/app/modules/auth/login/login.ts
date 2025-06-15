import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Firebase } from '../../../services/firebase';
import Swal from 'sweetalert2';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css', '../../../styles/auth-styles.css'],
})
export class Login {
  email: string = '';
  password: string = '';

  constructor(
    private firebaseService: Firebase,
    private router: Router
  ) { }

  async onLogin() {
    if (!this.email || !this.password) {
      Swal.fire('Campos vacíos', 'Por favor llena todos los campos.', 'warning');
      return;
    }

    try {
      const user = await this.firebaseService.getUserByEmail(this.email);

      if (!user) {
        Swal.fire('No encontrado', 'El correo no está registrado.', 'error');
        return;
      }

      const isPasswordCorrect = await bcrypt.compare(this.password, user.password);

      if (!isPasswordCorrect) {
        Swal.fire('Contraseña incorrecta', 'La contraseña no coincide.', 'error');
        return;
      }

      Swal.fire('¡Bienvenido!', `Hola, ${user.name}`, 'success');
      this.router.navigate(['/app/home']);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Algo salió mal. Intenta de nuevo.', 'error');
    }
  }
}
