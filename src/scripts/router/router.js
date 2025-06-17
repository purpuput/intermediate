import { renderHome } from '../view/homeView.js';
import { renderLogin } from '../view/loginView.js';
import { renderRegister } from '../view/registerView.js';
import renderTambah from '../view/tambahView.js';
import { renderDetail } from '../view/detailView.js';
import { tampilkanCeritaOffline } from '../presenter/offline-page.js'; // ✅ Tambahan

const routes = {
  '/home': renderHome,
  '/login': renderLogin,
  '/register': renderRegister,
  '/tambah': renderTambah,
  '/detail': renderDetail,
  '/offline': async (main) => { // ✅ Tambahan route offline
    main.innerHTML = `
      <h2 class="text-xl font-bold mb-4">Cerita Offline</h2>
      <section id="offline-container" class="p-2 space-y-4"></section>
    `;
    const container = document.getElementById('offline-container');
    await tampilkanCeritaOffline(container);
  },
};

const protectedRoutes = ['/tambah', '/detail'];

export const router = async () => {
  const main = document.querySelector('#main-content');
  let hash = location.hash.slice(1).split('?')[0];

  const currentRoute = hash || '/home';

  if (!currentRoute.startsWith('/')) return;

  const token = localStorage.getItem('token');
  if (protectedRoutes.includes(currentRoute) && !token) {
    alert('Silakan login terlebih dahulu.');
    window.location.hash = '#/login';
    return;
  }

  const renderFn = routes[currentRoute] || (() => {
    main.innerHTML = '<p>404 - Halaman tidak ditemukan.</p>';
  });

  if (document.startViewTransition) {
    document.startViewTransition(() => renderFn(main));
  } else {
    await renderFn(main);
  }

  main.focus();
};
