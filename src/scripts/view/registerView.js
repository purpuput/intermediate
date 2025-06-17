import { API } from '../model/api.js';

export const renderRegister = (container) => {
  container.innerHTML = `
    <h2>Register</h2>
    <form id="registerForm">
      <input type="text" id="name" placeholder="Nama" required /><br />
      <input type="email" id="email" placeholder="Email" required /><br />
      <input type="password" id="password" placeholder="Password" required /><br />
      <button type="submit">Register</button>
    </form>
    <p id="registerMessage"></p>
  `;

  const form = document.getElementById('registerForm');
  const message = document.getElementById('registerMessage');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const result = await API.register(name, email, password);

    if (result.error) {
      message.textContent = result.message;
    } else {
      message.textContent = 'Registrasi berhasil! Silakan login.';
      window.location.hash = '#/login';
    }
  });
};
