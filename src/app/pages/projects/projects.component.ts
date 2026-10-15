import { Component, inject, signal } from '@angular/core';
import { AtlasProject, AtlasStoreService } from '../../core/atlas-store.service';
import { AppHeaderComponent } from '../../shared/app-header.component';
import { ProfileDrawerComponent } from '../../shared/profile-drawer.component';
import { ProjectFormComponent } from '../../shared/project-form.component';

@Component({
  selector: 'app-projects',
  imports: [AppHeaderComponent, ProfileDrawerComponent, ProjectFormComponent],
  templateUrl: './projects.component.html',
})
export class ProjectsComponent {
  readonly store = inject(AtlasStoreService);
  readonly profileOpen = signal(false);
  readonly formOpen = signal(false);
  readonly expandedId = signal<string | null>(null);
  readonly editingProject = signal<AtlasProject | null>(null);

  toggleCard(id: string): void {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  openCreate(): void {
    this.editingProject.set(null);
    this.formOpen.set(true);
    this.profileOpen.set(false);
  }

  openEdit(project: AtlasProject): void {
    this.editingProject.set(project);
    this.formOpen.set(true);
    this.profileOpen.set(false);
  }
}
