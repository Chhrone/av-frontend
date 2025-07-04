import PracticeResultView from '../views/PracticeResultView.js';
import { appRouter } from '../../../utils/appRouter.js';


class PracticeResultPresenter {
  constructor(model) {
    this.model = model;
    this.view = new PracticeResultView();
  }

  init() {
    // Ambil hasil dari localStorage
    const resultData = JSON.parse(localStorage.getItem('practiceResult'));
    this.model.setResultData(resultData);

    // Hitung skor dan ambil deskripsi motivasi dari model
    const usConfidence = resultData && typeof resultData.us_confidence === 'number' ? resultData.us_confidence : 0;
    const score = usConfidence <= 1 ? (usConfidence * 100) : usConfidence;
    const motivationalDescription = this.model.getDescriptionByScore(score);

    // Render view dengan deskripsi motivasi
    this.view.render({ ...resultData, motivationalDescription });
    // Optional: Tambahkan animasi keluar jika ingin transisi balik
  }
}

export default PracticeResultPresenter;
