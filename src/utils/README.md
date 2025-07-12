# Utilitas

### `RecordingManager.js`

Ini adalah layanan tingkat tinggi yang mengelola seluruh siklus hidup perekaman audio, bertindak sebagai fasad di atas `AudioRecorder`.

- **Tujuan**: Untuk menyediakan antarmuka yang sederhana dan aman untuk memulai, menghentikan, dan mengelola rekaman audio tanpa perlu berinteraksi langsung dengan `AudioRecorder` tingkat rendah.
- **Cara kerjanya**:
    - Ini mempertahankan status perekaman (misalnya, `isRecording`, `isInitialized`).
    - Ini membuat dan menghancurkan instans `AudioRecorder` sesuai kebutuhan, memastikan bahwa sumber daya mikrofon dikelola dan dibersihkan dengan benar.
    - Ini menyediakan sistem berbasis peristiwa untuk memberi tahu bagian lain dari aplikasi tentang perubahan status perekaman (misalnya, `recordingStart`, `recordingStop`).
    - Ini mencakup metode `forceStop` untuk memastikan bahwa rekaman dihentikan dalam kasus-kasus ekstrem, seperti ketika pengguna meninggalkan halaman.

```javascript
// src/utils/RecordingManager.js

async stopRecording(metadata = {}) {
  try {
    if (!this.isRecording || !this.audioRecorder) {
      return null;
    }

    const recordingData = await this.audioRecorder.stopRecording();
    const transcript = this.audioRecorder.getTranscript();
    if (!recordingData) {
      throw new Error('No recording data received');
    }
    const tempRecording = {
      audioBlob: recordingData.blob,
      name: metadata.name || 'Speech Test Recording',
      category: metadata.category || 'speech-test',
      duration: recordingData.duration,
      sampleRate: recordingData.sampleRate,
      format: recordingData.format,
      source: this.recordingStartedFromWelcome ? 'welcome' : 'test',
      timestamp: Date.now(),
      transcript: transcript,
      ...metadata
    };
    this.currentRecording = tempRecording;
    this.isRecording = false;

    this.notifyListeners('recordingStop', { recording: tempRecording });
    await this.cleanup();
    return tempRecording;
  } catch (error) {
    this.notifyListeners('recordingError', error);
    throw error;
  }
}
```

Cuplikan ini signifikan karena menunjukkan:
- **Abstraksi**: Ini menyediakan metode `stopRecording` sederhana yang menyembunyikan kompleksitas `AudioRecorder` yang mendasarinya.
- **Pengemasan Data**: Ini mengambil data rekaman mentah dan transkrip dan mengemasnya ke dalam objek (`tempRecording`) yang bersih dan terstruktur dengan baik yang dapat dengan mudah digunakan oleh bagian lain dari aplikasi.
- **Manajemen Status**: Ini memperbarui status `isRecording` dengan benar dan memberi tahu pendengar mana pun bahwa rekaman telah berhenti.
- **Manajemen Sumber Daya**: Ini memanggil metode `cleanup` untuk memastikan bahwa instans `AudioRecorder` dihancurkan dan bahwa sumber daya mikrofon dilepaskan, mencegah kebocoran memori dan memastikan privasi pengguna.

### `AccentDetectionService.js`

Layanan ini bertanggung jawab untuk berinteraksi dengan API backend untuk menganalisis aksen pengguna.

- **Tujuan**: Untuk mengambil rekaman audio, mengirimkannya ke model deteksi aksen, dan mengembalikan skor kepercayaan.
- **Cara kerjanya**:
    - Ini dapat beroperasi dalam dua mode: `real` dan `demo`. Dalam mode `real`, ia mengirimkan blob audio ke titik akhir API produksi. Dalam mode `demo`, ia mengembalikan skor tiruan acak, memungkinkan pengembangan frontend tanpa backend langsung.
    - Ini mencakup fungsi pembantu, `processRecordingAndShowResult`, yang mengatur proses analisis rekaman dan mengarahkan pengguna ke halaman hasil.

