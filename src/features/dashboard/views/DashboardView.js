class DashboardView {
  constructor() {
    this.container = null;
  }

  render() {
    // ...log removed for production...
    // Clear the app container and replace its content
    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.innerHTML = '';
      // ...log removed for production...
    }

    // Clean up existing container if it exists
    if (this.container) {
      this.container.remove();
      // ...log removed for production...
    }

    this.container = document.createElement('div');
    this.container.id = 'dashboard-container';
    this.container.className = 'dashboard-container';

    this.container.innerHTML = `
      <!-- Konten Utama -->
      <main class="dashboard-main">
        <!-- Header Selamat Datang -->
        <div class="dashboard-header">
          <h1 class="dashboard-title">Selamat datang kembali!</h1>
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
                <p class="score-value" id="accent-score"></p>
                <p class="score-improvement" style="display:none;">
                  meningkat <span class="score-improvement-value">0</span>% dari minggu lalu!
                </p>
              </div>
              <div class="profile-content">
                <div class="profile-header">
                  <h3 class="profile-title">Statistik Kamu</h3>
                  <div class="profile-image-container">
                    <img src="https://placehold.co/100x100/E2E8F0/475569?text=U" alt="Foto Profil" class="profile-image">
                  </div>
                </div>
                <div class="stats-container">
                  <div class="stat-item">
                    <span class="stat-label">Latihan Selesai</span>
                    <span class="stat-value" id="completed-exercises"></span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Latihan Hari Ini</span>
                    <span class="stat-value" id="today-exercises"></span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Waktu Latihan</span>
                    <span class="stat-value" id="training-time"></span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Kategori Termahir</span>
                    <span class="stat-value" id="latest-category"></span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Kategori Dikuasai</span>
                    <span class="stat-value" id="categories-mastered"></span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Perlu Dilatih</span>
                    <span class="stat-value" id="need-practice"></span>
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
            <a href="#" class="category-card" data-category-id="inventaris-vokal">
              <h3 class="category-title">Inventaris Vokal</h3>
              <p class="category-description">Pelajari dan kuasai semua bunyi vokal dalam bahasa target.</p>
            </a>
            <a href="#" class="category-card" data-category-id="inventaris-konsonan">
              <h3 class="category-title">Inventaris Konsonan</h3>
              <p class="category-description">Kenali dan latih pengucapan konsonan yang benar.</p>
            </a>
            <a href="#" class="category-card" data-category-id="struktur-suku-kata">
              <h3 class="category-title">Struktur Suku Kata</h3>
              <p class="category-description">Pahami pola dan struktur suku kata yang umum digunakan.</p>
            </a>
            <a href="#" class="category-card" data-category-id="penekanan-kata">
              <h3 class="category-title">Penekanan Kata</h3>
              <p class="category-description">Latih penempatan tekanan pada suku kata yang tepat dalam kata.</p>
            </a>
            <a href="#" class="category-card" data-category-id="irama-bahasa">
              <h3 class="category-title">Irama Bahasa</h3>
              <p class="category-description">Fokus pada ritme dan alur bicara agar terdengar natural.</p>
            </a>
            <a href="#" class="category-card" data-category-id="skenario-dunia-nyata">
              <h3 class="category-title">Skenario dunia nyata</h3>
              <p class="category-description">Simulasi percakapan dan latihan dalam konteks sehari-hari.</p>
            </a>
          </div>
        </div>

      </main>
    `;

    const existingFooter = this.container.querySelector('#footer');
    if (existingFooter) existingFooter.remove();
    // Import FooterPresenter secara dinamis agar tidak circular
    import('../../../shared/index.js').then(({ FooterPresenter }) => {
      const footerPresenter = new FooterPresenter();
      footerPresenter.mount(this.container);
    });

    // Append to app container instead of body
    if (appContainer) {
      appContainer.appendChild(this.container);
      // ...log removed for production...
    } else {
      document.body.appendChild(this.container);
      // ...log removed for production...
    }

    return this.container;
  }

  bindEvents(presenter) {
    // Clean up any existing event listeners first
    this.unbindEvents();

    // Store the presenter reference for cleanup
    this.presenter = presenter;

    // Bind start training button (recommendation)
    const startTrainingBtn = this.container.querySelector('#start-training-btn');
    if (startTrainingBtn) {
      this.startTrainingHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (presenter && typeof presenter.handleStartTraining === 'function') {
          presenter.handleStartTraining();
        }
      };
      startTrainingBtn.addEventListener('click', this.startTrainingHandler, true);
    }

    // Bind category card click events
    this.categoryCards = this.container.querySelectorAll('.category-card');
    this.categoryCardHandlers = [];
    this.categoryCards.forEach(card => {
      const handler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const categoryId = card.dataset.categoryId;
        if (categoryId && presenter && typeof presenter.handleCategorySelect === 'function') {
          presenter.handleCategorySelect(categoryId);
        }
        return false;
      };
      card.addEventListener('click', handler, true);
      this.categoryCardHandlers.push({ card, handler });
    });
  }



  updateStats(stats) {
    if (!this.container) return;

    const accentScore = this.container.querySelector('#accent-score');
    const completedExercises = this.container.querySelector('#completed-exercises');
    const todayExercises = this.container.querySelector('#today-exercises');
    const trainingTime = this.container.querySelector('#training-time');
    const latestCategory = this.container.querySelector('#latest-category');
    const categoriesMastered = this.container.querySelector('#categories-mastered');
    const needPractice = this.container.querySelector('#need-practice');

    // Selalu update, meskipun 0 atau -
    if (accentScore) {
      accentScore.innerHTML = `${stats.accentScore || 0}<span class="score-percentage">%</span>`;
    }
    if (completedExercises) {
      completedExercises.textContent = stats.completedExercises || 0;
    }
    if (todayExercises) {
      todayExercises.textContent = stats.todayExercises || 0;
    }
    if (trainingTime) {
      trainingTime.textContent = stats.trainingTime || '0 Menit';
    }
    if (latestCategory) {
      latestCategory.textContent = stats.latestCategory || '-';
    }
    if (categoriesMastered) {
      categoriesMastered.textContent = stats.categoriesMastered || 0;
    }
    if (needPractice) {
      needPractice.textContent = stats.needPractice || '-';
    }
  }

  unbindEvents() {
    // Remove start training button handler
    const startTrainingBtn = this.container?.querySelector('#start-training-btn');
    if (startTrainingBtn && this.startTrainingHandler) {
      startTrainingBtn.removeEventListener('click', this.startTrainingHandler, true);
      this.startTrainingHandler = null;
    }

    // Remove category card handlers
    if (this.categoryCardHandlers) {
      this.categoryCardHandlers.forEach(({ card, handler }) => {
        card.removeEventListener('click', handler, true);
      });
      this.categoryCardHandlers = [];
    }
  }

  destroy() {
    // ...log removed for production...
    // Clean up event listeners
    this.unbindEvents();
    
    // Clear the app container when destroying dashboard
    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.innerHTML = '';
      // ...log removed for production...
    }

    // Remove container from DOM
    if (this.container?.parentNode) {
      this.container.parentNode.removeChild(this.container);
      // ...log removed for production...
    }
    
    // Clean up references
    this.container = null;
    this.presenter = null;
  }
}

export default DashboardView;
