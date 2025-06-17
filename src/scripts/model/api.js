export const API = {
  baseUrl: 'https://story-api.dicoding.dev/v1',

  register: async (name, email, password) => {
    try {
      const response = await fetch(`${API.baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      return await response.json();
    } catch (error) {
      return { error: true, message: error.message };
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch(`${API.baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return await response.json();
    } catch (error) {
      return { error: true, message: error.message };
    }
  },

  getStories: async (token) => {
    try {
      const response = await fetch(`${API.baseUrl}/stories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await response.json();
    } catch (error) {
      return { error: true, message: error.message };
    }
  },

  postStory: async (token, { description, photo, lat, lon }) => {
    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', photo);
      if (lat) formData.append('lat', lat);
      if (lon) formData.append('lon', lon);

      const response = await fetch(`${API.baseUrl}/stories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      return await response.json();
    } catch (error) {
      return { error: true, message: error.message };
    }
  },

  getStoryById: async (id, token) => {
    try {
      const response = await fetch(`${API.baseUrl}/stories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      return { error: true, message: error.message };
    }
  },
};
