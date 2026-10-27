import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommunityStoreService } from '../core/community-store.service';

@Component({
  selector: 'app-community-chat-dock',
  imports: [FormsModule, RouterLink],
  template: `
    <button class="chat-launcher" (click)="open.set(!open())" [attr.aria-expanded]="open()">
      ◯ Mensagens <span>{{ open() ? '−' : '+' }}</span>
    </button>
    @if (open()) {
      <section class="chat-dock panel" aria-label="Mensagens rápidas">
        <div class="panel-title">
          <h2>Mensagens</h2>
          <button class="icon-button" aria-label="Fechar mensagens" (click)="open.set(false)">
            ×
          </button>
        </div>
        <label
          >Squad de destino
          <select
            aria-label="Squad de destino"
            [ngModel]="targetSquad()"
            (ngModelChange)="targetSquad.set($event)"
          >
            @for (squad of community.squads; track squad.id) {
              <option [value]="squad.id">{{ squad.name }}</option>
            }
          </select>
        </label>
        <div class="message-list" aria-live="polite">
          @for (message of conversation(); track message.id) {
            <div class="message" [class.sent]="message.sent">
              @if (message.contact) {
                <small>CARD DE CONTATO</small><strong>{{ message.contact }}</strong>
              } @else {
                <p>{{ message.text }}</p>
              }
              <small>{{
                message.sent
                  ? (community.squad(message.senderSquadId ?? '')?.name ?? 'Squad')
                  : community.squad(message.senderSquadId ?? message.squadId)?.name
              }}</small>
            </div>
          } @empty {
            <p>Comece uma conversa.</p>
          }
        </div>
        @if (community.atlas.user() && paidSquads().length) {
          <form (ngSubmit)="send()">
            <label
              >Enviar como
              <select
                name="senderSquad"
                [ngModel]="senderSquadId()"
                (ngModelChange)="senderSquadId.set($event)"
                required
              >
                <option value="">Selecione seu squad pago</option>
                @for (squad of paidSquads(); track squad.id) {
                  <option [value]="squad.id">{{ squad.name }}</option>
                }
              </select>
            </label>
            <input
              name="message"
              [ngModel]="draft()"
              (ngModelChange)="draft.set($event)"
              placeholder="Escreva uma mensagem…"
              aria-label="Mensagem"
            />
            <div class="composer-footer">
              <button
                type="button"
                class="text-button"
                [disabled]="!senderSquadId()"
                (click)="sendContact()"
              >
                Contato +
              </button>
              <button class="primary-button" [disabled]="!draft().trim() || !senderSquadId()">
                Enviar ↗
              </button>
            </div>
          </form>
        } @else if (community.atlas.user()) {
          <p class="local-notice">Somente squads no Plano 1 podem iniciar conversas.</p>
        } @else {
          <a routerLink="/login" class="text-button">Entre para conversar →</a>
        }
        <a routerLink="/chat" class="text-button">Abrir página de mensagens ↗</a>
        <p class="local-notice">Prévia local, sem entrega a outros usuários.</p>
      </section>
    }
  `,
})
export class CommunityChatDockComponent {
  readonly community = inject(CommunityStoreService);
  readonly open = signal(false);
  readonly targetSquad = signal(this.community.lastSquadId() ?? 'atlas');
  readonly senderSquadId = signal('');
  readonly draft = signal('');
  readonly paidSquads = computed(() =>
    this.community.squads.filter((squad) => this.community.isPaidMember(squad.id)),
  );
  readonly conversation = computed(() =>
    this.community.messages().filter((message) => message.squadId === this.targetSquad()),
  );

  send(): void {
    if (this.community.send(this.targetSquad(), this.draft(), undefined, this.senderSquadId()))
      this.draft.set('');
  }

  sendContact(): void {
    const user = this.community.atlas.user();
    if (user)
      this.community.send(
        this.targetSquad(),
        '',
        `${user.name} · ${user.email}`,
        this.senderSquadId(),
      );
  }
}
