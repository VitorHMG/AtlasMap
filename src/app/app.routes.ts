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
  { path: 'projetos', redirectTo: 'discover', pathMatch: 'full' },
  {
    path: 'mapa',
    loadComponent: () => import('./pages/map/map.component').then((module) => module.MapComponent),
  },
  ...['feed', 'discover', 'perfil', 'chat', 'squad/:id', 'projeto/:id'].map((path) => ({
    path,
    data: {
      page:
        (
          { perfil: 'profile', 'squad/:id': 'squad', 'projeto/:id': 'project' } as Record<
            string,
            string
          >
        )[path] ?? path,
    },
    loadComponent: () =>
      import('./pages/community/community.component').then((module) => module.CommunityComponent),
  })),
  { path: '**', redirectTo: '' },
];
