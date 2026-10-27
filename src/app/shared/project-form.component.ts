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
        aria-label="Fechar formulário"
        (click)="cancel.emit()"
      >
        ×
      </button>
      <p class="eyebrow">Projeto do squad</p>
      <h2 id="project-form-title">{{ project() ? 'Editar projeto' : 'Criar projeto' }}</h2>
      <form (ngSubmit)="submit()">
        <label for="project-name">Nome <span aria-hidden="true">*</span></label>
        <input
          id="project-name"
          name="name"
          [(ngModel)]="name"
          placeholder="Ex.: Horta urbana inteligente"
          required
        />

        <label for="project-description">Descrição <span aria-hidden="true">*</span></label>
        <textarea
          id="project-description"
          name="description"
          [(ngModel)]="description"
          placeholder="Descreva o objetivo e impacto do projeto"
          required
        ></textarea>

        <label for="project-location"
          >Localização <span class="optional-label">(opcional)</span></label
        >
        <input
          id="project-location"
          name="address"
          [(ngModel)]="address"
          placeholder="Cidade, estado ou endereço"
          autocomplete="street-address"
        />

        <label for="project-tags">Tags <span aria-hidden="true">*</span></label>
        <input
          id="project-tags"
          name="tags"
          [(ngModel)]="tags"
          placeholder="Ex.: Energia solar, Python, IoT"
          required
        />
        <small>Separe as tags por vírgula.</small>

        <label for="project-status">Status de desenvolvimento</label>
        <select id="project-status" name="status" [(ngModel)]="status">
          <option>Em pesquisa</option>
          <option>Em desenvolvimento</option>
          <option>Em operação</option>
        </select>

        <label for="project-squad">Squad responsável</label>
        <input id="project-squad" [value]="selectedSquadName" readonly aria-readonly="true" />

        <label for="project-visibility">Tipo de código</label>
        <select
          id="project-visibility"
          name="visibility"
          [(ngModel)]="visibility"
          [disabled]="!selectedPlan1"
        >
          <option value="open">Open-source</option>
          <option value="closed">Código fechado</option>
        </select>

        @if (selectedPlan1) {
          <label class="check-option"
            ><input type="checkbox" name="featured" [(ngModel)]="featured" /> Destacar projeto no
            Discover</label
          >
          <label class="check-option"
            ><input type="checkbox" name="showOnMap" [(ngModel)]="showOnMap" /> Mostrar localização
            no mapa</label
          >
        } @else {
          <p class="local-notice">Destaque, código fechado e exibição no mapa exigem o Plano 1.</p>
        }
        @if (selectedPlan1 && showOnMap) {
          <fieldset class="coordinate-fields">
            <legend>Coordenadas do projeto <span aria-hidden="true">*</span></legend>
            <div class="form-row">
              <label for="project-longitude">Longitude</label>
              <input
                id="project-longitude"
                name="longitude"
                type="number"
                step="any"
                [(ngModel)]="longitude"
                required
              />
              <label for="project-latitude">Latitude</label>
              <input
                id="project-latitude"
                name="latitude"
                type="number"
                step="any"
                [(ngModel)]="latitude"
                required
              />
            </div>
          </fieldset>
        }

        @if (error) {
          <p class="form-error" role="alert">{{ error }}</p>
        }
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
  readonly defaultSquadId = input<string | null>(null);
  readonly cancel = output<void>();
  readonly saved = output<AtlasProject>();

  squadId = '';
  visibility: 'open' | 'closed' = 'open';
  featured = false;
  showOnMap = false;
  address = '';
  status = 'Em pesquisa';
  tags = '';
  name = '';
  description = '';
  longitude: number | null = null;
  latitude: number | null = null;
  error = '';

  get selectedPlan1(): boolean {
    return this.community.squad(this.squadId)?.plan === 'plan1';
  }

  get selectedSquadName(): string {
    return this.community.squad(this.squadId)?.name ?? '';
  }

  constructor() {
    effect(() => {
      const project = this.project();
      this.squadId = project?.squadId ?? this.defaultSquadId() ?? '';
      this.visibility = project?.visibility ?? 'open';
      this.featured = project?.featured ?? false;
      this.showOnMap = project?.showOnMap ?? false;
      this.address = project?.address ?? '';
      this.status = project?.status ?? 'Em pesquisa';
      this.tags = project?.tags?.join(', ') ?? '';
      this.name = project?.name ?? '';
      this.description = project?.description ?? '';
      this.longitude = project?.coordinates[0] ?? null;
      this.latitude = project?.coordinates[1] ?? null;
      this.error = '';
    });
  }

  submit(): void {
    const tags = this.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    if (!this.name.trim() || !this.description.trim() || !tags.length || !this.squadId) {
      this.error = 'Preencha nome, descrição, tags e squad responsável.';
      return;
    }
    if (!this.selectedPlan1 && (this.visibility === 'closed' || this.featured || this.showOnMap)) {
      this.error = 'Os recursos selecionados exigem o Plano 1.';
      return;
    }
    if (this.showOnMap && (this.longitude === null || this.latitude === null)) {
      this.error = 'Informe latitude e longitude para exibir o projeto no mapa.';
      return;
    }
    const squad = this.community.squad(this.squadId);
    if (!squad) {
      this.error = 'Selecione um squad válido.';
      return;
    }
    const result = this.store.saveProject(
      {
        squadId: squad.id,
        visibility: this.visibility,
        featured: this.selectedPlan1 && this.featured,
        showOnMap: this.selectedPlan1 && this.showOnMap,
        address: this.address.trim(),
        status: this.status,
        tags,
        name: this.name.trim(),
        owner: squad.name,
        description: this.description.trim(),
        image: this.project()?.image ?? 'assets/site/atlasmap.png',
        coordinates: [this.longitude ?? 0, this.latitude ?? 0],
      },
      this.project()?.id,
    );
    this.saved.emit(result);
  }
}
