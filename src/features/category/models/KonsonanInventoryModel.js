// Model untuk Inventaris Konsonan

const KonsonanInventoryModel = {
  title: 'Inventaris Konsonan',
  description: 'Kenali dan latih pengucapan konsonan yang benar.',
  banner: {
    title: 'Inventaris Konsonan',
    subtitle: 'Latih semua bunyi konsonan',
    image: 'https://placehold.co/800x300/E2E8F0/475569?text=Konsonan'
  },
  material: {
    title: 'Panduan Bunyi Konsonan',
    content: `
      <h2>Jenis-jenis Konsonan</h2>
      <ul>
        <li><b>Letup (Plosive):</b> /p/, /b/, /t/, /d/</li>
        <li><b>Gesek (Fricative):</b> /f/, /v/, /s/, /z/, /ʃ/, /ʒ/</li>
        <li><b>Sengau (Nasal):</b> /m/, /n/, /ŋ/</li>
        <li><b>Affricate:</b> /tʃ/, /dʒ/</li>
        <li><b>Contoh:</b> "pat", "bat", "fan", "van", "sing"</li>
      </ul>
      <h3>Latihan:</h3>
      <ol>
        <li>Ucapkan kata: <b>pat, bat, fat, vat</b></li>
        <li>Latih membedakan bunyi konsonan bersuara dan tidak bersuara</li>
      </ol>
    `,
    readingTime: '5 menit'
  },
  pronunciationExamples: [
    { word: 'pat', phonetic: '/pæt/', audio: null },
    { word: 'bat', phonetic: '/bæt/', audio: null },
    { word: 'fan', phonetic: '/fæn/', audio: null }
  ],
  practiceItems: [
    { instruction: 'Ucapkan kata "pat" dan "bat" secara bergantian.' },
    { instruction: 'Latih membedakan konsonan letup dan gesek.' }
  ]
};

export default KonsonanInventoryModel;
