// Model untuk Inventaris Konsonan

const KonsonanInventoryModel = {
  id: 'inventaris-konsonan',
  title: 'Inventaris Konsonan',
  description: 'Meskipun banyak konsonan Bahasa Inggris memiliki padanan yang mirip dalam Bahasa Indonesia, ada perbedaan krusial—baik dalam bentuk bunyi yang baru maupun cara pengucapan bunyi yang familiar—yang secara signifikan memengaruhi kejelasan dan kealamian aksen.',
  banner: {
    title: 'Inventaris Konsonan',
    subtitle: 'Latih bunyi konsonan sulit seperti /th/, /v/, dan American /r/',
    image: 'https://placehold.co/800x300/E2E8F0/475569?text=Konsonan'
  },
  material: {
    title: 'Panduan Bunyi Konsonan',
    content: `
      <h2>Fitur Kunci yang Berbeda</h2>
      <p>Beberapa fitur dan bunyi spesifik di Bahasa Inggris Amerika tidak memiliki padanan langsung di Bahasa Indonesia, yang menjadi sumber utama kesulitan.</p>
      <ul>
        <li><b>Aspirasi (Aspiration):</b> Konsonan stop tak bersuara (/p/, /t/, /k/) di awal suku kata bertekanan diucapkan dengan hembusan udara kecil. Bahasa Indonesia tidak menggunakan aspirasi, sehingga kata "pin" bisa terdengar seperti "bin" bagi penutur asli.</li>
        <li><b>Bunyi /r/ Amerika:</b> Bahasa Indonesia menggunakan /r/ getar (trilled), sedangkan Bahasa Inggris Amerika menggunakan /r/ retrofleks, di mana ujung lidah ditarik ke belakang tanpa bergetar.</li>
        <li><b>Frikatif Dental (/θ/ dan /ð/):</b> Bunyi "th" ini sama sekali tidak ada dalam Bahasa Indonesia. /θ/ adalah versi tak bersuara (<b>th</b>ink) dan /ð/ adalah versi bersuara (<b>th</b>is).</li>
        <li><b>Konsonan Akhir Kata:</b> Bahasa Indonesia memiliki aturan yang lebih ketat untuk konsonan di akhir kata. Kebiasaan mengganti /b/ dengan /p/ atau /d/ dengan /t/ di akhir kata sering terbawa ke Bahasa Inggris.</li>
      </ul>
      <h3>Latihan:</h3>
      <ol>
        <li>Ucapkan pasangan kata: <b>think / tink</b>, <b>then / den</b>, <b>very / ferry</b></li>
        <li>Latih membedakan bunyi konsonan bersuara (voiced) dan tidak bersuara (voiceless)</li>
      </ol>
    `,
    readingTime: '15 menit'
  },
  pronunciationExamples: [
    { word: 'think', phonetic: '/θɪŋk/' },
    { word: 'this', phonetic: '/ðɪs/' },
    { word: 'very', phonetic: '/ˈvɛri/' },
    { word: 'zoo', phonetic: '/zuː/' },
    { word: 'right', phonetic: '/raɪt/' },
    { word: 'pay', phonetic: '/pʰeɪ/ (aspirated)' }
  ],
  commonMistakes: [
    {
      id: 'consonant1',
      title: 'Substitusi Bunyi "th" (/θ/ & /ð/)',
      description: 'Karena bunyi "th" tidak ada dalam Bahasa Indonesia, penutur cenderung menggantinya dengan bunyi terdekat, biasanya /t/, /d/, atau /f/.',
      examples: ['think (/θɪŋk/) → "tink" atau "fink"', 'this (/ðɪs/) → "dis"']
    },
    {
      id: 'consonant2',
      title: 'Devoicing Konsonan Bersuara (/v/ → /f/, /z/ → /s/)',
      description: 'Ada kecenderungan kuat untuk mengganti konsonan bersuara dengan padanan tak bersuaranya, terutama di akhir kata.',
      examples: ['very (/ˈvɛri/) → "fery"', 'zoo (/zuː/) → "soo"', 'have (/hæv/) → "haf"']
    },
    {
      id: 'consonant3',
      title: 'Transfer Bunyi /r/ Indonesia',
      description: 'Menggunakan /r/ getar atau guling (trilled r) khas Indonesia untuk semua konteks /r/ dalam Bahasa Inggris, padahal seharusnya menggunakan American /r/ yang ditarik ke belakang.',
      examples: ['"car" dan "right" diucapkan dengan /r/ getar.']
    },
    {
      id: 'consonant4',
      title: 'Kurangnya Aspirasi pada /p/, /t/, /k/',
      description: 'Mengucapkan "pin", "ten", dan "come" tanpa hembusan udara yang diperlukan, sehingga dapat terdengar seperti "bin", "den", dan "gum" bagi penutur asli.',
      examples: ['pin (/pʰɪn/) diucapkan seperti bin (/bɪn/)']
    }
  ],
  practiceItems: [
    { 
      id: 'KI-001',
      title: 'Latihan Dasar /θ/ dan /t/',
      instruction: 'Latih bunyi /θ/ vs /t/: think vs tink, three vs tree, path vs pat.',
    },
    { 
      id: 'KI-002',
      title: 'Latihan /ð/ dan /d/',
      instruction: 'Latih bunyi /ð/ vs /d/: then vs den, they vs day, breathe vs breed.' 
    },
    { 
      id: 'KI-003',
      title: 'Latihan /r/ Gaya American',
      instruction: 'Latih American /r/: Ucapkan "car", "bird", "right", "run". Rasakan lidah tertarik ke belakang tanpa bergetar.'
    },
    { 
      id: 'KI-004',
      title: 'Latihan Aspirasi /p/, /t/, /k/',
      instruction: 'Latihan aspirasi: Pegang kertas di depan mulut. Ucapkan "pay", "take", "key". Kertas harus bergerak. Lalu ucapkan "spay", "stake", "sky". Kertas tidak boleh bergerak.'
    },
    { 
      id: 'KI-005',
      title: 'Latihan Konsonan Bersuara di Akhir Kata',
      instruction: 'Latih konsonan bersuara di akhir kata: "live", "have", "buzz", "prize". Rasakan getaran di tenggorokan hingga akhir.'
    }
  ],  
  moreMaterials: {
    title: 'Materi Tambahan',
    materials: [
      {
        id: 'mat1',
        title: "Rachel's English - How to make the TH Sounds",
        description: 'Video tutorial yang sangat jelas dan detail tentang cara memproduksi bunyi /θ/ dan /ð/ dengan benar.',
        url: 'https://www.youtube.com/watch?v=h_w262a3-gI',
        type: 'youtube',
        icon: '📺'
      },
      {
        id: 'mat2',
        title: 'Pronuncian - American R (/r/)',
        description: 'Penjelasan tertulis dan audio tentang cara membentuk bunyi /r/ Amerika, lengkap dengan daftar kata untuk latihan.',
        url: 'https://pronuncian.com/pronunciation-of-the-american-r',
        type: 'website',
        icon: '🌐'
      },
      {
        id: 'mat3',
        title: 'Speech Active - Aspiration of p, t, k',
        description: 'Artikel dan latihan audio yang berfokus pada aspirasi, menjelaskan kapan harus dan tidak harus menggunakannya.',
        url: 'https://www.speechactive.com/aspiration-english-pronunciation-p-t-k-sounds/',
        type: 'website',
        icon: '🌐'
      }
    ]
  }
};

export default KonsonanInventoryModel;
