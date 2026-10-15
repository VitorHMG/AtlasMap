import { Component, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  template: ` <header class="app-header">
    <a class="app-brand" routerLink="/"
      ><img src="assets/site/atlasmap.png" alt="" /><span
        >Atlas<span class="brand-accent">Map</span></span
      ></a
    >
    <nav aria-label="Navegação principal">
      <a routerLink="/feed" routerLinkActive="active">Feed</a>
      <a routerLink="/discover" routerLinkActive="active">Discover</a>
      <a routerLink="/mapa" routerLinkActive="active">Mapeamento</a>
      <a routerLink="/squad/atlas" routerLinkActive="active">Squad</a>
      <a routerLink="/chat" routerLinkActive="active">Chat</a>
    </nav>
    <div class="header-actions">
      <button class="new-project-button" (click)="addProject.emit()">+ Projeto</button
      ><a class="profile-trigger" routerLink="/perfil" aria-label="Meu perfil">●</a>
    </div>
  </header>`,
})
export class AppHeaderComponent {
  readonly openProfile = output<void>();
  readonly addProject = output<void>();
}
