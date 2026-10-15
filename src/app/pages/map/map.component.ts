import { AfterViewInit, Component, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AtlasProject, AtlasStoreService } from '../../core/atlas-store.service';
import { AppHeaderComponent } from '../../shared/app-header.component';
import { ProfileDrawerComponent } from '../../shared/profile-drawer.component';
import { ProjectFormComponent } from '../../shared/project-form.component';

@Component({
  selector: 'app-map',
  imports: [AppHeaderComponent, ProfileDrawerComponent, ProjectFormComponent],
  templateUrl: './map.component.html',
})
export class MapComponent implements AfterViewInit, OnDestroy {
  readonly store = inject(AtlasStoreService);
  private readonly route = inject(ActivatedRoute);
  readonly profileOpen = signal(false);
  readonly formOpen = signal(false);
  readonly editingProject = signal<AtlasProject | null>(null);
  readonly mapError = signal('');
  private map: any;
  private markerLayer: any;

  async ngAfterViewInit(): Promise<void> {
    try {
      const leaflet = await this.loadLeaflet();
      this.map = leaflet.map('atlas-map', { zoomControl: false }).setView([-15.5, -51.5], 4);
      leaflet
        .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        })
        .addTo(this.map);
      leaflet.control.zoom({ position: 'bottomright' }).addTo(this.map);
      this.renderProjects(leaflet);
      const selected = this.store
        .projects()
        .find((p) => p.id === this.route.snapshot.queryParamMap.get('projeto'));
      if (selected) this.map.setView([selected.coordinates[1], selected.coordinates[0]], 11);
    } catch {
      this.mapError.set('Não foi possível carregar o mapa. Verifique sua conexão com a internet.');
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
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

  refresh(): void {
    this.formOpen.set(false);
    if ((window as any).L && this.map) this.renderProjects((window as any).L);
  }

  private renderProjects(leaflet: any): void {
    this.markerLayer?.remove();
    this.markerLayer = leaflet.layerGroup().addTo(this.map);
    this.store.projects().forEach((project) => {
      const marker = leaflet.circleMarker([project.coordinates[1], project.coordinates[0]], {
        radius: 9,
        color: '#07150d',
        weight: 3,
        fillColor: '#53fa85',
        fillOpacity: 1,
      });
      const content = document.createElement('div');
      content.className = 'map-popup';
      const title = document.createElement('strong');
      title.textContent = project.name;
      const description = document.createElement('p');
      description.textContent = project.description;
      const image = document.createElement('img');
      image.src = project.image;
      image.alt = project.name;
      image.style.cssText =
        'width:100%;height:110px;object-fit:cover;border-radius:5px;margin-bottom:10px';
      const link = document.createElement('a');
      link.href = new URL(`projeto/${encodeURIComponent(project.id)}`, document.baseURI).href;
      link.textContent = 'Conhecer projeto →';
      link.style.cssText = 'display:block;margin-top:12px;color:#137854;font-weight:bold';
      content.append(image, title, description, link);
      marker.bindPopup(content);
      marker.addTo(this.markerLayer);
    });
  }

  private loadLeaflet(): Promise<any> {
    const current = (window as any).L;
    if (current) return Promise.resolve(current);
    if (!document.querySelector('link[data-leaflet]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.dataset['leaflet'] = 'true';
      document.head.appendChild(link);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => resolve((window as any).L);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
}
