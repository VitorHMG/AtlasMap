import { Injectable, computed, inject, signal } from '@angular/core';
import { AtlasStoreService } from './atlas-store.service';

export interface Squad {
  id: string;
  name: string;
  description: string;
  city: string;
  address?: string;
  image: string;
  members: string[];
  languages: string[];
  technologies: string[];
  areas: string[];
  plan: 'freemium' | 'plan1';
  ownerEmail?: string;
  ownerName?: string;
}
export interface Post {
  id: string;
  squadId: string;
  projectId: string;
  content: string;
  date: string;
  likes: number;
  liked: boolean;
  comments: { author: string; text: string }[];
}
export interface Message {
  id: string;
  squadId: string;
  text: string;
  sent: boolean;
  contact?: string;
  senderSquadId?: string;
}
@Injectable({ providedIn: 'root' })
export class CommunityStoreService {
  readonly atlas = inject(AtlasStoreService);
  private readonly builtInSquads: Squad[] = [
    {
      id: 'atlas',
      name: 'Squad Atlas',
      description:
        'Conectamos tecnologia e energia limpa para transformar o futuro das cidades. Um squad multidisciplinar construindo soluções de impacto real.',
      city: 'São Paulo, SP',
      image: 'assets/site/projeto-solar.jpg',
      members: ['Vitor Magalhães', 'Giovanni', 'Matheus'],
      languages: ['TypeScript', 'Python'],
      technologies: ['Angular', 'IoT', 'PostgreSQL'],
      areas: ['Energia solar', 'Energia eólica'],
      plan: 'plan1',
    },
    {
      id: 'verde',
      name: 'Squad Raízes',
      description:
        'Pesquisa, dados e colaboração para uma relação mais sustentável com os recursos naturais.',
      city: 'Foz do Iguaçu, PR',
      image: 'assets/site/projeto-biomassa.jpg',
      members: ['Rodrigo', 'Erick'],
      languages: ['Python', 'JavaScript'],
      technologies: ['React', 'Sensores', 'GIS'],
      areas: ['Biomassa', 'Recursos hídricos'],
      plan: 'freemium',
    },
  ];
  readonly createdSquads = signal<Squad[]>(this.read('atlas-squads', []));
  get squads(): Squad[] {
    return [...this.builtInSquads, ...this.createdSquads()];
  }
  readonly projects = computed(() =>
    this.atlas.projects().map((p) => ({
      ...p,
      squadId:
        p.squadId ??
        (['hidreletrico', 'biomassa'].includes(p.id) ? 'verde' : p.userCreated ? '' : 'atlas'),
      city:
        (
          {
            solar: 'São Paulo, SP',
            eolico: 'Fortaleza, CE',
            hidreletrico: 'Foz do Iguaçu, PR',
            biomassa: 'Sorocaba, SP',
          } as Record<string, string>
        )[p.id] ?? 'Localização cadastrada no mapa',
      address:
        p.address ??
        (
          {
            solar: 'São Paulo, São Paulo, Brasil',
            eolico: 'Fortaleza, Ceará, Brasil',
            hidreletrico: 'Foz do Iguaçu, Paraná, Brasil',
            biomassa: 'Sorocaba, São Paulo, Brasil',
          } as Record<string, string>
        )[p.id] ??
        `${p.coordinates[1]}, ${p.coordinates[0]}`,
      status:
        p.status ??
        (p.id === 'solar'
          ? 'Em desenvolvimento'
          : p.id === 'biomassa'
            ? 'Em pesquisa'
            : 'Em operação'),
      tags:
        p.tags ??
        (p.id === 'solar'
          ? ['Energia solar', 'IoT', 'Python']
          : p.id === 'eolico'
            ? ['Energia eólica', 'IoT', 'TypeScript']
            : p.id === 'hidreletrico'
              ? ['Recursos hídricos', 'GIS', 'Python']
              : p.id === 'biomassa'
                ? ['Biomassa', 'Sensores', 'JavaScript']
                : ['Sustentabilidade']),
      updated: p.updated ?? (p.userCreated ? '' : '2026-10-06T14:30:00'),
      visibility:
        p.visibility ??
        (p.squadId === 'verde' || ['hidreletrico', 'biomassa'].includes(p.id) ? 'open' : 'closed'),
      featured: p.featured ?? (p.squadId === 'atlas' || ['solar', 'eolico'].includes(p.id)),
      showOnMap: p.showOnMap ?? (p.squadId === 'atlas' || ['solar', 'eolico'].includes(p.id)),
    })),
  );
  readonly posts = signal<Post[]>(
    this.read('atlas-community-posts', [
      {
        id: 'post-solar',
        squadId: 'atlas',
        projectId: 'solar',
        content:
          'Mais um passo para uma cidade movida por energia limpa. ☀️ Nosso protótipo de monitoramento solar já está em fase de testes! Estamos conectando sensores e dados para entender o desempenho dos painéis em tempo real.',
        date: '2026-10-06T14:30:00',
        likes: 24,
        liked: false,
        comments: [
          {
            author: 'Rodrigo',
            text: 'Excelente iniciativa! Vamos trocar ideias sobre os sensores.',
          },
        ],
      },
      {
        id: 'post-biomassa',
        squadId: 'verde',
        projectId: 'biomassa',
        content:
          'O que hoje é resíduo pode ser a energia de amanhã. 🌱 Iniciamos o mapeamento de fontes de biomassa na região de Sorocaba. Acompanhe os próximos resultados por aqui.',
        date: '2026-10-05T10:00:00',
        likes: 18,
        liked: false,
        comments: [],
      },
      {
        id: 'post-eolico',
        squadId: 'atlas',
        projectId: 'eolico',
        content:
          'Novos dados do nosso projeto eólico em Fortaleza! A colaboração entre pessoas e tecnologia faz a diferença na transição energética.',
        date: '2026-10-04T09:00:00',
        likes: 32,
        liked: false,
        comments: [],
      },
    ]),
  );
  readonly messages = signal<Message[]>(
    this.read('atlas-community-messages', [
      {
        id: 'welcome',
        squadId: 'atlas',
        text: 'Olá! Este é um exemplo de conversa do Squad Atlas. Conte sobre o seu projeto.',
        sent: false,
      },
    ]),
  );
  readonly memberships = signal<string[]>(this.read('atlas-memberships', []));
  readonly invitations = signal<string[]>(this.read('atlas-invitations', []));
  readonly lastSquadId = signal<string | null>(this.read('atlas-last-squad', null));
  squad(id: string) {
    return this.squads.find((s) => s.id === id);
  }
  createSquad(input: { name: string; description: string; address: string }): Squad | null {
    const user = this.atlas.user();
    if (!user || !input.name.trim() || !input.description.trim()) return null;
    const squad: Squad = {
      id: `squad-${crypto.randomUUID()}`,
      name: input.name.trim(),
      description: input.description.trim(),
      city: input.address.trim() || 'Endereço não informado',
      address: input.address.trim(),
      image: 'assets/site/atlasmap.png',
      members: [user.name],
      languages: [],
      technologies: [],
      areas: [],
      plan: 'freemium',
      ownerEmail: user.email,
      ownerName: user.name,
    };
    const squads = [...this.createdSquads(), squad];
    this.createdSquads.set(squads);
    this.write('atlas-squads', squads);
    const memberships = [...new Set([...this.memberships(), squad.id])];
    this.memberships.set(memberships);
    this.write('atlas-memberships', memberships);
    this.interactWithSquad(squad.id);
    return squad;
  }
  canJoin(id: string): boolean {
    const squad = this.squad(id);
    return (
      !!squad &&
      (squad.plan === 'plan1' ||
        this.projects().some((p) => p.squadId === id && p.visibility === 'open'))
    );
  }
  isPaidMember(id: string): boolean {
    return this.memberships().includes(id) && this.squad(id)?.plan === 'plan1';
  }
  interactWithSquad(id: string): void {
    if (!this.squad(id)) return;
    this.lastSquadId.set(id);
    this.write('atlas-last-squad', id);
  }
  acceptInvite(id: string): boolean {
    if (!this.atlas.user() || !this.invitations().includes(id) || !this.canJoin(id)) return false;
    if (!this.memberships().includes(id)) {
      const next = [...this.memberships(), id];
      this.memberships.set(next);
      this.write('atlas-memberships', next);
    }
    const nextInvitations = this.invitations().filter((squadId) => squadId !== id);
    this.invitations.set(nextInvitations);
    this.write('atlas-invitations', nextInvitations);
    this.interactWithSquad(id);
    return true;
  }
  join(id: string): boolean {
    if (!this.atlas.user()) return false;
    const joining = !this.memberships().includes(id);
    if (joining && !this.canJoin(id)) return false;
    const next = this.memberships().includes(id)
      ? this.memberships().filter((x) => x !== id)
      : [...this.memberships(), id];
    this.memberships.set(next);
    this.write('atlas-memberships', next);
    return true;
  }
  like(id: string) {
    this.updatePosts(
      this.posts().map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p,
      ),
    );
  }
  comment(id: string, text: string) {
    if (!text.trim() || !this.atlas.user()) return;
    this.updatePosts(
      this.posts().map((p) =>
        p.id === id
          ? {
              ...p,
              comments: [...p.comments, { author: this.atlas.user()!.name, text: text.trim() }],
            }
          : p,
      ),
    );
  }
  publish(squadId: string, projectId: string, content: string) {
    if (
      !content.trim() ||
      !this.atlas.user() ||
      !this.memberships().includes(squadId) ||
      !this.projects().some((p) => p.id === projectId && p.squadId === squadId)
    )
      return false;
    this.updatePosts([
      {
        id: crypto.randomUUID(),
        squadId,
        projectId,
        content: content.trim(),
        date: new Date().toISOString(),
        likes: 0,
        liked: false,
        comments: [],
      },
      ...this.posts(),
    ]);
    return true;
  }
  send(squadId: string, text: string, contact?: string, senderSquadId?: string): boolean {
    if (
      !this.atlas.user() ||
      (!text.trim() && !contact) ||
      !senderSquadId ||
      !this.isPaidMember(senderSquadId) ||
      !this.squad(squadId)
    )
      return false;
    const next = [
      ...this.messages(),
      { id: crypto.randomUUID(), squadId, text: text.trim(), sent: true, contact, senderSquadId },
    ];
    this.messages.set(next);
    this.write('atlas-community-messages', next);
    return true;
  }
  private updatePosts(posts: Post[]) {
    this.posts.set(posts);
    this.write('atlas-community-posts', posts);
  }
  private read<T>(key: string, fallback: T): T {
    try {
      return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback;
    } catch {
      return fallback;
    }
  }
  private write(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
