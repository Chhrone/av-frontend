class IntroModel {
  constructor() {
    this.currentPage = 'welcome';
    this.isRecording = false;
    // Array of test texts for random selection
    this.testTexts = [
      'I went to the store this afternoon to buy groceries.',
      'It was really busy, and the line was long.',
      'I still found everything I needed.',
      'The line moved faster than I expected.',
      'I felt glad to get it all done and head home.',
      'While waiting for the bus, I saw a cat chasing a butterfly.',
      'You can try restarting it, but I\'m not sure it\'ll work.',
      'Honestly, I didn\'t expect them to arrive so early.',
      'She said she would call, but I haven\'t heard from her yet.'
    ];

    // UI Text Content (Indonesian)
    this.welcomeText = 'Mau tes seberapa bagus kemampuan berbicara bahasa Inggris kamu?';
    this.tryAgainButtonText = 'Coba Lagi';

    // Confidence descriptions (Indonesian)
    this.confidenceDescriptions = {
      excellent: "Luar biasa! Aksen Amerika kamu sangat kuat dan jelas.",
      great: "Kerja bagus! Kamu punya aksen Amerika yang baik dengan sedikit ruang untuk perbaikan.",
      good: "Bagus! Aksen Amerika kamu berkembang dengan baik. Terus berlatih!",
      notBad: "Tidak buruk! Kamu di jalur yang benar. Latihan lebih banyak akan membantu meningkatkan aksen kamu.",
      progress: "Kamu membuat kemajuan! Fokus pada pola pengucapan dan intonasi.",
      keepPracticing: "Terus berlatih! Setiap ahli pernah menjadi pemula. Kamu akan membaik seiring waktu."
    };
  }

  setCurrentPage(page) {
    this.currentPage = page;
  }

  getCurrentPage() {
    return this.currentPage;
  }

  setRecording(status) {
    this.isRecording = status;
  }

  isCurrentlyRecording() {
    return this.isRecording;
  }

  getTestText() {
    // Return a random test text from the array
    const randomIndex = Math.floor(Math.random() * this.testTexts.length);
    return this.testTexts[randomIndex];
  }

  setLastResult(result) {
    this.lastResult = result;
  }

  getLastResult() {
    return this.lastResult;
  }

  getWelcomeText() {
    return this.welcomeText;
  }

  getTryAgainButtonText() {
    return this.tryAgainButtonText;
  }

  getConfidenceDescription(confidence) {
    if (confidence >= 90) {
      return this.confidenceDescriptions.excellent;
    } else if (confidence >= 80) {
      return this.confidenceDescriptions.great;
    } else if (confidence >= 70) {
      return this.confidenceDescriptions.good;
    } else if (confidence >= 60) {
      return this.confidenceDescriptions.notBad;
    } else if (confidence >= 50) {
      return this.confidenceDescriptions.progress;
    } else {
      return this.confidenceDescriptions.keepPracticing;
    }
  }

  formatConfidenceText(confidence) {
    return `Tingkat kepercayaan aksen Amerika kamu: ${confidence.toFixed(1)}%`;
  }
}

export default IntroModel;
