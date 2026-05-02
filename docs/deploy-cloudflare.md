# Deploy en Cloudflare

Cloudflare es la opcion recomendada para Study by EAPA por calidad/precio: hosting rapido, CDN global, Workers para Next.js y plan gratuito suficiente para empezar.

## Comandos

```bash
npm run build:cloudflare
npm run preview:cloudflare
npm run deploy:cloudflare
```

## Primer deploy

1. Crea o entra a tu cuenta de Cloudflare.
2. Ejecuta `npx wrangler login` desde `apps/web` o usa `npm exec -w @academia/web wrangler login`.
3. Guarda secretos de produccion:

```bash
npm exec -w @academia/web wrangler secret put OPENAI_API_KEY
```

4. Despliega:

```bash
npm run deploy:cloudflare
```

## Importante sobre usuarios y materiales

El registro de estudiantes, perfiles, dispositivos y materiales no debe guardarse en archivos JSON en produccion. En Netlify eso dio `EROFS` porque el sistema de archivos es de solo lectura, y en Cloudflare Workers tampoco es una base de datos persistente.

Para produccion usa una base de datos:

- `Cloudflare D1`: opcion mas integrada y barata si nos quedamos en Cloudflare.
- `Supabase`: opcion muy comoda si quieres panel visual para ver usuarios y datos.

La siguiente fase debe mover `students.json` y `lesson-materials.json` a una base de datos real antes de cobrar pagos reales.
