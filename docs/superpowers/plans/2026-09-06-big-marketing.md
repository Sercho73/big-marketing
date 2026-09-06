# Big Marketing Implementation Plan

**Goal:** Crear y publicar la landing aprobada con formulario persistente.
**Architecture:** Astro prerenderiza la página; POST /api/contact ejecuta validación y una RPC de Supabase desde Vercel. Componentes por sección y estilos compartidos.
**Tech Stack:** Astro, TypeScript, GSAP, Supabase/Postgres, Vercel y GitHub.
**Spec:** ../specs/2026-09-06-big-marketing-design.md

## Global Constraints
Texto y composición de los cuatro conceptos aprobados. Español, performance marketing con IA. Claves privadas solo servidor. No declarar éxito sin persistencia.

### 1. Página visual
- [x] Instalar dependencias con pnpm y guardar lockfile.
- [x] Copiar conceptos y optimizar tres esculturas a WebP.
- [x] Crear Layout, Arrow, Header, Hero, Services, Method, ContactForm y Footer en src/components; componer src/pages/index.astro.
- [x] Definir tokens y reglas responsive en src/styles/global.css.
- [x] Añadir GSAP y selección de servicio en src/scripts/main.ts.
- [x] Comparar cada sección con su concepto; navegador integrado y Chrome/Playwright en 1536x1024 y 390x844.

### 2. Formulario persistente
- [x] Escribir tests Node para rechazar datos incompletos, correo inválido, consentimiento ausente, servicio desconocido y mensajes demasiado largos. Ejecutar antes de implementación.
- [x] Implementar validateLead(payload) y handleContact(request, config, fetchImpl) en src/lib/contact.mjs.
- [x] Endpoint POST devuelve 400 para entrada inválida, 403 para origen distinto, 503 para configuración ausente, 502 para error de almacenamiento y 201 únicamente tras RPC confirmada.
- [x] Migración SQL crea leads privados y RPC submit_marketing_lead con idempotencia, validación y límite persistente.
- [x] Probar reintento, fallo y confirmación; conectar Supabase si el acceso permite aplicar migración y secretos.

### 3. Publicación
- [x] Ejecutar pnpm test y pnpm build.
- [x] Verificar UI, consola, navegación, formulario, móvil y movimiento reducido.
- [x] Inicializar Git, publicar commits en main y sincronizar el repositorio GitHub creado por el usuario.
- [x] Desplegar en Vercel, verificar URL y envío real. Documentar con precisión cualquier dependencia de acceso no resuelta.
