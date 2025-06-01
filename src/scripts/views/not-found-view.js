class NotFoundView {
  getTemplate() {
    return `
      <div class="not-found-container">
        <div class="not-found-content">
          <h1>404</h1>
          <h2>Halaman Tidak Ditemukan</h2>
          <p>Maaf, halaman yang Anda cari tidak dapat ditemukan.</p>
          <a href="#/" class="back-home-button">Kembali ke Beranda</a>
        </div>
      </div>
    `;
  }
}

export default NotFoundView;