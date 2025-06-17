import { getAllPendingStories } from '../utils/idb';

export async function tampilkanCeritaOffline(container) {
  const cerita = await getAllPendingStories();

  container.innerHTML = '';

  if (cerita.length === 0) {
    container.innerHTML = '<p>Tidak ada cerita offline.</p>';
    return;
  }

  cerita.forEach(item => {
    const card = document.createElement('div');
    card.className = 'story-card border p-3 mb-3 rounded shadow';
    card.innerHTML = `
      <h3 class="font-bold">${item.title}</h3>
      <p>${item.body}</p>
      <small class="text-gray-500">${new Date(item.date).toLocaleString()}</small>
    `;
    container.appendChild(card);
  });
}
