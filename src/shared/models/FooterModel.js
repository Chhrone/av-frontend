class FooterModel {
  constructor() {
    this.brandName = 'AureaVoice';
    this.description = 'AureaVoice adalah platform pembelajaran aksen Amerika berbasis AI untuk penutur bahasa Indonesia, dirancang untuk membantu Kamu bicara bahasa Inggris dengan lebih percaya diri.';
    this.copyrightYear = new Date().getFullYear();
    this.backgroundText = 'AUREAVOICE';
  }

  getBrandName() {
    return this.brandName;
  }

  getDescription() {
    return this.description;
  }

  getCopyrightText() {
    return `© ${this.copyrightYear} ${this.brandName} All rights reserved.`;
  }

  getBackgroundText() {
    return this.backgroundText;
  }

  getInternalLinks() {
    return [
      { text: 'Home', href: '#/' },
      { text: 'Dashboard', href: '#/dashboard' },
      { text: 'Latihan', href: '#/latihan' },
      { text: 'Tentang', href: '#/tentang' },
      { text: 'FAQ', href: '#/faq' }
    ];
  }

  getCommunityLinks() {
    return [
      { text: 'Telegram Grup', href: '#' },
      { text: 'Blog', href: '#' },
      { text: 'Event', href: '#' },
      { text: 'Kontak', href: '#' }
    ];
  }

  getResourceLinks() {
    return [
      { text: 'Get Involved', href: '#' },
      { text: 'Press Releases', href: '#' },
      { text: 'Privacy Policy', href: '#' },
      { text: 'Terms of Service', href: '#' }
    ];
  }

  setBrandName(name) {
    this.brandName = name;
  }

  setDescription(description) {
    this.description = description;
  }

  setBackgroundText(text) {
    this.backgroundText = text;
  }
}

export default FooterModel;
