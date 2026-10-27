import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommunityStoreService } from '../../core/community-store.service';

@Component({
  selector: 'app-squad-create',
  imports: [FormsModule, RouterLink],
  templateUrl: './squad-create.component.html',
})
export class SquadCreateComponent {
  readonly community = inject(CommunityStoreService);
  private readonly router = inject(Router);
  readonly error = signal('');

  name = '';
  description = '';
  address = '';

  create(): void {
    const squad = this.community.createSquad({
      name: this.name,
      description: this.description,
      address: this.address,
    });
    if (!squad) {
      this.error.set('Preencha o nome e a descrição para criar seu squad.');
      return;
    }
    void this.router.navigate(['/squad', squad.id]);
  }
}
