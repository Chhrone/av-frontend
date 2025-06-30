class DashboardView {
  constructor() {
    this.container = null;
  }

  render() {
    // Clear the app container and replace its content
    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.innerHTML = '';
    }

    this.container = document.createElement('div');
    this.container.id = 'dashboard-container';
    this.container.className = 'dashboard-container';

    this.container.innerHTML = `
      <!-- Navigasi -->
      <nav class="dashboard-nav">
        <div class="nav-container">
          <div class="nav-logo">
            <span class="nav-logo-aurea">Aurea</span><span class="nav-logo-voice">Voice</span>
          </div>
          <div>
            <a href="#/" class="nav-button">Kembali ke Test</a>
          </div>
        </div>
      </nav>

      <!-- Konten Utama -->
      <main class="dashboard-main">
        <!-- Header Selamat Datang -->
        <div class="dashboard-header">
          <h1 class="dashboard-title">Selamat datang kembali, Budi!</h1>
          <p class="dashboard-subtitle">Teruslah berlatih, konsistensi adalah kunci untuk mencapai aksen yang natural.</p>
        </div>

        <!-- Grid Utama Dasbor menggunakan CSS Grid -->
        <div class="dashboard-grid">

          <!-- Kolom Utama (Kiri) -->
          <div class="main-column">
            <!-- Kartu Rekomendasi Latihan -->
            <div class="dashboard-card">
              <h2 class="card-title">Rekomendasi Latihan Utama Untuk Anda</h2>
              <div>
                <div class="recommendation-item">
                  <span class="recommendation-icon">🎵</span>
                  <div class="recommendation-content">
                    <p class="recommendation-title">Irama dan Penekanan</p>
                    <p class="recommendation-description">Fokus pada ritme *stress-timed* untuk alur bicara yang lebih natural.</p>
                  </div>
                  <button class="recommendation-button" id="start-training-btn">Mulai Latihan</button>
                </div>
              </div>
            </div>
            <!-- Kartu Grafik Perkembangan -->
            <div class="dashboard-card chart-card">
              <h2 class="card-title">Perkembangan Skor Anda</h2>
              <div class="chart-container">
                <canvas id="progressChart"></canvas>
              </div>
            </div>
          </div>

          <!-- Kolom Samping (Kanan) -->
          <div class="sidebar-column">
            <!-- Kartu Profil & Skor Pengguna -->
            <div class="profile-card">
              <div class="main-gradient">
                <p class="score-label">Skor Aksen Anda</p>
                <p class="score-value" id="accent-score">82<span class="score-percentage">%</span></p>
                <p class="score-improvement">meningkat 2% dari minggu lalu!</p>
              </div>
              <div class="profile-content">
                <div class="profile-header">
                  <h3 class="profile-title">Statistik Budi</h3>
                  <div class="profile-image-container">
                    <img src="https://placehold.co/100x100/E2E8F0/475569?text=B" alt="Foto Profil Budi" class="profile-image">
                  </div>
                </div>
                <div class="stats-container">
                  <div class="stat-item">
                    <span class="stat-label">Latihan Selesai</span>
                    <span class="stat-value" id="completed-exercises">128</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Waktu Latihan</span>
                    <span class="stat-value" id="training-time">14 Jam</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Kategori Dicoba</span>
                    <span class="stat-value" id="categories-tried">5/7</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Kategori Dikuasai</span>
                    <span class="stat-value" id="categories-mastered">2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Grid Kategori Latihan -->
        <div class="categories-section">
          <h2 class="categories-title">Pilih Kategori Latihan Lainnya</h2>
          <div class="categories-grid">

            <a href="#" class="category-card">
              <div class="category-icon">👄</div>
              <h3 class="category-title">Peta Vokal Amerika</h3>
              <p class="category-description">Kuasai bunyi vokal seperti pada 'cat' dan 'cut'.</p>
            </a>

             <a href="#" class="category-card">
              <div class="category-icon">🎵</div>
              <h3 class="category-title">Irama dan Penekanan</h3>
              <p class="category-description">Fokus pada ritme <em>stress-timed</em> untuk alur bicara yang lebih natural.</p>
            </a>

            <a href="#" class="category-card">
              <div class="category-icon">🔡</div>
              <h3 class="category-title">Gugus Konsonan</h3>
              <p class="category-description">Ucapkan kata seperti 'strengths' dan 'world'.</p>
            </a>

            <a href="#" class="category-card">
              <div class="category-icon">📖</div>
              <h3 class="category-title">Membaca Paragraf</h3>
              <p class="category-description">Latih kelancaran dan intonasi dalam konteks.</p>
            </a>

            <a href="#" class="category-card">
              <div class="category-icon">💬</div>
              <h3 class="category-title">Skenario Dunia Nyata</h3>
              <p class="category-description">Simulasi percakapan sehari-hari.</p>
            </a>

             <a href="#" class="category-card">
              <div class="category-icon">🔥</div>
              <h3 class="category-title">Latihan Intensif</h3>
              <p class="category-description">Tantang diri Anda dengan kalimat acak.</p>
            </a>

          </div>
        </div>

      </main>
    `;

    // Append to app container instead of body
    if (appContainer) {
      appContainer.appendChild(this.container);
    } else {
      document.body.appendChild(this.container);
    }

    return this.container;
  }

  bindEvents(presenter) {
    // Bind start training button
    const startTrainingBtn = this.container.querySelector('#start-training-btn');
    if (startTrainingBtn) {
      startTrainingBtn.addEventListener('click', () => {
        presenter.handleStartTraining();
      });
    }

    // Bind category cards
    const categoryCards = this.container.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const categoryTitle = card.querySelector('h3').textContent;
        presenter.handleCategorySelect(categoryTitle);
      });
    });

    // Bind scroll event for navigation transition
    this.bindScrollEvent();
  }

  bindScrollEvent() {
    const navContainer = this.container.querySelector('.nav-container');
    if (!navContainer) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > 50) {
        navContainer.classList.add('scrolled');
      } else {
        navContainer.classList.remove('scrolled');
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Store reference for cleanup
    this.scrollHandler = handleScroll;
  }

  updateStats(stats) {
    if (!this.container) return;

    const accentScore = this.container.querySelector('#accent-score');
    const completedExercises = this.container.querySelector('#completed-exercises');
    const trainingTime = this.container.querySelector('#training-time');
    const categoriesTried = this.container.querySelector('#categories-tried');
    const categoriesMastered = this.container.querySelector('#categories-mastered');

    if (accentScore && stats.accentScore) {
      accentScore.innerHTML = `${stats.accentScore}<span class="score-percentage">%</span>`;
    }
    if (completedExercises && stats.completedExercises) {
      completedExercises.textContent = stats.completedExercises;
    }
    if (trainingTime && stats.trainingTime) {
      trainingTime.textContent = stats.trainingTime;
    }
    if (categoriesTried && stats.categoriesTried) {
      categoriesTried.textContent = stats.categoriesTried;
    }
    if (categoriesMastered && stats.categoriesMastered) {
      categoriesMastered.textContent = stats.categoriesMastered;
    }
  }

  destroy() {
    // Remove scroll event listener
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
      this.scrollHandler = null;
    }

    // Clear the app container when destroying dashboard
    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.innerHTML = '';
    }

    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
  }
}

export default DashboardView;
