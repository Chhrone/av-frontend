class CategoryModel {
  constructor() {
    this.currentCategory = null;
    this.categoryData = null;
    this.materials = [];
    this.pronunciationExamples = [];
    this.practiceItems = [];
  }

  setCurrentCategory(categoryId) {
    this.currentCategory = categoryId;
    this.loadCategoryData(categoryId);
  }

  getCurrentCategory() {
    return this.currentCategory;
  }

  loadCategoryData(categoryId) {
    // Mock data for now - in real app this would fetch from API/database
    this.categoryData = this.getMockCategoryData(categoryId);
    this.material = this.categoryData.material || null;
    this.pronunciationExamples = this.categoryData.pronunciationExamples || [];
    this.practiceItems = this.categoryData.practiceItems || [];
  }

  getMockCategoryData(categoryId) {
    // Mock data structure for different categories
    // Import all category models
    let VokalInventoryModel, KonsonanInventoryModel, SukuKataStructureModel, PenekananKataModel, IramaBahasaModel, SkenarioDuniaNyataModel;
    try {
      VokalInventoryModel = require('./VokalInventoryModel.js').default;
      KonsonanInventoryModel = require('./KonsonanInventoryModel.js').default;
      SukuKataStructureModel = require('./SukuKataStructureModel.js').default;
      PenekananKataModel = require('./PenekananKataModel.js').default;
      IramaBahasaModel = require('./IramaBahasaModel.js').default;
      SkenarioDuniaNyataModel = require('./SkenarioDuniaNyataModel.js').default;
    } catch (e) {
      // fallback for environments that don't support require
    }
    const mockData = {
      'vokal': VokalInventoryModel,
      'konsonan': KonsonanInventoryModel,
      'suku-kata': SukuKataStructureModel,
      'penekanan': PenekananKataModel,
      'irama': IramaBahasaModel,
      'skenario': SkenarioDuniaNyataModel,
      'pronunciation': {
        id: 'pronunciation',
        title: 'Pelafalan Dasar',
        description: 'Pelajari pelafalan huruf dan kata dasar dalam bahasa Inggris',
        banner: {
          title: 'Pelafalan Dasar',
          subtitle: 'Kuasai pelafalan huruf dan kata dasar',
          image: 'https://placehold.co/800x300/E2E8F0/475569?text=Pronunciation'
        },
        material: {
          title: 'Panduan Lengkap Pelafalan Dasar Bahasa Inggris',
          content: `
            <h2>Pengenalan Pelafalan Bahasa Inggris</h2>
            <p>Pelafalan yang baik adalah kunci untuk komunikasi yang efektif dalam bahasa Inggris. Dalam panduan ini, kita akan mempelajari dasar-dasar pelafalan yang akan membantu Anda berbicara dengan lebih percaya diri dan natural.</p>

            <h3>1. Pelafalan Huruf Vokal</h3>
            <p>Huruf vokal dalam bahasa Inggris memiliki berbagai bunyi yang berbeda tergantung konteksnya. Mari kita pelajari satu per satu:</p>

            <h4>Huruf A</h4>
            <p>Huruf A memiliki beberapa bunyi utama:</p>
            <ul>
              <li><strong>/æ/</strong> seperti dalam kata "cat", "hat", "apple"</li>
              <li><strong>/eɪ/</strong> seperti dalam kata "cake", "name", "day"</li>
              <li><strong>/ɑː/</strong> seperti dalam kata "car", "father", "park"</li>
            </ul>

            <h4>Huruf E</h4>
            <p>Bunyi huruf E yang paling umum:</p>
            <ul>
              <li><strong>/e/</strong> seperti dalam kata "bed", "red", "pen"</li>
              <li><strong>/iː/</strong> seperti dalam kata "see", "tree", "me"</li>
              <li><strong>/ə/</strong> (schwa) seperti dalam kata "the", "about"</li>
            </ul>

            <h4>Huruf I</h4>
            <p>Variasi bunyi huruf I:</p>
            <ul>
              <li><strong>/ɪ/</strong> seperti dalam kata "sit", "big", "fish"</li>
              <li><strong>/aɪ/</strong> seperti dalam kata "time", "like", "my"</li>
            </ul>

            <h4>Huruf O</h4>
            <p>Bunyi huruf O yang perlu dikuasai:</p>
            <ul>
              <li><strong>/ɒ/</strong> seperti dalam kata "hot", "dog", "box"</li>
              <li><strong>/əʊ/</strong> seperti dalam kata "go", "home", "boat"</li>
              <li><strong>/ʌ/</strong> seperti dalam kata "love", "come", "some"</li>
            </ul>

            <h4>Huruf U</h4>
            <p>Variasi bunyi huruf U:</p>
            <ul>
              <li><strong>/ʌ/</strong> seperti dalam kata "cup", "run", "sun"</li>
              <li><strong>/uː/</strong> seperti dalam kata "blue", "true", "food"</li>
              <li><strong>/ʊ/</strong> seperti dalam kata "book", "good", "put"</li>
            </ul>

            <h3>2. Pelafalan Huruf Konsonan</h3>
            <p>Beberapa huruf konsonan dalam bahasa Inggris memiliki pelafalan yang berbeda dari bahasa Indonesia:</p>

            <h4>Huruf TH</h4>
            <p>Salah satu bunyi yang paling sulit bagi pelajar Indonesia:</p>
            <ul>
              <li><strong>/θ/</strong> (voiceless) seperti dalam "think", "three", "bath"</li>
              <li><strong>/ð/</strong> (voiced) seperti dalam "this", "that", "mother"</li>
            </ul>
            <p><em>Tips: Letakkan ujung lidah di antara gigi atas dan bawah, lalu tiupkan udara.</em></p>

            <h4>Huruf R</h4>
            <p>Pelafalan R dalam bahasa Inggris berbeda dengan bahasa Indonesia:</p>
            <ul>
              <li>Tidak di-roll seperti dalam bahasa Indonesia</li>
              <li>Ujung lidah tidak menyentuh langit-langit mulut</li>
              <li>Contoh: "red", "car", "very"</li>
            </ul>

            <h4>Huruf L</h4>
            <p>Ada dua jenis bunyi L:</p>
            <ul>
              <li><strong>Light L</strong> di awal kata: "light", "love", "like"</li>
              <li><strong>Dark L</strong> di akhir kata: "call", "ball", "people"</li>
            </ul>

            <p><strong>Ingat:</strong> Pelafalan yang baik membutuhkan waktu dan latihan yang konsisten. Jangan berkecil hati jika belum sempurna di awal. Yang terpenting adalah terus berlatih dan memperhatikan detail-detail kecil dalam setiap bunyi.</p>
          `,
          readingTime: '8 menit'
        },

        commonMistakes: {
          title: 'Kesalahan Umum yang Harus Dihindari',
          mistakes: [
            {
              id: 'mistake1',
              title: 'Mengucapkan semua huruf dalam kata',
              description: 'Tidak memperhatikan silent letters dalam bahasa Inggris'
            },
            {
              id: 'mistake2',
              title: 'Tidak memperhatikan word stress',
              description: 'Penekanan kata yang salah dapat mengubah makna'
            },
            {
              id: 'mistake3',
              title: 'Menggunakan pelafalan bahasa Indonesia',
              description: 'Menerapkan aturan pelafalan Indonesia untuk huruf yang sama'
            },
            {
              id: 'mistake4',
              title: 'Terlalu cepat berbicara',
              description: 'Berbicara cepat sebelum menguasai bunyi dasar dengan baik'
            }
          ]
        },
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
            },
            {
              id: 'mat3',
              title: 'Sounds Pronunciation App',
              description: 'Aplikasi interaktif untuk belajar phonetic symbols',
              url: 'https://www.macmillanenglish.com/us/catalogue/sounds-pronunciation-app/',
              type: 'app',
              icon: '📱'
            },
            {
              id: 'mat4',
              title: 'Cambridge Dictionary Pronunciation',
              description: 'Kamus online dengan audio pelafalan British dan American',
              url: 'https://dictionary.cambridge.org/',
              type: 'website',
              icon: '📚'
            },
            {
              id: 'mat5',
              title: 'Pronunciation with Emma',
              description: 'Video tutorial pelafalan untuk pemula hingga advanced',
              url: 'https://www.youtube.com/user/EnglishTeacherEmma',
              type: 'youtube',
              icon: '📺'
            }
          ]
        },
        pronunciationExamples: [
          {
            id: 'ex1',
            word: 'Apple',
            phonetic: '/ˈæpəl/',
            audioUrl: '#',
            difficulty: 'easy'
          },
          {
            id: 'ex2',
            word: 'Beautiful',
            phonetic: '/ˈbjuːtɪfəl/',
            audioUrl: '#',
            difficulty: 'medium'
          },
          {
            id: 'ex3',
            word: 'Pronunciation',
            phonetic: '/prəˌnʌnsiˈeɪʃən/',
            audioUrl: '#',
            difficulty: 'hard'
          }
        ],
        practiceItems: [
          {
            id: 'practice1',
            title: 'Latihan Vokal A',
            description: 'Berlatih pelafalan huruf A dalam berbagai kata',
            type: 'pronunciation'
          },
          {
            id: 'practice2',
            title: 'Latihan Konsonan TH',
            description: 'Berlatih pelafalan bunyi TH yang sulit',
            type: 'pronunciation'
          },
          {
            id: 'practice3',
            title: 'Kombinasi Huruf',
            description: 'Latihan pelafalan kombinasi huruf yang kompleks',
            type: 'pronunciation'
          },
          {
            id: 'practice4',
            title: 'Latihan Intonasi',
            description: 'Berlatih intonasi dalam kalimat tanya dan pernyataan',
            type: 'intonation'
          },
          {
            id: 'practice5',
            title: 'Latihan Stress Pattern',
            description: 'Berlatih penekanan kata dalam kalimat',
            type: 'stress'
          }
        ]
      }
    };

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
    return mockData[key] || mockData['pronunciation'];
  }

  getCategoryData() {
    return this.categoryData;
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

  getBannerData() {
    return this.categoryData?.banner || null;
  }



  getCommonMistakes() {
    return this.categoryData?.commonMistakes || null;
  }

  getMoreMaterials() {
    return this.categoryData?.moreMaterials || null;
  }
}

export default CategoryModel;
