/**
 * MicrophoneIcon - Reusable SVG microphone icon component
 * Returns the SVG string for the microphone icon used throughout the app
 */
class MicrophoneIcon {
  /**
   * Get the SVG string for the microphone icon
   * @param {Object} options - Configuration options for the icon
   * @param {string} options.className - CSS class to apply to the SVG
   * @param {string} options.fill - Fill color for the SVG (default: 'currentColor')
   * @param {string} options.viewBox - ViewBox attribute (default: '0 0 24 24')
   * @returns {string} SVG string
   */
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

  /**
   * Create a DOM element with the microphone icon
   * @param {Object} options - Configuration options for the icon
   * @returns {HTMLElement} SVG DOM element
   */
  static createElement(options = {}) {
    const div = document.createElement('div');
    div.innerHTML = this.getSVG(options);
    return div.firstElementChild;
  }

  /**
   * Insert the microphone icon into a container element
   * @param {HTMLElement} container - Container element to insert the icon into
   * @param {Object} options - Configuration options for the icon
   * @returns {HTMLElement} The inserted SVG element
   */
  static insertInto(container, options = {}) {
    const svgElement = this.createElement(options);
    container.appendChild(svgElement);
    return svgElement;
  }

  /**
   * Set the innerHTML of a container with the microphone icon
   * @param {HTMLElement} container - Container element to set innerHTML
   * @param {Object} options - Configuration options for the icon
   */
  static setInnerHTML(container, options = {}) {
    container.innerHTML = this.getSVG(options);
  }
}

export default MicrophoneIcon;
