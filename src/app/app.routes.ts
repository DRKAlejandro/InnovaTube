import { Routes } from '@angular/router';
import { Layout } from './core/layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      // { path: '', loadComponent: () => import('./modules/home/home').then(m => m.Home) },
      // {
      //   path: 'projects',
      //   loadChildren: () => import('./modules/projects/projects.module').then(m => m.ProjectsModule)
      // },
      // {
      //   path: 'experience',
      //   loadChildren: () => import('./modules/experience/experience.module').then(m => m.ExperiencesModule)
      // },
    ],
  },
];
