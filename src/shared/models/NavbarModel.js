class NavbarModel {
  constructor() {
    this.brandName = 'AureaVoice';
    this.navigationLinks = [
      { text: 'Dashboard', href: '/dashboard', type: 'route' },
      { text: 'Profile', href: '/profile', type: 'route' }
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
