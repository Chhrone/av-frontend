// Service untuk transisi tampilan dan binding event pada view
class PracticeViewService {
  renderTest(testView, resultView, practiceText) {
    testView.render(practiceText);
    const testEl = testView.getElement();
    const resultEl = resultView.getElement();
    if (testEl) testEl.style.display = '';
    if (resultEl) resultEl.style.display = 'none';
  }

  animateViewTransition(fromView, toView, resultData) {
    const fromEl = fromView.getElement();
    const toEl = toView.getElement();
    if (resultData) toView.render(resultData);
    if (fromEl) fromEl.style.display = 'none';
    if (toEl) toEl.style.display = '';
  }

  bindButton(button, handler) {
    if (button) button.addEventListener('click', handler);
  }

  unbindButton(button, handler) {
    if (button) button.removeEventListener('click', handler);
  }
}

export default PracticeViewService;
