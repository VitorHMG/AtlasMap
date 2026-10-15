import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';
import { CommunityComponent } from './community.component';

describe('Community pages', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
  });
  it('renderiza as telas e atualiza o projeto ao navegar entre detalhes', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/discover', CommunityComponent);
    expect(harness.routeNativeElement?.textContent).toContain('Grandes ideias.');
    await harness.navigateByUrl('/projeto/solar', CommunityComponent);
    expect(harness.routeNativeElement?.textContent).toContain('Projeto Solar');
    await harness.navigateByUrl('/projeto/biomassa', CommunityComponent);
    expect(harness.routeNativeElement?.textContent).toContain('Projeto Biomassa');
    expect(harness.routeNativeElement?.textContent).not.toContain('Projeto Solar');
    await harness.navigateByUrl('/squad/verde', CommunityComponent);
    expect(harness.routeNativeElement?.textContent).toContain('Squad Raízes');
    await harness.navigateByUrl('/feed', CommunityComponent);
    expect(harness.routeNativeElement?.textContent).toContain('Feed da comunidade');
    await harness.navigateByUrl('/perfil', CommunityComponent);
    expect(harness.routeNativeElement?.textContent).toContain('Entre para acompanhar');
    await harness.navigateByUrl('/chat', CommunityComponent);
    expect(harness.routeNativeElement?.textContent).toContain(
      'não são entregues a outros usuários',
    );
  });
});
