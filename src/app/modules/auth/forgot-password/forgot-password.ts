import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Firebase } from '../../../services/firebase';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css', '../../../styles/auth-styles.css'],
})
export class ForgotPassword {
  email: string = '';

  constructor(private firebaseService: Firebase, private router: Router) { }

  async sendReset() {
    try {
      const user = await this.firebaseService.getUserByEmail(this.email);
      if (!user) {
        Swal.fire('Correo no registrado', 'Verifica el email ingresado.', 'error');
        return;
      }

      this.sendResetEmail();
    } catch (error) {
      Swal.fire('Error', 'Ocurrió un error al buscar el correo.', 'error');
    }
  }
  sendResetEmail() {
    const templateParams = {
      reset_link: `${this.getBaseUrl()}/reset-password?email=${this.email}`,
      from_email: this.email,
    };

    console.log('Email a enviar:', templateParams.from_email);

    emailjs.send('service_zzmfc5u', 'template_rgjmijw', templateParams, 'VDLxwv24zMj1_f6JU')
      .then(() => {
        Swal.fire('Correo enviado', 'Revisa tu correo para continuar', 'success');
      }, (error) => {
        console.error('EmailJS error:', error);
        Swal.fire('Error', 'No se pudo enviar el correo', 'error');
      });
  }

  getBaseUrl(): string {
    return window.location.origin;
  }
}
