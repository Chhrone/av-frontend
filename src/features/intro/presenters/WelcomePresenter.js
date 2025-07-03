import WelcomeView from '../views/WelcomeView.js';

class WelcomePresenter {
  constructor(model) {
    this.view = null;
    this.model = model;
  }

  init() {
    const welcomeText = this.model.getWelcomeText();
    this.view = new WelcomeView(welcomeText);
    this.render();
  }

  render() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = '';

    const viewElement = this.view.render();
    appElement.appendChild(viewElement);

    // Tambahkan event listener pada tombol mic untuk mulai recording lalu transisi ke /test
    const micBtn = viewElement.querySelector('#welcome-mic-btn');
    if (micBtn) {
      micBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          // Mulai recording sebelum transisi
          const RecordingManagerModule = await import('../../../utils/RecordingManager.js');
          const RecordingManager = RecordingManagerModule.default;
          await RecordingManager.startRecording();
        } catch (err) {
          alert('Gagal memulai rekaman. Pastikan izin mikrofon diberikan.');
          return;
        }
        // Setelah recording dimulai, lakukan transisi
        import('../../../utils/ViewTransitionHelper.js').then(({ default: viewTransitionHelper }) => {
          viewTransitionHelper.createTransition(() => {
            window.location.hash = '/test';
          });
        });
      });
    }
  }

  destroy() {
    if (this.view) {
      this.view.destroy();
      this.view = null;
    }
  }
}

export default WelcomePresenter;
