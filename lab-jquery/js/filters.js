/**
 * ==========================================================================
 * ALEJANDRA SPACE - Sistema de Filtros, Búsqueda, Mazos Zero-Scroll y Horario
 * (filters.js)
 * ==========================================================================
 */

(function (window, document, $) {
  'use strict';

  const AlejandraApp = window.AlejandraApp || {};

  let activeGlobalCategory = 'all';
  let activeSearchTerm = '';
  let searchPage = 0;

  // Estado de paginación para cada mazo (.cards-deck)
  const deckPages = {};

  function getDeckPageSize() {
    if (window.innerWidth >= 960) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  }

  /**
   * Actualiza la paginación de un mazo específico para evitar scroll vertical
   */
  AlejandraApp.renderDeckPage = function (groupName) {
    const container = document.querySelector(`[data-deck-container="${groupName}"]`);
    const pager = document.querySelector(`[data-deck-pager="${groupName}"]`);
    if (!container) return;

    const visibleCards = Array.from(
      container.querySelectorAll('.glass-card:not(.is-filtered-out)')
    );
    const pageSize = getDeckPageSize();
    const totalPages = Math.max(1, Math.ceil(visibleCards.length / pageSize));

    if (typeof deckPages[groupName] !== 'number') deckPages[groupName] = 0;
    if (deckPages[groupName] >= totalPages) deckPages[groupName] = totalPages - 1;
    if (deckPages[groupName] < 0) deckPages[groupName] = 0;

    const currentPage = deckPages[groupName];
    visibleCards.forEach((card, idx) => {
      const inPage = idx >= currentPage * pageSize && idx < (currentPage + 1) * pageSize;
      card.classList.toggle('is-paged-hidden', !inPage);
    });

    if (pager) {
      pager.style.display = totalPages > 1 ? 'flex' : 'none';
      const prevBtn = pager.querySelector('.deck-prev');
      const nextBtn = pager.querySelector('.deck-next');
      if (prevBtn) prevBtn.disabled = currentPage === 0;
      if (nextBtn) nextBtn.disabled = currentPage >= totalPages - 1;
      const dotsWrap = pager.querySelector('.pager-dots');
      if (dotsWrap) {
        dotsWrap.innerHTML = Array.from({ length: totalPages }, (_, i) =>
          `<span class="pager-dot ${i === currentPage ? 'is-active' : ''}"></span>`
        ).join('');
      }
    }
  };

  /**
   * Renderiza los resultados de búsqueda dentro de #search-results-container sin scroll
   */
  AlejandraApp.applyGlobalFilters = function () {
    const resultsContainer = document.getElementById('search-results-container');
    const sourceItems = document.querySelectorAll('.app-section:not(#sec-buscador) .filterable-item');
    if (!resultsContainer || !sourceItems.length) return;

    const favs = typeof AlejandraApp.getFavorites === 'function' ? AlejandraApp.getFavorites() : [];
    const term = activeSearchTerm.trim().toLowerCase();

    const matches = [];
    sourceItems.forEach((item) => {
      const cat = item.getAttribute('data-category') || '';
      const titleAttr = (item.getAttribute('data-title') || '').toLowerCase();
      const text = item.textContent.toLowerCase();
      const itemId = item.getAttribute('data-item-id') || '';

      const matchesCategory =
        activeGlobalCategory === 'all' ||
        (activeGlobalCategory === 'favorites' ? favs.includes(itemId) : cat === activeGlobalCategory);

      const matchesSearch = !term || titleAttr.includes(term) || text.includes(term);

      if (matchesCategory && matchesSearch) {
        const displayTitle =
          item.querySelector('.card-title, .sp-row-title')?.textContent ||
          item.getAttribute('data-track') ||
          'Elemento';
        const displayMeta =
          item.querySelector('.card-meta, .sp-row-artist')?.textContent ||
          cat.toUpperCase();
        const displayDesc =
          item.querySelector('.card-desc')?.textContent ||
          `Categoría: ${cat}`;
        matches.push({ itemId, cat, displayTitle, displayMeta, displayDesc });
      }
    });

    const perPage = window.innerWidth >= 960 ? 3 : window.innerWidth >= 640 ? 2 : 2;
    const totalPages = Math.max(1, Math.ceil(matches.length / perPage));
    if (searchPage >= totalPages) searchPage = totalPages - 1;
    if (searchPage < 0) searchPage = 0;

    const slice = matches.slice(searchPage * perPage, searchPage * perPage + perPage);
    resultsContainer.innerHTML = slice
      .map((m) => `
        <article class="glass-card">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:6px;">
            <span class="tag-chip">${m.cat.toUpperCase()}</span>
            <a href="#sec-${m.cat}" class="tag-chip" data-view-target="sec-${m.cat}">Ir →</a>
          </div>
          <h3 class="card-title">${m.displayTitle}</h3>
          <p class="card-meta">${m.displayMeta}</p>
          <p class="card-desc">${m.displayDesc}</p>
        </article>
      `)
      .join('');

    const countEl = document.getElementById('filter-result-count');
    if (countEl) countEl.textContent = `${matches.length} resultado(s) encontrados`;

    const emptyBox = document.getElementById('global-empty-state');
    if (emptyBox) emptyBox.classList.toggle('is-visible', matches.length === 0);

    const pageInfo = document.getElementById('search-page-info');
    if (pageInfo) pageInfo.textContent = `Página ${searchPage + 1} / ${totalPages}`;

    const prevSearchBtn = document.getElementById('search-prev');
    const nextSearchBtn = document.getElementById('search-next');
    if (prevSearchBtn) prevSearchBtn.disabled = searchPage === 0;
    if (nextSearchBtn) nextSearchBtn.disabled = searchPage >= totalPages - 1;

    AlejandraApp.hydrateDynamicButtons?.(resultsContainer);
  };

  /**
   * Hidrata buscador, subcategorías, mazos sin scroll, galería y horario
   * aplicando limpieza explícita .off() antes de cada .on() para evitar memory leaks
   */
  AlejandraApp.hydrateFilters = function () {
    // Inicializar todos los mazos paginados
    document.querySelectorAll('[data-deck-group]').forEach((sec) => {
      const group = sec.getAttribute('data-deck-group');
      AlejandraApp.renderDeckPage(group);
    });

    $(document)
      .off('click.filtersDeckPrev', '.deck-prev')
      .on('click.filtersDeckPrev', '.deck-prev', function () {
        const group = $(this).closest('[data-deck-pager]').attr('data-deck-pager');
        if (!group) return;
        deckPages[group] = Math.max(0, (deckPages[group] || 0) - 1);
        AlejandraApp.renderDeckPage(group);
      });

    $(document)
      .off('click.filtersDeckNext', '.deck-next')
      .on('click.filtersDeckNext', '.deck-next', function () {
        const group = $(this).closest('[data-deck-pager]').attr('data-deck-pager');
        if (!group) return;
        deckPages[group] = (deckPages[group] || 0) + 1;
        AlejandraApp.renderDeckPage(group);
      });

    $(window)
      .off('resize.filtersLayout')
      .on('resize.filtersLayout', function () {
        document.querySelectorAll('[data-deck-group]').forEach((sec) => {
          AlejandraApp.renderDeckPage(sec.getAttribute('data-deck-group'));
        });
        AlejandraApp.paginateSpotifyList?.();
        AlejandraApp.paginateGallery?.();
        AlejandraApp.syncFavoritesUI?.();
        AlejandraApp.applyGlobalFilters();
      });

    // Búsqueda global en tiempo real sin acumulación de listeners
    $(document)
      .off('input.filtersSearch', '#global-search-input')
      .on('input.filtersSearch', '#global-search-input', function (e) {
        activeSearchTerm = e.target.value;
        searchPage = 0;
        const clearBtn = document.getElementById('search-clear-btn');
        if (clearBtn) clearBtn.classList.toggle('is-visible', activeSearchTerm.length > 0);
        AlejandraApp.applyGlobalFilters();
      });

    $(document)
      .off('click.filtersClear', '#search-clear-btn')
      .on('click.filtersClear', '#search-clear-btn', function () {
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) searchInput.value = '';
        activeSearchTerm = '';
        searchPage = 0;
        this.classList.remove('is-visible');
        AlejandraApp.applyGlobalFilters();
      });

    $(document)
      .off('click.filtersSearchPrev', '#search-prev')
      .on('click.filtersSearchPrev', '#search-prev', function () {
        if (searchPage > 0) {
          searchPage--;
          AlejandraApp.applyGlobalFilters();
        }
      });

    $(document)
      .off('click.filtersSearchNext', '#search-next')
      .on('click.filtersSearchNext', '#search-next', function () {
        searchPage++;
        AlejandraApp.applyGlobalFilters();
      });

    $(document)
      .off('click.filtersGlobalCat', '[data-global-filter]')
      .on('click.filtersGlobalCat', '[data-global-filter]', function () {
        $('[data-global-filter]').removeClass('is-active');
        $(this).addClass('is-active');
        activeGlobalCategory = $(this).attr('data-global-filter');
        searchPage = 0;
        AlejandraApp.applyGlobalFilters();
      });

    // Subcategorías por sección (actualiza tarjetas y re-pagina sin scroll)
    $(document)
      .off('click.filtersSubcat', '[data-subcat-group] [data-subcat]')
      .on('click.filtersSubcat', '[data-subcat-group] [data-subcat]', function () {
        const $btn = $(this);
        const $group = $btn.closest('[data-subcat-group]');
        const catName = $group.attr('data-subcat-group');

        $group.find('[data-subcat]').removeClass('is-active');
        $btn.addClass('is-active');

        const targetSub = $btn.attr('data-subcat');
        if (catName === 'musica' && typeof AlejandraApp.setSpotifySubcat === 'function') {
          AlejandraApp.setSpotifySubcat(targetSub);
          return;
        }

        const section = $group[0]?.closest('.app-section');
        if (!section) return;

        section.querySelectorAll(`.filterable-item[data-category="${catName}"]`).forEach((card) => {
          const subcats = (card.getAttribute('data-subcategory') || '').split(' ');
          const match = targetSub === 'all' || subcats.includes(targetSub);
          card.classList.toggle('is-filtered-out', !match);
        });

        deckPages[catName] = 0;
        AlejandraApp.renderDeckPage(catName);
      });

    // Filtros de galería
    $(document)
      .off('click.filtersGallery', '[data-gallery-filter]')
      .on('click.filtersGallery', '[data-gallery-filter]', function () {
        $('[data-gallery-filter]').removeClass('is-active');
        $(this).addClass('is-active');
        const target = $(this).attr('data-gallery-filter');
        document.querySelectorAll('.gallery-card').forEach((card) => {
          const cardCat = card.getAttribute('data-gallery-cat');
          card.classList.toggle('is-filtered-out', target !== 'all' && cardCat !== target);
        });
        AlejandraApp.paginateGallery?.();
      });

    // Pestañas de vista en Mi Horario (Línea de tiempo / Semanal / Tarjetas)
    $(document)
      .off('click.filtersSchedule', '[data-schedule-view]')
      .on('click.filtersSchedule', '[data-schedule-view]', function () {
        $('[data-schedule-view]').removeClass('is-active');
        $(this).addClass('is-active');
        const viewName = $(this).attr('data-schedule-view');
        document.querySelectorAll('[data-schedule-panel]').forEach((panel) => {
          panel.classList.toggle('is-active-tab', panel.getAttribute('data-schedule-panel') === viewName);
        });
      });

    // Resaltar día actual en Vista Semanal
    const todayIndex = String(new Date().getDay());
    document.querySelectorAll(`.day-col[data-weekday="${todayIndex}"]`).forEach((col) => {
      col.classList.add('is-today');
    });

    AlejandraApp.applyGlobalFilters();
    document.body.dataset.filtersHydrated = 'true';
    return true;
  };

  window.AlejandraApp = AlejandraApp;
})(window, document, window.jQuery);
