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
                <p class="score-value" id="accent-score">82<span class="score-percentage">%</span></p>
                <p class="score-improvement">meningkat 2% dari minggu lalu!</p>
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
                    <span class="stat-value" id="completed-exercises">128</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Latihan Hari Ini</span>
                    <span class="stat-value" id="today-exercises">5</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Waktu Latihan</span>
                    <span class="stat-value" id="training-time">14 Jam</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Kategori Termahir</span>
                    <span class="stat-value" id="latest-category">Pronunciation</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Kategori Dikuasai</span>
                    <span class="stat-value" id="categories-mastered">2</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Perlu Dilatih</span>
                    <span class="stat-value" id="need-practice">Intonation</span>
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
              <h3 class="category-title">Inventaris Vokal</h3>
              <p class="category-description">Pelajari dan kuasai semua bunyi vokal dalam bahasa target.</p>
            </a>
            <a href="#" class="category-card">
              <h3 class="category-title">Inventaris Konsonan</h3>
              <p class="category-description">Kenali dan latih pengucapan konsonan yang benar.</p>
            </a>
            <a href="#" class="category-card">
              <h3 class="category-title">Struktur Suku Kata</h3>
              <p class="category-description">Pahami pola dan struktur suku kata yang umum digunakan.</p>
            </a>
            <a href="#" class="category-card">
              <h3 class="category-title">Penekanan Kata</h3>
              <p class="category-description">Latih penempatan tekanan pada suku kata yang tepat dalam kata.</p>
            </a>
            <a href="#" class="category-card">
              <h3 class="category-title">Irama Bahasa</h3>
              <p class="category-description">Fokus pada ritme dan alur bicara agar terdengar natural.</p>
            </a>
            <a href="#" class="category-card">
              <h3 class="category-title">Skenario dunia nyata</h3>
              <p class="category-description">Simulasi percakapan dan latihan dalam konteks sehari-hari.</p>
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

    // Bind category cards with routing
    const categoryCards = this.container.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const categoryTitle = card.querySelector('h3').textContent;
        // Convert category title to a route-friendly string (e.g., kebab-case)
        const routeName = categoryTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        // Use the global router if available, otherwise fallback to presenter
        if (window.router && typeof window.router.navigate === 'function') {
          window.router.navigate(`/category/${routeName}`);
        } else if (presenter && typeof presenter.handleCategorySelect === 'function') {
          presenter.handleCategorySelect(categoryTitle);
        }
      });
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

    if (accentScore && stats.accentScore) {
      accentScore.innerHTML = `${stats.accentScore}<span class="score-percentage">%</span>`;
    }
    if (completedExercises && stats.completedExercises) {
      completedExercises.textContent = stats.completedExercises;
    }
    if (todayExercises && stats.todayExercises) {
      todayExercises.textContent = stats.todayExercises;
    }
    if (trainingTime && stats.trainingTime) {
      trainingTime.textContent = stats.trainingTime;
    }
    if (latestCategory && stats.latestCategory) {
      latestCategory.textContent = stats.latestCategory;
    }
    if (categoriesMastered && stats.categoriesMastered) {
      categoriesMastered.textContent = stats.categoriesMastered;
    }
    if (needPractice && stats.needPractice) {
      needPractice.textContent = stats.needPractice;
    }
  }

  destroy() {
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