```javascript
// src/utils/AccentDetectionService.js

async analyzeAccent(audioBlob) {
  if (!this.useRealModel) {
    return this.getDemoResult();
  }

  try {
    if (!audioBlob.type.includes('wav')) {
      throw new Error('Audio file must be in WAV format');
    }

    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');

    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      body: formData,
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    let us_confidence;

    if (typeof result.us_confidence === 'number') {
      us_confidence = result.us_confidence;
    } else if (typeof result.confidence === 'number') {
      us_confidence = result.confidence;
    } else if (typeof result === 'number') {
      us_confidence = result;
    } else {
      throw new Error('Invalid API response format: no confidence value found');
    }

    return { us_confidence };

  } catch (error) {
    console.error('Accent detection failed:', error);
    throw error;
  }
}
```

Cuplikan ini menunjukkan logika inti untuk mengirim blob audio ke API backend untuk analisis aksen. Ini menangani panggilan API nyata dan mode demo, memastikan audio dalam format yang benar dan memproses respons API untuk mengekstrak skor kepercayaan. Ini juga mencakup penanganan kesalahan dasar untuk permintaan jaringan dan respons yang tidak valid.

### `appEvents.js`

Modul ini mengatur pendengar acara global untuk menangani masalah di seluruh aplikasi, terutama yang terkait dengan pembersihan sumber daya.

- **Tujuan**: Untuk memastikan bahwa sumber daya penting, seperti rekaman audio, dihentikan dengan benar ketika pengguna menavigasi jauh dari halaman atau menutup tab.
- **Cara kerjanya**: Ini menambahkan pendengar acara untuk `beforeunload`, `pagehide`, dan `visibilitychange` untuk memanggil metode `forceStop` dari `RecordingManager`, mencegah mikrofon tetap aktif di latar belakang.

```javascript
// src/utils/appEvents.js

import RecordingManager from './RecordingManager.js';

export function setupGlobalCleanup() {
  window.addEventListener('beforeunload', () => {
    RecordingManager.forceStop();
  });
  window.addEventListener('pagehide', () => {
    RecordingManager.forceStop();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      RecordingManager.forceStop();
    }
  });
}
```

Cuplikan ini menunjukkan bagaimana pendengar acara global diatur untuk memastikan bahwa metode `RecordingManager.forceStop()` dipanggil dalam berbagai skenario di mana pengguna mungkin meninggalkan halaman atau beralih tab. Ini sangat penting untuk manajemen sumber daya dan privasi pengguna, karena mencegah mikrofon tetap aktif secara tidak terduga.

### `appHelpers.js`

File ini berisi serangkaian fungsi pembantu lain-lain yang digunakan di seluruh aplikasi.

- **Tujuan**: Untuk menyediakan fungsi yang sederhana dan dapat digunakan kembali untuk tugas-tugas umum.
- **Fungsi Utama**:
    - `categoryRouteMap`: Pemetaan dari nama rute yang ramah URL (kebab-case) ke ID kategori internal yang digunakan oleh model.
    - `scrollToTop`: Utilitas sederhana untuk menggulir jendela ke bagian atas halaman.
    - `hasCompletedIntro` & `setCompletedIntro`: Fungsi untuk memeriksa dan mengatur bendera di `localStorage` untuk menentukan apakah pengguna telah melalui alur intro awal.

```javascript
// src/utils/appHelpers.js

export const categoryRouteMap = {
  // Old routes (kept for backward compatibility)
  'peta-vokal-amerika': 'pronunciation',
  // ... (other old routes)
  
  // New category routes
  'inventaris-vokal': 'vokal',
  'inventaris-konsonan': 'konsonan',
  'struktur-suku-kata': 'suku-kata',
  'penekanan-kata': 'penekanan',
  'irama-bahasa': 'irama',
  'skenario-dunia-nyata': 'skenario'
};

export function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

export function hasCompletedIntro() {
  return localStorage.getItem('hasCompletedIntro') === 'true';
}

export function setCompletedIntro() {
  localStorage.setItem('hasCompletedIntro', 'true');
}
```

