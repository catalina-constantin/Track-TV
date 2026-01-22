async function fetchTrendingMovies() {
  try {
    const response = await fetch('https://ghibliapi.vercel.app/films');
    if (!response.ok) throw new Error(`[ERROR] HTTP error, status: ${response.status}`);
    const data = await response.json();

    localStorage.setItem('trendingMovies', JSON.stringify(data));
    renderTrendingMovies();
  } catch (error) {
    console.error('[ERROR] Error fetching movies:', error);
    showTrendsMessage('Couldn’t load movies. Please try again later.');
  }
}

function renderTrendingMovies() {
  const container = document.getElementById('trends-cards');
  if (!container) return;

  const raw = localStorage.getItem('trendingMovies');
  if (!raw) {
    showTrendsMessage('Loading movies…');
    return;
  }

  let films;
  try {
    films = JSON.parse(raw);
  } catch {
    showTrendsMessage('[ERROR] Unexpected data format.');
    return;
  }

  if (!Array.isArray(films) || films.length === 0) {
    showTrendsMessage('No movies available.');
    return;
  }

  const frag = document.createDocumentFragment();

  for (const film of films) {
    const title = film.title || 'Untitled';
    const poster = film.image || film.movie_banner || 'assets/backup-cover.png';
    const length = film.running_time ? film.running_time + ' min' : '—';
    const rating = film.rt_score ? (Number(film.rt_score) / 10).toFixed(1) : '—';
    const released = film.release_date ? film.release_date : '-'; 

    const card = document.createElement('article');
    card.className = 'movie-card';

    const media = document.createElement('div');
    media.className = 'movie-card_media';

    const img = document.createElement('img');
    img.className = 'movie-card_image';
    img.src = poster;
    img.alt = `Poster: ${title}`;
    img.loading = 'lazy';

    const overlay = document.createElement('div');
    overlay.className = 'movie-card_overlay';

    const titleWrap = document.createElement('div');
    titleWrap.className = 'movie-card_title-wrap';

    const titleEl = document.createElement('h3');
    titleEl.className = 'movie-card_title';
    titleEl.textContent = title;
    titleEl.title = title;

    titleWrap.appendChild(titleEl);

    const play = document.createElement('button');
    play.className = 'movie-card_play';
    play.type = 'button';
    play.innerHTML = `
      <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M9 7l8 5-8 5V7z" fill="currentColor"></path>
      </svg>
    `;

    media.appendChild(img);
    media.appendChild(overlay);
    media.appendChild(titleWrap);
    media.appendChild(play);

    const body = document.createElement('div');
    body.className = 'movie-card_body';

    const meta = document.createElement('div');
    meta.className = 'movie-card_meta';

    meta.appendChild(buildMetaItem('Length', length));
    meta.appendChild(buildMetaItem('Released', released));
    meta.appendChild(buildMetaItem('Rating', rating));

    body.appendChild(meta);

    card.appendChild(media);
    card.appendChild(body);
    frag.appendChild(card);
  }

  container.replaceChildren(frag);

  function buildMetaItem(label, value) {
    const item = document.createElement('div');
    item.className = 'movie-card_meta-item';

    const k = document.createElement('span');
    k.className = 'movie-card_meta-key';
    k.textContent = label;

    const v = document.createElement('span');
    v.className = 'movie-card_meta-value';
    v.textContent = value;

    item.appendChild(k);
    item.appendChild(v);
    return item;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderTrendingMovies();
  fetchTrendingMovies();
});

function showTrendsMessage(msg) {
  const container = document.getElementById('trends-cards');
  if (!container) return;
  container.textContent = msg;
}
