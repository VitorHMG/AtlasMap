import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AtlasProject } from '../../core/atlas-store.service';
import { CommunityStoreService } from '../../core/community-store.service';
import { AppHeaderComponent } from '../../shared/app-header.component';
import { ProjectFormComponent } from '../../shared/project-form.component';
import { CommunityFeedComponent } from './community-feed.component';

@Component({
  selector: 'app-community',
  imports: [
    DatePipe,
    FormsModule,
    RouterLink,
    AppHeaderComponent,
    ProjectFormComponent,
    CommunityFeedComponent,
  ],
  templateUrl: './community.component.html',
})
export class CommunityComponent {
  readonly store = inject(CommunityStoreService);
  readonly route = inject(ActivatedRoute);
  readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  readonly routeData = toSignal(this.route.data, { initialValue: this.route.snapshot.data });
  get page(): string {
    return this.routeData()['page'];
  }
  readonly squad = computed(() => this.store.squad(this.params().get('id') ?? 'atlas'));
  readonly project = computed(() =>
    this.store.projects().find((p) => p.id === this.params().get('id')),
  );
  readonly expandedProjectIds = signal<string[]>([]);
  readonly paidSquads = computed(() => this.joined().filter((s) => s.plan === 'plan1'));
  readonly joined = computed(() =>
    this.store.squads.filter((s) => this.store.memberships().includes(s.id)),
  );
  readonly profileProjects = computed(() =>
    this.store
      .projects()
      .filter(
        (p) =>
          this.store.memberships().includes(p.squadId) ||
          (p.userCreated && p.owner === this.store.atlas.user()?.name),
      ),
  );
  readonly languages = computed(() => [...new Set(this.joined().flatMap((s) => s.languages))]);
  readonly technologies = computed(() => [
    ...new Set(this.joined().flatMap((s) => s.technologies)),
  ]);
  readonly areas = computed(() => [...new Set(this.profileProjects().flatMap((p) => p.tags))]);
  readonly profilePosts = computed(() =>
    this.store.posts().filter((p) => this.store.memberships().includes(p.squadId)),
  );
  readonly formOpen = signal(false);
  readonly editingProject = signal<AtlasProject | null>(null);
  readonly chatOpen = signal(false);
  readonly search = signal('');
  readonly tag = signal('');
  readonly status = signal('');
  readonly city = signal('');
  readonly tags = computed(() => [
    ...new Set(this.store.projects().flatMap((p) => p.tags as string[])),
  ]);
  readonly cities = computed(() => [...new Set(this.store.projects().map((p) => p.city))]);
  readonly filteredProjects = computed(() =>
    this.store
      .projects()
      .filter(
        (p) =>
          (!this.search() ||
            `${p.name} ${p.description} ${this.store.squad(p.squadId)?.name ?? p.owner}`
              .toLocaleLowerCase('pt-BR')
              .includes(this.search().toLocaleLowerCase('pt-BR'))) &&
          (!this.tag() || p.tags.includes(this.tag())) &&
          (!this.status() || p.status === this.status()) &&
          (!this.city() || p.city === this.city()),
      )
      .sort((a, b) => Number(!!b.featured) - Number(!!a.featured)),
  );
  readonly filteredPosts = computed(() =>
    this.store
      .posts()
      .filter(
        (p) =>
          (this.page !== 'squad' || p.squadId === this.squad()?.id) &&
          (!this.search() ||
            `${p.content} ${this.store.squad(p.squadId)?.name} ${this.store.projects().find((x) => x.id === p.projectId)?.name}`
              .toLocaleLowerCase('pt-BR')
              .includes(this.search().toLocaleLowerCase('pt-BR'))),
      ),
  );
  readonly chatSquad = signal('atlas');
  readonly conversation = computed(() =>
    this.store.messages().filter((m) => m.squadId === this.chatSquad()),
  );
  content = '';
  publishSquad = '';
  publishProject = '';
  commentDrafts: Record<string, string> = {};
  message = '';
  senderSquadId = '';
  notice = '';
  toggleProfileProject(id: string): void {
    const current = this.expandedProjectIds();
    this.expandedProjectIds.set(
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    );
  }
  publish() {
    if (this.store.publish(this.publishSquad, this.publishProject, this.content)) {
      this.content = '';
      this.notice = 'Publicação criada pelo squad.';
    } else
      this.notice = 'Selecione um squad do qual participa, um projeto e escreva sua publicação.';
  }
  comment(id: string) {
    this.store.comment(id, this.commentDrafts[id] ?? '');
    this.commentDrafts[id] = '';
  }
  send() {
    if (this.store.send(this.chatSquad(), this.message, undefined, this.senderSquadId))
      this.message = '';
  }
  contact() {
    const user = this.store.atlas.user();
    if (user)
      this.store.send(this.chatSquad(), '', `${user.name} · ${user.email}`, this.senderSquadId);
  }
  reset() {
    this.search.set('');
    this.tag.set('');
    this.status.set('');
    this.city.set('');
  }
}
