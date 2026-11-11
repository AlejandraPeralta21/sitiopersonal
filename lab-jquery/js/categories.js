/**
 * ==========================================================================
 * ALEJANDRA SPACE - Categorías, Spotify Player con Audio, Favoritos y Galería
 * (categories.js)
 * ==========================================================================
 */

(function (window, document, $) {
  'use strict';

  const AlejandraApp = window.AlejandraApp || {};
  const FAV_STORAGE_KEY = 'alejandra_space_favorites_v2';

  const SOCIAL_CONFIG = {
    Instagram: 'https://www.instagram.com/ale_h.p_?rpxt=MXVxeG1zM3dlNmhxdQ==',
    Facebook: 'https://www.facebook.com/share/1E1KnyZcns/',
    TikTok: 'https://www.tiktok.com/@alejandra_peralta2.0?_r=1&_t=ZS-9Az2ASWndX0'
  };

  const FAVORITES_CATALOG = {
    'music-morat': { title: 'Cuando Nadie Ve — Morat', category: 'Música', desc: 'Álbum Balas Perdidas · Pop Rock Latino' },
    'music-morat-besos': { title: 'Besos en Guerra — Morat', category: 'Música', desc: 'Álbum Balas Perdidas · Pop Rock' },
    'music-morat-como': { title: 'Cómo Te Atreves — Morat', category: 'Música', desc: 'Álbum Sobre el Amor' },
    'music-shawn': { title: 'Treat You Better — Shawn Mendes', category: 'Música', desc: 'Álbum Illuminate · Pop Acústico' },
    'music-shawn-stitches': { title: 'Stitches — Shawn Mendes', category: 'Música', desc: 'Álbum Handwritten · Pop' },
    'music-shawn-holdin': { title: "Holdin' Me Back — Shawn Mendes", category: 'Música', desc: 'Álbum Illuminate · Pop Enérgico' },
    'music-taylor': { title: 'Cruel Summer — Taylor Swift', category: 'Música', desc: 'Álbum Lover · Synth Pop' },
    'music-taylor-antihero': { title: 'Anti-Hero — Taylor Swift', category: 'Música', desc: 'Álbum Midnights · Pop' },
    'music-taylor-lovestory': { title: 'Love Story (TV) — Taylor Swift', category: 'Música', desc: 'Álbum Fearless · Country Pop' },
    'music-humbe': { title: 'Amor de Cine — Humbe', category: 'Música', desc: 'Álbum Entropía · Pop Alternativo' },
    'music-humbe-poeta': { title: 'El Poeta — Humbe', category: 'Música', desc: 'Álbum Aurora · Alternativo' },
    'music-humbe-fantasmas': { title: 'Fantasmas — Humbe', category: 'Música', desc: 'Álbum Esencia · Balada Indie' },
    'music-reik': { title: 'Ya Me Enteré — Reik', category: 'Música', desc: 'Álbum Des/Amor · Baladas Pop' },
    'music-reik-noviembre': { title: 'Noviembre Sin Ti — Reik', category: 'Música', desc: 'Álbum Reik · Clásico Romántico' },
    'music-reik-creo': { title: 'Creo en Ti — Reik', category: 'Música', desc: 'Álbum Peligro · Balada Pop' },
    'music-playlist-code': { title: 'Coding & Focus Mix', category: 'Música', desc: 'Playlist UDS de estudio' },
    'game-freefire': { title: 'Free Fire (Rango Oro 🏆)', category: 'Juegos', desc: 'Clasificatoria en escuadras, dominio de Bermuda y firme siempre en rango Oro' },
    'game-vicecity': { title: 'GTA: Vice City (100% ✓)', category: 'Juegos', desc: 'Historia principal, propiedades, saltos únicos y misiones al 100%' },
    'game-pvz': { title: 'Plants vs. Zombies', category: 'Juegos', desc: 'Estrategia por carriles, gestión de soles y Modo Infinito en piscina/tejado' },
    'game-clash': { title: 'Clash Free', category: 'Juegos', desc: 'Duelos PvP en tiempo real con control de elixir y rotación táctica de mazos' },
    'game-upcoming': { title: 'Retos CTF & Puzzles Lógicos', category: 'Juegos', desc: 'Desafíos Capture The Flag de criptografía y ciberseguridad gamificada' },
    'movie-lego': { title: 'El Mundo LEGO (Favorita #1)', category: 'Películas', desc: 'Mi película favorita y pasión por los LEGOs' },
    'movie-lego-sets': { title: 'Universo & Sets LEGO', category: 'Películas', desc: 'Construcción creativa bloque a bloque' },
    'movie-mrrobot': { title: 'Mr. Robot', category: 'Películas', desc: 'Serie de ciberseguridad y suspenso tech' },
    'sport-voley': { title: 'Voleibol', category: 'Deportes', desc: 'Trabajo en equipo y coordinación' },
    'sport-futsal': { title: 'Futsal', category: 'Deportes', desc: 'Velocidad y agilidad en cancha' },
    'uni-uds': { title: 'Ingeniería de Sistemas (UDS)', category: 'Universidad', desc: 'Tercer año en Universidad Domingo Savio' },
    'uni-velora': { title: 'Proyecto Velora', category: 'Universidad', desc: 'Plataforma web universitaria con interfaz moderna y enfoque UI/UX' },
    'uni-autos': { title: 'Sistema de Reserva de Autos', category: 'Universidad', desc: 'Gestión integral de flota, disponibilidad por fechas y alquileres' },
    'uni-reposteria': { title: 'Sistema para Repostería (En Proceso)', category: 'Universidad', desc: 'Web en desarrollo para catálogo artesanal, pedidos y entregas' },
    'uni-cyber': { title: 'Especialización en Ciberseguridad', category: 'Universidad', desc: 'Meta profesional y seguridad informática' }
  };

  const DEFAULT_FAVORITES = [
    'music-morat',
    'music-morat-besos',
    'music-shawn',
    'music-taylor',
    'music-taylor-antihero',
    'music-humbe',
    'music-reik',
    'game-freefire',
    'game-vicecity',
    'game-pvz',
    'game-clash',
    'movie-lego',
    'movie-lego-sets',
    'movie-mrrobot',
    'sport-voley',
    'sport-futsal',
    'uni-uds',
    'uni-cyber'
  ];

  // =========================================================================
  // MOTOR DE AUDIO ESTILO SPOTIFY (Web Audio API Polifónico + Soporte MP3)
  // 16 arreglos melódicos únicos (Morat, Shawn Mendes, Taylor Swift, Humbe, Reik)
  // =========================================================================
  const TRACK_MELODIES = [
    // 0: Morat - Cuando Nadie Ve (D Major)
    { tempoMs: 280, notes: [293.66, 369.99, 440.0, 587.33, 440.0, 369.99, 246.94, 293.66, 369.99, 493.88, 392.0, 329.63] },
    // 1: Morat - Besos en Guerra (G Major enérgico)
    { tempoMs: 250, notes: [196.0, 293.66, 392.0, 493.88, 392.0, 329.63, 246.94, 329.63, 392.0, 440.0, 392.0, 293.66] },
    // 2: Morat - Cómo Te Atreves (C Major folk)
    { tempoMs: 270, notes: [261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 220.0, 261.63, 329.63, 440.0, 349.23, 293.66] },
    // 3: Shawn Mendes - Treat You Better (Am rítmico)
    { tempoMs: 260, notes: [220.0, 261.63, 329.63, 440.0, 196.0, 246.94, 293.66, 392.0, 174.61, 220.0, 261.63, 349.23] },
    // 4: Shawn Mendes - Stitches (Bb/Cm emotivo)
    { tempoMs: 245, notes: [261.63, 311.13, 392.0, 523.25, 233.08, 293.66, 349.23, 466.16, 207.65, 261.63, 311.13, 392.0] },
    // 5: Shawn Mendes - There's Nothing Holdin' Me Back (B/G#m pop)
    { tempoMs: 230, notes: [246.94, 329.63, 415.30, 493.88, 207.65, 246.94, 329.63, 415.30, 220.0, 277.18, 329.63, 440.0] },
    // 6: Taylor Swift - Cruel Summer (A Major synth pop)
    { tempoMs: 220, notes: [440.0, 554.37, 659.25, 554.37, 369.99, 440.0, 554.37, 440.0, 293.66, 369.99, 440.0, 329.63] },
    // 7: Taylor Swift - Anti-Hero (E Major synth groove)
    { tempoMs: 265, notes: [164.81, 246.94, 329.63, 415.30, 207.65, 246.94, 369.99, 493.88, 220.0, 277.18, 329.63, 440.0] },
    // 8: Taylor Swift - Love Story (D/F# brillante)
    { tempoMs: 255, notes: [293.66, 369.99, 440.0, 587.33, 220.0, 293.66, 369.99, 440.0, 246.94, 369.99, 493.88, 440.0] },
    // 9: Humbe - Amor de Cine (Lo-Fi Rhodes Fmaj7)
    { tempoMs: 360, notes: [174.61, 220.0, 261.63, 329.63, 164.81, 196.0, 246.94, 293.66, 146.83, 174.61, 220.0, 261.63] },
    // 10: Humbe - El Poeta (Em atmosférico)
    { tempoMs: 340, notes: [164.81, 246.94, 329.63, 392.0, 196.0, 293.66, 369.99, 440.0, 146.83, 220.0, 261.63, 329.63] },
    // 11: Humbe - Fantasmas (Dm7 nostálgico)
    { tempoMs: 375, notes: [146.83, 220.0, 261.63, 349.23, 174.61, 261.63, 329.63, 392.0, 196.0, 293.66, 349.23, 261.63] },
    // 12: Reik - Ya Me Enteré (G Major balada)
    { tempoMs: 340, notes: [196.0, 246.94, 293.66, 392.0, 146.83, 220.0, 293.66, 369.99, 164.81, 196.0, 246.94, 329.63] },
    // 13: Reik - Noviembre Sin Ti (E/A arpeggio)
    { tempoMs: 330, notes: [164.81, 207.65, 246.94, 329.63, 185.0, 246.94, 329.63, 415.30, 220.0, 277.18, 329.63, 440.0] },
    // 14: Reik - Creo en Ti (D balada suave)
    { tempoMs: 320, notes: [146.83, 220.0, 293.66, 369.99, 196.0, 246.94, 293.66, 392.0, 220.0, 277.18, 329.63, 440.0] },
    // 15: Coding & Focus Mix (Ambient Cyber Synth)
    { tempoMs: 390, notes: [130.81, 196.0, 246.94, 329.63, 146.83, 220.0, 261.63, 349.23] }
  ];

  const SpotifyEngine = {
    ctx: null,
    isPlaying: false,
    isShuffle: false,
    isRepeat: false,
    currentIndex: 0,
    elapsedSec: 0,
    durationSec: 24,
    noteStep: 0,
    synthTimer: null,
    progressTimer: null,
    localAudioUrls: {},
    spPage: 0,
    spSubcat: 'all',
    spArtistFilter: 'all'
  };

  function formatTime(sec) {
    const s = Math.max(0, Math.floor(sec));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem < 10 ? '0' : ''}${rem}`;
  }

  function playWarmTone(freq) {
    try {
      if (!SpotifyEngine.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        SpotifyEngine.ctx = new AudioCtx();
      }
      if (SpotifyEngine.ctx.state === 'suspended') {
        SpotifyEngine.ctx.resume();
      }

      const ctx = SpotifyEngine.ctx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const sub = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      sub.type = 'sine';
      sub.frequency.setValueAtTime(freq / 2, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1450, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.11, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      osc.connect(filter);
      sub.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      sub.start(now);
      osc.stop(now + 0.45);
      sub.stop(now + 0.45);
      osc.onended = () => {
        osc.disconnect();
        sub.disconnect();
        filter.disconnect();
        gain.disconnect();
      };
    } catch (e) {
      // Silencio seguro si el navegador bloquea AudioContext
    }
  }

  function stopPlaybackEngines() {
    clearInterval(SpotifyEngine.synthTimer);
    clearInterval(SpotifyEngine.progressTimer);
    SpotifyEngine.synthTimer = null;
    SpotifyEngine.progressTimer = null;
    const audioEl = document.getElementById('spotify-audio-el');
    if (audioEl && !audioEl.paused) {
      audioEl.pause();
    }
  }

  function updateSpotifyUI() {
    const playerBar = document.getElementById('music-player-bar');
    const playBtn = document.getElementById('btn-toggle-play');
    const seekBar = document.getElementById('sp-seek-bar');
    const timeCur = document.getElementById('sp-time-current');
    const timeTot = document.getElementById('sp-time-total');

    if (playerBar) playerBar.classList.toggle('is-playing', SpotifyEngine.isPlaying);
    if (playBtn) playBtn.textContent = SpotifyEngine.isPlaying ? '⏸' : '▶';
    if (seekBar) {
      seekBar.max = SpotifyEngine.durationSec;
      seekBar.value = Math.min(SpotifyEngine.elapsedSec, SpotifyEngine.durationSec);
    }
    if (timeCur) timeCur.textContent = formatTime(SpotifyEngine.elapsedSec);
    if (timeTot) timeTot.textContent = formatTime(SpotifyEngine.durationSec);

    document.querySelectorAll('.spotify-track-row').forEach((row) => {
      const idx = Number(row.getAttribute('data-track-index'));
      row.classList.toggle('is-active-track', idx === SpotifyEngine.currentIndex);
    });
  }

  function startCurrentTrackPlayback() {
    stopPlaybackEngines();
    SpotifyEngine.isPlaying = true;
    const audioEl = document.getElementById('spotify-audio-el');
    const customUrl = SpotifyEngine.localAudioUrls[SpotifyEngine.currentIndex];
    const modeLabel = document.getElementById('player-audio-mode');

    if (audioEl && customUrl) {
      if (audioEl.src !== customUrl) audioEl.src = customUrl;
      audioEl.currentTime = SpotifyEngine.elapsedSec;
      audioEl.play().catch(() => {});
      if (modeLabel) modeLabel.textContent = 'Reproduciendo archivo MP3 local';
      SpotifyEngine.progressTimer = setInterval(() => {
        SpotifyEngine.durationSec = Math.floor(audioEl.duration) || 24;
        SpotifyEngine.elapsedSec = Math.floor(audioEl.currentTime);
        updateSpotifyUI();
        if (audioEl.ended) handleTrackEnd();
      }, 400);
    } else {
      const pattern = TRACK_MELODIES[SpotifyEngine.currentIndex % TRACK_MELODIES.length];
      SpotifyEngine.durationSec = 24;
      if (modeLabel) modeLabel.textContent = '♫ Reproduciendo audio melódico';
      playWarmTone(pattern.notes[SpotifyEngine.noteStep % pattern.notes.length]);
      SpotifyEngine.noteStep++;

      SpotifyEngine.synthTimer = setInterval(() => {
        if (!SpotifyEngine.isPlaying) return;
        playWarmTone(pattern.notes[SpotifyEngine.noteStep % pattern.notes.length]);
        SpotifyEngine.noteStep++;
      }, pattern.tempoMs);

      SpotifyEngine.progressTimer = setInterval(() => {
        if (!SpotifyEngine.isPlaying) return;
        SpotifyEngine.elapsedSec += 1;
        if (SpotifyEngine.elapsedSec >= SpotifyEngine.durationSec) {
          handleTrackEnd();
        } else {
          updateSpotifyUI();
        }
      }, 1000);
    }
    updateSpotifyUI();
  }

  function getSpotifyPageSize() {
    if (window.innerWidth < 640 && window.innerHeight <= 720) return 3;
    if (window.innerHeight <= 680) return 4;
    if (window.innerHeight <= 820) return 5;
    return 6;
  }

  /**
   * Filtra y pagina la lista de Spotify por subcategoría, artista y álbum sin scroll
   */
  AlejandraApp.filterAndPaginateSpotify = function () {
    const allRows = Array.from(document.querySelectorAll('#spotify-tracklist .spotify-track-row'));
    if (!allRows.length) return;

    const matchingRows = [];
    allRows.forEach((row) => {
      const subcats = (row.getAttribute('data-subcategory') || '').split(' ');
      const artistKey = row.getAttribute('data-artist-key') || '';
      const albumKey = row.getAttribute('data-album-key') || '';

      const matchSub = SpotifyEngine.spSubcat === 'all' || subcats.includes(SpotifyEngine.spSubcat);
      const af = SpotifyEngine.spArtistFilter;
      const matchArtist = af === 'all' || artistKey === af || albumKey === af;

      const visible = matchSub && matchArtist;
      row.classList.toggle('is-filtered-out', !visible);
      if (visible) matchingRows.push(row);
    });

    const perPage = getSpotifyPageSize();
    const totalPages = Math.max(1, Math.ceil(matchingRows.length / perPage));
    if (SpotifyEngine.spPage >= totalPages) SpotifyEngine.spPage = totalPages - 1;
    if (SpotifyEngine.spPage < 0) SpotifyEngine.spPage = 0;

    const start = SpotifyEngine.spPage * perPage;
    const end = start + perPage;

    matchingRows.forEach((row, idx) => {
      row.classList.toggle('is-paged-hidden', !(idx >= start && idx < end));
    });

    const infoEl = document.getElementById('sp-page-info');
    if (infoEl) {
      if (matchingRows.length === 0) {
        infoEl.textContent = '0 pistas con este filtro';
      } else {
        infoEl.textContent = `Mostrando ${start + 1}–${Math.min(end, matchingRows.length)} de ${matchingRows.length}`;
      }
    }

    const prevPageBtn = document.getElementById('sp-page-prev');
    const nextPageBtn = document.getElementById('sp-page-next');
    if (prevPageBtn) prevPageBtn.disabled = SpotifyEngine.spPage === 0;
    if (nextPageBtn) nextPageBtn.disabled = SpotifyEngine.spPage >= totalPages - 1;
  };

  AlejandraApp.setSpotifySubcat = function (subcat) {
    SpotifyEngine.spSubcat = subcat || 'all';
    SpotifyEngine.spPage = 0;
    AlejandraApp.filterAndPaginateSpotify();
  };

  AlejandraApp.paginateSpotifyList = function () {
    AlejandraApp.filterAndPaginateSpotify();
  };

  function getNavigableIndices() {
    const visible = Array.from(document.querySelectorAll('#spotify-tracklist .spotify-track-row:not(.is-filtered-out)'));
    if (visible.length) {
      return visible.map((r) => Number(r.getAttribute('data-track-index')));
    }
    return Array.from(document.querySelectorAll('#spotify-tracklist .spotify-track-row')).map((r) =>
      Number(r.getAttribute('data-track-index'))
    );
  }

  function stepTrack(delta) {
    const indices = getNavigableIndices();
    if (!indices.length) return;
    const pos = indices.indexOf(SpotifyEngine.currentIndex);
    const nextPos = pos === -1 ? 0 : ((pos + delta) % indices.length + indices.length) % indices.length;
    selectTrackByIndex(indices[nextPos], true);
  }

  function handleTrackEnd() {
    if (SpotifyEngine.isRepeat) {
      SpotifyEngine.elapsedSec = 0;
      startCurrentTrackPlayback();
      return;
    }
    const indices = getNavigableIndices();
    if (!indices.length) return;
    if (SpotifyEngine.isShuffle) {
      const randIdx = indices[Math.floor(Math.random() * indices.length)];
      selectTrackByIndex(randIdx, true);
    } else {
      stepTrack(1);
    }
  }

  function selectTrackByIndex(index, autoPlay = true) {
    const rows = document.querySelectorAll('#spotify-tracklist .spotify-track-row');
    if (!rows.length) return;
    const safeIndex = ((index % rows.length) + rows.length) % rows.length;
    const row = rows[safeIndex];

    SpotifyEngine.currentIndex = safeIndex;
    SpotifyEngine.elapsedSec = 0;
    SpotifyEngine.noteStep = 0;

    // Mantener visible la pista activa en la página correspondiente del listado
    const visibleRows = Array.from(document.querySelectorAll('#spotify-tracklist .spotify-track-row:not(.is-filtered-out)'));
    const visPos = visibleRows.indexOf(row);
    if (visPos !== -1) {
      SpotifyEngine.spPage = Math.floor(visPos / getSpotifyPageSize());
      AlejandraApp.filterAndPaginateSpotify();
    }

    const track = row.getAttribute('data-track') || 'Canción';
    const artist = row.getAttribute('data-artist') || 'Artista';
    const cover = row.getAttribute('data-cover');

    const trackEl = document.getElementById('player-track');
    const artistEl = document.getElementById('player-artist');
    const coverEl = document.getElementById('player-cover');

    if (trackEl) trackEl.textContent = track;
    if (artistEl) artistEl.textContent = artist;
    if (coverEl && cover) coverEl.src = cover;

    const heroNowPlaying = document.getElementById('hero-now-playing');
    if (heroNowPlaying) {
      const shortArtist = artist.split(' · ')[0] || artist;
      heroNowPlaying.textContent = `${shortArtist} · ${track}`;
    }

    if (autoPlay) {
      startCurrentTrackPlayback();
    } else {
      stopPlaybackEngines();
      SpotifyEngine.isPlaying = false;
      updateSpotifyUI();
    }
  }

  AlejandraApp.hydrateMusicPlayer = function () {
    $(document)
      .off('click.spPlay', '#btn-toggle-play')
      .on('click.spPlay', '#btn-toggle-play', function () {
        if (SpotifyEngine.isPlaying) {
          stopPlaybackEngines();
          SpotifyEngine.isPlaying = false;
          updateSpotifyUI();
        } else {
          startCurrentTrackPlayback();
        }
      });

    $(document)
      .off('click.spPrev', '#sp-btn-prev')
      .on('click.spPrev', '#sp-btn-prev', function () { stepTrack(-1); });

    $(document)
      .off('click.spNext', '#sp-btn-next')
      .on('click.spNext', '#sp-btn-next', function () { stepTrack(1); });

    $(document)
      .off('click.spShuffle', '#sp-btn-shuffle')
      .on('click.spShuffle', '#sp-btn-shuffle', function () {
        SpotifyEngine.isShuffle = !SpotifyEngine.isShuffle;
        this.classList.toggle('is-on', SpotifyEngine.isShuffle);
        this.setAttribute('aria-pressed', String(SpotifyEngine.isShuffle));
        AlejandraApp.showToast?.(SpotifyEngine.isShuffle ? '⇄ Modo aleatorio activado' : 'Modo aleatorio desactivado');
      });

    $(document)
      .off('click.spRepeat', '#sp-btn-repeat')
      .on('click.spRepeat', '#sp-btn-repeat', function () {
        SpotifyEngine.isRepeat = !SpotifyEngine.isRepeat;
        this.classList.toggle('is-on', SpotifyEngine.isRepeat);
        this.setAttribute('aria-pressed', String(SpotifyEngine.isRepeat));
        AlejandraApp.showToast?.(SpotifyEngine.isRepeat ? '↻ Repetición de pista activada' : 'Repetición desactivada');
      });

    $(document)
      .off('input.spSeek', '#sp-seek-bar')
      .on('input.spSeek', '#sp-seek-bar', function (e) {
        SpotifyEngine.elapsedSec = Number(e.target.value) || 0;
        const audioEl = document.getElementById('spotify-audio-el');
        if (audioEl && SpotifyEngine.localAudioUrls[SpotifyEngine.currentIndex]) {
          audioEl.currentTime = SpotifyEngine.elapsedSec;
        }
        updateSpotifyUI();
      });

    $(document)
      .off('change.spUpload', '#sp-local-mp3')
      .on('change.spUpload', '#sp-local-mp3', function (e) {
        const file = e.target.files?.[0];
        if (!file) return;
        const idx = SpotifyEngine.currentIndex;
        if (SpotifyEngine.localAudioUrls[idx]) {
          URL.revokeObjectURL(SpotifyEngine.localAudioUrls[idx]);
        }
        const url = URL.createObjectURL(file);
        SpotifyEngine.localAudioUrls[idx] = url;
        SpotifyEngine.elapsedSec = 0;
        const trackEl = document.getElementById('player-track');
        if (trackEl) trackEl.textContent = file.name.replace(/\.[^/.]+$/, '');
        startCurrentTrackPlayback();
        AlejandraApp.showToast?.(`♫ Audio MP3 cargado: ${file.name}`);
        e.target.value = '';
      });

    // Clic en fila de pista estilo Spotify
    $(document)
      .off('click.spTrack', '#spotify-tracklist .spotify-track-row')
      .on('click.spTrack', '#spotify-tracklist .spotify-track-row', function (e) {
        if ($(e.target).closest('.sp-row-fav').length) return;
        const idx = Number($(this).attr('data-track-index'));
        selectTrackByIndex(idx, true);
      });

    // Filtros rápidos por Artista y Álbum en Spotify
    $(document)
      .off('click.spArtist', '[data-sp-artist]')
      .on('click.spArtist', '[data-sp-artist]', function () {
        $('[data-sp-artist]').removeClass('is-active');
        $(this).addClass('is-active');
        SpotifyEngine.spArtistFilter = $(this).attr('data-sp-artist') || 'all';
        SpotifyEngine.spPage = 0;
        AlejandraApp.filterAndPaginateSpotify();
      });

    // Paginación de lista Spotify sin scroll
    $(document)
      .off('click.spPagePrev', '#sp-page-prev')
      .on('click.spPagePrev', '#sp-page-prev', function () {
        if (SpotifyEngine.spPage > 0) {
          SpotifyEngine.spPage--;
          AlejandraApp.filterAndPaginateSpotify();
        }
      });

    $(document)
      .off('click.spPageNext', '#sp-page-next')
      .on('click.spPageNext', '#sp-page-next', function () {
        SpotifyEngine.spPage++;
        AlejandraApp.filterAndPaginateSpotify();
      });

    // Checklists de tareas
    $(document)
      .off('change.spTask', '.task-item input[type="checkbox"]')
      .on('change.spTask', '.task-item input[type="checkbox"]', function (e) {
        const row = e.target.closest('.task-item');
        if (row) row.classList.toggle('is-done', e.target.checked);
      });

    // Liberar timers y ObjectURLs al salir de la página para evitar fugas en RAM
    $(window)
      .off('beforeunload.spotifyCleanup')
      .on('beforeunload.spotifyCleanup', function () {
        stopPlaybackEngines();
        Object.values(SpotifyEngine.localAudioUrls).forEach((blobUrl) => {
          if (blobUrl) URL.revokeObjectURL(blobUrl);
        });
        SpotifyEngine.localAudioUrls = {};
      });

    AlejandraApp.filterAndPaginateSpotify();
    updateSpotifyUI();
    document.body.dataset.musicHydrated = 'true';
    return true;
  };

  // =========================================================================
  // FAVORITOS + PAGINACIÓN SIN SCROLL
  // =========================================================================
  let favPage = 0;

  AlejandraApp.getFavorites = function () {
    try {
      const stored = localStorage.getItem(FAV_STORAGE_KEY);
      if (!stored) return [...DEFAULT_FAVORITES];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [...DEFAULT_FAVORITES];
    } catch (e) {
      return [...DEFAULT_FAVORITES];
    }
  };

  AlejandraApp.saveFavorites = function (favList) {
    localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(favList));
    AlejandraApp.syncFavoritesUI();
  };

  AlejandraApp.syncFavoritesUI = function () {
    const favs = AlejandraApp.getFavorites();

    document.querySelectorAll('[data-fav-id]').forEach((btn) => {
      const id = btn.getAttribute('data-fav-id');
      const active = favs.includes(id);
      btn.classList.toggle('is-fav', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    document.querySelectorAll('#bottom-fav-badge, [data-fav-badge]').forEach((badge) => {
      badge.textContent = String(favs.length);
    });

    const container = document.getElementById('favorites-container');
    if (!container) return;

    const perPage = window.innerWidth >= 960 ? 6 : window.innerWidth >= 640 ? 4 : 3;
    const totalPages = Math.max(1, Math.ceil(favs.length / perPage));
    if (favPage >= totalPages) favPage = totalPages - 1;

    if (favs.length === 0) {
      container.innerHTML =
        '<div class="glass-card" style="grid-column:1/-1; text-align:center;">' +
        '<h3 class="card-title">Tu lista de favoritos está vacía</h3>' +
        '<p class="card-desc">Presiona ♥ en cualquier canción, juego, deporte o materia.</p></div>';
    } else {
      const slice = favs.slice(favPage * perPage, favPage * perPage + perPage);
      container.innerHTML = slice
        .map((id) => {
          const item = FAVORITES_CATALOG[id] || { title: id, category: 'Personal', desc: 'Elemento guardado.' };
          return `
            <article class="glass-card" data-fav-preview="${id}">
              <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                <h3 class="card-title">♥ ${item.title}</h3>
                <button type="button" class="tag-chip btn-remove-fav" data-remove-fav="${id}">Quitar ×</button>
              </div>
              <p class="card-meta">Categoría: ${item.category}</p>
              <p class="card-desc">${item.desc}</p>
            </article>
          `;
        })
        .join('');
    }

    const pageInfo = document.getElementById('fav-page-info');
    if (pageInfo) pageInfo.textContent = `Página ${favPage + 1} / ${totalPages}`;

    const prevFavBtn = document.getElementById('fav-prev');
    const nextFavBtn = document.getElementById('fav-next');
    if (prevFavBtn) prevFavBtn.disabled = favPage === 0;
    if (nextFavBtn) nextFavBtn.disabled = favPage >= totalPages - 1;

    AlejandraApp.hydrateDynamicButtons?.(container);
  };

  AlejandraApp.hydrateFavorites = function () {
    AlejandraApp.syncFavoritesUI();

    $(document)
      .off('click.favToggle', '[data-fav-id]')
      .on('click.favToggle', '[data-fav-id]', function () {
        const id = $(this).attr('data-fav-id');
        let favs = AlejandraApp.getFavorites();
        if (favs.includes(id)) {
          favs = favs.filter((item) => item !== id);
          AlejandraApp.showToast?.('Eliminado de Mis Favoritos');
        } else {
          favs.push(id);
          AlejandraApp.showToast?.('♥ Guardado en Mis Favoritos');
        }
        AlejandraApp.saveFavorites(favs);
      });

    $(document)
      .off('click.favRemove', '[data-remove-fav]')
      .on('click.favRemove', '[data-remove-fav]', function () {
        const id = $(this).attr('data-remove-fav');
        AlejandraApp.saveFavorites(AlejandraApp.getFavorites().filter((i) => i !== id));
      });

    $(document)
      .off('click.favPrev', '#fav-prev')
      .on('click.favPrev', '#fav-prev', function () {
        if (favPage > 0) { favPage--; AlejandraApp.syncFavoritesUI(); }
      });

    $(document)
      .off('click.favNext', '#fav-next')
      .on('click.favNext', '#fav-next', function () {
        const favs = AlejandraApp.getFavorites();
        const perPage = window.innerWidth >= 960 ? 6 : window.innerWidth >= 640 ? 4 : 3;
        const totalPages = Math.max(1, Math.ceil(favs.length / perPage));
        if (favPage < totalPages - 1) { favPage++; AlejandraApp.syncFavoritesUI(); }
      });

    $(document)
      .off('click.favReset', '#btn-reset-favs')
      .on('click.favReset', '#btn-reset-favs', function () {
        favPage = 0;
        AlejandraApp.saveFavorites([...DEFAULT_FAVORITES]);
        AlejandraApp.showToast?.('Favoritos restaurados');
      });

    document.body.dataset.favsHydrated = 'true';
    return true;
  };

  // =========================================================================
  // GALERÍA DE FOTOS COMPACTA SIN SCROLL + LIGHTBOX
  // =========================================================================
  let galPage = 0;

  AlejandraApp.paginateGallery = function () {
    const cards = Array.from(document.querySelectorAll('#gallery-grid .gallery-card:not(.is-filtered-out)'));
    const perPage = window.innerWidth >= 640 ? 6 : 4;
    const totalPages = Math.max(1, Math.ceil(cards.length / perPage));
    if (galPage >= totalPages) galPage = totalPages - 1;

    cards.forEach((card, idx) => {
      const inPage = idx >= galPage * perPage && idx < (galPage + 1) * perPage;
      card.classList.toggle('is-paged-hidden', !inPage);
    });

    const info = document.getElementById('gal-page-info');
    if (info) info.textContent = `Página ${galPage + 1} / ${totalPages}`;

    const prevGalBtn = document.getElementById('gal-prev');
    const nextGalBtn = document.getElementById('gal-next');
    if (prevGalBtn) prevGalBtn.disabled = galPage === 0;
    if (nextGalBtn) nextGalBtn.disabled = galPage >= totalPages - 1;
  };

  AlejandraApp.hydrateGallery = function () {
    AlejandraApp.paginateGallery();

    $(document)
      .off('click.galPrev', '#gal-prev')
      .on('click.galPrev', '#gal-prev', function () {
        if (galPage > 0) { galPage--; AlejandraApp.paginateGallery(); }
      });

    $(document)
      .off('click.galNext', '#gal-next')
      .on('click.galNext', '#gal-next', function () {
        const cards = document.querySelectorAll('#gallery-grid .gallery-card:not(.is-filtered-out)');
        const perPage = window.innerWidth >= 640 ? 6 : 4;
        const totalPages = Math.max(1, Math.ceil(cards.length / perPage));
        if (galPage < totalPages - 1) { galPage++; AlejandraApp.paginateGallery(); }
      });

    $(document)
      .off('click.galCard', '#gallery-grid .gallery-card')
      .on('click.galCard', '#gallery-grid .gallery-card', function () {
        const card = this;
        const img = card.querySelector('img');
        const title = card.querySelector('h4')?.textContent || 'Fotografía';
        const cat = card.querySelector('span')?.textContent || '';

        const lbImg = document.getElementById('lightbox-img');
        const lbTitle = document.getElementById('lightbox-caption');
        const lbMeta = document.getElementById('lightbox-meta');
        if (lbImg && img) lbImg.src = img.src;
        if (lbTitle) lbTitle.textContent = title;
        if (lbMeta) lbMeta.textContent = `Categoría: ${cat}`;
        AlejandraApp.openModal?.('modal-lightbox');
      });

    $(document)
      .off('change.galUpload', '#photo-upload-input')
      .on('change.galUpload', '#photo-upload-input', function (e) {
        const galleryGrid = document.getElementById('gallery-grid');
        const categorySelect = document.getElementById('upload-category-select');
        const file = e.target.files?.[0];
        if (!galleryGrid || !file || !file.type.startsWith('image/')) {
          AlejandraApp.showToast?.('Selecciona un archivo de imagen válido.');
          return;
        }
        const reader = new FileReader();
        reader.onload = function (ev) {
          const catValue = categorySelect ? categorySelect.value : 'personales';
          const catLabel = categorySelect ? categorySelect.options[categorySelect.selectedIndex].text : 'Personales';
          const cleanTitle = file.name.replace(/\.[^/.]+$/, '').slice(0, 28) || 'Foto subida';

          const figure = document.createElement('figure');
          figure.className = 'gallery-card';
          figure.setAttribute('data-gallery-cat', catValue);
          figure.innerHTML = `<img src="${ev.target.result}" alt="${cleanTitle}" /><figcaption class="gallery-overlay"><h4>${cleanTitle}</h4><span>${catLabel}</span></figcaption>`;
          galleryGrid.prepend(figure);
          galPage = 0;
          AlejandraApp.paginateGallery();
          AlejandraApp.showToast?.(`📸 Foto agregada en "${catLabel}"`);
          e.target.value = '';
        };
        reader.readAsDataURL(file);
      });

    document.body.dataset.galleryHydrated = 'true';
    return true;
  };

  // =========================================================================
  // REDES SOCIALES CONFIGURABLES
  // =========================================================================
  AlejandraApp.hydrateSocialLinks = function () {
    document.querySelectorAll('.social-circle-link').forEach((link) => {
      const network = link.getAttribute('data-social-network');
      const configuredUrl = SOCIAL_CONFIG[network];
      if (configuredUrl && configuredUrl !== '#') {
        link.setAttribute('href', configuredUrl);
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });

    $(document)
      .off('click.socialUnconfigured', '.social-circle-link')
      .on('click.socialUnconfigured', '.social-circle-link', function (e) {
        const network = $(this).attr('data-social-network');
        const configuredUrl = SOCIAL_CONFIG[network];
        if (!configuredUrl || configuredUrl === '#') {
          e.preventDefault();
          AlejandraApp.showToast?.(`Enlace de ${network} listo para configurar en js/categories.js`);
        }
      });

    document.body.dataset.socialHydrated = 'true';
    return true;
  };

  window.AlejandraApp = AlejandraApp;
})(window, document, window.jQuery);
