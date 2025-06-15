import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as bcrypt from 'bcryptjs';
import { Firebase } from '../../../services/firebase';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css', '../../../styles/auth-styles.css'],
})
export class ResetPassword {
  password = '';
  confirmPassword = '';
  email = '';

  constructor(private route: ActivatedRoute, private router: Router, private firebaseService: Firebase) {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
  }

  async reset() {
    if (this.password.length < 8) {
      Swal.fire('Error', 'La contraseña debe tener al menos 8 caracteres.', 'warning');
      return;
    }

    if (this.password !== this.confirmPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden.', 'warning');
      return;
    }

    try {
      const hashed = await bcrypt.hash(this.password, 10);
      await this.firebaseService.updatePasswordByEmail(this.email, hashed);

      Swal.fire('Éxito', 'Contraseña actualizada', 'success');
      this.router.navigate(['/login']);
    } catch (e) {
      Swal.fire('Error', 'No se pudo actualizar la contraseña', 'error');
    }
  }

}
