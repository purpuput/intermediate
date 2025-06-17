import { API } from '../model/api.js';

export const renderHome = async (container) => {
  const token = localStorage.getItem('token');

  container.innerHTML = `
    <a href="#mainContent" class="skip-link">Skip to content</a>
    <header>
      <h1>Aplikasi Cerita</h1>
      <!-- Bisa tambahkan navigasi utama di sini jika ada -->
    </header>
    <main id="mainContent">
      <h2>Beranda</h2>
      <div id="story-list">Loading...</div>
    </main>
  `;

  if (!token) {
    const main = container.querySelector('main');
    main.innerHTML = `<p>Silakan login untuk melihat cerita.</p>`;
    return;
  }

  try {
    const data = await API.getStories(token);
    const list = container.querySelector('#story-list');

    if (data.error) {
      list.innerHTML = `<p>Gagal memuat cerita: ${data.message}</p>`;
      return;
    }

    list.innerHTML = data.listStory.map(story => `
      <article class="story" tabindex="0" aria-label="Cerita dari ${story.name}">
        <h3>${story.name}</h3>
        ${story.photoUrl ? `<img src="${story.photoUrl}" alt="Foto ${story.name}" style="max-width: 100%; height: auto; margin-bottom: 10px;" />` : ''}
        <p>${story.description}</p>
        <small>${new Date(story.createdAt).toLocaleString()}</small><br/>
        <button onclick="location.hash='#/detail?id=${story.id}'" aria-label="Lihat detail cerita dari ${story.name}">Lihat Detail</button>
        ${story.lat && story.lon ? `<div id="map-${story.id}" class="story-map" style="height: 200px; margin-top: 10px;" aria-label="Peta lokasi cerita"></div>` : ''}
      </article>
    `).join('');

    if (window.L) { // Pastikan Leaflet sudah di-load
      data.listStory.forEach(story => {
        if (story.lat && story.lon) {
          const mapId = `map-${story.id}`;
          const mapElement = document.getElementById(mapId);
          if (mapElement) {
            const map = L.map(mapId).setView([story.lat, story.lon], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            L.marker([story.lat, story.lon])
              .addTo(map)
              .bindPopup(`<b>${story.name}</b><br>${story.description}`);
          }
        }
      });
    }
  } catch (err) {
    const main = container.querySelector('main');
    main.innerHTML = `<p>Terjadi kesalahan: ${err.message}</p>`;
  }
};
