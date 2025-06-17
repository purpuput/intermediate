let stream = null;
let capturedFile = null;

import { saveStoryOffline } from '../utils/idb';

export function startCamera(videoElement, cameraArea, previewImg) {
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(mediaStream => {
      stream = mediaStream;
      videoElement.srcObject = stream;
      cameraArea.style.display = 'block';
      previewImg.style.display = 'none';
      capturedFile = null;
    })
    .catch(err => {
      alert('Izin akses kamera ditolak atau tidak tersedia: ' + err.message);
    });
}

export function capturePhoto(videoElement, previewImg, cameraArea) {
  if (!stream) {
    alert('Kamera belum aktif.');
    return null;
  }
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve) => {
    canvas.toBlob(blob => {
      capturedFile = new File([blob], 'kamera-foto.jpg', { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      previewImg.src = url;
      previewImg.style.display = 'block';
      stopCamera();
      cameraArea.style.display = 'none';
      resolve(capturedFile);
    }, 'image/jpeg');
  });
}

export function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
}

export function handleFileInput(fileInput, previewImg) {
  if (fileInput.files && fileInput.files[0]) {
    capturedFile = fileInput.files[0];
    const url = URL.createObjectURL(capturedFile);
    previewImg.src = url;
    previewImg.style.display = 'block';
    stopCamera();
    return capturedFile;
  }
  return null;
}

export function getCapturedFile() {
  return capturedFile;
}

export async function handleTambahCerita(judul, isi) {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', judul);
    formData.append('body', isi);
    if (capturedFile) {
      formData.append('photo', capturedFile);
    }

    const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) throw new Error('Gagal kirim ke server');

    alert('Cerita berhasil dikirim!');
  } catch (err) {
    const offlineData = {
      title: judul,
      body: isi,
      date: new Date().toISOString(),
    };

    if (capturedFile) {
      offlineData.photo = await toBase64(capturedFile);
    }

    await saveStoryOffline(offlineData);
    alert('Cerita disimpan offline. Akan dikirim saat online.');
  }
}

// Fungsi bantu untuk mengubah file menjadi base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
