import { API } from '../model/api.js';

export const renderLogin = (container) => {
  container.innerHTML = `
    <h2>Login</h2>
    <form id="loginForm">
      <input type="email" id="email" name="email" placeholder="Email" required /><br />
      <input type="password" id="password" name="password" placeholder="Password" required /><br />
      <button type="submit">Login</button>
    </form>
    <div id="loginLoader" style="display:none;" class="loader"></div>
    <p id="loginMessage"></p>
    <p>Belum punya akun? <a href="#/register">Register di sini</a></p>
  `;

  const form = document.getElementById('loginForm');
  const message = document.getElementById('loginMessage');
  const loader = document.getElementById('loginLoader');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    message.textContent = '';
    loader.style.display = 'block';

    const email = form.email.value;
    const password = form.password.value;

    const result = await API.login(email, password);
    loader.style.display = 'none';

    if (result.error) {
      message.textContent = result.message;
    } else {
      localStorage.setItem('token', result.loginResult.token);
      window.location.hash = '#/home'; // langsung, tanpa delay
    }
  });
};
