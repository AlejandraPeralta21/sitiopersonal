/**
 * ==========================================================================
 * ALEJANDRA SPACE - Navegación Zero-Scroll y Menú Lateral con jQuery
 * (jquery-functions.js)
 * ==========================================================================
 */

(function (window, $) {
  'use strict';

  const AlejandraApp = window.AlejandraApp || {};

  /**
   * Cambia la vista activa dentro de la app sin generar scroll
   * @param {string} sectionId
   */
  AlejandraApp.switchView = function (sectionId) {
    if (!sectionId) return;
    const $target = $(`#${sectionId}`);
    if (!$target.length) return;

    $('.app-section').removeClass('is-active-view section-entering');
    $target.addClass('is-active-view');
    void $target[0].offsetWidth;
    $target.addClass('section-entering');

    // Hidratar y animar ligeramente los botones de la nueva vista activa
    if (typeof AlejandraApp.hydrateButtons === 'function') {
      AlejandraApp.hydrateButtons();
    }
    if (typeof AlejandraApp.flashViewButtons === 'function') {
      AlejandraApp.flashViewButtons($target[0]);
    }

    // Sincronizar estado activo en menú lateral, selector de categorías y barra inferior
    $('.drawer-link').removeClass('is-active');
    $(`.drawer-link[data-view-target="${sectionId}"]`).addClass('is-active');

    $('.subcat-tabs [data-view-target]').removeClass('is-active');
    $(`.subcat-tabs [data-view-target="${sectionId}"]`).addClass('is-active');

    $('.bottom-nav-item').removeClass('is-active');
    if (sectionId === 'sec-inicio') {
      $('.bottom-nav-item[data-nav="inicio"]').addClass('is-active');
    } else if (sectionId === 'sec-favoritos') {
      $('.bottom-nav-item[data-nav="favoritos"]').addClass('is-active');
    } else if (sectionId === 'sec-perfil') {
      $('.bottom-nav-item[data-nav="perfil"]').addClass('is-active');
    } else {
      $('.bottom-nav-item[data-nav="categorias"]').addClass('is-active');
    }

    // Enfocar buscador si corresponde
    if (sectionId === 'sec-buscador') {
      setTimeout(() => $('#global-search-input').trigger('focus'), 120);
    }

    // Asegurar scroll en 0
    window.scrollTo(0, 0);
  };

  /**
   * Hidrata el menú hamburguesa, cambio de pantallas sin scroll y microinteracciones
   * aplicando siempre .off() antes de .on() para prevenir memory leaks
   */
  AlejandraApp.hydrateJQueryUI = function () {
    if (typeof $ === 'undefined') return false;

    const $body = $('body');
    const $drawer = $('#side-drawer');
    const $backdrop = $('#drawer-backdrop');
    const SIDEBAR_STORAGE_KEY = 'alejandra_laptop_sidebar_collapsed';
    const isDesktopLayout = () => window.innerWidth >= 960;

    function syncHamburgerState() {
      const isExpanded = isDesktopLayout()
        ? !$body.hasClass('desktop-sidebar-collapsed')
        : $drawer.hasClass('is-open');
      $('#btn-hamburger')
        .attr('aria-expanded', String(isExpanded))
        .toggleClass('is-menu-open', isExpanded)
        .attr('title', isExpanded ? 'Ocultar menú lateral' : 'Abrir menú lateral');
    }

    function openDrawer() {
      if (isDesktopLayout()) {
        $body.removeClass('desktop-sidebar-collapsed');
        try { localStorage.setItem(SIDEBAR_STORAGE_KEY, '0'); } catch (_) {}
      } else {
        $drawer.addClass('is-open');
        $backdrop.addClass('is-open');
      }
      syncHamburgerState();
    }

    function closeDrawer() {
      if (isDesktopLayout()) {
        $body.addClass('desktop-sidebar-collapsed');
        try { localStorage.setItem(SIDEBAR_STORAGE_KEY, '1'); } catch (_) {}
      } else {
        $drawer.removeClass('is-open');
        $backdrop.removeClass('is-open');
      }
      syncHamburgerState();
    }

    function toggleDrawer() {
      if (isDesktopLayout()) {
        if ($body.hasClass('desktop-sidebar-collapsed')) {
          openDrawer();
        } else {
          closeDrawer();
        }
      } else if ($drawer.hasClass('is-open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    }

    try {
      if (localStorage.getItem(SIDEBAR_STORAGE_KEY) === '1') {
        $body.addClass('desktop-sidebar-collapsed');
      }
    } catch (_) {}
    syncHamburgerState();

    $(document)
      .off('click.drawerOpen', '#btn-hamburger')
      .on('click.drawerOpen', '#btn-hamburger', function (e) {
        e.preventDefault();
        toggleDrawer();
      });

    $(document)
      .off('click.drawerClose', '#btn-close-drawer, #drawer-backdrop')
      .on('click.drawerClose', '#btn-close-drawer, #drawer-backdrop', function (e) {
        e.preventDefault();
        closeDrawer();
      });

    $(window)
      .off('resize.drawerMode')
      .on('resize.drawerMode', function () {
        if (isDesktopLayout()) {
          $drawer.removeClass('is-open');
          $backdrop.removeClass('is-open');
        }
        syncHamburgerState();
      });

    // Cambio de vista Zero-Scroll mediante delegación con limpieza previa .off()
    $(document)
      .off('click.viewNav', '[data-view-target]')
      .on('click.viewNav', '[data-view-target]', function (e) {
        const targetId = $(this).attr('data-view-target');
        if (targetId && $(`#${targetId}`).length) {
          e.preventDefault();
          AlejandraApp.switchView(targetId);
          if (!isDesktopLayout()) closeDrawer();
          $('#navMenu').stop(true, true).slideUp(180);
          $('#btnPWA').attr('aria-expanded', 'false');
        }
      });

    // Cerrar drawer en pantallas pequeñas si abre un modal desde el menú
    $(document)
      .off('click.drawerModal', '.drawer-link[data-open-modal]')
      .on('click.drawerModal', '.drawer-link[data-open-modal]', function () {
        if (!isDesktopLayout()) closeDrawer();
      });

    // Hidratación visual y microinteracción Ripple delegada para TODOS los botones
    const ALL_BUTTONS_SELECTOR =
      'button, [role="button"], .btn-glow, .btn-glass, .orbit-btn, .icon-btn, ' +
      '.subcat-btn, .sp-artist-pill, .sp-pager-btn, .sp-ctrl-btn, .sp-play-btn, ' +
      '.sp-row-fav, .pill-btn, .fav-toggle-btn, .btn-remove-fav, .theme-card-option, ' +
      '.drawer-link, .bottom-nav-item, .social-circle-link, .spotify-upload-mp3, .search-clear-btn, ' +
      '.btn-estatico, .btn-hidratado, .pwa-nav-link, .laptop-bento-card';

    $(document)
      .off('click.buttonMicroFx', ALL_BUTTONS_SELECTOR)
      .on('click.buttonMicroFx', ALL_BUTTONS_SELECTOR, function (e) {
        if (this.disabled) return;
        const $btn = $(this);

        $btn.addClass('is-btn-tapped');
        setTimeout(() => $btn.removeClass('is-btn-tapped'), 220);

        AlejandraApp.recordButtonActivation?.(this);

        // Sincronizar aria-pressed en botones con estado visual
        if ($btn.is('.subcat-btn, .pill-btn, .sp-artist-pill, .fav-toggle-btn, .sp-row-fav, .sp-ctrl-btn, .theme-card-option')) {
          setTimeout(() => {
            const activeState = $btn.is('.is-active, .is-fav, .is-on, .is-selected');
            $btn.attr('aria-pressed', String(activeState));
          }, 0);
        }

        const style = window.getComputedStyle(this);
        if (style.position !== 'relative' || style.overflow !== 'hidden') return;

        const offset = $btn.offset();
        if (!offset) return;
        const size = Math.max($btn.outerWidth(), $btn.outerHeight());
        const clientX = typeof e.pageX === 'number' && e.pageX > 0 ? e.pageX : offset.left + $btn.outerWidth() / 2;
        const clientY = typeof e.pageY === 'number' && e.pageY > 0 ? e.pageY : offset.top + $btn.outerHeight() / 2;

        const $ripple = $('<span class="ripple-circle"></span>').css({
          width: size,
          height: size,
          left: clientX - offset.left - size / 2,
          top: clientY - offset.top - size / 2
        });

        $btn.append($ripple);
        setTimeout(() => $ripple.remove(), 600);
      });

    // Respetar hash inicial en la URL si viene de una subpágina (ej. index.html#sec-redes)
    if (window.location.hash && $body.attr('data-jq-hydrated') !== 'true') {
      const hashId = window.location.hash.replace('#', '');
      if ($(`#${hashId}.app-section`).length) {
        AlejandraApp.switchView(hashId);
      }
    }

    $body.attr('data-jq-hydrated', 'true');
    return true;
  };

  window.AlejandraApp = AlejandraApp;
})(window, window.jQuery);
