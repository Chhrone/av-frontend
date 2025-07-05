// Service untuk pengolahan hasil, skor, dan deskripsi motivasi
class PracticeResultService {
  constructor(resultModel) {
    this.resultModel = resultModel;
  }

  getScoreFromResult(result) {
    if (!result || typeof result.us_confidence !== 'number') return 0;
    return result.us_confidence <= 1 ? (result.us_confidence * 100) : result.us_confidence;
  }

  getMotivationalDescription(score) {
    return this.resultModel.getDescriptionByScore(score);
  }

  getAverageScore(scores) {
    if (!scores.length) return 0;
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }
}

export default PracticeResultService;
