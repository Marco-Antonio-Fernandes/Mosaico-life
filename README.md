# Mosaico Life

Aplicação web do Mosaico Life, construída com Next.js, TypeScript e Tailwind
CSS.

## Desenvolvimento

```bash
npm install
npm run dev
```

Comandos de validação:

```bash
npm run typecheck
npm run lint
npm run build
npm test
```

## Estrutura inicial

- `src/app`: rotas, layouts e composição do App Router;
- `src/components/ui`: primitivas visuais compartilhadas;
- `src/components/shared`: shell, navegação e estados de feedback;
- `src/lib`: utilitários transversais.

A versão atual é um protótipo navegável com dados fictícios, autorizado para
avaliar o layout de todos os módulos. Inclui notas flutuantes coloridas com um
lembrete de exemplo. Interações ficam na memória e não enviam dados ao servidor.
Login permanece adiado nesta etapa.

O backend compartilhado existe em `../mosaico-back/`, com SQLite/Prisma.
O usuário confirmou o health check em `https://mosaico.rotatix.com.br`.
As APIs clínicas ainda não foram implementadas; as telas atuais são mocks.

Veja o [plano de frontend](docs/PLANO-FRONTEND-MOCK.md), as tasks atualizadas
e o [status de frontend/backend/servidor](<../Servidor Rotatix/STATUS-MOSAICO.md>).
Nenhum teste ou build da última entrega foi executado, conforme solicitado.
