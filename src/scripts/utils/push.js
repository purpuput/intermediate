export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    console.log('✅ Service Worker berhasil didaftarkan');

    // Daftarkan tombol uji notifikasi
    const btn = document.getElementById('btn-push');
    if (btn) {
      btn.addEventListener('click', () => {
        registration.active?.postMessage({
          type: 'push-test',
          title: 'Halo dari Aplikasi!',
          body: 'Ini notifikasi lokal dari tombol uji coba.',
        });
      });
    }
  } catch (error) {
    console.error('❌ Gagal mendaftarkan Service Worker:', error);
  }
}


