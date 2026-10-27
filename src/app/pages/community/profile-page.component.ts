import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommunityStoreService } from '../../core/community-store.service';

@Component({
  selector: 'app-profile-page',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent {
  readonly store = inject(CommunityStoreService);
  private readonly router = inject(Router);
  readonly joined = computed(() =>
    this.store.squads.filter((squad) => this.store.memberships().includes(squad.id)),
  );
  readonly profileProjects = computed(() =>
    this.store
      .projects()
      .filter(
        (project) =>
          this.store.memberships().includes(project.squadId ?? '') ||
          (project.userCreated && project.owner === this.store.atlas.user()?.name),
      ),
  );
  readonly languages = computed(() => [
    ...new Set(this.joined().flatMap((squad) => squad.languages)),
  ]);
  readonly technologies = computed(() => [
    ...new Set(this.joined().flatMap((squad) => squad.technologies)),
  ]);
  readonly areas = computed(() => [
    ...new Set(this.profileProjects().flatMap((project) => project.tags ?? [])),
  ]);
  readonly profilePosts = computed(() =>
    this.store.posts().filter((post) => this.store.memberships().includes(post.squadId)),
  );
  readonly expandedProjectIds = signal<string[]>([]);
  readonly editOpen = signal(false);
  name = '';
  email = '';
  birthDate = '';
  accountType: 'developer' | 'company' = 'developer';

  startEdit(): void {
    const user = this.store.atlas.user();
    if (!user) return;
    this.name = user.name;
    this.email = user.email;
    this.birthDate = user.birthDate ?? '';
    this.accountType = user.accountType ?? 'developer';
    this.editOpen.set(true);
  }

  saveProfile(): void {
    if (!this.name.trim() || !this.email.trim()) return;
    this.store.atlas.updateProfile({
      name: this.name.trim(),
      email: this.email.trim(),
      birthDate: this.birthDate,
      accountType: this.accountType,
    });
    this.editOpen.set(false);
  }

  toggleProject(id: string): void {
    const current = this.expandedProjectIds();
    this.expandedProjectIds.set(
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  logout(): void {
    this.store.atlas.logout();
    void this.router.navigate(['/login']);
  }
}
