import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppHeaderComponent } from '../../shared/app-header.component';
import { CommunityChatDockComponent } from '../../shared/community-chat-dock.component';
import { ProfileDrawerComponent } from '../../shared/profile-drawer.component';

@Component({
  selector: 'app-community-shell',
  imports: [RouterOutlet, AppHeaderComponent, CommunityChatDockComponent, ProfileDrawerComponent],
  templateUrl: './community-shell.component.html',
})
export class CommunityShellComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly profileOpen = signal(false);
  readonly currentUrl = signal(this.router.url);
  readonly showChatDock = computed(() => !this.currentUrl().split('?')[0].endsWith('/chat'));

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => this.currentUrl.set(event.urlAfterRedirects));
  }
}
