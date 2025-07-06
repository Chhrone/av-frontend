// File: SkenarioDuniaNyataModel.js

class SkenarioDuniaNyataInventoryModel {
  constructor() {
    this.data = {
      id: "skenario-dunia-nyata",
      title: "Skenario Dunia Nyata",
      description:
        "Menerapkan semua pilar pelafalan dalam simulasi percakapan sehari-hari untuk mencapai komunikasi yang jelas dan alami.",
      banner: {
        title: "Skenario Dunia Nyata",
        subtitle: "Latih pelafalan terintegrasi dalam konteks percakapan nyata",
        image:
          "https://placehold.co/800x300/E2E8F0/475569?text=Skenario+Percakapan",
      },
      material: {
        title: "Pengenalan Materi",
        content: `
          <h2>Latihan Terintegrasi dalam Konteks Nyata</h2>
          <p>Bagian ini membantu Anda melatih semua aspek pelafalan—vokal, konsonan, penekanan, dan irama—dalam skenario percakapan yang realistis. Tujuannya adalah untuk berbicara secara alami dan mudah dipahami dalam situasi sehari-hari.</p>
          <ul>
            <li><strong>Simulasi Realistis:</strong> Berlatih dalam konteks seperti memesan kopi atau rapat kerja.</li>
            <li><strong>Fokus Terpandu:</strong> Setiap skenario menyoroti aspek pelafalan tertentu yang perlu diperhatikan.</li>
            <li><strong>Umpan Balik Instan:</strong> Bandingkan ucapan Anda dengan contoh untuk perbaikan langsung.</li>
          </ul>
          <p>Dengan berlatih secara teratur, Anda akan membangun kepercayaan diri untuk berkomunikasi secara efektif di berbagai situasi.</p>
        `,
        readingTime: "15 menit",
      },
      pronunciationExamples: [
        {
          word: "I'd like a medium iced latte",
          phonetic: "/aɪd laɪk ə ˈmiːdiəm ˈaɪst ˈlɑːteɪ/",
        },
        {
          word: "We've finished the initial research",
          phonetic: "/wiv ˈfɪnɪʃt ði ɪˈnɪʃəl ˈriːsɜːrtʃ/",
        },
        {
          word: "I'd like to schedule a check-up",
          phonetic: "/aɪd laɪk tə ˈskɛdʒuːl ə ˈtʃɛkʌp/",
        },
        {
          word: "What are the next steps?",
          phonetic: "/wət ɑːr ðə nɛkst stɛps/",
        },
      ],
      practiceItems: [
        {
          id: "RL-001",
          title: "Perkenalan Formal dan Informal",
          instruction:
            "Latih memperkenalkan diri dalam situasi formal dan informal.",
        },
        {
          id: "RL-002",
          title: "Memesan Makanan di Restoran",
          instruction:
            "Rekam suara Anda saat memesan makanan di restoran imajiner.",
        },
        {
          id: "RL-003",
          title: "Simulasi Rapat Tim",
          instruction:
            "Praktikkan dialog rapat tim dengan fokus pada intonasi profesional.",
        },
        {
          id: "RL-004",
          title: "Membuat Janji via Telepon",
          instruction:
            "Coba buat janji temu melalui telepon dengan suara yang jelas dan tenang.",
        },
        {
          id: "RL-005",
          title: "Percakapan di Bandara",
          instruction:
            "Latih skenario check-in di bandara: menyapa petugas, menunjukkan tiket, dan bertanya soal gerbang keberangkatan.",
        },
      ],
      commonMistakes: [
        {
          id: "mistake1",
          title: "Intonasi Pertanyaan yang Datar",
          description:
            'Tidak menggunakan intonasi naik pada pertanyaan "Yes/No" dapat membuatnya terdengar seperti pernyataan, bukan pertanyaan.',
          examples: [
            "Salah: 'You are a student.' (turun) vs Benar: 'You are a student?' (naik)",
          ],
        },
        {
          id: "mistake2",
          title: "Ucapan Terpotong-potong",
          description:
            "Gagal menghubungkan kata-kata (linking) membuat percakapan terdengar tidak alami dan kaku.",
          examples: [
            "Salah: 'Can. I. have. it?' vs Benar: 'Can I have it?' (terdengar seperti /kənaɪhævɪt/)",
          ],
        },
      ],
      moreMaterials: {
        title: "Materi Tambahan untuk Latihan Percakapan",
        materials: [
          {
            id: "mat1",
            title: "ESL Fast - Conversation Questions",
            description:
              "Kumpulan pertanyaan percakapan berdasarkan topik untuk latihan mandiri.",
            url: "https://www.eslfast.com/robot/",
            type: "website",
            icon: "🌐",
          },
          {
            id: "mat2",
            title: "Rachel's English - Real English Conversations",
            description:
              "Analisis percakapan nyata yang membedah pelafalan, linking, dan intonasi penutur asli American English.",
            url: "https://www.youtube.com/c/rachelsenglish",
            type: "youtube",
            icon: "📺",
          },
          {
            id: "mat4",
            title:
              "Voice of America - Learn American English with VOA Learning English",
            description:
              "Podcast dan video untuk belajar bahasa Inggris Amerika dengan berita, fitur, dan pelajaran yang disederhanakan.",
            url: "https://learningenglish.voanews.com/",
            type: "website",
            icon: "🎧",
          },
          {
            id: "mat5",
            title:
              "Learn 50 popular English Idioms in the United States - English With Kayla",
            description:
              "Video yang mengajarkan 50 idiom dan frasa umum yang digunakan di Amerika Serikat dengan penjelasan dan contoh.",
            url: "https://www.youtube.com/watch?v=vbDqczAXywI",
            type: "youtube",
            icon: "🗣️",
          },
          {
            id: "mat6",
            title:
              "American English Pronunciation and Accent Training - Go Natural English (Playlist)",
            description:
              "Daftar putar video yang membantu Anda meningkatkan pengucapan dan aksen American English, membahas suara individu dan pola bicara.",
            url: "https://www.youtube.com/playlist?list=PLDmyXXns94k3WgnwA1xdNSJKNtQGS8eko",
            type: "youtube",
            icon: "💡",
          },
        ],
      },
    };
  }

  getData() {
    return this.data;
  }
}

export default SkenarioDuniaNyataInventoryModel;