Cuplikan ini menampilkan `categoryRouteMap`, yang penting untuk memetakan URL yang ramah pengguna ke ID kategori internal. Ini juga mencakup fungsi pembantu yang sederhana, namun sering digunakan, seperti `scrollToTop` dan fungsi untuk mengelola status penyelesaian intro di `localStorage`. Pembantu ini berkontribusi pada basis kode yang lebih bersih dan lebih mudah dipelihara dengan merangkum fungsionalitas umum.

### `appRouter.js`

Ini adalah router utama untuk aplikasi, menangani semua navigasi yang terjadi setelah alur intro awal.

- **Tujuan**: Untuk mengelola rute aplikasi, memetakan jalur URL ke fungsi penanganan tertentu (misalnya, merender tampilan).
- **Cara kerjanya**:
    - Ini mendukung perutean berbasis hash dan berbasis pathname.
    - Ini memungkinkan rute dinamis dengan parameter (misalnya, `/category/:id`).
    - Ini menyediakan metode untuk menavigasi secara terprogram (`navigate`), kembali (`goBack`), dan menangani kesalahan perutean.
    - Ini diimplementasikan sebagai singleton, memastikan bahwa hanya ada satu instans router di seluruh siklus hidup aplikasi.

```javascript
// src/utils/appRouter.js

async handleRouteChange() {
  try {
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    // Support both hash and pathname based routing
    // If hash exists and matches a route, use hash as path
    let effectivePath = path;
    if (hash && hash.startsWith('#/')) {
      effectivePath = hash.slice(1); // remove '#'
    }
    const { route, params } = this.findMatchingRoute(effectivePath);
    
    if (!route) {
      if (path !== '/') {
        console.warn('AppRouter: No route matched for:', window.location.pathname);
      }
      return;
    }

    this.previousRoute = this.currentRoute;
    this.currentRoute = effectivePath;

    const routeContext = { 
      from: this.previousRoute, 
      to: effectivePath,
      params
    };

    try {
      // Execute global middlewares
      for (const middleware of this.middlewares) {
        await middleware(routeContext);
      }

      // Execute route-specific middlewares
      for (const middleware of route.middlewares) {
        await middleware(routeContext);
      }

      // Execute route handler with params
      await route.handler.call(this, params || {});

      // Notify route change subscribers
      if (this.onRouteChange) {
        this.onRouteChange({
          from: this.previousRoute,
          to: path,
          route: this.currentRoute
        });
      }
    } catch (error) {
      console.error('Error during route execution:', error);
      if (this.errorHandler) {
        this.errorHandler('An error occurred while loading the page');
      }
    }
  } catch (error) {
    console.error('Error during route change:', error);
    if (this.errorHandler) {
      this.errorHandler('An unexpected error occurred');
    }
  }
}
```

Cuplikan ini menunjukkan logika inti dari metode `handleRouteChange` `AppRouter`. Ini menunjukkan bagaimana router menentukan jalur yang efektif (mendukung perutean berbasis pathname dan hash), menemukan rute yang cocok, menjalankan middleware terkait, dan akhirnya memanggil fungsi penanganan rute. Metode ini adalah pusat alur navigasi aplikasi dan memastikan bahwa konten yang benar ditampilkan berdasarkan URL.

### `AudioRecorder.js`

Kelas ini menyediakan antarmuka tingkat rendah untuk merekam audio dari mikrofon pengguna.

- **Tujuan**: Untuk menangani kompleksitas akses mikrofon, perekaman audio, dan konversinya ke format yang dapat digunakan (WAV).
- **Cara kerjanya**:
    - Ini menggunakan API `MediaDevices` untuk mendapatkan akses ke mikrofon pengguna.
    - Ini memanfaatkan API `MediaRecorder` untuk menangkap potongan audio.
    - Ini mencakup logika untuk mengonversi audio yang direkam menjadi file WAV, yang merupakan format yang diperlukan untuk API deteksi aksen.
    - Ini juga mengintegrasikan API `SpeechRecognition` untuk menyediakan transkripsi ucapan-ke-teks waktu nyata dari rekaman pengguna.

