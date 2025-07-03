// File: VokalInventoryModel.js (contoh nama file, sesuaikan dengan kategori lain)

class VokalInventoryModel {
  constructor() {
    this.data = {
      id: 'vokal',
      title: 'Inventaris Vokal',
      description: 'Pelajari pelafalan vokal dalam bahasa Inggris secara lengkap.',
      banner: {
        title: 'Inventaris Vokal',
        subtitle: 'Kenali dan latih pengucapan vokal pendek dan panjang',
        image: 'https://placehold.co/800x300/E2E8F0/475569?text=Inventaris+Vokal'
      },
      material: {
        title: 'Pengenalan Vokal',
        content: `
          <h2>Inventaris Vokal Bahasa Inggris</h2>
          <p>Bahasa Inggris memiliki banyak jenis vokal, termasuk vokal pendek, panjang, dan diphthong (gabungan dua vokal).</p>
          <ul>
            <li>Vokal Pendek: /æ/, /ɛ/, /ɪ/, /ɒ/, /ʌ/, /ʊ/</li>
            <li>Vokal Panjang: /iː/, /ɑː/, /ɔː/, /uː/, /ɜː/</li>
            <li>Diphthong: /aɪ/, /eɪ/, /ɔɪ/, /aʊ/, /oʊ/, dll.</li>
          </ul>
          <p>Latih masing-masing bunyi dengan contoh kata di bawah ini.</p>
        `,
        readingTime: '15 menit'
      },
      pronunciationExamples: [
        { word: 'bit', phonetic: '/bɪt/' },
        { word: 'beat', phonetic: '/biːt/' },
        { word: 'boat', phonetic: '/boʊt/' },
        { word: 'book', phonetic: '/bʊk/' },
        { word: 'bird', phonetic: '/bɜːrd/' }
      ],
      practiceItems: [
        { 
          id: 'VI-001',
          title: 'Perbedaan /ɪ/ dan /iː/',
          instruction: 'Ucapkan perbedaan antara /ɪ/ dan /iː/: bit vs beat' 
        },
        { 
          id: 'VI-002',
          title: 'Vokal Panjang /ɑː/',
          instruction: 'Latih vokal panjang /ɑː/: car, star, far' 
        },
        { 
          id: 'VI-003',
          title: 'Diphthong /aɪ/',
          instruction: 'Ucapkan diphthong /aɪ/: my, time, light' 
        },
        { 
          id: 'VI-004',
          title: 'Perbandingan /ʊ/ dan /uː/',
          instruction: 'Bandingkan /ʊ/ dan /uː/: book vs blue' 
        },
        { 
          id: 'VI-005',
          title: 'Vokal Tengah /ɜː/',
          instruction: 'Latih vokal tengah /ɜː/: bird, turn, learn' 
        }
      ],      
      commonMistakes: [
        {
          id: 'mistake1',
          title: 'Menyamakan vokal pendek dan panjang',
          description: 'Sering kali pembelajar memperlakukan vokal pendek dan panjang sama.',
          examples: ['bit (/bɪt/) vs beat (/biːt/)', 'ship (/ʃɪp/) vs sheep (/ʃiːp/)']
        },
        {
          id: 'mistake2',
          title: 'Tidak mengenal diphthong',
          description: 'Mengabaikan perubahan suara pada diphthong seperti /aɪ/ atau /oʊ/.',
          examples: ['time (/taɪm/) bukan /tɛm/', 'no (/noʊ/) bukan /nə/']
        }
      ],
      moreMaterials: {
        title: 'Materi Tambahan',
        materials: [
          {
            id: 'mat1',
            title: 'BBC Learning English - Sounds of English',
            description: 'Video panduan lengkap tentang semua bunyi dalam bahasa Inggris.',
            url: ' https://www.bbc.co.uk/learningenglish/english/features/pronunciation ',
            type: 'website',
            icon: '🌐'
          },
          {
            id: 'mat2',
            title: "Rachel's English - Vowel Sounds",
            description: 'Tutorial pelafalan vokal dari Rachel dengan penjelasan visual.',
            url: 'https://www.youtube.com/user/rachelsenglish ',
            type: 'youtube',
            icon: '📺'
          }
        ]
      }
    };
  }

  getData() {
    return this.data;
  }
}

export default VokalInventoryModel;