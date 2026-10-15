import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.component').then((module) => module.LandingComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/auth.component').then((module) => module.AuthComponent),
  },
  {
    path: 'projetos',
    loadComponent: () =>
      import('./pages/projects/projects.component').then((module) => module.ProjectsComponent),
  },
  {
    path: 'mapa',
    loadComponent: () =>
      import('./pages/map/map.component').then((module) => module.MapComponent),
  },
  { path: '**', redirectTo: '' },
];
