# Big Marketing

Web de presentación de una marca de performance marketing con IA en preparación.

Astro + GSAP, imágenes originales generadas con Image Gen y formulario de demostración persistente en Supabase.

## Desarrollo

Requiere Node.js 22 y pnpm 11.19.0.

```sh
pnpm install
pnpm dev
pnpm test
pnpm build
```

## Configuración privada

Definir SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en las variables del servidor de Vercel. Nunca usar prefijo PUBLIC_ ni subir credenciales al repositorio. La migración está en supabase/migrations/202609060001_big_marketing_leads.sql.

El formulario solo confirma cuando Supabase guarda la solicitud. Incluye validación servidor, límite persistente por email e idempotencia. La tabla no admite acceso de roles públicos.

## Estado de la marca

El titular confirmó que Big Marketing es una marca en preparación. Usar únicamente datos ficticios en el formulario de demostración. La identidad legal y el canal de derechos deberán completarse antes de iniciar captación comercial.

## Diseño

Cuatro conceptos aprobados, tres esculturas originales, tipografía local Barlow Condensed / DM Sans y animaciones con respeto a movimiento reducido. Las especificaciones están en docs/superpowers/.
