// Model untuk Irama Bahasa

const IramaBahasaModel = {
  id: 'irama_bahasa',
  title: 'Irama Bahasa',
  description: 'Irama dan intonasi adalah puncak dari piramida pelafalan. Menguasai elemen ini adalah kunci untuk menciptakan musik bahasa yang mengalir secara alami dan tidak terdengar "asing" atau kaku.',
  banner: {
    title: 'Irama Bahasa',
    subtitle: 'Latih ritme dan intonasi untuk bicara yang mengalir alami',
    image: 'https://placehold.co/800x300/E2E8F0/475569?text=Irama+Bahasa'
  },
  material: {
    title: 'Panduan Irama dan Intonasi',
    content: `
      <h2>Perbedaan Fundamental: Stress-timed vs. Syllable-timed</h2>
      <p>Akar dari perbedaan "melodi" antara Bahasa Inggris dan Indonesia terletak pada cara kedua bahasa mengatur ritme kalimat.</p>
      <ul>
        <li><b>Syllable-timed (Bahasa Indonesia):</b> Setiap suku kata diberikan durasi waktu yang kurang lebih sama. Ritmenya seperti ketukan drum yang stabil dan teratur: da-da-da-da. Ini menciptakan aliran yang lebih datar.</li>
        <li><b>Stress-timed (Bahasa Inggris):</b> Ritme didasarkan pada interval waktu yang sama di antara suku kata yang bertekanan. Suku kata tak bertekanan harus "diperas" atau diucapkan lebih cepat untuk menjaga ritme.</li>
      </ul>
      <p>Untuk menghasilkan ritme Inggris yang alami, penting untuk membedakan antara <strong>Content Words</strong> (kata benda, kata kerja utama, kata sifat, kata keterangan) yang biasanya ditekan, dan <strong>Function Words</strong> (preposisi, artikel, pronomina) yang biasanya tidak ditekan dan diucapkan dengan cepat.</p>
      <h3>Pola Intonasi Dasar:</h3>
      <ol>
        <li><b>Intonasi Turun (Falling Intonation):</b> Nada suara turun di akhir. Digunakan untuk pernyataan, perintah, dan pertanyaan WH- (What, Where, Why, etc.).</li>
        <li><b>Intonasi Naik (Rising Intonation):</b> Nada suara naik di akhir. Digunakan untuk pertanyaan Yes/No dan untuk menunjukkan ketidakpercayaan atau meminta klarifikasi.</li>
      </ol>
    `,
    readingTime: '10 menit'
  },
  pronunciationExamples: [
    { word: 'happy', phonetic: '/ˈhæpi/' },
    { word: 'banana', phonetic: '/bəˈnɑːnə/' },
    { word: 'important', phonetic: '/ɪmˈpɔːrtənt/' },
    { word: 'photograph', phonetic: '/ˈfəʊtəɡræf/' },
    { word: 'understand', phonetic: '/ˌʌndəˈstænd/' }
  ],
  commonMistakes: [
    {
      id: 'rhythm1',
      title: 'Ritme Syllable-timed (Choppy Rhythm)',
      description: 'Memberikan penekanan dan durasi yang sama pada semua kata dalam kalimat, termasuk kata fungsi (seperti to, the, a), yang membuat ucapan terdengar terpatah-patah.',
      examples: ['Mengucapkan "I want to go" sebagai "I - want - to - go" dengan penekanan yang sama rata.']
    },
    {
      id: 'rhythm2',
      title: 'Intonasi Datar (Flat Intonation)',
      description: 'Bahasa Indonesia memiliki rentang intonasi yang lebih sempit. Jika ditransfer ke Bahasa Inggris, ucapan terdengar monoton, tidak bersemangat, atau bahkan tidak tertarik.',
      examples: ['Mengucapkan kalimat pernyataan tanpa ada naik-turun nada pada kata kunci.']
    },
    {
      id: 'rhythm3',
      title: 'Pola Intonasi yang Salah untuk Pertanyaan',
      description: 'Menggunakan intonasi turun pada pertanyaan Yes/No, atau intonasi naik pada pernyataan, yang dapat membingungkan pendengar dan membuat penutur terdengar tidak yakin.',
      examples: ['Mengatakan "You live here?" dengan nada turun, membuatnya terdengar seperti pernyataan, bukan pertanyaan.']
    }
  ],
  practiceItems: [
    { 
      id: 'IB-001',
      title: 'Intonasi WH- Questions',
      instruction: 'Latih intonasi turun untuk pertanyaan WH-: "What is your name? ➘", "Where are you from? ➘"' 
    },
    { 
      id: 'IB-002',
      title: 'Intonasi Yes/No Questions',
      instruction: 'Latih intonasi naik untuk pertanyaan Yes/No: "Are you coming? ➚", "Is this your book? ➚"' 
    },
    { 
      id: 'IB-003',
      title: 'Penekanan pada Content Words',
      instruction: 'Identifikasi dan tandai "content words" dalam sebuah paragraf, lalu baca dengan menekankan hanya kata-kata tersebut.' 
    },
    { 
      id: 'IB-004',
      title: 'Latihan Ritme Bahasa Inggris',
      instruction: 'Gunakan metronom online untuk melatih ritme stress-timed. Pastikan kata yang bertekanan jatuh tepat pada ketukan.' 
    },
    { 
      id: 'IB-005',
      title: 'Intonasi untuk Kalimat Pilihan',
      instruction: 'Latih intonasi untuk pilihan: "Would you like coffee➚ or tea➘?"' 
    }
  ],  
  moreMaterials: {
    title: 'Materi Tambahan',
    materials: [
      {
        id: 'mat1',
        title: "Rachel's English - Intonation Playlist",
        description: 'Koleksi video lengkap yang menjelaskan dan melatih berbagai pola intonasi dalam Bahasa Inggris Amerika.',
        url: 'https://www.youtube.com/playlist?list=PLrqHrGoMJdTTSRNwRh0Dw',
        type: 'youtube',
        icon: '📺'
      },
      {
        id: 'mat2',
        title: "Accent's Way - English Rhythm Practice",
        description: 'Latihan praktis dari Hadar Shemesh untuk merasakan dan memproduksi ritme stress-timed yang alami.',
        url: 'https://hadarshemesh.com/magazine/english-rhythm-practice/',
        type: 'website',
        icon: '🌐'
      },
      {
        id: 'mat3',
        title: 'Online Metronome',
        description: 'Alat sederhana untuk melatih ritme. Atur kecepatan lambat dan pastikan kata yang bertekanan jatuh tepat pada ketukan.',
        url: 'https://metronomeonline.com/',
        type: 'website',
        icon: '🌐'
      }
    ]
  }
};

export default IramaBahasaModel;
