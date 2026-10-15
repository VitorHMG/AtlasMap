import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AtlasStoreService } from '../../core/atlas-store.service';

@Component({
  selector: 'app-auth',
  imports: [FormsModule, RouterLink],
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  private readonly store = inject(AtlasStoreService);
  private readonly router = inject(Router);
  readonly mode = signal<'login' | 'register'>('login');
  readonly message = signal('');

  name = '';
  email = '';
  phone = '';
  password = '';

  submit(): void {
    if (!this.email.trim() || !this.password.trim()) return;
    if (this.mode() === 'register') {
      if (!this.name.trim() || !this.phone.trim()) return;
      this.store.register(this.name.trim(), this.email.trim());
      this.message.set('Cadastro concluído. Agora entre com suas credenciais.');
      this.mode.set('login');
      this.password = '';
      return;
    }
    this.store.login(this.email.trim());
    void this.router.navigate(['/projetos']);
  }

  social(provider: string): void {
    this.store.login(`${provider.toLowerCase()}@atlasmap.com`);
    void this.router.navigate(['/projetos']);
  }

  changeMode(mode: 'login' | 'register'): void {
    this.mode.set(mode);
    this.message.set('');
  }
}
