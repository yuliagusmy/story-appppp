# Story App - Submission Dicoding Web Intermediate

Aplikasi web progresif (PWA) untuk berbagi cerita dengan fitur kamera dan peta.

## Fitur

### Fitur Wajib
- ✅ PWA (Progressive Web App)
  - Installable
  - Offline support dengan Service Worker
  - Manifest yang lengkap
  - Application Shell Architecture
- ✅ Push Notification
  - Menggunakan VAPID key dari Dicoding
  - Service worker untuk menangani notifikasi
  - Toggle untuk mengaktifkan/menonaktifkan notifikasi
- ✅ IndexedDB
  - Menyimpan cerita favorit
  - Menampilkan cerita yang disimpan
  - Menghapus cerita yang disimpan

### Fitur Opsional
- ✅ Manifest Shortcuts
  - Shortcut ke halaman "Tambah Cerita"
- ✅ Screenshots di Manifest
  - Screenshot desktop dan mobile
- ✅ Maskable Icons
  - Icon yang mendukung adaptive icons di Android

## Teknologi yang Digunakan
- HTML5
- CSS3
- JavaScript (ES6+)
- Service Worker
- IndexedDB
- Push API
- Web Manifest
- Leaflet.js (untuk peta)

## Cara Menjalankan
1. Clone repository ini
2. Install dependencies:
   ```bash
   npm install
   ```
3. Jalankan development server:
   ```bash
   npm run start-dev
   ```
4. Build untuk production:
   ```bash
   npm run build
   ```

## Deployment
Aplikasi ini di-deploy di GitHub Pages. Link deployment dapat dilihat di file `STUDENT.txt`.

## Screenshots
Screenshots aplikasi dapat dilihat di folder `screenshots/`:
- `desktop.png`: Tampilan desktop
- `mobile.png`: Tampilan mobile

## Lisensi
Dibuat untuk submission Dicoding Web Intermediate.