```javascript
// src/utils/AudioRecorder.js

async initialize() {
  try {
    const constraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 16000,
        channelCount: 1
      }
    };

    this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

    this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate: 16000
    });

    this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
    this.gainNode = this.audioContext.createGain();
    this.destinationNode = this.audioContext.createMediaStreamDestination();

    this.sourceNode.connect(this.gainNode);
    this.gainNode.connect(this.destinationNode);

    let mimeType = 'audio/webm;codecs=opus';
    if (MediaRecorder.isTypeSupported('audio/wav')) {
      mimeType = 'audio/wav';
    } else if (MediaRecorder.isTypeSupported('audio/webm;codecs=pcm')) {
      mimeType = 'audio/webm;codecs=pcm';
    }

    this.mediaRecorder = new MediaRecorder(this.destinationNode.stream, {
      mimeType: mimeType
    });

    this.setupMediaRecorderEvents();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.speechRecognition = new SpeechRecognition();
      this.speechRecognition.continuous = true;
      this.speechRecognition.interimResults = true;
      this.speechRecognition.lang = 'en-US';
      this.speechRecognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            this.transcript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        this._lastInterimTranscript = interimTranscript;
      };
      this.speechRecognition.onerror = (event) => {};
    } else {
      console.warn('[LOG] SpeechRecognition not supported');
    }

    return true;
  } catch (error) {
    console.error('Failed to initialize AudioRecorder:', error);
    throw error;
  }
}
```

Cuplikan ini menunjukkan metode `initialize` dari kelas `AudioRecorder`. Ini menunjukkan bagaimana aplikasi meminta akses mikrofon, menyiapkan `AudioContext` untuk pemrosesan, mengonfigurasi `MediaRecorder` untuk menangkap audio, dan menginisialisasi Web Speech API untuk transkripsi waktu nyata. Metode ini fundamental untuk kemampuan aplikasi untuk merekam dan memproses ucapan pengguna.

### `errorHandler.js`

Modul ini menyediakan fungsi terpusat untuk menampilkan pesan kesalahan kepada pengguna.

- **Tujuan**: Untuk menawarkan cara yang konsisten untuk menampilkan kesalahan, baik yang berasal dari panggilan API, masalah perutean, atau bagian lain dari aplikasi.
- **Cara kerjanya**: Fungsi `showError` mengambil pesan kesalahan dan judul, dan merender layar kesalahan sederhana di dalam wadah aplikasi utama, memungkinkan pengguna untuk kembali ke halaman sebelumnya.

```javascript
// src/utils/errorHandler.js

export function showError(message, title = 'Terjadi Kesalahan') {
  const errorMessage = message instanceof Error ? message.message : String(message);
  const appContainer = document.getElementById('app');
  if (!appContainer) {
    console.error('App container not found');
    return;
  }
  try {
    appContainer.innerHTML = `
      <div class="error-container" style="text-align: center; padding: 2rem;">
        <h2>${title}</h2>
        <p>${errorMessage}</p>
        <button 
          onclick="window.history.back()" 
          class="error-button"
          style="padding: 0.5rem 1rem; margin-top: 1rem; cursor: pointer;"
        >
          Kembali
        </button>
      </div>
    `;
  } catch (error) {
    console.error('Failed to render error:', error);
  }
  console.error('Application Error:', errorMessage);
}
```

Cuplikan ini menunjukkan fungsi `showError`, yang merupakan mekanisme penanganan kesalahan terpusat. Ini secara dinamis membuat UI pesan kesalahan di dalam wadah aplikasi utama, menyediakan cara yang ramah pengguna untuk menampilkan kesalahan dan tombol untuk menavigasi kembali. Ini memastikan pengalaman kesalahan yang konsisten di seluruh aplikasi.

### `introRouter.js`

Ini adalah router khusus yang menangani alur pengantar awal aplikasi.

