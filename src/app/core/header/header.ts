import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
  imports: [CommonModule],
})
export class Header {
  userName: string | null = null;

  constructor(private router: Router) {
    const user = localStorage.getItem('user');
    if (user) {
      this.userName = JSON.parse(user).name;
      console.log(`Usuario autenticado: ${this.userName}`);
    }
  }

  logout() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
        Swal.fire('Cerraste sesión', '', 'success');
      }
    });
  }

}
