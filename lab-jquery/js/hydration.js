/**
 * ==========================================================================
 * ALEJANDRA SPACE - Controlador de Hidratación Progresiva (hydration.js)
 * ==========================================================================
 *
 * ARQUITECTURA DE HIDRATACIÓN PROGRESIVA:
 * - FASE 1 (HTML5 + CSS3): Toda la estructura semántica, diseño visual,
 *   botones, tarjetas, horarios, formularios y temas ya existen y son legibles
 *   directamente en el DOM estático antes de ejecutar JavaScript.
 *
 * - FASE 2 (Hidratación JS + jQuery): Al completarse la carga del DOM, este
 *   controlador enlaza eventos e interactividad progresiva sobre los elementos
 *   preexistentes SIN reconstruir la página completa ni duplicar listeners.
 *
 * COMPONENTES HIDRATADOS POR ESTE MÓDULO:
 * 1. Tema Claro/Oscuro y Preferencia de Movimiento (#btn-theme-toggle, modal)
 * 2. Fecha Dinámica en Cabecera (#current-date)
 * 3. Sistema Global de Modales (#modal-settings, #modal-lightbox)
 * 4. Interfaz jQuery (Menú hamburguesa, navegación Zero-Scroll, microinteracciones)
 * 5. Gestor de Favoritos y Sincronización (#favorites-container, #bottom-fav-badge)
 * 6. Reproductor Spotify con Web Audio + MP3 (#music-player-bar, .spotify-track-row)
 * 7. Galería de Fotos y Subida desde Dispositivo (#gallery-grid, #photo-upload-input)
 * 8. Sistema de Filtros, Búsqueda y Horario (#global-search-input, .subcat-btn)
 * 9. Validación de Formulario de Contacto (#contact-form)
 * 10. Enlaces Configurables de Redes Sociales (.social-circle-link)
 * 11. Hidratación Individual de Cada Botón (rol semántico, teclado, ARIA y estado)
 * ==========================================================================
 */

