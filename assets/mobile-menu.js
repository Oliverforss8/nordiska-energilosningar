/**
 * Mobile Dropdown Menu
 * Handles the mobile navigation dropdown menu
 */

document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('[data-mobile-menu-toggle]');
  const mobileDropdown = document.querySelector('[data-mobile-dropdown]');
  const submenuToggles = document.querySelectorAll('[data-mobile-submenu-toggle]');

  // Toggle main mobile dropdown
  if (menuToggle && mobileDropdown) {
    menuToggle.addEventListener('click', function () {
      const isActive = mobileDropdown.classList.contains('active');

      if (isActive) {
        // Close menu
        mobileDropdown.classList.remove('active');
        menuToggle.classList.remove('active');
      } else {
        // Open menu
        mobileDropdown.classList.add('active');
        menuToggle.classList.add('active');
      }
    });
  }

  // Toggle submenus
  submenuToggles.forEach((toggle) => {
    toggle.addEventListener('click', function () {
      const parentItem = this.closest('.mobile-nav-item');
      const isActive = parentItem.classList.contains('active');

      // Close all other submenus
      document.querySelectorAll('.mobile-nav-item.active').forEach((item) => {
        if (item !== parentItem) {
          item.classList.remove('active');
        }
      });

      // Toggle current submenu
      if (isActive) {
        parentItem.classList.remove('active');
      } else {
        parentItem.classList.add('active');
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (event) {
    if (mobileDropdown && menuToggle) {
      const isClickInsideMenu = mobileDropdown.contains(event.target);
      const isClickOnToggle = menuToggle.contains(event.target);

      if (!isClickInsideMenu && !isClickOnToggle && mobileDropdown.classList.contains('active')) {
        mobileDropdown.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    }
  });

  // Close mobile menu when cart button is clicked
  const mobileCartButton = mobileDropdown?.querySelector('[data-cart-toggle]');
  if (mobileCartButton && mobileDropdown) {
    mobileCartButton.addEventListener('click', function () {
      // Close the mobile menu when cart is opened
      mobileDropdown.classList.remove('active');
      if (menuToggle) {
        menuToggle.classList.remove('active');
      }
    });
  }

  // Close menu on window resize to desktop
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth >= 1024 && mobileDropdown) {
        mobileDropdown.classList.remove('active');
        if (menuToggle) {
          menuToggle.classList.remove('active');
        }
        // Close all submenus
        document.querySelectorAll('.mobile-nav-item.active').forEach((item) => {
          item.classList.remove('active');
        });
      }
    }, 250);
  });
});
