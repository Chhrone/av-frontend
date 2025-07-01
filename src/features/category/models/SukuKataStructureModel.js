// Model untuk Struktur Suku Kata

const SukuKataStructureModel = {
  title: 'Struktur Suku Kata',
  description: 'Pahami pola dan struktur suku kata yang umum digunakan.',
  banner: {
    title: 'Struktur Suku Kata',
    subtitle: 'Pahami pola umum pembentukan kata',
    image: 'https://placehold.co/800x300/E2E8F0/475569?text=Suku+Kata'
  },
  material: {
    title: 'Panduan Struktur Suku Kata',
    content: `
      <h2>Pola Suku Kata</h2>
      <ul>
        <li><b>CV:</b> "me", "no", "pa"</li>
        <li><b>CVC:</b> "cat", "dog", "sun"</li>
        <li><b>CCV:</b> "play", "tree", "sky"</li>
        <li><b>CCVC:</b> "plan", "trap", "skip"</li>
      </ul>
      <h3>Latihan:</h3>
      <ol>
        <li>Identifikasi pola suku kata pada kata: <b>cat, plan, tree</b></li>
        <li>Ucapkan kata dengan pola berbeda secara berurutan</li>
      </ol>
    `,
    readingTime: '4 menit'
  },
  pronunciationExamples: [
    { word: 'cat', phonetic: '/kæt/', audio: null },
    { word: 'plan', phonetic: '/plæn/', audio: null },
    { word: 'tree', phonetic: '/triː/', audio: null }
  ],
  practiceItems: [
    { instruction: 'Tebak pola suku kata pada kata "skip".' },
    { instruction: 'Latih mengucapkan kata dengan pola CCV dan CVC.' }
  ]
};

export default SukuKataStructureModel;
