class CategoryView {
  constructor() {
    this.container = null;
    this.bannerSection = null;
    this.mainContent = null;
    this.sidebar = null;
  }

  render(categoryData) {
    // Clear the app container and replace its content
    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.innerHTML = '';
    }

    this.container = document.createElement('div');
    this.container.id = 'category-container';
    this.container.className = 'category-container';

    this.container.innerHTML = `
      <!-- Banner Section -->
      <section class="category-banner">
        <div class="banner-content">
          <div class="banner-text">
            <h1 class="banner-title">${categoryData.banner?.title || 'Kategori'}</h1>
            <p class="banner-subtitle">${categoryData.banner?.subtitle || 'Deskripsi kategori'}</p>
          </div>
          <div class="banner-image">
            <img src="${categoryData.banner?.image || 'https://placehold.co/400x200/E2E8F0/475569?text=Banner'}" 
                 alt="${categoryData.banner?.title || 'Banner'}" 
                 class="banner-img">
          </div>
        </div>
      </section>

      <!-- Main Content Area -->
      <div class="category-layout">
        <!-- Main Content -->
        <main class="category-main">
          <!-- Material Article Section -->
          <section class="material-section">
            <article class="material-article" id="material-container">
              ${this.renderMaterial(categoryData.material || null)}
            </article>
          </section>

          <!-- Pronunciation Examples Section -->
          <section class="pronunciation-section">
            <h2 class="section-title">Contoh Pelafalan</h2>
            <div class="pronunciation-grid" id="pronunciation-container">
              ${this.renderPronunciationExamples(categoryData.pronunciationExamples || [])}
            </div>
          </section>

          <!-- Common Mistakes Section -->
          <section class="mistakes-section">
            <h2 class="section-title">Kesalahan Umum yang Harus Dihindari</h2>
            <div class="mistakes-grid" id="mistakes-container">
              ${this.renderCommonMistakes(categoryData.commonMistakes || null)}
            </div>
          </section>

          <!-- More Materials Section -->
          <section class="more-materials-section">
            <h2 class="section-title">Materi Tambahan</h2>
            <div class="more-materials-grid" id="more-materials-container">
              ${this.renderMoreMaterials(categoryData.moreMaterials || null)}
            </div>
          </section>
        </main>

        <!-- Sidebar -->
        <aside class="category-sidebar">
          <div class="sidebar-content">
            <h3 class="sidebar-title">Item Latihan</h3>
            <div class="practice-items" id="practice-container">
              ${this.renderPracticeItems(categoryData.practiceItems || [])}
            </div>
          </div>
        </aside>
      </div>

      <!-- Footer will be mounted here by CategoryPresenter -->
      <div id="category-footer-container"></div>
    `;

    // Append to app container
    if (appContainer) {
      appContainer.appendChild(this.container);
    } else {
      document.body.appendChild(this.container);
    }

