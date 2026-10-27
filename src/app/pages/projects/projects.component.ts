import { Component, inject, signal } from '@angular/core';
import { AtlasStoreService } from '../../core/atlas-store.service';
import { AppHeaderComponent } from '../../shared/app-header.component';
import { ProfileDrawerComponent } from '../../shared/profile-drawer.component';

@Component({
  selector: 'app-projects',
  imports: [AppHeaderComponent, ProfileDrawerComponent],
  templateUrl: './projects.component.html',
})
export class ProjectsComponent {
  readonly store = inject(AtlasStoreService);
  readonly profileOpen = signal(false);
  readonly expandedId = signal<string | null>(null);

  toggleCard(id: string): void {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }
}
