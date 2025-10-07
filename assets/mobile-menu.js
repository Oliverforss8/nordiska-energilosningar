/**
 * Mobile Menu Functionality
 * Handles opening/closing mobile menu and submenu interactions
 */

class MobileMenu {
  constructor() {
    this.mobileMenu = document.querySelector('[data-mobile-menu]');
    this.mobileMenuToggle = document.querySelector('[data-mobile-menu-toggle]');
    this.mobileMenuClose = document.querySelector('[data-mobile-menu-close]');
    this.submenuToggles = document.querySelectorAll('[data-mobile-submenu-toggle]');

    if (!this.mobileMenu || !this.mobileMenuToggle) return;

    this.init();
  }

  init() {
    // Toggle mobile menu
    this.mobileMenuToggle.addEventListener('click', () => this.toggleMenu());

    // Close mobile menu
    if (this.mobileMenuClose) {
      this.mobileMenuClose.addEventListener('click', () => this.closeMenu());
    }

    // Close menu when clicking outside
    this.mobileMenu.addEventListener('click', (e) => {
      if (e.target === this.mobileMenu) {
        this.closeMenu();
      }
    });

    // Handle submenu toggles
    this.submenuToggles.forEach((toggle) => {
      toggle.addEventListener('click', () => this.toggleSubmenu(toggle));
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.mobileMenu.classList.contains('active')) {
        this.closeMenu();
      }
    });

    // Close menu when navigating to a link
    const menuLinks = this.mobileMenu.querySelectorAll('a');
    menuLinks.forEach((link) => {
      link.addEventListener('click', () => {
        // Small delay to allow navigation
        setTimeout(() => this.closeMenu(), 100);
      });
    });
  }

  toggleMenu() {
    const isActive = this.mobileMenu.classList.contains('active');

    if (isActive) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.mobileMenu.classList.add('active');
    this.mobileMenuToggle.classList.add('active');
    document.body.classList.add('mobile-menu-open');

    // Prevent scroll
    document.body.style.overflow = 'hidden';
  }

  closeMenu() {
    this.mobileMenu.classList.remove('active');
    this.mobileMenuToggle.classList.remove('active');
    document.body.classList.remove('mobile-menu-open');

    // Restore scroll
    document.body.style.overflow = '';

    // Close all submenus
    this.closeAllSubmenus();
  }

  toggleSubmenu(toggle) {
    const navItem = toggle.closest('.mobile-nav-item');
    const isActive = navItem.classList.contains('active');

    // Close other submenus
    this.closeAllSubmenus();

    // Toggle current submenu
    if (!isActive) {
      navItem.classList.add('active');
    }
  }

  closeAllSubmenus() {
    const activeItems = document.querySelectorAll('.mobile-nav-item.active');
    activeItems.forEach((item) => item.classList.remove('active'));
  }
}

// Initialize mobile menu when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new MobileMenu());
} else {
  new MobileMenu();
}
