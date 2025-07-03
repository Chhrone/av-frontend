// Model untuk Penekanan Kata

const PenekananKataModel = {
  id: 'penekanan_kata',
  title: 'Penekanan Kata',
  description: 'Penekanan kata adalah "detak jantung" dari sebuah kata dalam Bahasa Inggris. Menguasainya akan mengubah pelafalan dari datar menjadi dinamis dan alami, serta memastikan makna tersampaikan dengan benar.',
  banner: {
    title: 'Penekanan Kata',
    subtitle: 'Kuasai melodi kata dengan penekanan & reduksi vokal yang tepat',
    image: 'https://placehold.co/800x300/E2E8F0/475569?text=Penekanan+Kata'
  },
  material: {
    title: 'Panduan Penekanan Kata & Reduksi Vokal',
    content: `
      <h2>Perbedaan Fundamental: Dapat Diprediksi vs. Leksikal</h2>
      <p>Akar masalah bagi penutur Indonesia adalah perbedaan sifat penekanan kata:</p>
      <ul>
        <li><b>Bahasa Indonesia:</b> Penekanan dapat diprediksi, biasanya di suku kata kedua dari belakang (pe<b>NA</b>ma). Sifatnya tidak mengubah makna.</li>
        <li><b>Bahasa Inggris:</b> Penekanan bersifat leksikal, artinya harus dihafal per kata dan dapat mengubah makna (contoh: <b>RE</b>cord vs re<b>CORD</b>).</li>
      </ul>
      <h2>Apa itu Suku Kata Bertekanan?</h2>
      <p>Suku kata yang ditekankan lebih menonjol karena diucapkan dengan:</p>
      <ol>
        <li><b>Durasi Lebih Panjang:</b> Vokalnya diucapkan lebih lama.</li>
        <li><b>Nada Lebih Tinggi:</b> Pitch suara naik.</li>
        <li><b>Volume Lebih Keras:</b> Diucapkan dengan lebih banyak energi.</li>
        <li><b>Vokal yang Jelas:</b> Vokal diucapkan penuh, tidak direduksi.</li>
      </ol>
      <h3>Konsep Kunci: Reduksi Vokal menjadi Schwa /ə/</h3>
      <p>Untuk membuat satu suku kata menonjol, suku kata lain yang <em>tidak bertekanan</em> harus dilemahkan. Vokal pada suku kata tak bertekanan ini seringkali direduksi menjadi bunyi netral dan pendek yang disebut <b>Schwa (/ə/)</b>. Ini adalah rahasia pelafalan yang alami.</p>
      <p>Contoh: <b>"banana"</b>. Pola tekanannya adalah ba-<b>NA</b>-na. Vokal 'a' pertama dan ketiga direduksi. Pelafalan yang benar: <b>/bəˈnænə/</b>.</p>
    `,
    readingTime: '12 menit'
  },
  pronunciationExamples: [
    { word: 'photograph', phonetic: '/ˈfoʊ.tə.ɡræf/' },
    { word: 'photographer', phonetic: '/fəˈtɑː.ɡrə.fɚ/' },
    { word: 'photographic', phonetic: '/ˌfoʊ.təˈɡræf.ɪk/' },
    { word: 'record (noun)', phonetic: '/ˈrɛk.ɚd/' },
    { word: 'record (verb)', phonetic: '/rɪˈkɔːrd/' },
    { word: 'about', phonetic: '/əˈbaʊt/' }
  ],
  commonMistakes: [
    {
      id: 'stress1',
      title: 'Menerapkan Pola Stres Indonesia',
      description: 'Secara tidak sadar menerapkan aturan penekanan pada suku kata kedua dari belakang, yang seringkali salah dalam Bahasa Inggris.',
      examples: ['Mengucapkan "HOtel" (salah) → seharusnya "hoTEL"', 'Mengucapkan "deVE-lop" (salah) → seharusnya "de-VE-lop"']
    },
    {
      id: 'stress2',
      title: 'Kurangnya Reduksi Vokal (Mengucapkan Sesuai Ejaan)',
      description: 'Mengucapkan semua vokal dalam kata dengan nilai penuhnya, tanpa melemahkan vokal tak bertekanan menjadi schwa /ə/. Ini membuat ucapan terdengar datar dan kaku.',
      examples: ['"about" diucapkan /a-baʊt/ (salah) → seharusnya /əˈbaʊt/', '"computer" diucapkan /kɔm-pju-tər/ (salah) → seharusnya /kəmˈpjuː.tər/']
    },
    {
      id: 'stress3',
      title: 'Kebingungan Heteronim (Noun vs. Verb)',
      description: 'Tidak mengubah pola penekanan untuk kata yang sama yang memiliki fungsi berbeda (kata benda vs. kata kerja), sehingga mengubah makna.',
      examples: ['"I need to reCORD (verb) the REcord (noun)." Keduanya sering diucapkan dengan penekanan yang sama.']
    },
    {
      id: 'stress4',
      title: 'Stres yang Sama Rata (Equation Stress)',
      description: 'Memberikan tingkat penekanan yang hampir sama pada semua suku kata, menghilangkan melodi internal kata tersebut.',
      examples: ['Mengucapkan "in-for-ma-tion" dengan penekanan yang sama rata, bukan "in-for-MA-tion".']
    }
  ],
  practiceItems: [
    { 
      id: 'PK-001',
      title: 'Latihan Heteronim (Tegangan Berbeda)',
      instruction: 'Latih heteronim: "PREsent" (noun) vs "preSENT" (verb), "OBject" (noun) vs "obJECT" (verb).' 
    },
    { 
      id: 'PK-002',
      title: 'Latihan Reduksi Vokal /ə/',
      instruction: 'Latih reduksi vokal. Ucapkan kata berikut dan rasakan vokal /ə/ yang lemah: a-BOUT, ba-NA-na, SO-fa, TA-ken.' 
    },
    { 
      id: 'PK-003',
      title: 'Akhiran -tion/-sion',
      instruction: 'Latih aturan akhiran. Ucapkan kata berakhiran -tion/-sion: inforMAtion, eduCAtion, deCIsion.' 
    },
    { 
      id: 'PK-004',
      title: 'Tekanan Kata Benda Majemuk',
      instruction: 'Latih kata benda majemuk. Tekanan selalu di kata pertama: GREENhouse, BOOKstore, FOOTball.' 
    },
    { 
      id: 'PK-005',
      title: 'Latihan Konteks Heteronim dalam Kalimat',
      instruction: 'Rekam suara Anda saat mengucapkan "I need a permit to permit you inside" dan bandingkan dengan penutur asli.' 
    }
  ],  
  moreMaterials: {
    title: 'Materi Tambahan',
    materials: [
      {
        id: 'mat1',
        title: "Rachel's English - Introduction to Word Stress",
        description: 'Video penjelasan mendalam tentang pentingnya penekanan kata dan reduksi vokal.',
        url: 'https://www.youtube.com/watch?v=K-wF9I_g_aY',
        type: 'youtube',
        icon: '📺'
      },
      {
        id: 'mat2',
        title: 'Pronuncian - Word Stress Lists',
        description: 'Daftar kata yang dikelompokkan berdasarkan pola penekanan untuk latihan terfokus.',
        url: 'https://pronuncian.com/word-stress',
        type: 'website',
        icon: '🌐'
      },
      {
        id: 'mat3',
        title: 'Espresso English - Heteronyms',
        description: 'Daftar kata heteronim (ejaan sama, penekanan & arti beda) dengan contoh kalimat dan audio.',
        url: 'https://www.espressoenglish.net/common-english-heteronyms/',
        type: 'website',
        icon: '🌐'
      }
    ]
  }
};

export default PenekananKataModel;
