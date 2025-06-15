import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('user');

    this.router.navigate(['/']);
  }
}
