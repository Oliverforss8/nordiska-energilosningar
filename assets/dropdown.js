document.addEventListener('DOMContentLoaded', function () {
  // Enhanced dropdown interactions
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  let globalHoverTimeout;
  let currentActiveDropdown = null;

  dropdownItems.forEach((item) => {
    const dropdown = item.querySelector('.mega-dropdown');
    if (!dropdown) return;

    const categoryItems = dropdown.querySelectorAll('.dropdown-category[data-category-index]');
    const productContainers = dropdown.querySelectorAll('.category-products');

    // Show dropdown on mouse enter
    item.addEventListener('mouseenter', () => {
      // Clear any existing timeout
      clearTimeout(globalHoverTimeout);

      // Hide any currently active dropdown immediately
      if (currentActiveDropdown && currentActiveDropdown !== dropdown) {
        currentActiveDropdown.style.opacity = '0';
        currentActiveDropdown.style.visibility = 'hidden';

        // Reset the previous dropdown's categories
        const prevCategoryItems = currentActiveDropdown.querySelectorAll('.dropdown-category[data-category-index]');
        const prevProductContainers = currentActiveDropdown.querySelectorAll('.category-products');
        resetToFirstItem(prevCategoryItems, prevProductContainers);
      }

      // Show current dropdown
      dropdown.style.opacity = '1';
      dropdown.style.visibility = 'visible';
      // Removed overflow hidden - allow page scrolling
      currentActiveDropdown = dropdown;
    });

    // Hide dropdown on mouse leave with delay
    item.addEventListener('mouseleave', () => {
      globalHoverTimeout = setTimeout(() => {
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        // Removed overflow restore - no longer needed
        currentActiveDropdown = null;

        // Reset to first item highlighted when dropdown closes
        resetToFirstItem(categoryItems, productContainers);
      }, 150); // Reduced delay for faster transitions
    });

    // Keep dropdown open when hovering over the content area
    const dropdownContent = dropdown.querySelector('.layout');
    if (dropdownContent) {
      dropdownContent.addEventListener('mouseenter', () => {
        clearTimeout(globalHoverTimeout);
      });

      dropdownContent.addEventListener('mouseleave', () => {
        globalHoverTimeout = setTimeout(() => {
          dropdown.style.opacity = '0';
          dropdown.style.visibility = 'hidden';
          currentActiveDropdown = null;

          // Reset to first item highlighted when dropdown closes
          resetToFirstItem(categoryItems, productContainers);
        }, 150); // Reduced delay
      });
    }

    // Close dropdown when clicking on backdrop
    dropdown.addEventListener('click', (e) => {
      if (e.target === dropdown) {
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        // Removed overflow restore - no longer needed
        currentActiveDropdown = null;
      }
    });

    // Category item hover interactions
    categoryItems.forEach((categoryItem) => {
      categoryItem.addEventListener('mouseenter', () => {
        const categoryIndex = categoryItem.getAttribute('data-category-index');
        
        // Remove highlight from all items
        categoryItems.forEach((item) => {
          item.classList.remove('bg-[#F3F1E8]');
          item.classList.add('bg-white');
        });

        // Add highlight to hovered item
        categoryItem.classList.remove('bg-white');
        categoryItem.classList.add('bg-[#F3F1E8]');
        
        // Show corresponding products, hide others
        productContainers.forEach((container) => {
          const productsIndex = container.getAttribute('data-products-index');
          if (productsIndex === categoryIndex) {
            container.style.display = 'block';
            // Small delay to trigger opacity transition
            setTimeout(() => {
              container.classList.add('active');
            }, 10);
          } else {
            container.classList.remove('active');
            // Hide after opacity transition
            setTimeout(() => {
              if (!container.classList.contains('active')) {
                container.style.display = 'none';
              }
            }, 200);
          }
        });
      });
    });

    // Reset to first item when mouse leaves category area
    const leftColumn = dropdown.querySelector('.flex.flex-col');
    if (leftColumn) {
      leftColumn.addEventListener('mouseleave', (e) => {
        // Check if we're not moving to another category item
        const relatedTarget = e.relatedTarget;
        if (!relatedTarget || !relatedTarget.getAttribute('data-category-index') === null) {
          setTimeout(() => {
            resetToFirstItem(categoryItems, productContainers);
          }, 50); // Faster reset
        }
      });
    }
  });

  // Helper function to reset to first item
  function resetToFirstItem(categoryItems, productContainers) {
    categoryItems.forEach((categoryItem, index) => {
      if (index === 0) {
        categoryItem.classList.remove('bg-white');
        categoryItem.classList.add('bg-[#F3F1E8]');
      } else {
        categoryItem.classList.remove('bg-[#F3F1E8]');
        categoryItem.classList.add('bg-white');
      }
    });
    
    // Reset products to show first category
    if (productContainers) {
      productContainers.forEach((container, index) => {
        if (index === 0) {
          container.style.display = 'block';
          container.classList.add('active');
        } else {
          container.style.display = 'none';
          container.classList.remove('active');
        }
      });
    }
  }
});
