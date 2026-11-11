# ALEJANDRA SPACE – Mi Mundo en un Solo Lugar

Aplicación web personal diseñada con enfoque **Mobile-First Zero-Scroll**, estética **Glassmorphism**, paleta oscura **Verde Agua / Neón** y modo claro alternativo en **Menta / Aguamarina Pastel**.

## Arquitectura Frontend Avanzada (UPDS – Diseño Web II)

1. **Prevención de Fugas de Memoria (Memory Leaks) con jQuery:**
   - Todos los listeners globales y dinámicos en `js/*.js` aplican la **Regla de Oro** (`.off(...).on(...)`), limpian temporizadores y liberan `ObjectURLs`/nodos de audio antes de descargar la vista.
2. **Simulación de Hidratación SSR / PWA (`js/hydration.js`):**
   - **Fase 1 (HTML5 + CSS3):** Estructura estática lista desde el primer render (`<div id="contenedorMenu" data-hidratado="false"><button id="btnPWA" class="btn-estatico">Cargando Menú...</button></div>`).
   - **Fase 2 (Hidratación diferida con jQuery):** `setTimeout(hidratarInterfaz, 500)` comprueba `data-hidratado`, conecta `#btnPWA` mediante `.off('click').on('click', ...)` para desplegar `#navMenu`, activa cada botón interactivo con animaciones y marca `data-hidratado="true"`.
3. **Validación en Tiempo Real (`js/validation.js`):**
   - El formulario `#contact-form` valida en vivo sobre eventos `input`, `keyup`, `blur`, `change` y `submit`, junto con estilos `:focus` y `:focus-visible` en `css/style.css`.

## Subcarpeta de Entrega (`lab-jquery/`)

Para el laboratorio práctico, el proyecto completo y autónomo con todas sus rutas relativas (`index.html`, `pages/`, `css/`, `js/`, `images/`, `assets/`) también se encuentra replicado dentro de:

```text
ALEJANDRA-SPACE/
└── lab-jquery/
    ├── index.html
    ├── pages/
    ├── css/
    ├── js/
    ├── images/
    └── assets/
```

## Cómo ejecutar el proyecto localmente

1. **Opción directa (sin servidor):**
   - Abre la carpeta `ALEJANDRA-SPACE` y haz doble clic en `index.html` para abrirlo directamente en Chrome, Edge o Firefox. Todo el proyecto (incluido jQuery local en `assets/vendor/jquery.min.js`) funciona sin conexión.
2. **Opción con servidor local (recomendado en VS Code):**
   - Abre la carpeta `ALEJANDRA-SPACE` en Visual Studio Code.
   - Instala o usa la extensión **Live Server** y haz clic en **Go Live** sobre `index.html`.

## Personalización rápida

- **Cambiar fotografías:** Reemplaza las imágenes en `images/profile/profile.svg` (o actualiza las rutas `src` a tus archivos `.jpg` / `.png` dentro de `images/`).
- **Configurar redes sociales:** Edita el objeto `SOCIAL_CONFIG` dentro de `js/categories.js`.
