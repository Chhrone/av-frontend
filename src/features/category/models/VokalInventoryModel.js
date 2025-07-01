// Model untuk Inventaris Vokal

const VokalInventoryModel = {
  title: 'Inventaris Vokal',
  description: 'Pelajari dan kuasai semua bunyi vokal dalam bahasa target.',
  banner: {
    title: 'Inventaris Vokal',
    subtitle: 'Kenali dan latih semua bunyi vokal',
    image: 'https://placehold.co/800x300/E2E8F0/475569?text=Vokal'
  },
  material: {
    title: 'Panduan Bunyi Vokal',
    content: `
      <h2>Jenis-jenis Vokal</h2>
      <ul>
        <li><b>Vokal depan:</b> /i/, /e/ (contoh: "bit", "bed")</li>
        <li><b>Vokal tengah:</b> /ə/, /ʌ/ (contoh: "sofa", "cup")</li>
        <li><b>Vokal belakang:</b> /u/, /o/ (contoh: "book", "dog")</li>
        <li><b>Vokal panjang:</b> /iː/, /uː/ (contoh: "see", "blue")</li>
        <li><b>Vokal pendek:</b> /ɪ/, /ʊ/ (contoh: "sit", "put")</li>
      </ul>
      <h3>Latihan:</h3>
      <ol>
        <li>Ucapkan kata: <b>cat, cut, cot, coat, cute</b></li>
        <li>Bandingkan bunyi vokal pada kata-kata di atas</li>
      </ol>
    `,
    readingTime: '5 menit'
  },
  pronunciationExamples: [
    { word: 'cat', phonetic: '/kæt/', audio: null },
    { word: 'seat', phonetic: '/siːt/', audio: null },
    { word: 'book', phonetic: '/bʊk/', audio: null }
  ],
  practiceItems: [
    { instruction: 'Ucapkan kata "cat" dan "cut" secara bergantian.' },
    { instruction: 'Latih membedakan vokal panjang dan pendek.' }
  ]
};

export default VokalInventoryModel;
