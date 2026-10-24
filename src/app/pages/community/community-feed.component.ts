import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommunityStoreService } from '../../core/community-store.service';

@Component({
  selector: 'app-community-feed',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './community-feed.component.html',
})
export class CommunityFeedComponent {
  readonly store = inject(CommunityStoreService);
  readonly squadId = input<string | null>(null);
  readonly showHeading = input(false);
  readonly search = signal('');
  readonly joined = computed(() =>
    this.store.squads.filter((s) => this.store.memberships().includes(s.id)),
  );
  readonly filteredPosts = computed(() =>
    this.store
      .posts()
      .filter(
        (p) =>
          (!this.squadId() || p.squadId === this.squadId()) &&
          (!this.search() ||
            `${p.content} ${this.store.squad(p.squadId)?.name} ${this.store.projects().find((x) => x.id === p.projectId)?.name}`
              .toLocaleLowerCase('pt-BR')
              .includes(this.search().toLocaleLowerCase('pt-BR'))),
      ),
  );
  content = '';
  publishSquad = '';
  publishProject = '';
  commentDrafts: Record<string, string> = {};
  notice = '';

  publish(): void {
    if (this.store.publish(this.publishSquad, this.publishProject, this.content)) {
      this.content = '';
      this.notice = 'Publicação criada pelo squad.';
    } else {
      this.notice = 'Selecione um squad do qual participa, um projeto e escreva sua publicação.';
    }
  }

  comment(id: string): void {
    this.store.comment(id, this.commentDrafts[id] ?? '');
    this.commentDrafts[id] = '';
  }
}
