class PracticeModel {
  constructor() {
    this.practiceData = {};
    this.practiceSessions = {};
    this.resultData = null;
    this.levelDescriptions = {
      excellent: "Luar biasa! Aksen Amerika kamu sangat kuat dan jelas.",
      great: "Kerja bagus! Kamu punya aksen Amerika yang baik dengan sedikit ruang untuk perbaikan.",
      good: "Bagus! Aksen Amerika kamu berkembang dengan baik. Terus berlatih!",
      notBad: "Tidak buruk! Kamu di jalur yang benar. Latihan lebih banyak akan membantu meningkatkan aksen kamu.",
      progress: "Kamu membuat kemajuan! Fokus pada pola pengucapan dan intonasi.",
      keepPracticing: "Terus berlatih! Setiap ahli pernah menjadi pemula. Kamu akan membaik seiring waktu."
    };
    this.sessionRecordings = [];
    this.sessionScores = [];
    this.maxSession = 4;
  }

  async getPracticeText(categoryId, practiceId) {
    // Implementasi pengambilan teks latihan
    if (this.practiceData[categoryId] && this.practiceData[categoryId][practiceId]) {
      return this.practiceData[categoryId][practiceId];
    }
    // Dummy fallback
    return 'Latihan tidak ditemukan.';
  }

  savePracticeRecording(categoryId, practiceId, recording, score) {
    // Simpan rekaman dan skor ke session
    this.sessionRecordings.push(recording);
    this.sessionScores.push(score);
  }

  savePracticeSession(categoryId, practiceId, recordings, scores, avgScore) {
    // Simpan hasil sesi ke practiceSessions
    if (!this.practiceSessions[categoryId]) this.practiceSessions[categoryId] = {};
    this.practiceSessions[categoryId][practiceId] = {
      recordings,
      scores,
      avgScore
    };
  }

  setResultData(data) {
    this.resultData = data;
  }

  getResultData() {
    return this.resultData;
  }

  getDescriptionByScore(score) {
    if (score >= 90) return this.levelDescriptions.excellent;
    if (score >= 80) return this.levelDescriptions.great;
    if (score >= 70) return this.levelDescriptions.good;
    if (score >= 60) return this.levelDescriptions.notBad;
    if (score >= 40) return this.levelDescriptions.progress;
    return this.levelDescriptions.keepPracticing;
  }

  resetSession() {
    this.sessionRecordings = [];
    this.sessionScores = [];
  }
}

export default PracticeModel;
