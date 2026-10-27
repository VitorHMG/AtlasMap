import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AtlasStoreService } from '../../core/atlas-store.service';

@Component({
  selector: 'app-auth',
  imports: [FormsModule, RouterLink],
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  private readonly store = inject(AtlasStoreService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  email = '';
  password = '';

  submit(): void {
    if (!this.email.trim() || !this.password.trim()) return;
    this.store.login(this.email.trim());
    void this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('returnUrl') || '/squads');
  }

  social(provider: string): void {
    this.store.login(`${provider.toLowerCase()}@atlasmap.com`);
    void this.router.navigate(['/squads']);
  }
}
