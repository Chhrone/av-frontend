class NavbarModel {
  constructor() {
    this.brandName = 'AureaVoice';
    this.navigationLinks = [
      { text: 'Dashboard', href: '#dashboard' },
      { text: 'Kategori', href: '#categories' },
      { text: 'Profile', href: '#profile' }
    ];
  }

  getBrandName() {
    return this.brandName;
  }

  getNavigationLinks() {
    return this.navigationLinks;
  }

  getBrandParts() {
    return {
      aurea: 'Aurea',
      voice: 'Voice'
    };
  }
}

export default NavbarModel;
