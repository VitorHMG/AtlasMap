import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommunityStoreService } from '../../core/community-store.service';
import { AtlasProject } from '../../core/atlas-store.service';
import { ProjectFormComponent } from '../../shared/project-form.component';
import { CommunityFeedComponent } from './community-feed.component';

@Component({
  selector: 'app-squad-page',
  imports: [RouterLink, ProjectFormComponent, CommunityFeedComponent],
  templateUrl: './squad-page.component.html',
})
export class SquadPageComponent {
  readonly store = inject(CommunityStoreService);
  private readonly route = inject(ActivatedRoute);
  readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  readonly squad = computed(() => {
    return this.store.squad(this.params().get('id') ?? '');
  });
  readonly formOpen = signal(false);
  readonly editingProject = signal<AtlasProject | null>(null);

  constructor() {
    effect(() => {
      const squadId = this.params().get('id');
      if (squadId && this.store.squad(squadId)) this.store.interactWithSquad(squadId);
    });
  }

  openCreate(): void {
    if (!this.squad() || !this.store.memberships().includes(this.squad()!.id)) return;
    this.editingProject.set(null);
    this.formOpen.set(true);
  }
}
