class ResultView {
  constructor(resultData = null, model = null) {
    this.container = null;
    this.resultData = resultData || { us_confidence: 0 };
    this.model = model;
  }

  render() {
    this.container = document.createElement('div');
    this.container.className = 'container';

    const confidenceText = document.createElement('h1');
    confidenceText.textContent = this.model ?
      this.model.formatConfidenceText(this.resultData.us_confidence) :
      `Your US accent confidence: ${this.resultData.us_confidence.toFixed(1)}%`;
    confidenceText.className = 'result-text';

    const descriptionText = document.createElement('p');
    descriptionText.textContent = this.model ?
      this.model.getConfidenceDescription(this.resultData.us_confidence) :
      this.getConfidenceDescription(this.resultData.us_confidence);
    descriptionText.className = 'result-description';

    const tryAgainButton = document.createElement('button');
    tryAgainButton.textContent = this.model ?
      this.model.getTryAgainButtonText() :
      'Try Again';
    tryAgainButton.className = 'try-again-button';

    tryAgainButton.addEventListener('click', () => {
      window.location.hash = '#/';
    });

    this.container.appendChild(confidenceText);
    this.container.appendChild(descriptionText);
    this.container.appendChild(tryAgainButton);

    // Show elements immediately without transitions
    confidenceText.classList.add('visible');
    descriptionText.classList.add('visible');
    tryAgainButton.classList.add('visible');

    return this.container;
  }

  getConfidenceDescription(confidence) {
    if (confidence >= 90) {
      return "Excellent! Your American accent is very strong and clear.";
    } else if (confidence >= 80) {
      return "Great job! You have a good American accent with room for minor improvements.";
    } else if (confidence >= 70) {
      return "Good work! Your American accent is developing well. Keep practicing!";
    } else if (confidence >= 60) {
      return "Not bad! You're on the right track. More practice will help improve your accent.";
    } else if (confidence >= 50) {
      return "You're making progress! Focus on pronunciation and intonation patterns.";
    } else {
      return "Keep practicing! Every expert was once a beginner. You'll improve with time.";
    }
  }

  updateResult(newResultData) {
    this.resultData = newResultData;
    if (this.container) {
      const confidenceText = this.container.querySelector('.result-text');
      const descriptionText = this.container.querySelector('.result-description');

      if (confidenceText) {
        confidenceText.textContent = this.model ?
          this.model.formatConfidenceText(this.resultData.us_confidence) :
          `Your US accent confidence: ${this.resultData.us_confidence.toFixed(1)}%`;
      }

      if (descriptionText) {
        descriptionText.textContent = this.model ?
          this.model.getConfidenceDescription(this.resultData.us_confidence) :
          this.getConfidenceDescription(this.resultData.us_confidence);
      }
    }
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}

export default ResultView;
