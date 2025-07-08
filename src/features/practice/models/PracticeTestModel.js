class PracticeTestModel {
  constructor() {
    this.practiceData = {};
    this.practiceSessions = {};
  }

  async getPracticeText(categoryId, practiceId) {
    // Normalisasi id kategori agar selalu pakai dash
    const normalizedCategoryId = categoryId.replace(/_/g, '-');
    try {
      const { getPracticesByCategory } = await import('../../../utils/database/aureaVoiceDB.js');
      const practices = await getPracticesByCategory(normalizedCategoryId);
      if (!practices || practices.length === 0) {
        console.error(`No practice data found in DB for ${normalizedCategoryId}`);
        return null;
      }
      let selectedPractice;
      if (practiceId) {
        selectedPractice = practices.find(p => p.id_latihan === practiceId);
      } else {
        // Jika practiceId tidak diberikan, ambil random salah satu
        selectedPractice = practices[Math.floor(Math.random() * practices.length)];
      }
      if (!selectedPractice) {
        console.error(`PracticeId ${practiceId} not found in DB for ${normalizedCategoryId}`);
        return null;
      }
      // Pilih kalimat random dari array kata_kata (atau kalimat untuk kompatibilitas lama)
      const kalimatArr = selectedPractice.kata_kata || selectedPractice.kalimat || [];
      const text = kalimatArr.length > 0 ? kalimatArr[Math.floor(Math.random() * kalimatArr.length)] : null;
      this.practiceData.last = { id: selectedPractice.id_latihan, text };
      this.lastPracticeText = text; // Simpan ke property global agar bisa diakses presenter
      return text;
    } catch (err) {
      console.error('Error fetching practice from DB:', err);
      return null;
    }
  }

  savePracticeRecording(categoryId, practiceId, recording, score) {
    if (!this.practiceData[categoryId]) this.practiceData[categoryId] = {};
    if (!this.practiceData[categoryId][practiceId]) this.practiceData[categoryId][practiceId] = [];
    this.practiceData[categoryId][practiceId].push({ recording, score });
  }

  savePracticeSession(categoryId, practiceId, recordings, scores, avgScore) {
    if (!this.practiceSessions[categoryId]) this.practiceSessions[categoryId] = {};
    if (!this.practiceSessions[categoryId][practiceId]) this.practiceSessions[categoryId][practiceId] = [];
    this.practiceSessions[categoryId][practiceId].push({
      recordings,
      scores,
      avgScore,
      timestamp: Date.now()
    });
  }
}

export default PracticeTestModel;