- **Tujuan**: Untuk mengelola urutan layar yang dilihat pengguna baru, dari layar pembuka hingga pesan selamat datang, tes aksen, dan hasilnya.
- **Cara kerjanya**:
    - Ini adalah router berbasis hash yang dirancang khusus untuk urutan intro.
    - Ini mencakup logika untuk memeriksa apakah pengguna telah menyelesaikan intro, dan jika demikian, ia mengarahkan mereka ke dasbor utama.
    - Ini menggunakan View Transition API untuk membuat transisi yang mulus dan animasi antara layar intro yang berbeda.

```javascript
// src/utils/introRouter.js

handleRouteChange() {
  let hash = window.location.hash.slice(1);
  
  if (!hash && window.location.pathname === '/') {
    hash = '/welcome';
  } else if (!hash) {
    hash = '/';
  }
  
  let routeHandler = this.routes[hash];
  let params = {};
  
  if (!routeHandler) {
    const routeMatch = this.findMatchingRoute(hash);
    if (routeMatch) {
      routeHandler = routeMatch.handler;
      params = routeMatch.params || {};
    }
  }

  if (routeHandler) {
    this.previousRoute = this.currentRoute;
    this.currentRoute = hash;
    
    if (hash === '/splash') {
      setTimeout(() => {
        window.location.pathname = '/dashboard';
      }, 2000);
      return;
    }
    
    const useTransition = this.isIntroRoute(hash) && 'startViewTransition' in document;
    
    const execute = () => {
      try {
        routeHandler(params);
        if (this.onRouteChange) {
          this.onRouteChange({
            from: this.previousRoute,
            to: hash,
            params: params
          });
        }
      } catch (error) {
        console.error(`Error executing route ${hash}:`, error);
        if (this.isIntroRoute(hash)) {
          this.navigate('/welcome');
        }
      }
    };
    
    if (useTransition) {
      document.startViewTransition(execute);
    } else {
      execute();
    }
  } else {
    if (this.isIntroRoute(hash)) {
      this.navigate('/welcome');
    }
  }
}
```

Cuplikan ini mengilustrasikan metode `handleRouteChange`, yang merupakan inti dari `introRouter`. Ini menunjukkan bagaimana router menentukan rute saat ini, menangani kasus-kasus khusus seperti layar pembuka, dan menggunakan View Transition API untuk navigasi yang mulus antara layar intro. Ini juga mencakup logika cadangan untuk browser yang tidak didukung dan penanganan kesalahan untuk memastikan pengalaman pengguna yang kuat selama proses orientasi.

### `RecordingManager.js`

Ini adalah layanan tingkat tinggi yang mengelola seluruh siklus hidup perekaman audio, bertindak sebagai fasad di atas `AudioRecorder`.

- **Tujuan**: Untuk menyediakan antarmuka yang sederhana dan aman untuk memulai, menghentikan, dan mengelola rekaman audio tanpa perlu berinteraksi langsung dengan `AudioRecorder` tingkat rendah.
- **Cara kerjanya**:
    - Ini mempertahankan status perekaman (misalnya, `isRecording`, `isInitialized`).
    - Ini membuat dan menghancurkan instans `AudioRecorder` sesuai kebutuhan, memastikan bahwa sumber daya mikrofon dikelola dan dibersihkan dengan benar.
    - Ini menyediakan sistem berbasis peristiwa untuk memberi tahu bagian lain dari aplikasi tentang perubahan status perekaman (misalnya, `recordingStart`, `recordingStop`).
    - Ini mencakup metode `forceStop` untuk memastikan bahwa rekaman dihentikan dalam kasus-kasus ekstrem, seperti ketika pengguna meninggalkan halaman.

```javascript
// src/utils/RecordingManager.js

async stopRecording(metadata = {}) {
  try {
    if (!this.isRecording || !this.audioRecorder) {
      return null;
    }

    const recordingData = await this.audioRecorder.stopRecording();
    const transcript = this.audioRecorder.getTranscript();
    if (!recordingData) {
      throw new Error('No recording data received');
    }
    const tempRecording = {
      audioBlob: recordingData.blob,
      name: metadata.name || 'Speech Test Recording',
      category: metadata.category || 'speech-test',
      duration: recordingData.duration,
      sampleRate: recordingData.sampleRate,
      format: recordingData.format,
      source: this.recordingStartedFromWelcome ? 'welcome' : 'test',
      timestamp: Date.now(),
      transcript: transcript,
      ...metadata
    };
    this.currentRecording = tempRecording;
    this.isRecording = false;

    this.notifyListeners('recordingStop', { recording: tempRecording });
    await this.cleanup();
    return tempRecording;
  } catch (error) {
    this.notifyListeners('recordingError', error);
    throw error;
  }
}
```

