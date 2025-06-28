class MicrophoneIcon {
  static getSVG(options = {}) {
    const {
      className = 'microphone-icon',
      fill = 'currentColor',
      viewBox = '0 0 24 24'
    } = options;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="${fill}" class="${className}">
  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
  <path d="M19 10v2a7 7 0 0 1-14 0v-2a1 1 0 0 1 2 0v2a5 5 0 0 0 10 0v-2a1 1 0 0 1 2 0z"/>
  <path d="M12 19a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1z"/>
</svg>`;
  }

  static createElement(options = {}) {
    const div = document.createElement('div');
    div.innerHTML = this.getSVG(options);
    return div.firstElementChild;
  }

  static insertInto(container, options = {}) {
    const svgElement = this.createElement(options);
    container.appendChild(svgElement);
    return svgElement;
  }

  static setInnerHTML(container, options = {}) {
    container.innerHTML = this.getSVG(options);
  }
}

export default MicrophoneIcon;
