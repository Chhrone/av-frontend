class CategoryModel {
  constructor() {
    this.currentCategory = null;
    this.categoryData = null;
    this.material = null;
    this.pronunciationExamples = [];
    this.practiceItems = [];
  }

  async setCurrentCategory(categoryId) {
    this.currentCategory = categoryId;
    try {
      await this.loadCategoryData(categoryId);
      return this.categoryData;
    } catch (error) {
      console.error('Error setting current category:', error);
      throw error;
    }
  }

  getCurrentCategory() {
    return this.currentCategory;
  }

  async loadCategoryData(categoryId) {
    try {
      // Get the model class based on categoryId
      const ModelClass = await this.getModelForCategory(categoryId);
      
      if (ModelClass) {
        // If we have a specific model for this category, use it
        const modelInstance = typeof ModelClass === 'function' ? new ModelClass() : ModelClass;
        this.categoryData = modelInstance.getData ? modelInstance.getData() : modelInstance;
      } else {
        // Fallback to mock data if no specific model is found
        this.categoryData = this.getMockCategoryData(categoryId);
      }
      
      // Set the properties from the loaded data
      this.material = this.categoryData.material || null;
      this.pronunciationExamples = this.categoryData.pronunciationExamples || [];
      this.practiceItems = this.categoryData.practiceItems || [];
      
      return this.categoryData;
    } catch (error) {
      console.error('Error loading category data:', error);
      // Fallback to mock data if there's an error
      this.categoryData = this.getMockCategoryData(categoryId);
      return this.categoryData;
    }
  }

  async getModelForCategory(categoryId) {
    try {
      // Map URL-friendly names to model names
      const categoryMap = {
        'inventaris-vokal': 'vokal',
        'inventaris-konsonan': 'konsonan',
        'struktur-suku-kata': 'suku-kata',
        'penekanan-kata': 'penekanan',
        'irama-bahasa': 'irama',
        'skenario-dunia-nyata': 'skenario'
      };

      // Get the model key, falling back to the original categoryId if not found
      const modelKey = categoryMap[categoryId] || categoryId;
      
      // Dynamically import the module based on the model key
      let module;
      switch(modelKey) {
        case 'vokal':
          module = await import('./VokalInventoryModel.js');
          break;
        case 'konsonan':
          module = await import('./KonsonanInventoryModel.js');
          break;
        case 'suku-kata':
          module = await import('./SukuKataStructureModel.js');
          break;
        case 'penekanan':
          module = await import('./PenekananKataModel.js');
          break;
        case 'irama':
          module = await import('./IramaBahasaModel.js');
          break;
        case 'skenario':
          module = await import('./SkenarioDuniaNyataModel.js');
          break;
        default:
          return null;
      }
      
      return module.default || null;
    } catch (e) {
      console.error('Error loading model for category:', categoryId, e);
      return null;
    }
  }

  getMockCategoryData(categoryId) {
    // Mapping for route/category name to model key
    const mapKey = {
      'inventaris-vokal': 'vokal',
      'inventaris-konsonan': 'konsonan',
      'struktur-suku-kata': 'suku-kata',
      'penekanan-kata': 'penekanan',
      'irama-bahasa': 'irama',
      'skenario-dunia-nyata': 'skenario',
    };
    
    const key = mapKey[categoryId] || categoryId;
    
    // Return mock data for the specific category or fallback to default
    if (key === 'pronunciation') {
      return {
        id: 'pronunciation',
        title: 'Pelafalan Dasar',
        description: 'Pelajari pelafalan huruf dan kata dasar dalam bahasa Inggris',
        banner: {
          title: 'Pelafalan Dasar',
          subtitle: 'Pelajari cara mengucapkan huruf dan kata dasar dengan benar',
          image: 'https://placehold.co/800x300/E2E8F0/475569?text=Pelafalan+Dasar'
        },
        material: {
          title: 'Dasar-dasar Pelafalan',
          content: `
            <h2>Pengenalan Pelafalan Bahasa Inggris</h2>
            <p>Pelafalan yang baik adalah kunci untuk komunikasi yang efektif dalam bahasa Inggris.</p>
          `,
          readingTime: '10 menit'
        },
        pronunciationExamples: [
          { word: 'cat', phonetic: '/kæt/', audio: null },
          { word: 'bed', phonetic: '/bed/', audio: null },
          { word: 'sit', phonetic: '/sɪt/', audio: null },
          { word: 'dog', phonetic: '/dɒg/', audio: null },
          { word: 'cup', phonetic: '/kʌp/', audio: null }
        ],
        practiceItems: [
          { instruction: 'Ucapkan kata-kata berikut dengan pelafalan yang benar: cat, bed, sit, dog, cup' },
          { instruction: 'Bandingkan pelafalan vokal pendek dan panjang: sit vs seat, ship vs sheep' },
          { instruction: 'Latih pelafalan TH dengan kata-kata: think, this, three, that' },
          { instruction: 'Bandingkan pelafalan R dan L: red vs led, light vs right' },
          { instruction: 'Latih perbedaan antara light L dan dark L: light, love, call, ball' }
        ],
        commonMistakes: [
          {
            id: 'mistake1',
            title: 'Mengucapkan semua huruf dalam kata',
            description: 'Tidak memperhatikan silent letters dalam bahasa Inggris',
            examples: ['knee (/niː/ bukan /kniː/)', 'comb (/koʊm/ bukan /kɒmb/)']
          },
          {
            id: 'mistake2',
            title: 'Tidak memperhatikan word stress',
            description: 'Penekanan kata yang salah dapat mengubah makna',
            examples: ['REcord (noun) vs reCORD (verb)', 'PREsent (noun) vs preSENT (verb)']
          }
        ],
        moreMaterials: {
          title: 'Materi Tambahan',
          materials: [
            {
              id: 'mat1',
              title: 'BBC Learning English - Pronunciation',
              description: 'Video pembelajaran pelafalan dari BBC dengan native speaker',
              url: 'https://www.bbc.co.uk/learningenglish/english/features/pronunciation',
              type: 'website',
              icon: '🌐'
            },
            {
              id: 'mat2',
              title: 'Rachel\'s English - Pronunciation Videos',
              description: 'Channel YouTube dengan tutorial pelafalan yang detail',
              url: 'https://www.youtube.com/user/rachelsenglish',
              type: 'youtube',
              icon: '📺'
            }
          ]
        }
      };
    }
    
    // Default mock data for other categories
    return {
      id: categoryId,
      title: categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
      banner: {
        title: 'Kategori ' + categoryId,
        subtitle: 'Deskripsi untuk ' + categoryId,
        image: 'https://placehold.co/800x300/E2E8F0/475569?text=' + categoryId
      },
      material: {
        title: 'Materi ' + categoryId,
        content: '<p>Konten materi akan segera tersedia.</p>',
        readingTime: '5 menit'
      },
      pronunciationExamples: [],
      practiceItems: [],
      commonMistakes: [],
      moreMaterials: {
        title: 'Materi Tambahan',
        materials: []
      }
    };
  }

  getCategoryData() {
    return this.categoryData;
  }

  getBannerData() {
    return this.categoryData?.banner || null;
  }

  getMaterial() {
    return this.material;
  }

  getPronunciationExamples() {
    return this.pronunciationExamples;
  }

  getPracticeItems() {
    return this.practiceItems;
  }

  getCommonMistakes() {
    return this.categoryData?.commonMistakes || [];
  }

  getMoreMaterials() {
    return this.categoryData?.moreMaterials || { title: 'Materi Tambahan', materials: [] };
  }
}

export default CategoryModel;
