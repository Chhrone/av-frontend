class IntroModel {
  constructor() {
    this.currentPage = 'welcome';
    this.isRecording = false;
    // Array of test texts for random selection (12-second reading time)
    this.testTexts = [
      'I went to the store this afternoon to buy groceries for the week. It was really busy, and the line was surprisingly long, but I still found everything I needed. The cashier was friendly and helped me pack my bags efficiently. The line moved faster than I expected, and I felt glad to get it all done.',

      'While waiting for the bus yesterday, I saw a cat chasing a butterfly through the park. The weather was perfect for being outside, with a gentle breeze and warm sunshine. Many people were walking their dogs, jogging, or simply enjoying the beautiful day.',

      'You can try restarting your computer, but I\'m not sure it will work this time. The problem seems more serious than usual, and we might need to call technical support. Honestly, I didn\'t expect the system to crash so frequently.',

      'She said she would call me back within an hour, but I haven\'t heard from her yet. I\'m starting to worry that something might have happened, or perhaps she simply forgot about our conversation. I know she\'s been incredibly busy with work lately, managing multiple projects and dealing with tight deadlines.',

      'The new restaurant downtown has been getting excellent reviews from food critics and customers alike. Their menu features fresh, locally sourced ingredients and creative dishes that blend traditional flavors with modern cooking techniques. I made a reservation for next Friday evening, and I\'m really looking forward to trying their signature pasta dish.',

      'Learning a new language requires patience, practice, and dedication over many months or even years. It\'s important to set realistic goals and celebrate small victories along the way. Reading books, watching movies, and having conversations with native speakers can significantly improve your fluency.',

      'The weather forecast predicts rain for the entire weekend, which means our outdoor picnic plans will need to be changed. We could move the gathering to someone\'s house or perhaps visit the new indoor entertainment center that just opened last month.',

      'Technology has transformed the way we communicate, work, and live our daily lives in remarkable ways. Social media platforms connect us with friends and family around the world instantly. Video conferencing allows us to attend meetings from anywhere with an internet connection.'
    ];

    // UI Text Content (Indonesian)
    this.welcomeText = 'Mau tes seberapa bagus kemampuan berbicara bahasa Inggris kamu?';
    this.tryAgainButtonText = 'Mau jadi lebih jago?';

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
    return `Skor aksen Amerika kamu: ${confidence.toFixed(1)}%`;
  }
}

export default IntroModel;
