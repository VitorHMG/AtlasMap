import { Routes } from '@angular/router';
import { CommunityShellComponent } from './pages/community/community-shell.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/landing/landing.component').then((module) => module.LandingComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/auth.component').then((module) => module.AuthComponent),
  },
  {
    path: 'cadastro',
    loadComponent: () =>
      import('./pages/registration/registration.component').then(
        (module) => module.RegistrationComponent,
      ),
  },
  { path: 'projetos', redirectTo: 'discover', pathMatch: 'full' },
  {
    path: 'mapa',
    loadComponent: () => import('./pages/map/map.component').then((module) => module.MapComponent),
  },
  {
    path: '',
    component: CommunityShellComponent,
    children: [
      {
        path: 'feed',
        loadComponent: () =>
          import('./pages/community/feed-page.component').then((m) => m.FeedPageComponent),
      },
      {
        path: 'discover',
        loadComponent: () =>
          import('./pages/community/discover-page.component').then((m) => m.DiscoverPageComponent),
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./pages/community/profile-page.component').then((m) => m.ProfilePageComponent),
      },
      {
        path: 'chat',
        loadComponent: () =>
          import('./pages/community/chat-page.component').then((m) => m.ChatPageComponent),
      },
      {
        path: 'squads',
        loadComponent: () =>
          import('./pages/community/squads-home.component').then((m) => m.SquadsHomeComponent),
      },
      {
        path: 'squad/novo',
        loadComponent: () =>
          import('./pages/squad-create/squad-create.component').then((m) => m.SquadCreateComponent),
      },
      {
        path: 'squad/:id',
        loadComponent: () =>
          import('./pages/community/squad-page.component').then((m) => m.SquadPageComponent),
      },
      {
        path: 'projeto/:id',
        loadComponent: () =>
          import('./pages/community/project-page.component').then((m) => m.ProjectPageComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
