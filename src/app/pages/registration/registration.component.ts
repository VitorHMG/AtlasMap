import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AtlasStoreService } from '../../core/atlas-store.service';

@Component({
  selector: 'app-registration',
  imports: [FormsModule, RouterLink],
  templateUrl: './registration.component.html',
})
export class RegistrationComponent {
  private readonly store = inject(AtlasStoreService);
  private readonly router = inject(Router);
  readonly step = signal<'type' | 'details'>('type');
  readonly accountType = signal<'developer' | 'company' | null>(null);
  readonly error = signal('');

  name = '';
  email = '';
  password = '';
  birthDate = '';

  continue(): void {
    if (!this.accountType()) {
      this.error.set('Selecione se você é desenvolvedor(a) ou empresa.');
      return;
    }
    this.error.set('');
    this.step.set('details');
  }

  register(): void {
    if (!this.name.trim() || !this.email.trim() || !this.password || !this.accountType()) {
      this.error.set('Preencha todos os campos obrigatórios.');
      return;
    }
    this.store.register(this.name.trim(), this.email.trim(), {
      accountType: this.accountType()!,
      ...(this.birthDate ? { birthDate: this.birthDate } : {}),
    });
    void this.router.navigate(['/perfil']);
  }
}