    return this.container;
  }

  renderMaterial(material) {
    if (!material) {
      return '<p class="empty-state">Belum ada materi tersedia</p>';
    }

    return `
      <div class="material-header">
        <h2 class="material-title">${material.title}</h2>
        <div class="material-meta">
          <span class="reading-time">⏱️ ${material.readingTime}</span>
        </div>
      </div>
      <div class="material-content">
        ${material.content}
      </div>
    `;
  }

  renderPronunciationExamples(examples) {
    if (!examples || examples.length === 0) {
      return '<p class="empty-state">Belum ada contoh pelafalan tersedia</p>';
    }

    return examples.map(example => `
      <div class="pronunciation-card" data-example-id="${example.id}">
        <div class="pronunciation-word">
          <h4 class="word-text">${example.word}</h4>
          <span class="phonetic-text">${example.phonetic}</span>
        </div>
        <div class="pronunciation-controls">
          <button class="play-button" data-audio-url="${example.audioUrl}">
            <span class="play-icon">▶</span>
            Putar
          </button>
          <span class="difficulty-badge difficulty-${example.difficulty}">
            ${this.getDifficultyText(example.difficulty)}
          </span>
        </div>
      </div>
    `).join('');
  }

  renderPracticeItems(practiceItems) {
    if (!practiceItems || practiceItems.length === 0) {
      return '<p class="empty-state">Belum ada latihan tersedia</p>';
    }

    return practiceItems.map(item => `
      <div class="practice-item" data-practice-id="${item.id}">
        <div class="practice-header">
          <h4 class="practice-title">${item.title}</h4>
        </div>
        <p class="practice-description">${item.description}</p>
        <button class="practice-button" data-practice-id="${item.id}">
          Mulai Latihan
        </button>
      </div>
    `).join('');
  }

  getDifficultyText(difficulty) {
    const difficultyMap = {
      'easy': 'Mudah',
      'medium': 'Sedang',
      'hard': 'Sulit'
    };
    return difficultyMap[difficulty] || 'Sedang';
  }



  renderCommonMistakes(commonMistakes) {
    if (!commonMistakes || !commonMistakes.mistakes) {
      return '<p class="empty-state">Belum ada informasi kesalahan umum</p>';
    }

    return commonMistakes.mistakes.map(mistake => `
      <div class="mistake-card">
        <h4 class="mistake-title">${mistake.title}</h4>
        <p class="mistake-description">${mistake.description}</p>
      </div>
    `).join('');
  }

  renderMoreMaterials(moreMaterials) {
    if (!moreMaterials || !moreMaterials.materials) {
      return '<p class="empty-state">Belum ada materi tambahan</p>';
    }

    return moreMaterials.materials.map(material => `
      <a href="${material.url}" target="_blank" rel="noopener noreferrer" class="material-link-card">
        <div class="material-icon">${material.icon}</div>
        <div class="material-info">
          <h4 class="material-link-title">${material.title}</h4>
          <p class="material-link-description">${material.description}</p>
          <span class="material-type-badge">${this.getTypeText(material.type)}</span>
        </div>
        <div class="external-link-icon">↗</div>
      </a>
    `).join('');
  }

  getTypeText(type) {
    const typeMap = {
      'website': 'Website',
      'youtube': 'YouTube',
      'app': 'Aplikasi'
    };
    return typeMap[type] || 'Link';
  }

  // Event binding methods - Material click not needed for article format

  bindPronunciationPlay(handler) {
    if (!this.container) return;
    
    const playButtons = this.container.querySelectorAll('.play-button');
    playButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const audioUrl = button.dataset.audioUrl;
        handler(audioUrl);
      });
    });
  }

  bindPracticeStart(handler) {
    if (!this.container) return;
    
    const practiceButtons = this.container.querySelectorAll('.practice-button');
    practiceButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const practiceId = button.dataset.practiceId;
        handler(practiceId);
      });
    });
  }

  updateMaterial(material) {
    const container = this.container?.querySelector('#material-container');
    if (container) {
      container.innerHTML = this.renderMaterial(material);
    }
  }

  updatePronunciationExamples(examples) {
    const container = this.container?.querySelector('#pronunciation-container');
    if (container) {
      container.innerHTML = this.renderPronunciationExamples(examples);
    }
  }

  updatePracticeItems(practiceItems) {
    const container = this.container?.querySelector('#practice-container');
    if (container) {
      container.innerHTML = this.renderPracticeItems(practiceItems);
    }
  }



  updateCommonMistakes(commonMistakes) {
    const container = this.container?.querySelector('#mistakes-container');
    if (container) {
      container.innerHTML = this.renderCommonMistakes(commonMistakes);
    }
  }

  updateMoreMaterials(moreMaterials) {
    const container = this.container?.querySelector('#more-materials-container');
    if (container) {
      container.innerHTML = this.renderMoreMaterials(moreMaterials);
    }
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
    this.bannerSection = null;
    this.mainContent = null;
    this.sidebar = null;
  }
}

export default CategoryView;
