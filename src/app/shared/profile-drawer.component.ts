import { Component, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AtlasProject, AtlasStoreService } from '../core/atlas-store.service';

@Component({
  selector: 'app-profile-drawer',
  imports: [RouterLink],
  template: `
    <div class="drawer-backdrop" [class.open]="open()" (click)="close.emit()"></div>
    <aside class="profile-drawer" [class.open]="open()" aria-label="Perfil do usuário">
      <button class="icon-button drawer-close" type="button" aria-label="Fechar" (click)="close.emit()">×</button>
      <p class="eyebrow">AtlasMap</p>
      <h2>Perfil do usuário</h2>

      @if (store.user(); as user) {
        <div class="profile-summary">
          <span class="profile-avatar">{{ user.name.charAt(0).toUpperCase() }}</span>
          <div><strong>{{ user.name }}</strong><small>{{ user.email }}</small></div>
        </div>

        <div class="profile-tabs" role="tablist">
          <button [class.active]="tab() === 'mine'" (click)="tab.set('mine')">Meus projetos</button>
          <button [class.active]="tab() === 'liked'" (click)="tab.set('liked')">Projetos curtidos</button>
        </div>

        @if (tab() === 'mine') {
          <div class="profile-list">
            @for (project of store.createdProjects(); track project.id) {
              <article>
                <div><strong>{{ project.name }}</strong><small>{{ project.owner }}</small></div>
                <button type="button" (click)="edit.emit(project)">Editar</button>
              </article>
            } @empty {
              <p class="empty-state">Você ainda não criou projetos.</p>
            }
          </div>
          <button class="primary-button full-button" type="button" (click)="add.emit()">
            Adicionar novo projeto
          </button>
        } @else {
          <div class="profile-list">
            @for (project of store.likedProjects(); track project.id) {
              <article>
                <div><strong>{{ project.name }}</strong><small>{{ project.description }}</small></div>
              </article>
            } @empty {
              <p class="empty-state">Curta projetos para encontrá-los aqui.</p>
            }
          </div>
        }

        <button class="text-button danger" type="button" (click)="logout()">Sair</button>
      } @else {
        <div class="signed-out-state">
          <span class="profile-avatar">?</span>
          <h3>Você está desconectado</h3>
          <p>Entre para criar projetos e manter sua seleção de favoritos.</p>
          <a class="primary-button full-button" routerLink="/login" (click)="close.emit()">Entrar</a>
        </div>
      }
    </aside>
  `,
})
export class ProfileDrawerComponent {
  readonly store = inject(AtlasStoreService);
  private readonly router = inject(Router);
  readonly open = input(false);
  readonly close = output<void>();
  readonly add = output<void>();
  readonly edit = output<AtlasProject>();
  readonly tab = signal<'mine' | 'liked'>('mine');

  logout(): void {
    this.store.logout();
    this.close.emit();
    void this.router.navigate(['/projetos']);
  }
}