Cuplikan ini signifikan karena menunjukkan:
- **Abstraksi**: Ini menyediakan metode `stopRecording` sederhana yang menyembunyikan kompleksitas `AudioRecorder` yang mendasarinya.
- **Pengemasan Data**: Ini mengambil data rekaman mentah dan transkrip dan mengemasnya ke dalam objek (`tempRecording`) yang bersih dan terstruktur dengan baik yang dapat dengan mudah digunakan oleh bagian lain dari aplikasi.
- **Manajemen Status**: Ini memperbarui status `isRecording` dengan benar dan memberi tahu pendengar mana pun bahwa rekaman telah berhenti.
- **Manajemen Sumber Daya**: Ini memanggil metode `cleanup` untuk memastikan bahwa instans `AudioRecorder` dihancurkan dan bahwa sumber daya mikrofon dilepaskan, mencegah kebocoran memori dan memastikan privasi pengguna.

### `routerSetup.js`

Modul ini bertanggung jawab untuk menginisialisasi dan mengonfigurasi router aplikasi.

- **Tujuan**: Untuk memusatkan definisi rute untuk aplikasi utama dan alur intro.
- **Cara kerjanya**: Ini menyediakan dua fungsi, `setupMainRoutes` dan `setupIntroRoutes`, yang dipanggil selama proses startup aplikasi untuk menambahkan semua rute yang diperlukan ke router masing-masing.

```javascript
// src/utils/routerSetup.js

import { ROUTES } from './routes.js';

export function setupMainRoutes(appInstance) {
  const appRouter = appInstance.router;
  appRouter.addRoute(ROUTES.DASHBOARD, () => appInstance.showDashboard());
  appRouter.addRoute(ROUTES.PRACTICE, () => appInstance.showPractice());
  appRouter.addRoute(ROUTES.PROFILE, () => appInstance.showProfile());
  appRouter.addRoute(ROUTES.CATEGORIES_DYNAMIC, (params) => appInstance.showCategory(params));
  appRouter.addRoute('/practice/:categoryId', (params) => appInstance.showCategory(params));
  appRouter.addRoute(ROUTES.PRACTICE_DYNAMIC, (params) => appInstance.showPractice(params));
  appRouter.addRoute(ROUTES.PRACTICE_RESULT_DYNAMIC, (params) => appInstance.showPracticeResult(params));
  appRouter.addRoute('/', () => {
    if (appInstance.checkIntroToken()) {
      appInstance.showDashboardDirect();
    } else if (appInstance.introRouter) {
      window.location.hash = '/welcome';
    }
  });
  appRouter.addRoute('*', () => {
    console.warn('AppRouter: No route matched for:', window.location.pathname);
    appInstance.showError('Halaman tidak ditemukan');
  });
}

export function setupIntroRoutes(appInstance) {
  const introRouter = appInstance.introRouter;
  introRouter.addRoute('/', () => appInstance._handleRootPath());
  const introRoutes = [
    { path: '/welcome', handler: () => appInstance.showWelcome() },
    { path: '/test', handler: () => appInstance.showTest() },
    { path: '/result', handler: () => appInstance.showResult() },
    { path: '/splash', handler: () => appInstance.showSplash() }
  ];
  introRoutes.forEach(route => {
    introRouter.addRoute(route.path, () => {
      if (!appInstance._checkAndRedirectToDashboard()) {
        route.handler();
      }
    });
  });
  introRouter.addRoute('/dashboard', () => {
    appInstance.setIntroToken();
    appInstance.showDashboardDirect();
  });
  introRouter.addRoute('*', () => {
    if (!appInstance._checkAndRedirectToDashboard() && window.location.hash !== '#/welcome') {
      window.location.hash = '/welcome';
    }
  });
}
```

