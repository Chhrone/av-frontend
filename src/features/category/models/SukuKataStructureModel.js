// Model untuk Struktur Suku Kata

const SukuKataStructureModel = {
  id: 'struktur_suku_kata',
  title: 'Struktur Suku Kata',
  description: 'Struktur suku kata adalah "kerangka" tempat vokal dan konsonan disusun. Menguasai gugus konsonan Inggris yang kompleks tidak hanya memperbaiki pelafalan, tetapi juga secara langsung memperbaiki akurasi tata bahasa.',
  banner: {
    title: 'Struktur Suku Kata',
    subtitle: 'Kuasai gugus konsonan untuk pelafalan & tata bahasa yang akurat',
    image: 'https://placehold.co/800x300/E2E8F0/475569?text=Struktur+Suku+Kata'
  },
  material: {
    title: 'Panduan Struktur Suku Kata',
    content: `
      <h2>Perbedaan Fundamental: Sederhana vs. Kompleks</h2>
      <p>Perbedaan utama antara Bahasa Indonesia dan Inggris terletak pada aturan tentang <b>gugus konsonan</b> (consonant clusters)—dua atau lebih konsonan berurutan tanpa vokal di antaranya.</p>
      <ul>
        <li><b>Bahasa Indonesia:</b> Sangat menyukai struktur sederhana seperti KV (Ko-pi) dan KVK (Ma-kan). Gugus konsonan sangat terbatas, terutama di akhir kata.</li>
        <li><b>Bahasa Inggris:</b> Sangat permisif terhadap gugus konsonan yang kompleks, baik di awal (<b>str</b>eet, <b>spl</b>it) maupun di akhir kata (ta<b>sks</b>, te<b>xts</b>).</li>
      </ul>
      <h3>Implikasi Gramatikal Kritis</h3>
      <p>Kesulitan mengucapkan gugus konsonan di akhir kata seringkali menyebabkan penghapusan konsonan. Ini bukan hanya masalah pelafalan, tetapi juga <b>merusak tata bahasa</b>:</p>
      <ol>
        <li><b>Penanda Jamak (-s):</b> Mengucapkan "two book" bukan "two book<b>s</b>" (/bʊks/) terjadi karena sulitnya mengucapkan gugus /ks/.</li>
        <li><b>Penanda Waktu Lampau (-ed):</b> Mengucapkan "he look" bukan "he look<b>ed</b>" (/lʊkt/) terjadi karena sulitnya mengucapkan gugus /kt/.</li>
        <li><b>Penanda Orang Ketiga (-s):</b> Mengucapkan "she work" bukan "she work<b>s</b>" (/wɜːrks/) terjadi karena sulitnya mengucapkan gugus /rks/.</li>
      </ol>
      <p>Memperbaiki pengucapan gugus konsonan akhir secara langsung akan memperbaiki akurasi tata bahasa lisan Anda.</p>
    `,
    readingTime: '12 menit'
  },
  pronunciationExamples: [
    { word: 'street', phonetic: '/striːt/' },
    { word: 'splash', phonetic: '/splæʃ/' },
    { word: 'tasks', phonetic: '/tæsks/' },
    { word: 'texts', phonetic: '/tɛksts/' },
    { word: 'looked', phonetic: '/lʊkt/' },
    { word: 'friends', phonetic: '/frɛndz/' }
  ],
  commonMistakes: [
    {
      id: 'syllable1',
      title: 'Epenthesis (Penyisipan Vokal)',
      description: 'Strategi paling umum untuk "memecah" gugus konsonan yang sulit dengan menyisipkan vokal schwa /ə/ di antara konsonan.',
      examples: ['"blue" (/bluː/) → "belu" (/bəˈluː/)', '"school" (/skuːl/) → "sekul" (/səˈkuːl/)']
    },
    {
      id: 'syllable2',
      title: 'Deletion (Penghapusan Konsonan Akhir)',
      description: 'Menghilangkan satu atau lebih konsonan dari gugus di akhir kata. Ini adalah kesalahan yang paling merusak secara gramatikal.',
      examples: ['"fast" (/fæst/) → "fas" (/fæs/)', '"six" (/sɪks/) → "sik" (/sɪk/)', '"products" (/ˈprɑːdʌkts/) → "prodak" (/ˈprɑːdək/)']
    },
    {
      id: 'syllable3',
      title: 'Salah Membagi Suku Kata (Syllabification)',
      description: 'Karena perbedaan aturan, penutur cenderung salah membagi suku kata pada kata-kata multi-silabik, yang memengaruhi penekanan dan ritme.',
      examples: ['"agree" (/ə.ˈgriː/) diucapkan sebagai /ag.ri/']
    }
  ],
  practiceItems: [
    { 
      id: 'SK-001',
      title: 'Gugus Konsonan Awal',
      instruction: 'Latih penggabungan gugus awal: s-t-r... st-r... street. Ucapkan: strong, splash, screen.' 
    },
    { 
      id: 'SK-002',
      title: 'Gugus Konsonan Akhir',
      instruction: 'Latih gugus akhir dengan jelas. Ucapkan: fast, test, desk, ask.' 
    },
    { 
      id: 'SK-003',
      title: 'Akhiran Jamak (Plural -s)',
      instruction: 'Latihan Kritis - Akhiran Jamak: Ucapkan "books", "cats", "tasks", "dogs", "friends", "words".' 
    },
    { 
      id: 'SK-004',
      title: 'Akhiran Lampau (Past -ed)',
      instruction: 'Latihan Kritis - Akhiran Lampau: Ucapkan "helped", "looked", "watched", "loved", "cleaned", "played".' 
    },
    { 
      id: 'SK-005',
      title: 'Kejelasan Konsonan Berurutan',
      instruction: 'Rekam suara Anda saat mengatakan "He asked for six texts" dan periksa apakah semua konsonan akhir terdengar.' 
    }
  ],
  moreMaterials: {
    title: 'Materi Tambahan',
    materials: [
      {
        id: 'mat1',
        title: "Rachel's English - Consonant Clusters",
        description: 'Video yang menjelaskan cara menggabungkan konsonan dengan lancar tanpa menambahkan vokal ekstra.',
        url: 'https://www.youtube.com/watch?v=k-B5e3e-k4M',
        type: 'youtube',
        icon: '📺'
      },
      {
        id: 'mat2',
        title: 'Pronuncian - Final Consonant Clusters',
        description: 'Daftar kata dan penjelasan audio yang berfokus pada gugus konsonan di akhir kata.',
        url: 'https://pronuncian.com/pronouncing-final-consonant-clusters',
        type: 'website',
        icon: '🌐'
      },
      {
        id: 'mat3',
        title: 'Elemental English - How to Pronounce -ED Endings',
        description: 'Video tutorial yang sangat baik yang menjelaskan tiga cara pengucapan akhiran -ed (/t/, /d/, /ɪd/) yang bergantung pada bunyi sebelumnya.',
        url: 'https://www.youtube.com/watch?v=j32-82-2J6k',
        type: 'youtube',
        icon: '📺'
      }
    ]
  }
};

export default SukuKataStructureModel;
