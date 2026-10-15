import { computed, Injectable, signal } from '@angular/core';

export interface AtlasUser {
  name: string;
  email: string;
}

export interface AtlasProject {
  id: string;
  name: string;
  owner: string;
  description: string;
  image: string;
  coordinates: [number, number];
  userCreated?: boolean;
  squadId?: string;
  status?: string;
  address?: string;
  tags?: string[];
  updated?: string;
}

const BUILT_IN_PROJECTS: AtlasProject[] = [
  {
    id: 'solar',
    name: 'Projeto Solar',
    owner: 'Equipe AtlasMap',
    description: 'Descrição curta sobre o monitoramento solar.',
    image: 'assets/site/projeto-solar.jpg',
    coordinates: [-46.63, -23.55],
  },
  {
    id: 'eolico',
    name: 'Projeto Eólico',
    owner: 'Equipe AtlasMap',
    description: 'Monitoramento de parques eólicos para otimização energética.',
    image: 'assets/site/projeto-eolico.png',
    coordinates: [-38.54, -3.73],
  },
  {
    id: 'hidreletrico',
    name: 'Projeto Hidrelétrico',
    owner: 'Equipe AtlasMap',
    description: 'Análise de reservatórios e geração hidrelétrica sustentável.',
    image: 'assets/site/projeto-hidreletrico.jpg',
    coordinates: [-54.59, -25.41],
  },
  {
    id: 'biomassa',
    name: 'Projeto Biomassa',
    owner: 'Equipe AtlasMap',
    description: 'Mapeamento de fontes de biomassa para energia renovável.',
    image: 'assets/site/projeto-biomassa.jpg',
    coordinates: [-47.45, -23.5],
  },
];

@Injectable({ providedIn: 'root' })
export class AtlasStoreService {
  private readonly userKey = 'atlasmap-auth-user';
  private readonly projectsKey = 'atlasmap-projects';
  private readonly likesKey = 'atlasmap-liked-projects';

  readonly user = signal<AtlasUser | null>(this.read<AtlasUser | null>(this.userKey, null));
  readonly createdProjects = signal<AtlasProject[]>(
    this.read<AtlasProject[]>(this.projectsKey, []),
  );
  readonly likedIds = signal<string[]>(this.read<string[]>(this.likesKey, []));
  readonly projects = computed(() => [...BUILT_IN_PROJECTS, ...this.createdProjects()]);
  readonly likedProjects = computed(() => {
    const liked = new Set(this.likedIds());
    return this.projects().filter((project) => liked.has(project.id));
  });

  login(email: string): void {
    const saved = this.user();
    const user =
      saved?.email === email ? saved : { name: email.split('@')[0] || 'Usuário AtlasMap', email };
    this.user.set(user);
    this.write(this.userKey, user);
  }

  register(name: string, email: string): void {
    const user = { name, email };
    this.user.set(user);
    this.write(this.userKey, user);
  }

  logout(): void {
    this.user.set(null);
    localStorage.removeItem(this.userKey);
  }

  toggleLike(id: string): void {
    const next = this.likedIds().includes(id)
      ? this.likedIds().filter((likedId) => likedId !== id)
      : [...this.likedIds(), id];
    this.likedIds.set(next);
    this.write(this.likesKey, next);
  }

  isLiked(id: string): boolean {
    return this.likedIds().includes(id);
  }

  saveProject(project: Omit<AtlasProject, 'id' | 'userCreated'>, id?: string): AtlasProject {
    const saved: AtlasProject = {
      ...project,
      id: id ?? `project-${Date.now()}`,
      userCreated: true,
      updated: new Date().toISOString(),
    };
    const exists = this.createdProjects().some((item) => item.id === saved.id);
    const next = exists
      ? this.createdProjects().map((item) => (item.id === saved.id ? saved : item))
      : [...this.createdProjects(), saved];
    this.createdProjects.set(next);
    this.write(this.projectsKey, next);
    return saved;
  }

  private read<T>(key: string, fallback: T): T {
    if (typeof localStorage === 'undefined') return fallback;
    try {
      const value = localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  private write(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
