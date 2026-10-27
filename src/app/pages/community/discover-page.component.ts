import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommunityStoreService } from '../../core/community-store.service';

@Component({
  selector: 'app-discover-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './discover-page.component.html',
})
export class DiscoverPageComponent {
  readonly store = inject(CommunityStoreService);
  readonly search = signal('');
  readonly tag = signal('');
  readonly status = signal('');
  readonly city = signal('');
  readonly tags = computed(() => [
    ...new Set(this.store.projects().flatMap((project) => project.tags ?? [])),
  ]);
  readonly cities = computed(() => [
    ...new Set(this.store.projects().map((project) => project.city)),
  ]);
  readonly filteredProjects = computed(() =>
    this.store
      .projects()
      .filter(
        (project) =>
          (!this.search() ||
            `${project.name} ${project.description} ${this.store.squad(project.squadId ?? '')?.name ?? project.owner}`
              .toLocaleLowerCase('pt-BR')
              .includes(this.search().toLocaleLowerCase('pt-BR'))) &&
          (!this.tag() || project.tags?.includes(this.tag())) &&
          (!this.status() || project.status === this.status()) &&
          (!this.city() || project.city === this.city()),
      )
      .sort((a, b) => Number(!!b.featured) - Number(!!a.featured)),
  );

  reset(): void {
    this.search.set('');
    this.tag.set('');
    this.status.set('');
    this.city.set('');
  }
}
