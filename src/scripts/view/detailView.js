import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchStoryDetail } from '../presenter/detailPresenter.js';
import { saveStoryOffline, deleteStoryByDate, getAllPendingStories } from '../utils/idb.js';

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

const isStorySaved = async (date) => {
  const all = await getAllPendingStories();
  return all.some(item => item.date === date);
};

export const renderDetail = async (container) => {
  container.setAttribute('aria-live', 'polite');

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

  // Tampilkan peta
  if (story.lat !== undefined && story.lon !== undefined) {
    const map = L.map('map').setView([story.lat, story.lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    L.marker([story.lat, story.lon]).addTo(map).bindPopup("Lokasi cerita").openPopup();
  }

  // Tambahkan tombol Simpan/Hapus Offline
  const actionsDiv = document.createElement('div');
  actionsDiv.id = 'offline-actions';

  const saved = await isStorySaved(story.createdAt);
  const btn = document.createElement('button');
  btn.textContent = saved ? 'Hapus dari Offline' : 'Simpan Offline';
  btn.className = 'mt-2 p-2 border rounded bg-blue-600 text-white';

  btn.addEventListener('click', async () => {
    if (await isStorySaved(story.createdAt)) {
      await deleteStoryByDate(story.createdAt);
      btn.textContent = 'Simpan Offline';
      alert('✅ Cerita dihapus dari penyimpanan offline.');
    } else {
      await saveStoryOffline({
        date: story.createdAt,
        title: story.name,
        body: story.description,
      });
      btn.textContent = 'Hapus dari Offline';
      alert('✅ Cerita disimpan offline.');
    }
  });

  container.appendChild(actionsDiv);
  actionsDiv.appendChild(btn);
};