(function (window, document, $) {
  'use strict';

  const AlejandraApp = window.AlejandraApp || {};

  const BUTTON_HYDRATION_SELECTOR = [
    'button',
    '[role="button"]',
    '.orbit-btn',
    '.btn-glow',
    '.btn-glass',
    '.icon-btn',
    '.subcat-btn',
    '.sp-artist-pill',
    '.sp-pager-btn',
    '.sp-ctrl-btn',
    '.sp-play-btn',
    '.sp-row-fav',
    '.pill-btn',
    '.fav-toggle-btn',
    '.btn-remove-fav',
    '.theme-card-option',
    '.drawer-link',
    '.bottom-nav-item',
    '.social-circle-link',
    '.spotify-upload-mp3',
    '.search-clear-btn',
    '.btn-estatico',
    '.btn-hidratado',
    '.pwa-nav-link',
    '.laptop-bento-card'
  ].join(', ');

  /**
   * Determina el rol funcional de un botón para diagnóstico de hidratación
   * @param {HTMLElement} el
   * @returns {string}
   */
  function inferButtonRole(el) {
    if (el.matches('[data-install-pwa]')) return 'pwa-instalar';
    if (el.matches('#btnPWA, .pwa-nav-link')) return 'pwa-menu';
    if (el.matches('[data-set-theme], #btn-theme-toggle')) return 'tema';
    if (el.matches('[data-open-modal], .modal-close-btn, #btn-open-settings')) return 'modal';
    if (el.matches('#btn-hamburger, #btn-close-drawer, .drawer-link, .bottom-nav-item, .orbit-btn, .laptop-bento-card, [data-view-target]')) {
      return 'navegacion';
    }
    if (el.matches('.sp-play-btn, .sp-ctrl-btn, .spotify-upload-mp3')) return 'reproductor';
    if (el.matches('.sp-artist-pill, [data-subcat], [data-global-filter], [data-gallery-filter], [data-schedule-view], #search-clear-btn')) {
      return 'filtro';
    }
    if (el.matches('.sp-pager-btn, .deck-prev, .deck-next, #fav-prev, #fav-next, #gal-prev, #gal-next, #search-prev, #search-next')) {
      return 'paginacion';
    }
    if (el.matches('[data-fav-id], [data-remove-fav], #btn-reset-favs')) return 'favorito';
    if (el.matches('.social-circle-link')) return 'social';
    if (el.matches('[type="submit"]')) return 'formulario';
    if (el.matches('label[for="photo-upload-input"]')) return 'galeria';
    return 'accion';
  }

  /**
   * Hidrata individualmente un botón del DOM sin duplicar eventos
   * @param {HTMLElement} el
   * @returns {boolean}
   */
  AlejandraApp.hydrateButtonElement = function (el) {
    if (!el || el.dataset.hydrated === 'true') return false;

    el.dataset.hydrated = 'true';
    el.dataset.hydrationRole = inferButtonRole(el);
    el.classList.add('is-btn-hydrated');

    // Inicializar atributos ARIA en controles con estado
    if (el.id === 'btn-hamburger' && !el.hasAttribute('aria-expanded')) {
      el.setAttribute('aria-expanded', 'false');
    }

    if (el.matches('.subcat-btn, .pill-btn, .sp-artist-pill, .fav-toggle-btn, .sp-row-fav, .sp-ctrl-btn, .theme-card-option')) {
      const isActive = el.classList.contains('is-active') ||
        el.classList.contains('is-fav') ||
        el.classList.contains('is-on') ||
        el.classList.contains('is-selected');
      el.setAttribute('aria-pressed', String(isActive));
    }

    // Soporte accesible por teclado (se delega globalmente sin listeners por nodo para evitar fugas)
    const needsKeyboardBridge =
      el.tagName === 'LABEL' ||
      (el.tagName !== 'BUTTON' && el.getAttribute('role') === 'button');

    if (needsKeyboardBridge && !el.hasAttribute('tabindex')) {
      el.setAttribute('tabindex', '0');
    }

    return true;
  };

  /**
   * Hidrata botones renderizados dinámicamente (ej. resultados de búsqueda o favoritos)
   * @param {ParentNode} root
   * @returns {number}
   */
  AlejandraApp.hydrateDynamicButtons = function (root = document) {
    let newlyHydrated = 0;
    root.querySelectorAll(BUTTON_HYDRATION_SELECTOR).forEach((el) => {
      if (AlejandraApp.hydrateButtonElement(el)) {
        newlyHydrated++;
      }
    });
    return newlyHydrated;
  };

  /**
   * Paso dedicado del pipeline: garantiza hidratación completa y delegación por teclado limpia
   * @returns {number} Total de botones hidratados en el documento
   */
  AlejandraApp.hydrateButtons = function () {
    AlejandraApp.hydrateDynamicButtons(document);

    if (typeof $ !== 'undefined') {
      $(document)
        .off('keydown.hydratedKbd', '[data-hydrated="true"]')
        .on('keydown.hydratedKbd', '[data-hydrated="true"]', function (e) {
          const needsBridge =
            this.tagName === 'LABEL' ||
            (this.tagName !== 'BUTTON' && this.getAttribute('role') === 'button');
          if (!needsBridge || (e.key !== 'Enter' && e.key !== ' ')) return;
          e.preventDefault();
          if (this.tagName === 'LABEL' && this.htmlFor) {
            document.getElementById(this.htmlFor)?.click();
          } else {
            this.click();
          }
        });
    }

    const totalHydrated = document.querySelectorAll('[data-hydrated="true"]').length;
    document.body.dataset.buttonsHydrated = String(totalHydrated);
    return totalHydrated;
  };

  let lastHydrationStats = {
    modulesDone: 0,
    totalModules: 0
  };
  let activeWaveRunId = 0;

  /**
   * Registra en tiempo real qué botón fue activado tras la hidratación
   * @param {HTMLElement} el
   */
  AlejandraApp.recordButtonActivation = function (el) {
    if (!el) return;
    if (el.dataset.hydrated !== 'true') {
      AlejandraApp.hydrateButtonElement(el);
      AlejandraApp.hydrateButtons();
    }

    const rawText = (
      el.getAttribute('aria-label') ||
      el.getAttribute('title') ||
      el.textContent ||
      'Botón'
    ).replace(/\s+/g, ' ').trim();
    const label = rawText.length > 26 ? `${rawText.slice(0, 26)}…` : (rawText || 'Botón');
    const role = el.dataset.hydrationRole || inferButtonRole(el);

    document.body.dataset.lastActivatedButton = `${label} (${role})`;

    const lastBtnBox = document.getElementById('hydration-last-btn');
    if (lastBtnBox) {
      lastBtnBox.textContent = 'Último botón pulsado: ';
      const strong = document.createElement('strong');
      strong.textContent = label;
      lastBtnBox.appendChild(strong);
      lastBtnBox.appendChild(document.createTextNode(` [${role}] · ✓ Hidratado`));
    }
  };

  function updateHydrationUI(phase, modulesDone, totalModules, buttonCount) {
    document.querySelectorAll('[data-hydration-pill]').forEach((pill) => {
      const textEl = pill.querySelector('.hydration-pill-text');
      const target = textEl || pill;
      if (phase === 'animating') {
        target.textContent = '⏳ Activando animaciones...';
        pill.classList.remove('is-just-hydrated');
      } else {
        target.textContent = `⚡ Hidratado · Fase 2 (${buttonCount} botones)`;
        pill.classList.remove('is-just-hydrated');
        void pill.offsetWidth;
        pill.classList.add('is-just-hydrated');
      }
    });

    const statusBadge = document.getElementById('hydration-status');
    if (statusBadge) {
      statusBadge.textContent =
        phase === 'animating'
          ? '⏳ Ejecutando animaciones -> hidratando botones...'
          : `⚡ Fase 2 Hidratada por animación: ${modulesDone}/${totalModules} módulos · ${buttonCount} botones activos`;
    }
  }

  function isReducedMotion() {
    return (
      document.body.classList.contains('reduced-motion') ||
      Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches)
    );
  }

  let waveTimers = [];
  let flashTimers = [];

  function clearTimerPool(pool) {
    while (pool.length) {
      clearTimeout(pool.pop());
    }
  }

  /**
   * Lanza las animaciones de entrada/ola y utiliza su finalización para activar la Fase 2
   * @param {Object} options
   */
  AlejandraApp.runHydrationWaveAnimation = function (options = {}) {
    clearTimerPool(waveTimers);
    const runId = ++activeWaveRunId;
    const modulesDone = options.modulesDone || lastHydrationStats.modulesDone || HYDRATION_PIPELINE.length;
    const totalModules = options.totalModules || lastHydrationStats.totalModules || HYDRATION_PIPELINE.length;
    const totalButtons = AlejandraApp.hydrateButtons();
    const showToast = options.showToast !== false;

    function completeActivationFromAnimation() {
      if (runId !== activeWaveRunId) return;
      clearTimerPool(waveTimers);

      document.body.classList.remove('is-hydrating-wave');
      document.body.classList.add('is-hydrated');
      document.querySelectorAll('.is-hydrating-flash').forEach((node) => {
        node.classList.remove('is-hydrating-flash');
      });

      document.querySelectorAll('.reveal-item').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 60) {
          el.classList.add('is-visible');
        }
      });

      updateHydrationUI('hydrated', modulesDone, totalModules, totalButtons);

      if (showToast && typeof AlejandraApp.showToast === 'function') {
        AlejandraApp.showToast(`⚡ App Hidratada (Fase 2) · ${totalButtons} botones activos`);
      }
    }

    if (isReducedMotion()) {
      completeActivationFromAnimation();
      return;
    }

    // Reiniciar clase de entrada en la sección activa para que las animaciones sean visibles
    document.body.classList.remove('is-hydrated');
    document.body.classList.add('is-hydrating-wave');

    const activeSection = document.querySelector('.app-section.is-active-view');
    if (activeSection) {
      activeSection.classList.remove('section-entering');
      void activeSection.offsetWidth;
      activeSection.classList.add('section-entering');
    }

    updateHydrationUI('animating', modulesDone, totalModules, totalButtons);

    const lastOrbitBtn = document.querySelector('.is-active-view .orbital-stage > .orbit-node:last-child .orbit-btn');
    const replayOrbit = Boolean(options.isReplay && lastOrbitBtn);

    if (replayOrbit) {
      document.querySelectorAll('.is-active-view .orbital-stage > .orbit-node .orbit-btn').forEach((ob) => {
        ob.style.animation = 'none';
        void ob.offsetWidth;
        ob.style.animation = '';
      });
    }

    // Recopilar botones actualmente visibles para encenderlos en cascada sin pisar orbitPopIn
    const visibleButtons = Array.from(document.querySelectorAll('[data-hydrated="true"]')).filter((btn) => {
      if (lastOrbitBtn && btn.classList.contains('orbit-btn')) return false;
      return btn.offsetParent !== null || btn.getClientRects().length > 0;
    }).slice(0, 34);

    if (visibleButtons.length === 0 && !replayOrbit) {
      waveTimers.push(setTimeout(completeActivationFromAnimation, 420));
      return;
    }

    let completed = false;
    let flashDone = visibleButtons.length === 0;
    let orbitDone = !replayOrbit;

    function finishOnce() {
      if (completed || runId !== activeWaveRunId) return;
      completed = true;
      completeActivationFromAnimation();
    }

    function tryFinish() {
      if (flashDone && orbitDone) finishOnce();
    }

    if (replayOrbit) {
      $(lastOrbitBtn)
        .off('animationend.orbitWave')
        .one('animationend.orbitWave', function () {
          orbitDone = true;
          tryFinish();
        });
    }

    const stepDelay = visibleButtons.length ? Math.min(20, Math.floor(320 / visibleButtons.length)) : 0;
    visibleButtons.forEach((btn, idx) => {
      btn.classList.remove('is-hydrating-flash');
      waveTimers.push(
        setTimeout(() => {
          if (runId !== activeWaveRunId) return;
          btn.classList.add('is-hydrating-flash');
          if (idx === visibleButtons.length - 1) {
            $(btn)
              .off('animationend.btnWave')
              .one('animationend.btnWave', function () {
                flashDone = true;
                tryFinish();
              });
          }
        }, idx * stepDelay)
      );
    });

    // Respaldo determinístico tras terminar ambas animaciones (ola de botones + órbita)
    const waveMs = visibleButtons.length ? visibleButtons.length * stepDelay + 560 : 480;
    const totalWaveDuration = replayOrbit ? Math.max(960, waveMs) : waveMs;
    waveTimers.push(setTimeout(finishOnce, totalWaveDuration));
  };

  /**
   * Pulso visual breve al entrar a una nueva sección ya hidratada
   * @param {HTMLElement} sectionEl
   */
  AlejandraApp.flashViewButtons = function (sectionEl) {
    if (!sectionEl || isReducedMotion() || document.body.classList.contains('is-hydrating-wave')) return;

    clearTimerPool(flashTimers);
    const btns = Array.from(sectionEl.querySelectorAll('[data-hydrated="true"]')).slice(0, 10);
    btns.forEach((btn, idx) => {
      btn.classList.remove('is-hydrating-flash');
      void btn.offsetWidth;
      flashTimers.push(
        setTimeout(() => {
          btn.classList.add('is-hydrating-flash');
          $(btn)
            .off('animationend.flashView')
            .one('animationend.flashView', function () {
              this.classList.remove('is-hydrating-flash');
            });
        }, idx * 24)
      );
    });
  };

  const HYDRATION_PIPELINE = [
    { name: 'ThemeManager (Modo Claro/Oscuro)', fn: () => AlejandraApp.hydrateTheme?.() },
    { name: 'HeaderDate (Fecha Dinámica)', fn: () => AlejandraApp.hydrateDate?.() },
    { name: 'ModalSystem (Configuración/Lightbox)', fn: () => AlejandraApp.hydrateModals?.() },
    { name: 'PWAServiceWorker (Manifest & Instalar App)', fn: () => AlejandraApp.hydratePWA?.() },
    { name: 'jQueryUI (Menú Hamburguesa, Zero-Scroll & Ripple)', fn: () => AlejandraApp.hydrateJQueryUI?.() },
    { name: 'FavoritesManager (Favoritos + localStorage)', fn: () => AlejandraApp.hydrateFavorites?.() },
    { name: 'MusicAndTasks (Spotify Web Audio & Checklists)', fn: () => AlejandraApp.hydrateMusicPlayer?.() },
    { name: 'PhotoGallery (Lightbox & Subida Local)', fn: () => AlejandraApp.hydrateGallery?.() },
    { name: 'FiltersAndSearch (Búsqueda Global, Subcategorías & Horario)', fn: () => AlejandraApp.hydrateFilters?.() },
    { name: 'FormValidation (Validación Tiempo Real Contacto)', fn: () => AlejandraApp.hydrateValidation?.() },
    { name: 'SocialLinks (Redes Configurables)', fn: () => AlejandraApp.hydrateSocialLinks?.() },
    { name: 'ButtonHydration (Todos los Botones Interactivos)', fn: () => AlejandraApp.hydrateButtons() }
  ];

  function startProgressiveHydration(forceReplay = false) {
    if (window.__ALEJANDRA_HYDRATED__ && !forceReplay) {
      console.info('[Hydration] Omitido: la aplicación ya fue hidratada.');
      return;
    }
    window.__ALEJANDRA_HYDRATED__ = true;

    const hydratedComponents = [];
    let hydratedButtonCount = 0;

    HYDRATION_PIPELINE.forEach((step) => {
      try {
        const result = step.fn();
        if (result !== false) {
          hydratedComponents.push(step.name);
        }
        if (step.name.startsWith('ButtonHydration') && typeof result === 'number') {
          hydratedButtonCount = result;
        }
      } catch (error) {
        console.error(`[Hydration] Error al hidratar ${step.name}:`, error);
      }
    });

    lastHydrationStats = {
      modulesDone: hydratedComponents.length,
      totalModules: HYDRATION_PIPELINE.length
    };

    // Ejecutar las animaciones de bienvenida que activan visualmente el estado Hidratado (Fase 2)
    AlejandraApp.runHydrationWaveAnimation({
      modulesDone: hydratedComponents.length,
      totalModules: HYDRATION_PIPELINE.length,
      showToast: true,
      initialBoot: !forceReplay,
      isReplay: Boolean(forceReplay)
    });

    console.info(
      '%c[ALEJANDRA SPACE] Hidratación Progresiva completada:',
      'color: #2dd4bf; font-weight: bold; font-size: 12px;',
      hydratedComponents,
      `Botones hidratados: ${hydratedButtonCount}`
    );
  }

  // Simulación oficial de Hidratación en PWA con verificación de estado y carga diferida
  $(document).ready(function () {
    let pwaDelayTimer = null;

    function hidratarInterfaz() {
      const $box = $('#contenedorMenu');
      if ($box.length && $box.attr('data-hidratado') === 'true') return;

      // Hidratación del botón PWA: adjuntar eventos sin redibujar el DOM y limpiando con .off()
      $('#btnPWA')
        .text('☰ Menú Interactivo (Hidratado)')
        .removeClass('btn-estatico')
        .addClass('btn-hidratado')
        .off('click')
        .on('click', function () {
          const $nav = $('#navMenu');
          const willOpen = !$nav.is(':visible');
          $nav.stop(true, true).slideToggle(300);
          $(this).attr('aria-expanded', String(willOpen));
        });

      // Cerrar menú PWA al hacer clic fuera o elegir un enlace, aplicando Regla de Oro .off()
      $(document)
        .off('click.pwaOutside')
        .on('click.pwaOutside', function (e) {
          if (!$(e.target).closest('#contenedorMenu').length) {
            $('#navMenu').stop(true, true).slideUp(180);
            $('#btnPWA').attr('aria-expanded', 'false');
          }
        });

      $(document)
        .off('click.pwaLink', '#navMenu .pwa-nav-link')
        .on('click.pwaLink', '#navMenu .pwa-nav-link', function () {
          $('#navMenu').stop(true, true).slideUp(180);
          $('#btnPWA').attr('aria-expanded', 'false');
        });

      const isReplay = window.__ALEJANDRA_REPLAY_REQUEST__ === true;
      window.__ALEJANDRA_REPLAY_REQUEST__ = false;

      startProgressiveHydration(isReplay);

      if ($box.length) {
        $box.attr('data-hidratado', 'true');
      }
    }

    // Re-animación controlada desde el inspector sin duplicar listeners
    $(document)
      .off('click.replayHydration', '#btn-replay-hydration')
      .on('click.replayHydration', '#btn-replay-hydration', function () {
        AlejandraApp.closeAllModals?.();
        $('#navMenu').stop(true, true).slideUp(140);
        $('#contenedorMenu').attr('data-hidratado', 'false');
        $('#btnPWA')
          .text('Cargando Menú...')
          .removeClass('btn-hidratado')
          .addClass('btn-estatico')
          .attr('aria-expanded', 'false');
        window.__ALEJANDRA_REPLAY_REQUEST__ = true;
        clearTimeout(pwaDelayTimer);
        pwaDelayTimer = setTimeout(hidratarInterfaz, 500);
      });

    $(window)
      .off('beforeunload.hydrationTimers')
      .on('beforeunload.hydrationTimers', function () {
        clearTimeout(pwaDelayTimer);
        clearTimerPool(waveTimers);
        clearTimerPool(flashTimers);
      });

    // Ejecutar proceso de hidratación al cargar los recursos (carga asíncrona simulada 500ms)
    pwaDelayTimer = setTimeout(hidratarInterfaz, 500);
  });
})(window, document, window.jQuery);
