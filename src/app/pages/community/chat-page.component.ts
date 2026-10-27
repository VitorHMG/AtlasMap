import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommunityStoreService } from '../../core/community-store.service';

@Component({
  selector: 'app-chat-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './chat-page.component.html',
})
export class ChatPageComponent {
  readonly store = inject(CommunityStoreService);
  readonly chatSquad = signal(this.store.lastSquadId() ?? 'atlas');
  senderSquadId = '';
  message = '';
  readonly paidSquads = computed(() =>
    this.store.squads.filter((squad) => this.store.isPaidMember(squad.id)),
  );
  readonly conversation = computed(() =>
    this.store.messages().filter((item) => item.squadId === this.chatSquad()),
  );

  send(): void {
    if (this.store.send(this.chatSquad(), this.message, undefined, this.senderSquadId))
      this.message = '';
  }

  contact(): void {
    const user = this.store.atlas.user();
    if (user)
      this.store.send(this.chatSquad(), '', `${user.name} · ${user.email}`, this.senderSquadId);
  }
}
