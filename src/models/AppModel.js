class AppModel {
  constructor() {
    this.currentPage = 'welcome';
    this.isRecording = false;
    this.testText = 'I went to the store to buy some groceries. The store was busy, and there was a long line at the checkout. I still managed to get everything I needed before going home.';
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
    return this.testText;
  }
}

export default AppModel;
