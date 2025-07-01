// Model untuk Skenario Dunia Nyata

const SkenarioDuniaNyataModel = {
  title: 'Skenario dunia nyata',
  description: 'Simulasi percakapan dan latihan dalam konteks sehari-hari.',
  banner: {
    title: 'Skenario dunia nyata',
    subtitle: 'Latihan percakapan sehari-hari',
    image: 'https://placehold.co/800x300/E2E8F0/475569?text=Skenario'
  },
  material: {
    title: 'Panduan Skenario Dunia Nyata',
    content: `
      <h2>Contoh Skenario</h2>
      <ul>
        <li><b>Di toko:</b> "How much is this?"</li>
        <li><b>Di sekolah:</b> "Can I borrow your pen?"</li>
        <li><b>Di tempat kerja:</b> "Could you help me with this report?"</li>
      </ul>
      <h3>Latihan Roleplay:</h3>
      <ol>
        <li>Bermain peran sebagai pembeli dan kasir</li>
        <li>Simulasikan percakapan di sekolah</li>
      </ol>
    `,
    readingTime: '5 menit'
  },
  pronunciationExamples: [
    { sentence: 'How much is this?', phonetic: null, audio: null },
    { sentence: 'Can I borrow your pen?', phonetic: null, audio: null }
  ],
  practiceItems: [
    { instruction: 'Latih percakapan di toko.' },
    { instruction: 'Simulasikan roleplay di sekolah.' }
  ]
};

export default SkenarioDuniaNyataModel;
