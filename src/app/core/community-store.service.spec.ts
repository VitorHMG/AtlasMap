import { TestBed } from '@angular/core/testing';
import { CommunityStoreService } from './community-store.service';

describe('CommunityStoreService', () => {
  let store: CommunityStoreService;
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    store = TestBed.inject(CommunityStoreService);
  });
  it('permite publicações apenas por um squad participante e em um projeto desse squad', () => {
    expect(store.publish('atlas', 'solar', 'Atualização')).toBe(false);
    store.atlas.register('Teste', 'teste@example.com');
    expect(store.publish('atlas', 'solar', 'Atualização')).toBe(false);
    store.join('atlas');
    expect(store.publish('atlas', 'biomassa', 'Projeto de outro squad')).toBe(false);
    expect(store.publish('atlas', 'solar', '   ')).toBe(false);
    expect(store.publish('atlas', 'solar', 'Nova atualização')).toBe(true);
    expect(store.posts()[0].squadId).toBe('atlas');
    expect(JSON.parse(localStorage.getItem('atlas-community-posts')!)[0].content).toBe(
      'Nova atualização',
    );
  });
  it('alterna curtidas sem acumular contagens e persiste comentários identificados', () => {
    const post = store.posts()[0];
    store.like(post.id);
    store.like(post.id);
    expect(store.posts()[0].likes).toBe(post.likes);
    const count = post.comments.length;
    store.comment(post.id, 'Comentário anônimo');
    expect(store.posts()[0].comments.length).toBe(count);
    store.atlas.register('Teste', 'teste@example.com');
    store.comment(post.id, '  Ótima iniciativa  ');
    expect(store.posts()[0].comments.at(-1)).toEqual({ author: 'Teste', text: 'Ótima iniciativa' });
  });
  it('mantém mensagens e cards separados por conversa', () => {
    store.atlas.register('Teste', 'teste@example.com');
    store.send('verde', 'Olá');
    store.send('atlas', '', 'Teste · teste@example.com');
    expect(store.messages().filter((m) => m.squadId === 'verde')).toHaveLength(1);
    expect(store.messages().at(-1)?.contact).toBe('Teste · teste@example.com');
  });
});
