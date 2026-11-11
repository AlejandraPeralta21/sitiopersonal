/**
 * ==========================================================================
 * ALEJANDRA SPACE - Módulo Principal (main.js)
 * Utilidades globales, fecha dinámica, sistema de notificaciones Toast y modales
 * ==========================================================================
 */

(function (window, document, $) {
  'use strict';

  const AlejandraApp = window.AlejandraApp || {};

  /**
   * Muestra una notificación Toast temporal sin bloquear la interfaz
   * @param {string} message - Texto a mostrar
   * @param {number} duration - Duración en ms
   */
  AlejandraApp.showToast = function (message, duration = 3200) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-8px)';
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      setTimeout(() => toast.remove(), 320);
    }, duration);
  };

  /**
   * Actualiza la fecha actual en español en la cabecera
   */
  AlejandraApp.hydrateDate = function () {
    const dateEl = document.getElementById('current-date');
    if (!dateEl) return true;

    // Preservar subtítulo si es una subpágina que no usa fecha literal, o formatear si es la vista principal
    const isHome = window.location.pathname.endsWith('index.html') ||
                   window.location.pathname.endsWith('/') ||
                   !window.location.pathname.includes('/pages/');

    if (!isHome) return true;

    try {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(now);

      // Capitalizar primera letra
      dateEl.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } catch (err) {
      // Mantiene el texto estático de Fase 1 si falla Intl
    }
    return true;
  };

  /**
   * Abre un modal por su ID
   * @param {string} modalId
   */
  AlejandraApp.openModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('is-open');
  };

  /**
   * Cierra todos los modales abiertos
   */
  AlejandraApp.closeAllModals = function () {
    document.querySelectorAll('.app-modal.is-open').forEach((modal) => {
      modal.classList.remove('is-open');
    });
  };

  /**
   * Hidrata los botones y eventos globales de modales mediante jQuery (.off().on())
   */
  AlejandraApp.hydrateModals = function () {
    $(document)
      .off('click.modalSettings', '#btn-open-settings')
      .on('click.modalSettings', '#btn-open-settings', function () {
        AlejandraApp.openModal('modal-settings');
      });

    $(document)
      .off('click.modalTrigger', '[data-open-modal]')
      .on('click.modalTrigger', '[data-open-modal]', function () {
        const targetId = $(this).attr('data-open-modal');
        AlejandraApp.openModal(targetId);
      });

    $(document)
      .off('click.modalClose', '.modal-close-btn')
      .on('click.modalClose', '.modal-close-btn', function () {
        AlejandraApp.closeAllModals();
      });

    $(document)
      .off('click.modalBackdrop', '.app-modal')
      .on('click.modalBackdrop', '.app-modal', function (e) {
        if (e.target === this) AlejandraApp.closeAllModals();
      });

    $(document)
      .off('keydown.modalEsc')
      .on('keydown.modalEsc', function (e) {
        if (e.key === 'Escape') {
          AlejandraApp.closeAllModals();
          $('#navMenu').stop(true, true).slideUp(180);
          $('#btnPWA').attr('aria-expanded', 'false');
        }
      });

    document.body.dataset.modalsHydrated = 'true';
    return true;
  };

  /**
   * Registra el Service Worker PWA y controla el botón de instalación ("Instalar App")
   */
  let deferredInstallPrompt = null;

  AlejandraApp.hydratePWA = function () {
    const isSecureOrigin =
      window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    if ('serviceWorker' in navigator && isSecureOrigin && !window.__ALEJANDRA_SW_REGISTERED__) {
      window.__ALEJANDRA_SW_REGISTERED__ = true;
      const isSubPage = window.location.pathname.includes('/pages/');
      const swPath = isSubPage ? '../sw.js' : './sw.js';
      const swScope = isSubPage ? '../' : './';

      navigator.serviceWorker.register(swPath, { scope: swScope }).catch((err) => {
        console.warn('[PWA] No se pudo registrar sw.js:', err);
      });
    }

    const isStandalone =
      window.matchMedia?.('(display-mode: standalone)')?.matches ||
      window.navigator.standalone === true;

    const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent || '');
    const statusLabel = document.getElementById('pwa-install-status');

    function syncInstallButtons() {
      const $btns = $('[data-install-pwa]');
      if (isStandalone) {
        $btns.hide();
        if (statusLabel) statusLabel.textContent = '✓ App instalada en tu dispositivo';
        return;
      }

      if (deferredInstallPrompt) {
        $btns.css('display', 'inline-flex').text('📲 Instalar App');
        if (statusLabel) statusLabel.textContent = 'Lista para descargar e instalar con ícono';
      } else if (isIOS) {
        $btns.css('display', 'inline-flex').text('📲 Instalar en iPhone');
        if (statusLabel) statusLabel.textContent = 'En Safari: Compartir → Agregar a inicio';
      } else {
        $('#btn-install-pwa').hide();
        if (statusLabel) {
          statusLabel.textContent = isSecureOrigin
            ? 'Instalable desde menú del navegador (⋮ → Instalar)'
            : 'Al subir a GitHub Pages se activa la descarga directa';
        }
      }
    }

    $(window)
      .off('beforeinstallprompt.pwaInstall')
      .on('beforeinstallprompt.pwaInstall', function (jqEvent) {
        const nativeEvent = jqEvent.originalEvent || jqEvent;
        nativeEvent.preventDefault();
        deferredInstallPrompt = nativeEvent;
        syncInstallButtons();
      });

    $(window)
      .off('appinstalled.pwaInstall')
      .on('appinstalled.pwaInstall', function () {
        deferredInstallPrompt = null;
        $('[data-install-pwa]').hide();
        if (statusLabel) statusLabel.textContent = '✓ App instalada en tu dispositivo';
        AlejandraApp.showToast?.('✓ ALEJANDRA SPACE instalada correctamente');
      });

    $(document)
      .off('click.pwaInstallAction', '[data-install-pwa]')
      .on('click.pwaInstallAction', '[data-install-pwa]', async function () {
        if (deferredInstallPrompt) {
          deferredInstallPrompt.prompt();
          try {
            const choice = await deferredInstallPrompt.userChoice;
            if (choice?.outcome === 'accepted') {
              AlejandraApp.showToast?.('📲 Descargando e instalando ALEJANDRA SPACE...');
            }
          } catch (e) {
            // Ignora cancelación del diálogo del navegador
          }
          deferredInstallPrompt = null;
          syncInstallButtons();
        } else if (isIOS) {
          AlejandraApp.showToast?.('En Safari pulsa Compartir (↑) → "Agregar a pantalla de inicio"');
        } else {
          AlejandraApp.showToast?.('Desde GitHub Pages usa el ícono de instalar en la barra del navegador');
        }
      });

    syncInstallButtons();
    return true;
  };

  window.AlejandraApp = AlejandraApp;
})(window, document, window.jQuery);
