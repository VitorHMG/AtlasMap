import { Component, computed, effect, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommunityStoreService } from '../../core/community-store.service';

@Component({
  selector: 'app-squads-home',
  imports: [RouterLink],
  templateUrl: './squads-home.component.html',
})
export class SquadsHomeComponent {
  readonly store = inject(CommunityStoreService);
  private readonly router = inject(Router);
  readonly joined = computed(() =>
    this.store.squads.filter((squad) => this.store.memberships().includes(squad.id)),
  );

  constructor() {
    effect(() => {
      const squadId = this.store.lastSquadId() ?? this.joined()[0]?.id;
      if (squadId) void this.router.navigate(['/squad', squadId], { replaceUrl: true });
    });
  }

  acceptInvite(id: string): void {
    if (this.store.acceptInvite(id)) void this.router.navigate(['/squad', id]);
  }
}