Cuplikan ini menunjukkan bagaimana perutean aplikasi diatur. Ini mendefinisikan rute aplikasi utama dan rute pengantar, termasuk rute dinamis dengan parameter. Pendekatan modular untuk perutean ini membuat struktur navigasi aplikasi jelas dan mudah dipelihara, memungkinkan perluasan dan modifikasi rute yang mudah.

### `routes.js`

File ini mendefinisikan semua jalur rute yang digunakan dalam aplikasi sebagai konstanta.

- **Tujuan**: Untuk menyediakan satu sumber kebenaran untuk semua jalur URL, membuatnya lebih mudah untuk mengelola dan memperbarui rute.
- **Ekspor Utama**:
    - `ROUTES`: Objek yang berisi semua jalur rute statis.
    - `generateRoute`: Fungsi pembantu untuk membuat jalur URL dengan parameter.
    - `getRouteParams`: Utilitas untuk mengekstrak parameter dari jalur URL.

```javascript
// src/utils/routes.js

export const ROUTES = {
  // Main routes
  DASHBOARD: '/dashboard',
  CATEGORY: '/category',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  PRACTICE: '/practice',
  CATEGORIES_DYNAMIC: '/categories/:categoryId',
  PRACTICE_DYNAMIC: '/practice/:categoryId/:practiceId',
  PRACTICE_RESULT_DYNAMIC: '/practice/:categoryId/:practiceId/result',
  
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Error pages
  NOT_FOUND: '/404',
  ERROR: '/error',
};

export const generateRoute = (baseRoute, params = {}) => {
  let route = baseRoute;
  
  Object.keys(params).forEach(key => {
    route = route.replace(`:${key}`, params[key]);
  });
  
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && !route.includes(`:${key}`)) {
      queryParams.append(key, value);
    }
  });
  
  const queryString = queryParams.toString();
  return queryString ? `${route}?${queryString}` : route;
};
```

Cuplikan ini menunjukkan objek `ROUTES`, yang memusatkan semua jalur rute aplikasi, termasuk rute dinamis. Ini juga mencakup fungsi pembantu `generateRoute`, yang penting untuk membangun URL secara terprogram dengan parameter. Pendekatan ini memastikan konsistensi dalam perutean dan menyederhanakan navigasi di seluruh aplikasi.

### `ViewTransitionHelper.js`

Utilitas ini adalah pembungkus di sekitar View Transition API browser.

- **Tujuan**: Untuk menyederhanakan pembuatan transisi animasi antara tampilan yang berbeda dan untuk menyediakan cadangan untuk browser yang tidak mendukung API.
- **Cara kerjanya**:
    - Ini memeriksa dukungan browser untuk View Transition API.
    - Ini menyediakan metode `createTransition` yang menggunakan `document.startViewTransition` asli atau kembali ke eksekusi panggilan balik sederhana.
    - Ini mencakup metode pembantu untuk mengatur dan menghapus nama transisi pada elemen, yang merupakan bagian penting dari cara kerja View Transition API.

```javascript
// src/utils/ViewTransitionHelper.js

createTransition(callback) {
  if (this.isSupported && document.startViewTransition) {
    return document.startViewTransition(callback);
  } else {
    // Fallback: just execute the callback
    return Promise.resolve(callback());
  }
}
```

Cuplikan ini menunjukkan metode `createTransition`, yang merupakan fungsi utama dari `ViewTransitionHelper`. Ini secara cerdas menggunakan View Transition API asli browser jika didukung, memberikan transisi yang mulus dan animasi antara tampilan. Jika API tidak didukung, ia dengan anggun kembali ke eksekusi panggilan balik sederhana, memastikan bahwa aplikasi tetap berfungsi di berbagai browser. Utilitas ini sangat penting untuk meningkatkan pengalaman pengguna dengan transisi UI modern.