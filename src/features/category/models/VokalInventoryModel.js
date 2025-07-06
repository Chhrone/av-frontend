// File: VokalInventoryModel.js (contoh nama file, sesuaikan dengan kategori lain)

class VokalInventoryModel {
  constructor() {
    this.data = {
      id: "inventaris-vokal",
      title: "Inventaris Vokal",
      description:
        "Pelajari pelafalan vokal dalam bahasa Inggris secara lengkap.",
      banner: {
        title: "Inventaris Vokal",
        subtitle: "Kenali dan latih pengucapan vokal pendek dan panjang",
        image:
          "https://placehold.co/800x300/E2E8F0/475569?text=Inventaris+Vokal",
      },
      material: {
        title: "Pengenalan Vokal",
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
        readingTime: "15 menit",
      },
      pronunciationExamples: [
        { word: "bit", phonetic: "/bɪt/" },
        { word: "beat", phonetic: "/biːt/" },
        { word: "boat", phonetic: "/boʊt/" },
        { word: "book", phonetic: "/bʊk/" },
        { word: "bird", phonetic: "/bɜːrd/" },
      ],
      practiceItems: [
        {
          id: "VI-001",
          title: "Perbedaan /ɪ/ dan /iː/",
          instruction: "Ucapkan perbedaan antara /ɪ/ dan /iː/: bit vs beat",
        },
        {
          id: "VI-002",
          title: "Vokal Panjang /ɑː/",
          instruction: "Latih vokal panjang /ɑː/: car, star, far",
        },
        {
          id: "VI-003",
          title: "Diphthong /aɪ/",
          instruction: "Ucapkan diphthong /aɪ/: my, time, light",
        },
        {
          id: "VI-004",
          title: "Perbandingan /ʊ/ dan /uː/",
          instruction: "Bandingkan /ʊ/ dan /uː/: book vs blue",
        },
        {
          id: "VI-005",
          title: "Vokal Tengah /ɜː/",
          instruction: "Latih vokal tengah /ɜː/: bird, turn, learn",
        },
      ],
      commonMistakes: [
        {
          id: "mistake1",
          title: "Menyamakan vokal pendek dan panjang",
          description:
            "Sering kali pembelajar memperlakukan vokal pendek dan panjang sama.",
          examples: [
            "bit (/bɪt/) vs beat (/biːt/)",
            "ship (/ʃɪp/) vs sheep (/ʃiːp/)",
          ],
        },
        {
          id: "mistake2",
          title: "Tidak mengenal diphthong",
          description:
            "Mengabaikan perubahan suara pada diphthong seperti /aɪ/ atau /oʊ/.",
          examples: ["time (/taɪm/) bukan /tɛm/", "no (/noʊ/) bukan /nə/"],
        },
      ],
      moreMaterials: {
        title: "Materi Tambahan",
        materials: [
          {
            id: "mat1",
            title:
              "Rachel's English - DON'T Fall For These Diphthongs and Vowel Mistakes | Pronunciation Compilation",
            description:
              "Video kompilasi yang membahas penggunaan vokal dan diftong, kesalahan umum, serta cara mengucapkannya seperti penutur asli American English.",
            url: "https://www.youtube.com/watch?v=jaRcbpN_KlM",
            type: "youtube",
            icon: "📺",
          },
          {
            id: "mat2",
            title:
              "Rachel's English - American English Vowel Sounds (Playlist)",
            description:
              "Daftar putar lengkap dari Rachel's English yang mencakup semua bunyi vokal American English, dengan video terpisah untuk setiap bunyi.",
            url: "https://www.youtube.com/playlist?list=PLrqHrGoMJdTQ__1eH4a5EW43NQvDuRjnr",
            type: "youtube",
            icon: "📺",
          },
          {
            id: "mat3",
            title: "The Color Vowel Chart | American English",
            description:
              "Alat pengucapan yang kuat menggunakan warna dan kata kunci untuk mewakili bunyi vokal bahasa Inggris tanpa simbol fonetik.",
            url: "https://americanenglish.state.gov/resources/color-vowel-chart",
            type: "website",
            icon: "🌐",
          },
          {
            id: "mat4",
            title:
              "American English Vowels Practice in 10 Minutes - Fluent American",
            description:
              "Latihan singkat 10 menit untuk meningkatkan bunyi vokal American English Anda.",
            url: "https://www.youtube.com/watch?v=0SK89tQGVCw",
            type: "youtube",
            icon: "📺",
          },
          {
            id: "mat5",
            title:
              "North American English Vowel Sounds - Clear English Corner (Playlist)",
            description:
              "Daftar putar yang berfokus pada bunyi vokal dalam American English dan cara mengucapkannya dengan benar, termasuk membedakan bunyi yang serupa.",
            url: "https://www.youtube.com/playlist?list=PLpEsvqK-KhCtx2yI7fnNTflrs-LBnBZsk",
            type: "youtube",
            icon: "📺",
          },
          {
            id: "mat6",
            title: "Interactive American IPA chart - Sounds American",
            description:
              "Bagan IPA interaktif dengan suara dan contoh untuk semua bunyi American English (General American), termasuk vokal dan diftong.",
            url: "https://americanipachart.com/",
            type: "website",
            icon: "🌐",
          },
        ],
      },
    };
  }

  getData() {
    return this.data;
  }
}

export default VokalInventoryModel;
