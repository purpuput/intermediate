import L from 'leaflet';
import {
  startCamera,
  capturePhoto,
  stopCamera,
  handleFileInput,
  getCapturedFile
} from '../presenter/tambahPresenter.js';

function renderTambah(main) {
  const content = main;

  content.innerHTML = `
    <h2>Tambah Cerita</h2>
    <form id="tambahForm" data-lat="" data-lng="">
      <label for="deskripsi">Deskripsi:</label>
      <textarea id="deskripsi" name="deskripsi" required></textarea>

      <label for="foto">Unggah Foto:</label>
      <input type="file" id="foto" accept="image/*">

      <button type="button" id="kameraButton">Gunakan Kamera</button>
      <button type="button" id="ambilFoto">Ambil Foto</button>
      <div id="cameraArea" style="display:none;">
        <video autoplay></video>
      </div>

      <img id="previewImg" style="display:none; max-width: 100%; margin-top: 10px;"/>

      <div id="map" style="height: 300px; margin-top: 20px;"></div>

      <button type="submit">Kirim</button>
    </form>
  `;

  const deskripsiInput = document.getElementById('deskripsi');
  const fileInput = document.getElementById('foto');
  const kameraBtn = document.getElementById('kameraButton');
  const ambilFotoBtn = document.getElementById('ambilFoto');
  const cameraArea = document.getElementById('cameraArea');
  const video = cameraArea.querySelector('video');
  const previewImg = document.getElementById('previewImg');
  const form = document.getElementById('tambahForm');

  let isCameraActive = false; // ✅ status kamera

  kameraBtn.addEventListener('click', () => {
    startCamera(video, cameraArea, previewImg);
    isCameraActive = true; // ✅ aktifkan status kamera
  });

  ambilFotoBtn.addEventListener('click', async () => {
    if (!isCameraActive) {
      alert('Kamera belum aktif. Silakan klik "Gunakan Kamera" terlebih dahulu.');
      return;
    }
    await capturePhoto(video, previewImg, cameraArea);
  });

  fileInput.addEventListener('change', () => {
    handleFileInput(fileInput, previewImg);
  });

  // Inisialisasi Leaflet map
  const map = L.map('map').setView([-6.200000, 106.816666], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  let userMarker = null;
  map.on('click', function (e) {
    const { lat, lng } = e.latlng;
    if (userMarker) {
      userMarker.setLatLng([lat, lng]);
    } else {
      userMarker = L.marker([lat, lng]).addTo(map);
    }
    form.dataset.lat = lat;
    form.dataset.lng = lng;
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const deskripsi = deskripsiInput.value;
    const foto = getCapturedFile();
    const lat = form.dataset.lat;
    const lng = form.dataset.lng;

    if (!foto) {
      alert('Harap unggah atau ambil foto.');
      return;
    }

    if (!lat || !lng) {
      alert('Harap pilih lokasi pada peta.');
      return;
    }

    const formData = new FormData();
    formData.append('description', deskripsi);
    formData.append('photo', foto);
    formData.append('lat', lat);
    formData.append('lon', lng);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://story-api.dicoding.dev/v1/stories', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const result = await res.json();
      if (result.message === 'Story created successfully') {
        alert('Cerita berhasil ditambahkan!');
        location.hash = '#/home';
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      alert('Gagal mengirim cerita: ' + err.message);
    }
  });

  // Matikan kamera saat pindah halaman
  window.addEventListener('hashchange', () => {
    stopCamera();
    isCameraActive = false; // ✅ reset status
  });
}

export default renderTambah;
