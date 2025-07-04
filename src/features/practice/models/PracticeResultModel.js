class PracticeResultModel {
  constructor() {
    this.resultData = null;
    this.levelDescriptions = {
      excellent: "Luar biasa! Aksen Amerika kamu sangat kuat dan jelas.",
      great: "Kerja bagus! Kamu punya aksen Amerika yang baik dengan sedikit ruang untuk perbaikan.",
      good: "Bagus! Aksen Amerika kamu berkembang dengan baik. Terus berlatih!",
      notBad: "Tidak buruk! Kamu di jalur yang benar. Latihan lebih banyak akan membantu meningkatkan aksen kamu.",
      progress: "Kamu membuat kemajuan! Fokus pada pola pengucapan dan intonasi.",
      keepPracticing: "Terus berlatih! Setiap ahli pernah menjadi pemula. Kamu akan membaik seiring waktu."
    };
  }

  setResultData(data) {
    this.resultData = data;
  }

  getResultData() {
    return this.resultData;
  }

  /**
   * Mendapatkan deskripsi motivasi berdasarkan skor
   * @param {number} score - skor dalam persen (0-100)
   * @returns {string}
   */
  getDescriptionByScore(score) {
    if (score >= 90) return this.levelDescriptions.excellent;
    if (score >= 80) return this.levelDescriptions.great;
    if (score >= 70) return this.levelDescriptions.good;
    if (score >= 60) return this.levelDescriptions.notBad;
    if (score >= 40) return this.levelDescriptions.progress;
    return this.levelDescriptions.keepPracticing;
  }
}

export default PracticeResultModel;
