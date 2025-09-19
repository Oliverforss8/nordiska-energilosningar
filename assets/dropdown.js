document.addEventListener('DOMContentLoaded', function () {
  // Enhanced dropdown interactions
  const dropdownItems = document.querySelectorAll('.dropdown-item');

  dropdownItems.forEach(item => {
    const dropdown = item.querySelector('.mega-dropdown');
    if (!dropdown) return;

    const categoryItems = dropdown.querySelectorAll('[data-category-item]');
    let hoverTimeout;

    // Show dropdown on mouse enter
    item.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimeout);
      dropdown.style.opacity = '1';
      dropdown.style.visibility = 'visible';
      document.body.style.overflow = 'hidden'; // Prevent body scroll
    });

    // Hide dropdown on mouse leave with delay
    item.addEventListener('mouseleave', () => {
      hoverTimeout = setTimeout(() => {
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        document.body.style.overflow = ''; // Restore body scroll

        // Reset to first item highlighted when dropdown closes
        resetToFirstItem(categoryItems);
      }, 200);
    });

    // Keep dropdown open when hovering over it
    dropdown.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimeout);
    });

    dropdown.addEventListener('mouseleave', () => {
      hoverTimeout = setTimeout(() => {
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        document.body.style.overflow = ''; // Restore body scroll

        // Reset to first item highlighted when dropdown closes
        resetToFirstItem(categoryItems);
      }, 200);
    });

    // Close dropdown when clicking on backdrop
    dropdown.addEventListener('click', e => {
      if (e.target === dropdown) {
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        document.body.style.overflow = '';
      }
    });

    // Category item hover interactions
    categoryItems.forEach(categoryItem => {
      categoryItem.addEventListener('mouseenter', () => {
        console.log('Hovering over:', categoryItem.textContent.trim());

        // Remove highlight from all items
        categoryItems.forEach(item => {
          item.classList.remove('bg-[#F3F1E8]');
          item.classList.add('bg-white');
        });

        // Add highlight to hovered item
        categoryItem.classList.remove('bg-white');
        categoryItem.classList.add('bg-[#F3F1E8]');

        console.log('Applied highlight to:', categoryItem.textContent.trim());
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
          }, 100);
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
    console.log('Reset to first item');
  }
});
