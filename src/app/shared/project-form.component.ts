import { Component, effect, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommunityStoreService } from '../core/community-store.service';
import { AtlasProject, AtlasStoreService } from '../core/atlas-store.service';

@Component({
  selector: 'app-project-form',
  imports: [FormsModule],
  template: `
    <div class="modal-backdrop" (click)="cancel.emit()"></div>
    <section
      class="project-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-form-title"
    >
      <button
        class="icon-button modal-close"
        type="button"
        aria-label="Fechar"
        (click)="cancel.emit()"
      >
        ×
      </button>
      <p class="eyebrow">Projeto sustentável</p>
      <h2 id="project-form-title">{{ project() ? 'Editar projeto' : 'Adicionar novo projeto' }}</h2>
      <form (ngSubmit)="submit()">
        <label>
          Nome do projeto
          <input
            name="name"
            [(ngModel)]="name"
            placeholder="Ex.: Horta urbana inteligente"
            required
          />
        </label>
        <label>
          Responsável
          <input
            name="owner"
            [(ngModel)]="owner"
            placeholder="Nome da equipe ou responsável"
            required
          />
        </label>
        <label>
          Descrição
          <textarea
            name="description"
            [(ngModel)]="description"
            placeholder="Descreva o impacto do projeto"
            required
          ></textarea>
        </label>
        <label
          >Squad responsável
          <select name="squad" [(ngModel)]="squadId">
            <option value="">Projeto independente</option>
            @for (s of community.squads; track s.id) {
              @if (community.memberships().includes(s.id) || project()?.squadId === s.id) {
                <option [value]="s.id">{{ s.name }}</option>
              }
            }
          </select>
        </label>
        <label
          >Endereço<input
            name="address"
            [(ngModel)]="address"
            placeholder="Cidade, estado ou endereço do projeto"
        /></label>
        <label
          >Status de desenvolvimento<select name="status" [(ngModel)]="status">
            <option>Em pesquisa</option>
            <option>Em desenvolvimento</option>
            <option>Em operação</option>
          </select></label
        >
        <label
          >Tags<input name="tags" [(ngModel)]="tags" placeholder="Ex.: Energia solar, Python, IoT"
        /></label>
        <div class="form-row">
          <label>
            Longitude
            <input
              name="longitude"
              type="number"
              step="any"
              [(ngModel)]="longitude"
              placeholder="-47.45"
              required
            />
          </label>
          <label>
            Latitude
            <input
              name="latitude"
              type="number"
              step="any"
              [(ngModel)]="latitude"
              placeholder="-23.50"
              required
            />
          </label>
        </div>
        <button class="primary-button full-button" type="submit">
          {{ project() ? 'Salvar alterações' : 'Cadastrar projeto' }}
        </button>
      </form>
    </section>
  `,
})
export class ProjectFormComponent {
  private readonly store = inject(AtlasStoreService);
  readonly community = inject(CommunityStoreService);
  readonly project = input<AtlasProject | null>(null);
  readonly cancel = output<void>();
  readonly saved = output<AtlasProject>();

  squadId = '';
  address = '';
  status = 'Em pesquisa';
  tags = '';
  name = '';
  owner = '';
  description = '';
  longitude: number | null = null;
  latitude: number | null = null;

  constructor() {
    effect(() => {
      const project = this.project();
      this.squadId = project?.squadId ?? '';
      this.address = project?.address ?? '';
      this.status = project?.status ?? 'Em pesquisa';
      this.tags = project?.tags?.join(', ') ?? '';
      this.name = project?.name ?? '';
      this.owner = project?.owner ?? this.store.user()?.name ?? '';
      this.description = project?.description ?? '';
      this.longitude = project?.coordinates[0] ?? null;
      this.latitude = project?.coordinates[1] ?? null;
    });
  }

  submit(): void {
    if (!this.name.trim() || !this.owner.trim() || !this.description.trim()) return;
    if (this.longitude === null || this.latitude === null) return;
    const result = this.store.saveProject(
      {
        squadId: this.squadId,
        address: this.address.trim(),
        status: this.status,
        tags: this.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        name: this.name.trim(),
        owner: this.owner.trim(),
        description: this.description.trim(),
        image: this.project()?.image ?? 'assets/site/atlasmap.png',
        coordinates: [Number(this.longitude), Number(this.latitude)],
      },
      this.project()?.id,
    );
    this.saved.emit(result);
  }
}
