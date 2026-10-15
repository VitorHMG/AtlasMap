# AtlasMap

AtlasMap é uma plataforma Angular para descobrir, acompanhar e conectar projetos sustentáveis.

## Recursos

- Discover com filtros por tags, status e localização;
- páginas de squads, projetos e perfis;
- mapa interativo dos projetos;
- feed com curtidas, comentários e publicações por squad;
- chat demonstrativo e envio de card de contato;
- persistência local no navegador para a demonstração.

## Executar localmente

Instale as dependências e inicie o servidor de desenvolvimento:

```bash
npm install
npx ng serve
```

Abra `http://localhost:4200/`.

No PowerShell, se `ng serve` for bloqueado pela política de scripts, prefira `npx ng serve` ou execute `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` somente na sessão atual.

## Verificação

```bash
npm run build
npm test -- --watch=false
```

O código da aplicação está em `src/` e os arquivos públicos em `public/`.
