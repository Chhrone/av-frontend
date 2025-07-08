import '../styles/practice-index.css';


class PracticeResultView {
  getContinueButton() {
    return document.getElementById('practice-continue-btn');
  }
  getElement() {
    return this.resultContainer;
  }
  constructor() {
    // Buat atau ambil practice-container utama
    this.practiceContainer = document.getElementById('practice-container');
    if (!this.practiceContainer) {
      this.practiceContainer = document.createElement('div');
      this.practiceContainer.id = 'practice-container';
      this.practiceContainer.className = 'practice-container';
      document.getElementById('app').appendChild(this.practiceContainer);
    }
    // Selalu gunakan container khusus untuk result
    this.resultContainer = document.getElementById('practice-result-container');
    if (!this.resultContainer) {
      this.resultContainer = document.createElement('div');
      this.resultContainer.id = 'practice-result-container';
      this.resultContainer.className = 'practice-result-ctn';
      this.resultContainer.style.display = 'none';
      this.practiceContainer.appendChild(this.resultContainer);
    } else if (!this.resultContainer.parentElement || this.resultContainer.parentElement !== this.practiceContainer) {
      this.practiceContainer.appendChild(this.resultContainer);
    }
  }


  // Tidak perlu getLevelDescription lagi, deskripsi motivasi sudah diberikan dari presenter

  render(viewData) {
    // viewData sudah berisi score, motivationalDescription, averageInfo, mainText, buttonHtml dari Presenter
    let mainText = '';
    let buttonHtml = '';
    let transcriptHtml = '';
    let compareBtnHtml = '';
    let compareAreaHtml = '';
    if (viewData && viewData.averageInfo) {
      mainText = `<div class="practice-result-average">${viewData.averageInfo}</div>`;
      buttonHtml = `<button id="practice-return-button" class="practice-return-btn">Kembali ke Kategori</button>`;
      if (typeof viewData.score === 'number') {
        console.log(`[LOG] Hasil rata-rata 4 sesi: ${viewData.score.toFixed(2)}`);
      }
      // Tampilkan transcript jika ada pada hasil sesi ke-4
      if (viewData.transcript) {
        transcriptHtml = `<div class="practice-result-transcript"><b>Hasil Speech-to-Text:</b><br><span>${viewData.transcript}</span></div>`;
      }
      // Tampilkan tombol perbandingan jika ada transcript dan practiceText
      if (viewData.transcript && viewData.practiceText) {
        compareBtnHtml = `<button id="practice-compare-btn" class="practice-compare-btn">Lihat Perbandingan Teks</button>`;
        compareAreaHtml = `
          <div id="practice-compare-area" class="practice-compare-area" style="display:none;">
            <div class="practice-compare-block">
              <div class="practice-compare-label">Teks Asli:</div>
              <div class="practice-compare-text practice-compare-original">${viewData.practiceText}</div>
            </div>
            <div class="practice-compare-block">
              <div class="practice-compare-label">Hasil Speech-to-Text:</div>
              <div class="practice-compare-text practice-compare-transcript">${viewData.transcript}</div>
            </div>
          </div>
        `;
      }
    } else {
      mainText = `<div class="practice-result-text">Skor aksen Amerika kamu: ${typeof viewData.score === 'number' ? viewData.score.toFixed(1) : '-'}%</div>`;
      buttonHtml = `<button id="practice-continue-btn" class="practice-continue-btn">Lanjut ke Sesi Rekaman Berikutnya</button>`;
      if (viewData.transcript) {
        transcriptHtml = `<div class="practice-result-transcript"><b>Hasil Speech-to-Text:</b><br><span>${viewData.transcript}</span></div>`;
      }
      if (viewData.transcript && viewData.practiceText) {
        compareBtnHtml = `<button id="practice-compare-btn" class="practice-compare-btn">Lihat Perbandingan Teks</button>`;
        compareAreaHtml = `
          <div id="practice-compare-area" class="practice-compare-area" style="display:none;">
            <div class="practice-compare-block">
              <div class="practice-compare-label">Teks Asli:</div>
              <div class="practice-compare-text practice-compare-original">${viewData.practiceText}</div>
            </div>
            <div class="practice-compare-block">
              <div class="practice-compare-label">Hasil Speech-to-Text:</div>
              <div class="practice-compare-text practice-compare-transcript">${viewData.transcript}</div>
            </div>
          </div>
        `;
      }
    }

    this.resultContainer.innerHTML = `
      <div class="practice-result-content">
        ${mainText}
        <div class="practice-result-description">${viewData.motivationalDescription || ''}</div>
        ${transcriptHtml}
        ${compareBtnHtml}
        ${compareAreaHtml}
        ${buttonHtml}
      </div>
    `;
    this.resultContainer.style.display = '';

    // Event handler untuk tombol perbandingan
    const compareBtn = document.getElementById('practice-compare-btn');
    const compareArea = document.getElementById('practice-compare-area');
    if (compareBtn && compareArea) {
      compareBtn.addEventListener('click', () => {
        if (compareArea.style.display === 'none') {
          compareArea.style.display = '';
          compareBtn.textContent = 'Sembunyikan Perbandingan';
        } else {
          compareArea.style.display = 'none';
          compareBtn.textContent = 'Lihat Perbandingan Teks';
        }
      });
    }
  }

  getReturnButton() {
    return document.getElementById('practice-return-button');
  }
}

export default PracticeResultView;
