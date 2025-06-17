import { getAllPendingStories, deleteStoryByDate } from '../utils/idb';

export async function tampilkanCeritaOffline(container) {
  const cerita = await getAllPendingStories();

  container.innerHTML = '<h2 class="text-xl font-bold mb-4">Cerita Tersimpan Offline</h2>';

  if (cerita.length === 0) {
    container.innerHTML += '<p class="text-gray-600">Tidak ada cerita offline yang tersimpan.</p>';
    return;
  }

  cerita.forEach(item => {
    const card = document.createElement('div');
    card.className = 'story-card border p-4 mb-4 rounded shadow bg-white';

    const tanggal = item.date ? new Date(item.date).toLocaleString() : '(tanggal tidak tersedia)';

    card.innerHTML = `
      <h3 class="text-lg font-semibold mb-2">${item.title}</h3>
      <p class="mb-2">${item.body}</p>
      <small class="text-gray-500 block mb-2">Tanggal: ${tanggal}</small>
      <button class="btn-hapus p-2 bg-red-600 text-white rounded hover:bg-red-700">Hapus Cerita</button>
    `;

    const btnHapus = card.querySelector('.btn-hapus');
    btnHapus.addEventListener('click', async () => {
      await deleteStoryByDate(item.date);
      alert('✅ Cerita berhasil dihapus.');
      tampilkanCeritaOffline(container); // Refresh tampilan
    });

    container.appendChild(card);
  });
}
