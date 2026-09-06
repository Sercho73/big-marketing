# Big Marketing — diseño aprobado

El usuario aprobó los cuatro conceptos el 6 de septiembre de 2026 y aclaró que el posicionamiento es performance marketing con IA.

## Superficie y sistema
Landing en español: portada, servicios, método y contacto. Astro, CSS nativo, GSAP; navegación por anclas y versión móvil. Conceptos en `docs/design/`. Fondo marfil #f4f2eb, negro #191918 y naranja #ff4d24. Tipografía Barlow Condensed 700/800/900 para títulos, DM Sans para texto y controles. Cabecera con logotipo tipográfico, dos enlaces y CTA. Márgenes fluidos entre 24 y 64 px, sin tarjetas; líneas finas, botones ovalados, flechas vectoriales de 1.5 px. Imágenes sin tintes ni overlays, bordes suavizados únicamente para integrar el fondo. Títulos grandes, con líneas explícitas en escritorio y escala adaptable en móvil.

## Texto autorizado en portada
big. / MARKETING / Servicios / Método / Hablemos / Piensa BIG. / Crece con / inteligencia. / Estrategia, creatividad e inteligencia artificial para llevar tu negocio al siguiente nivel. / Hagamos algo BIG / Explora los servicios / Estrategia humana. Potencia artificial. / Desliza para descubrir.

## Componentes
Header, Hero, Services, Method, ContactForm, Footer, Arrow y Layout. Seis servicios con enlace al formulario que selecciona su servicio. Método en tres pasos: Entendemos, Activamos y Optimizamos. No métricas, casos de éxito, clientes, testimonios ni datos de contacto inventados.

## Formulario y datos
Nombre (2–100), email (máximo 254), empresa (2–160), servicio enumerado y mensaje (10–3000). Consentimiento obligatorio. Honeypot, límite de cuerpo, comprobación de origen, validación servidor, inserción en Supabase únicamente con credencial servidor y RLS sin acceso público. Éxito solo tras persistencia confirmada. Idempotencia con UUID para evitar duplicados en reintentos. Límite persistente de solicitudes en función SQL por huella de correo. Estados de envío accesibles con aria-live; preservar datos si hay un fallo. Privacidad vinculada, sin analítica ni cookies opcionales. Identidad legal y canal de derechos pendientes del titular, reflejados honestamente.

## Recursos y movimiento
Cuatro conceptos y tres imágenes finales creados con Image Gen integrado. Asterisco naranja con centro cromado, eslabones naranja/cromo y flecha cromada. GSAP: entrada de portada, aparición al hacer scroll, paralaje leve y hover; desactivar con prefers-reduced-motion. Contenido visible sin JavaScript.

## Verificación y entrega
Tests de validación y endpoint, compilación Astro, navegador integrado en escritorio y móvil, comparación con los cuatro conceptos e inspección view_image. GitHub y Vercel son destinos autorizados; comprobar acceso antes de modificar. Verificar envío real y registro en Supabase cuando haya credenciales. No declarar despliegue o persistencia completos sin evidencia.
