import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RecaptchaModule } from 'ng-recaptcha';
import { FormsModule } from '@angular/forms';
import { Firebase } from '../../../services/firebase'; 
import Swal from 'sweetalert2';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, RecaptchaModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css', '../../../styles/auth-styles.css'],
})
export class Register {
  captchaResponse: string | null = null;

  userData = {
    name: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  };

  confirmPassword: string = '';

  constructor(
    private firebaseService: Firebase,
    private router: Router
  ) { }

  handleCaptchaResolved(response: string | null) {
    this.captchaResponse = response;
    console.log('Captcha resolved:', response);
  }

  async onSubmit() {
    const { name, lastName, username, email, password } = this.userData;

    if (!name || !lastName || !username || !email || !password || !this.confirmPassword) {
      Swal.fire('Campos vacíos', 'Por favor completa todos los campos.', 'warning');
      return;
    }

    if (password.length < 8) {
      Swal.fire('Contraseña corta', 'La contraseña debe tener al menos 8 caracteres.', 'error');
      return;
    }

    if (password !== this.confirmPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden.', 'error');
      return;
    }

    if (!this.captchaResponse) {
      Swal.fire('Captcha requerido', 'Por favor completa el reCAPTCHA.', 'warning');
      return;
    }

    const emailTaken = await this.firebaseService.isEmailTaken(email);
    if (emailTaken) {
      Swal.fire('Correo en uso', 'Este correo ya está registrado. Usa otro diferente.', 'error');
      return;
    }

    try {
      this.userData.password = await bcrypt.hash(password, 10); 
      await this.firebaseService.addUser(this.userData);
      Swal.fire('¡Registro exitoso!', 'Tu cuenta ha sido creada correctamente.', 'success');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      Swal.fire('Error', 'Hubo un problema al registrar. Inténtalo de nuevo.', 'error');
    }
  }

}
