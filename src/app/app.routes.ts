import { Routes } from '@angular/router';
import { Layout } from './core/layout/layout';
import { AuthLayout } from './core/auth-layout/auth-layout';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./modules/auth/login/login').then(m => m.Login)
      },
      {
        path: 'register',
        loadComponent: () => import('./modules/auth/register/register').then(m => m.Register)
      }
    ]
  },
  {
    path: 'app',
    component: Layout,
    children: [
      // {
      //   path: 'home',
      //   loadComponent: () => import('./modules/home/home').then(m => m.Home)
      // },
      // {
      //   path: 'videos',
      //   loadComponent: () => import('./modules/videos/videos').then(m => m.Videos)
      // },
      // {
      //   path: 'favorites',
      //   loadComponent: () => import('./modules/favorites/favorites').then(m => m.Favorites)
      // },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
