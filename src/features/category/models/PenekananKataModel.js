// Model untuk Penekanan Kata

const PenekananKataModel = {
  title: 'Penekanan Kata',
  description: 'Latih penempatan tekanan pada suku kata yang tepat dalam kata.',
  banner: {
    title: 'Penekanan Kata',
    subtitle: 'Latih penempatan tekanan pada kata',
    image: 'https://placehold.co/800x300/E2E8F0/475569?text=Penekanan'
  },
  material: {
    title: 'Panduan Penekanan Kata',
    content: `
      <h2>Aturan Penekanan</h2>
      <ul>
        <li>Kata dua suku kata: biasanya tekanan di suku kata pertama ("TAble", "WINdow")</li>
        <li>Kata dengan akhiran tertentu: tekanan bisa berubah ("enJOYment", "emPLOYee")</li>
        <li>Penekanan bisa mengubah arti: "PREsent" (noun) vs "preSENT" (verb)</li>
      </ul>
      <h3>Latihan:</h3>
      <ol>
        <li>Ucapkan kata: <b>TAble, WINdow, enJOYment</b></li>
        <li>Latih membedakan penekanan pada kata yang sama</li>
      </ol>
    `,
    readingTime: '4 menit'
  },
  pronunciationExamples: [
    { word: 'table', phonetic: '/ˈteɪ.bəl/', audio: null },
    { word: 'enjoyment', phonetic: '/ɪnˈdʒɔɪ.mənt/', audio: null },
    { word: 'present', phonetic: '/ˈprez.ənt/ (noun), /prɪˈzent/ (verb)', audio: null }
  ],
  practiceItems: [
    { instruction: 'Latih penekanan pada kata "present" sebagai noun dan verb.' },
    { instruction: 'Ucapkan kata dua suku kata dengan tekanan di awal.' }
  ]
};

export default PenekananKataModel;
