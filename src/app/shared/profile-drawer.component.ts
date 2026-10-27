import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AtlasStoreService } from '../core/atlas-store.service';
import { CommunityStoreService } from '../core/community-store.service';

@Component({
  selector: 'app-profile-drawer',
  imports: [RouterLink],
  template: `
    <div class="drawer-backdrop" [class.open]="open()" (click)="close.emit()"></div>
    <aside class="profile-drawer" [class.open]="open()" aria-label="Perfil do usuário">
      <button
        class="icon-button drawer-close"
        type="button"
        aria-label="Fechar"
        (click)="close.emit()"
      >
        ×
      </button>
      <p class="eyebrow">AtlasMap</p>
      <h2>Perfil do usuário</h2>

      @if (store.user(); as user) {
        <div class="profile-summary">
          <span class="profile-avatar">{{ user.name.charAt(0).toUpperCase() }}</span>
          <div>
            <strong>{{ user.name }}</strong
            ><small>{{ user.email }}</small>
          </div>
        </div>

        <section class="panel squad-choice">
          <p class="eyebrow">Seus squads</p>
          @if (community.memberships().length) {
            <label
              >Squad selecionado
              <select
                aria-label="Selecionar squad"
                [value]="selectedSquadId()"
                (change)="selectSquad($any($event.target).value)"
              >
                @for (squadId of community.memberships(); track squadId) {
                  @if (community.squad(squadId); as squad) {
                    <option [value]="squad.id">{{ squad.name }}</option>
                  }
                }
              </select>
            </label>
          } @else {
            <p>Você não está em nenhum squad.</p>
          }
          @for (squadId of community.invitations(); track squadId) {
            @if (community.squad(squadId); as squad) {
              <article class="squad-invitation">
                <span>Convite para {{ squad.name }}</span>
                @if (community.canJoin(squad.id)) {
                  <button type="button" class="text-button" (click)="acceptInvite(squad.id)">
                    Aceitar e entrar
                  </button>
                } @else {
                  <small>Este squad ainda não tem projeto open-source.</small>
                }
              </article>
            }
          } @empty {
            @if (!community.memberships().length) {
              <small>Quando receber um convite, ele aparecerá aqui.</small>
            }
          }
          <div class="squad-choice-links">
            @if (community.squad(selectedSquadId()); as squad) {
              <a class="text-button" [routerLink]="['/squad', squad.id]" (click)="close.emit()"
                >Abrir {{ squad.name }} →</a
              >
            }
            <a class="text-button" routerLink="/squad/novo" (click)="close.emit()">+ Criar squad</a>
          </div>
        </section>

        <div class="profile-tabs" role="tablist">
          <button [class.active]="tab() === 'mine'" (click)="tab.set('mine')">Meus projetos</button>
          <button [class.active]="tab() === 'liked'" (click)="tab.set('liked')">
            Projetos curtidos
          </button>
        </div>

        @if (tab() === 'mine') {
          <div class="profile-list">
            @for (project of store.createdProjects(); track project.id) {
              <article>
                <div>
                  <strong>{{ project.name }}</strong
                  ><small>{{ project.owner }}</small>
                </div>
              </article>
            } @empty {
              <p class="empty-state">Você ainda não criou projetos.</p>
            }
          </div>
        } @else {
          <div class="profile-list">
            @for (project of store.likedProjects(); track project.id) {
              <article>
                <div>
                  <strong>{{ project.name }}</strong
                  ><small>{{ project.description }}</small>
                </div>
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
          <a class="primary-button full-button" routerLink="/login" (click)="close.emit()"
            >Entrar</a
          >
        </div>
      }
    </aside>
  `,
})
export class ProfileDrawerComponent {
  readonly store = inject(AtlasStoreService);
  readonly community = inject(CommunityStoreService);
  private readonly router = inject(Router);
  readonly open = input(false);
  readonly close = output<void>();
  readonly tab = signal<'mine' | 'liked'>('mine');
  readonly selectedSquadId = computed(() => {
    const memberships = this.community.memberships();
    const lastSquadId = this.community.lastSquadId();
    return lastSquadId && memberships.includes(lastSquadId) ? lastSquadId : (memberships[0] ?? '');
  });

  selectSquad(id: string): void {
    this.community.interactWithSquad(id);
    void this.router.navigate(['/squad', id]);
    this.close.emit();
  }

  acceptInvite(id: string): void {
    if (this.community.acceptInvite(id)) {
      void this.router.navigate(['/squad', id]);
      this.close.emit();
    }
  }

  logout(): void {
    this.store.logout();
    this.close.emit();
    void this.router.navigate(['/projetos']);
  }
}
