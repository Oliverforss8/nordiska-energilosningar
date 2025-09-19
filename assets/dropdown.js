document.addEventListener('DOMContentLoaded', function () {
  // Enhanced dropdown interactions
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  let globalHoverTimeout;
  let currentActiveDropdown = null;

  dropdownItems.forEach(item => {
    const dropdown = item.querySelector('.mega-dropdown');
    if (!dropdown) return;

    const categoryItems = dropdown.querySelectorAll('[data-category-item]');

    // Show dropdown on mouse enter
    item.addEventListener('mouseenter', () => {
      // Clear any existing timeout
      clearTimeout(globalHoverTimeout);

      // Hide any currently active dropdown immediately
      if (currentActiveDropdown && currentActiveDropdown !== dropdown) {
        currentActiveDropdown.style.opacity = '0';
        currentActiveDropdown.style.visibility = 'hidden';

        // Reset the previous dropdown's categories
        const prevCategoryItems = currentActiveDropdown.querySelectorAll(
          '[data-category-item]'
        );
        resetToFirstItem(prevCategoryItems);
      }

      // Show current dropdown
      dropdown.style.opacity = '1';
      dropdown.style.visibility = 'visible';
      document.body.style.overflow = 'hidden'; // Prevent body scroll
      currentActiveDropdown = dropdown;
    });

    // Hide dropdown on mouse leave with delay
    item.addEventListener('mouseleave', () => {
      globalHoverTimeout = setTimeout(() => {
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        document.body.style.overflow = ''; // Restore body scroll
        currentActiveDropdown = null;

        // Reset to first item highlighted when dropdown closes
        resetToFirstItem(categoryItems);
      }, 150); // Reduced delay for faster transitions
    });

    // Keep dropdown open when hovering over it
    dropdown.addEventListener('mouseenter', () => {
      clearTimeout(globalHoverTimeout);
    });

    dropdown.addEventListener('mouseleave', () => {
      globalHoverTimeout = setTimeout(() => {
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        document.body.style.overflow = ''; // Restore body scroll
        currentActiveDropdown = null;

        // Reset to first item highlighted when dropdown closes
        resetToFirstItem(categoryItems);
      }, 150); // Reduced delay
    });

    // Close dropdown when clicking on backdrop
    dropdown.addEventListener('click', e => {
      if (e.target === dropdown) {
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        document.body.style.overflow = '';
        currentActiveDropdown = null;
      }
    });

    // Category item hover interactions
    categoryItems.forEach(categoryItem => {
      categoryItem.addEventListener('mouseenter', () => {
        // Remove highlight from all items
        categoryItems.forEach(item => {
          item.classList.remove('bg-[#F3F1E8]');
          item.classList.add('bg-white');
        });

        // Add highlight to hovered item
        categoryItem.classList.remove('bg-white');
        categoryItem.classList.add('bg-[#F3F1E8]');
      });
    });

    // Reset to first item when mouse leaves category area
    const leftColumn = dropdown.querySelector('.flex.flex-col');
    if (leftColumn) {
      leftColumn.addEventListener('mouseleave', e => {
        // Check if we're not moving to another category item
        const relatedTarget = e.relatedTarget;
        if (
          !relatedTarget ||
          !relatedTarget.hasAttribute('data-category-item')
        ) {
          setTimeout(() => {
            resetToFirstItem(categoryItems);
          }, 50); // Faster reset
        }
      });
    }
  });

  // Helper function to reset to first item
  function resetToFirstItem(categoryItems) {
    categoryItems.forEach((categoryItem, index) => {
      if (index === 0) {
        categoryItem.classList.remove('bg-white');
        categoryItem.classList.add('bg-[#F3F1E8]');
      } else {
        categoryItem.classList.remove('bg-[#F3F1E8]');
        categoryItem.classList.add('bg-white');
      }
    });
  }
});
