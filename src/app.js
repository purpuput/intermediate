import 'leaflet/dist/leaflet.css';
import { router } from './scripts/router/router.js';
import { registerServiceWorker } from './scripts/utils/push.js';
import { getAllPendingStories, clearPendingStories } from './scripts/utils/idb.js'; // ✅ Tambahan untuk IndexedDB

window.addEventListener('hashchange', () => {
  router();
  updateNavbar();
});

window.addEventListener('DOMContentLoaded', () => {
  router();
  updateNavbar();

  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      alert('Berhasil logout.');
      window.location.hash = '#/login';
      updateNavbar();
    });
  }

  // ✅ Daftarkan Service Worker & Push
  registerServiceWorker();

  // ✅ Sinkronisasi cerita offline saat online
  if (navigator.onLine) {
    syncPendingStories();
  }
});

window.addEventListener('online', () => {
  console.log('🔄 Kamu kembali online, mencoba sinkronisasi cerita...');
  syncPendingStories();
});

function updateNavbar() {
  const logoutLink = document.getElementById('logoutLink');
  const loginLink = document.querySelector('a[href="#/login"]');

  if (!logoutLink || !loginLink) return;

  const token = localStorage.getItem('token');
  if (token) {
    logoutLink.style.display = 'inline';
    loginLink.style.display = 'none';
  } else {
    logoutLink.style.display = 'none';
    loginLink.style.display = 'inline';
  }
}

// ✅ Fungsi sinkronisasi cerita offline ke API
async function syncPendingStories() {
  const token = localStorage.getItem('token');
  if (!token) return;

  const pendingStories = await getAllPendingStories();
  if (pendingStories.length === 0) return;

  for (const story of pendingStories) {
    try {
      const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: story.title, body: story.body }),
      });

      if (response.ok) {
        console.log('✅ Cerita offline berhasil disinkronkan:', story.title);
      } else {
        console.error('❌ Gagal mengirim cerita offline:', await response.text());
      }
    } catch (error) {
      console.error('❌ Error saat sinkronisasi cerita:', error);
    }
  }

  await clearPendingStories();
  console.log('🗑️ Cerita offline dibersihkan dari IndexedDB setelah sinkronisasi.');
}
