import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchStoryDetail } from '../presenter/detailPresenter.js';

const getQueryParams = (queryString) => {
  const params = {};
  const pairs = (queryString[0] === '?' ? queryString.slice(1) : queryString).split('&');
  for (const pair of pairs) {
    if (!pair) continue;
    const [key, value] = pair.split('=');
    params[key] = decodeURIComponent(value || '');
  }
  return params;
};

export const renderDetail = async (container) => {
  container.setAttribute('aria-live', 'polite'); // bantu screen reader update

  const token = localStorage.getItem('token');
  if (!token) {
    container.innerHTML = `<p>Silakan login terlebih dahulu untuk melihat detail cerita.</p>`;
    return;
  }

  const hash = location.hash;
  const queryString = hash.split('?')[1] || '';
  const params = getQueryParams(queryString);
  const id = params.id;

  if (!id) {
    container.innerHTML = `<p>ID cerita tidak ditemukan.</p>`;
    return;
  }

  container.innerHTML = `<p>Loading detail cerita...</p>`;

  const data = await fetchStoryDetail(id, token);

  if (data.error) {
    container.innerHTML = `<p>Gagal memuat detail cerita: ${data.message}</p>`;
    return;
  }

  const story = data.story;
  if (!story) {
    container.innerHTML = `<p>Detail cerita tidak ditemukan.</p>`;
    return;
  }

  let html = `
    <h2>${story.name}</h2>
    <img src="${story.photoUrl}" alt="Foto cerita ${story.name}" style="max-width:100%; height:auto;" />
    <p>${story.description}</p>
    <small>Dibuat: ${new Date(story.createdAt).toLocaleString()}</small><br/>
  `;

  if (story.lat !== undefined && story.lon !== undefined) {
    html += `<div id="map" style="height: 300px; margin-top: 10px;" aria-label="Lokasi cerita di peta"></div>`;
  }

  html += `<br/><button onclick="window.history.back()">Kembali</button>`;
  container.innerHTML = html;

  if (story.lat !== undefined && story.lon !== undefined) {
    const map = L.map('map').setView([story.lat, story.lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.marker([story.lat, story.lon]).addTo(map).bindPopup("Lokasi cerita").openPopup();
  }
};
