// Model untuk Irama Bahasa

const IramaBahasaModel = {
  title: 'Irama Bahasa',
  description: 'Fokus pada ritme dan alur bicara agar terdengar natural.',
  banner: {
    title: 'Irama Bahasa',
    subtitle: 'Latih ritme dan intonasi bicara',
    image: 'https://placehold.co/800x300/E2E8F0/475569?text=Irama'
  },
  material: {
    title: 'Panduan Irama Bahasa',
    content: `
      <h2>Jenis Irama</h2>
      <ul>
        <li><b>Stress-timed:</b> Irama berdasarkan tekanan (contoh: bahasa Inggris)</li>
        <li><b>Syllable-timed:</b> Irama berdasarkan suku kata (contoh: bahasa Indonesia)</li>
      </ul>
      <h3>Latihan Intonasi:</h3>
      <ol>
        <li>Ucapkan kalimat: <b>"Where are you going?"</b> dengan intonasi bertanya</li>
        <li>Bandingkan irama bahasa Inggris dan Indonesia</li>
      </ol>
    `,
    readingTime: '4 menit'
  },
  pronunciationExamples: [
    { sentence: 'Where are you going?', phonetic: null, audio: null },
    { sentence: 'I am going to school.', phonetic: null, audio: null }
  ],
  practiceItems: [
    { instruction: 'Latih intonasi bertanya dan pernyataan.' },
    { instruction: 'Coba baca kalimat dengan irama berbeda.' }
  ]
};

export default IramaBahasaModel;
