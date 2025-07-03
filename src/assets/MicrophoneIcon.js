class MicrophoneIcon {
  constructor(props = {}) {
    this.props = props;
    this.element = this.createElement();
  }

  getSVG() {
    const { isRecording = false } = this.props;
    const className = 'microphone-icon';
    // Use currentColor to inherit from parent element's color
    const fill = 'currentColor';
    const viewBox = '0 0 24 24';

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="${fill}" class="${className}" width="24" height="24">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2a1 1 0 0 1 2 0v2a5 5 0 0 0 10 0v-2a1 1 0 0 1 2 0z"/>
      <path d="M12 19a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1z"/>
    </svg>`;
  }

  createElement() {
    const div = document.createElement('div');
    div.innerHTML = this.getSVG();
    return div.firstElementChild;
  }

  update(props) {
    this.props = { ...this.props, ...props };
    const newElement = this.createElement();
    this.element.parentNode.replaceChild(newElement, this.element);
    this.element = newElement;
    return this.element;
  }
}

export default MicrophoneIcon;
