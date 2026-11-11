/**
 * ==========================================================================
 * ALEJANDRA SPACE - Gestión de Temas Claro y Oscuro (theme.js)
 * Cambia dinámicamente entre modo oscuro y claro con persistencia en localStorage
 * ==========================================================================
 */

(function (window, document, $) {
  'use strict';

  const AlejandraApp = window.AlejandraApp || {};
  const THEME_STORAGE_KEY = 'alejandra_space_theme';
  const MOTION_STORAGE_KEY = 'alejandra_space_reduced_motion';

  const SUN_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  const MOON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  /**
   * Aplica el tema elegido al documento y sincroniza la UI
   * @param {'dark'|'light'} theme
   * @param {boolean} notify
   */
  AlejandraApp.applyTheme = function (theme, notify = false) {
    const validTheme = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', validTheme);
    localStorage.setItem(THEME_STORAGE_KEY, validTheme);

    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', validTheme === 'dark' ? '#041e21' : '#ecfdf5');
    }

    const toggleBtn = document.getElementById('btn-theme-toggle');
    if (toggleBtn) {
      toggleBtn.innerHTML = validTheme === 'dark' ? SUN_SVG : MOON_SVG;
      toggleBtn.setAttribute(
        'title',
        validTheme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'
      );
    }

    document.querySelectorAll('[data-set-theme]').forEach((option) => {
      option.classList.toggle('is-selected', option.getAttribute('data-set-theme') === validTheme);
    });

    if (notify && typeof AlejandraApp.showToast === 'function') {
      AlejandraApp.showToast(
        validTheme === 'dark'
          ? 'Modo Oscuro activado (Verde Agua Neón)'
          : 'Modo Claro activado (Menta & Aguamarina Pastel)'
      );
    }
  };

  /**
   * Aplica preferencia de reducción de animaciones
   * @param {boolean} enabled
   */
  AlejandraApp.applyReducedMotion = function (enabled) {
    document.body.classList.toggle('reduced-motion', Boolean(enabled));
    localStorage.setItem(MOTION_STORAGE_KEY, String(Boolean(enabled)));
    const checkbox = document.getElementById('toggle-reduced-motion');
    if (checkbox) checkbox.checked = Boolean(enabled);
  };

  /**
   * Hidrata los controles de cambio de tema usando jQuery (.off().on()) sin fugas de memoria
   */
  AlejandraApp.hydrateTheme = function () {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
    AlejandraApp.applyTheme(savedTheme, false);

    const savedMotion = localStorage.getItem(MOTION_STORAGE_KEY) === 'true';
    AlejandraApp.applyReducedMotion(savedMotion);

    $(document)
      .off('click.themeToggle', '#btn-theme-toggle')
      .on('click.themeToggle', '#btn-theme-toggle', function () {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        AlejandraApp.applyTheme(current === 'dark' ? 'light' : 'dark', true);
      });

    $(document)
      .off('click.themeOption', '[data-set-theme]')
      .on('click.themeOption', '[data-set-theme]', function () {
        AlejandraApp.applyTheme($(this).attr('data-set-theme'), true);
      });

    $(document)
      .off('change.themeMotion', '#toggle-reduced-motion')
      .on('change.themeMotion', '#toggle-reduced-motion', function (e) {
        AlejandraApp.applyReducedMotion(e.target.checked);
      });

    document.body.dataset.themeHydrated = 'true';
    return true;
  };

  window.AlejandraApp = AlejandraApp;
})(window, document, window.jQuery);
