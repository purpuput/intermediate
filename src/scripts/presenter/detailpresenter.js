import { API } from '../model/api.js';

export const fetchStoryDetail = async (id, token) => {
  if (!token) {
    return { error: true, message: 'Token tidak ditemukan' };
  }

  if (!id) {
    return { error: true, message: 'ID cerita tidak ditemukan' };
  }

  try {
    const data = await API.getStoryById(id, token);
    return data;
  } catch (error) {
    return { error: true, message: error.message || 'Gagal mengambil data cerita' };
  }
};
