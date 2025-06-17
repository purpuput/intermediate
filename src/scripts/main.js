import { registerServiceWorker } from './scripts/utils/push.js';

window.addEventListener('DOMContentLoaded', () => {
  registerServiceWorker();
});

const mainContent = document.querySelector('#main-content');
const skipLink = document.querySelector('.skip-link');

if (skipLink && mainContent) {
  skipLink.addEventListener('click', function (event) {
    event.preventDefault();
    skipLink.blur();
    mainContent.focus();
    mainContent.scrollIntoView();
  });
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
