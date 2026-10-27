import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommunityStoreService } from '../../core/community-store.service';

@Component({
  selector: 'app-project-page',
  imports: [DatePipe, RouterLink],
  templateUrl: './project-page.component.html',
})
export class ProjectPageComponent {
  readonly store = inject(CommunityStoreService);
  private readonly route = inject(ActivatedRoute);
  readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  readonly project = computed(() =>
    this.store.projects().find((project) => project.id === this.params().get('id')),
  );
}
