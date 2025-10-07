// Product page functionality
document.addEventListener('DOMContentLoaded', function () {
  // Global dropdown toggle function for mobile-friendly interaction
  function toggleDropdown(contentId, trigger) {
    const content = document.getElementById(contentId);
    const icon = trigger.querySelector('.dropdown-icon');

    if (content.style.display === 'none' || content.style.display === '') {
      content.style.display = 'block';
      content.classList.add('show');
      trigger.classList.add('active');
    } else {
      content.style.display = 'none';
      content.classList.remove('show');
      trigger.classList.remove('active');
    }
  }

  // Make toggleDropdown globally available
  window.toggleDropdown = toggleDropdown;

  // Variant Selection Logic
  const variantSelects = document.querySelectorAll('.variant-select');
  const buyNowBtn = document.querySelector('.buy-now-btn');
  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  const priceDisplay = document.getElementById('current-price');
  const comparePriceDisplay = document.getElementById('compare-price');

  // Product variants data
  const productVariantsRaw = document.getElementById('product-variants-data');
  const productVariants = productVariantsRaw ? JSON.parse(productVariantsRaw.textContent) : [];

  // Function to find matching variant based on selected options
  function findMatchingVariant() {
    const selectedOptions = {};

    // Get selected values by position (option1, option2, option3)
    variantSelects.forEach((select) => {
      const position = select.dataset.optionPosition;
      selectedOptions['option' + position] = select.value;
    });

    // Find variant where all options match
    return productVariants.find((variant) => {
      return Object.keys(selectedOptions).every((optionKey) => {
        return variant[optionKey] === selectedOptions[optionKey];
      });
    });
  }

  // Function to update variant
  function updateVariant() {
    const selectedVariant = findMatchingVariant();

    if (selectedVariant) {
      console.log('Selected variant:', selectedVariant.id, selectedVariant.title);

      // Update button data attributes
      if (buyNowBtn) {
        buyNowBtn.setAttribute('data-variant-id', selectedVariant.id);
      }
      if (addToCartBtn) {
        addToCartBtn.setAttribute('data-variant-id', selectedVariant.id);
      }

      // Update price display
      if (priceDisplay) {
        priceDisplay.textContent = new Intl.NumberFormat('sv-SE', {
          style: 'currency',
          currency: 'SEK',
        }).format(selectedVariant.price / 100);
      }

      // Update compare price
      if (comparePriceDisplay) {
        if (
          selectedVariant.compare_at_price &&
          selectedVariant.compare_at_price > selectedVariant.price
        ) {
          comparePriceDisplay.textContent = new Intl.NumberFormat('sv-SE', {
            style: 'currency',
            currency: 'SEK',
          }).format(selectedVariant.compare_at_price / 100);
          comparePriceDisplay.style.display = 'inline';
        } else {
          comparePriceDisplay.style.display = 'none';
        }
      }

      // Update URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('variant', selectedVariant.id);
      window.history.replaceState({}, '', newUrl);
      console.log('Updated URL to:', newUrl.toString());
    } else {
      console.log('No matching variant found');
    }
  }

  // Add change listeners to variant selects
  variantSelects.forEach((select) => {
    select.addEventListener('change', updateVariant);
  });

  // Image gallery functionality
  const mainImageContainer = document.getElementById('main-product-image');
  const thumbnails = document.querySelectorAll('[data-thumbnail]');

  if (mainImageContainer && thumbnails.length > 0) {
    // Store all product media for easy access
    const productMediaRaw = document.getElementById('product-media-data');
    const productMedia = productMediaRaw ? JSON.parse(productMediaRaw.textContent) : [];

    // Function to update main image
    function updateMainImage(mediaId) {
      const media = productMedia.find((m) => m.id === mediaId);
      if (!media) return;

      // Update the image source
      const img = mainImageContainer.querySelector('img');
      if (img) {
        img.src = media.src;
        img.alt = media.alt;
      }

      // Update active thumbnail
      thumbnails.forEach((thumb) => {
        thumb.classList.remove('active');
        if (parseInt(thumb.dataset.mediaId) === mediaId) {
          thumb.classList.add('active');
        }
      });
    }

    // Add click listeners to thumbnails
    thumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener('click', function () {
        const mediaId = parseInt(this.dataset.mediaId);
        updateMainImage(mediaId);
      });
    });

    // Set initial active state for featured image
    if (productMedia.length > 0) {
      const featuredMedia = productMedia.find((m) => m.isFeatured);
      if (featuredMedia) {
        const featuredThumbnail = Array.from(thumbnails).find(
          (thumb) => parseInt(thumb.dataset.mediaId) === featuredMedia.id
        );

        if (featuredThumbnail) {
          featuredThumbnail.classList.add('active');
        }
      }
    }
  }

  // Installation and Green Deduction Functionality
  const installationCheckbox = document.getElementById('installation-checkbox');
  const greenDeductionWrapper = document.getElementById('green-deduction-wrapper');

  if (installationCheckbox && greenDeductionWrapper) {
    // Set initial visibility based on installation checkbox state
    greenDeductionWrapper.style.display = installationCheckbox.checked ? 'block' : 'none';

    // Show/hide green deduction options based on installation checkbox
    installationCheckbox.addEventListener('change', function () {
      if (this.checked) {
        greenDeductionWrapper.style.display = 'block';
      } else {
        greenDeductionWrapper.style.display = 'none';
        // Uncheck any selected green deduction option
        const greenDeductionRadios = document.querySelectorAll('.green-deduction-radio');
        greenDeductionRadios.forEach((radio) => {
          radio.checked = false;
        });
      }
    });
  }

  // Function to get selected discount code (supports radios and checkboxes)
  function getSelectedDiscountCode() {
    // Prefer any checked radio
    const selectedRadio = document.querySelector(
      '.green-deduction-radio:checked, input[type="radio"][data-discount-code]:checked'
    );
    if (selectedRadio) {
      const code = selectedRadio.dataset.discountCode || null;
      console.log('🔍 Discount (radio) selected:', code);
      return code;
    }

    // Fallback: any checked checkbox with data-discount-code
    const checkedCheckbox = document.querySelector(
      '.green-deduction-checkbox:checked, input[type="checkbox"][data-discount-code]:checked'
    );
    if (checkedCheckbox) {
      const code = checkedCheckbox.dataset.discountCode || null;
      console.log('🔍 Discount (checkbox) selected:', code);
      return code;
    }

    console.log('🔍 No discount selected');
    return null;
  }

  // Persist discount selection immediately on any discount input change and notify cart
  const discountInputs = document.querySelectorAll(
    '.green-deduction-radio, .green-deduction-checkbox, [data-discount-code]'
  );
  console.log('🧩 Discount inputs init - found count:', discountInputs ? discountInputs.length : 0);
  if (discountInputs && discountInputs.length > 0) {
    discountInputs.forEach((input) => {
      input.addEventListener('change', function () {
        console.log(
          '🖱️ Discount input changed:',
          this.type,
          this.dataset.discountCode,
          'checked:',
          this.checked
        );
        const code = getSelectedDiscountCode();
        try {
          if (code) {
            sessionStorage.setItem('selectedDiscountCode', code);
            console.log('💾 Saved discount code to session:', code);
          } else {
            sessionStorage.removeItem('selectedDiscountCode');
            console.log('🧹 Cleared discount code from session');
          }
        } catch (e) {
          console.warn('SessionStorage not available', e);
        }
        // Broadcast to cart drawer to update its display
        window.dispatchEvent(new CustomEvent('discount:update'));
      });
    });
  } else {
    console.log('ℹ️ No discount inputs found on this product');
  }

  // Upsell Products Functionality
  function getSelectedUpsells() {
    const selectedUpsells = [];
    const upsellCheckboxes = document.querySelectorAll('.upsell-checkbox:checked');

    upsellCheckboxes.forEach((checkbox) => {
      selectedUpsells.push({
        id: checkbox.dataset.variantId,
        quantity: 1,
      });
    });

    return selectedUpsells;
  }

  // Quantity functionality
  function getSelectedQuantity() {
    const quantityInput = document.getElementById('quantity-input');
    return quantityInput ? parseInt(quantityInput.value) || 1 : 1;
  }

  // Fixed Bottom Price Bar Functionality
  const fixedPriceBar = document.getElementById('fixed-bottom-price-bar');
  const mainPriceDisplay = document.getElementById('main-price-display');
  const totalPriceDisplay = document.getElementById('total-price-display');
  const priceBreakdown = document.getElementById('price-breakdown');
  const afterDiscount = document.getElementById('after-discount');
  const discountPriceDisplay = document.getElementById('discount-price-display');

  // Function to update the fixed price bar
  function updateFixedPriceBar() {
    if (!fixedPriceBar) return;

    const selectedVariant = findMatchingVariant();
    if (!selectedVariant) return;

    // Calculate total price
    let totalPrice = selectedVariant.price * getSelectedQuantity();

    // Add upsell prices
    const upsellCheckboxes = document.querySelectorAll('.upsell-checkbox:checked');
    upsellCheckboxes.forEach((checkbox) => {
      const price = parseInt(checkbox.dataset.price);
      totalPrice += price;
    });

    // Add installation price if selected
    const installationCheckbox = document.getElementById('installation-checkbox');
    if (installationCheckbox && installationCheckbox.checked) {
      const installationPrice = parseInt(installationCheckbox.dataset.price);
      totalPrice += installationPrice;
    }

    // Get selected discount code
    const discountCode = getSelectedDiscountCode();
    let finalPrice = totalPrice;
    let showDiscount = false;

    console.log('🔍 Discount calculation:', {
      discountCode,
      totalPrice: totalPrice / 100,
      installationChecked: installationCheckbox ? installationCheckbox.checked : false,
    });

    // Calculate discount if green deduction is selected
    if (discountCode) {
      showDiscount = true;
      let maxDiscountAmount = 0;
      let discountRate = 0.5551; // 55.51%

      if (discountCode === 'AVDRAG1') {
        maxDiscountAmount = 5000000; // 50,000 SEK in cents
      } else if (discountCode === 'AVDRAG2') {
        maxDiscountAmount = 10000000; // 100,000 SEK in cents
      }

      // Calculate discount on TOTAL PRICE (not just installation)
      const calculatedDiscount = totalPrice * discountRate;
      const discountAmount = Math.min(calculatedDiscount, maxDiscountAmount);
      finalPrice = totalPrice - discountAmount;

      console.log('💰 Discount applied:', {
        totalPrice: totalPrice / 100,
        discountRate: discountRate * 100 + '%',
        calculatedDiscount: calculatedDiscount / 100,
        maxDiscountAmount: maxDiscountAmount / 100,
        actualDiscountAmount: discountAmount / 100,
        finalPrice: finalPrice / 100,
      });
    } else {
      console.log('❌ No discount code selected');
    }

    // Update total price display
    if (totalPriceDisplay) {
      totalPriceDisplay.textContent = new Intl.NumberFormat('sv-SE', {
        style: 'currency',
        currency: 'SEK',
      }).format(totalPrice / 100);

      // Add strikethrough if discount is applied
      if (showDiscount) {
        totalPriceDisplay.classList.add('strikethrough');
      } else {
        totalPriceDisplay.classList.remove('strikethrough');
      }
    }

    // Update discount display
    if (showDiscount) {
      console.log('✅ Showing discount display');
      afterDiscount.style.display = 'flex';
      if (discountPriceDisplay) {
        discountPriceDisplay.textContent = new Intl.NumberFormat('sv-SE', {
          style: 'currency',
          currency: 'SEK',
        }).format(finalPrice / 100);
      }
    } else {
      console.log('❌ Hiding discount display');
      afterDiscount.style.display = 'none';
    }

    // Update button data attributes
    const addToCartBtnBottom = document.querySelector('.add-to-cart-btn-bottom');

    if (addToCartBtnBottom) {
      addToCartBtnBottom.setAttribute('data-variant-id', selectedVariant.id);
    }
  }

  // Function to show/hide price bar based on scroll position
  function togglePriceBarVisibility() {
    if (!fixedPriceBar) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Show price bar when user has scrolled down enough and not at the very bottom
    // Reduced threshold to 100px for better visibility
    const shouldShow = scrollTop > 100 && scrollTop + windowHeight < documentHeight - 100;

    if (shouldShow) {
      fixedPriceBar.classList.add('visible');
    } else {
      fixedPriceBar.classList.remove('visible');
    }
  }

  // Also show price bar immediately on page load for testing
  setTimeout(() => {
    if (fixedPriceBar) {
      fixedPriceBar.classList.add('visible');
    }
  }, 1000);

  // Initial update and event listeners
  updateFixedPriceBar();

  // Listen for scroll events
  window.addEventListener('scroll', togglePriceBarVisibility);

  // Listen for variant changes
  variantSelects.forEach((select) => {
    select.addEventListener('change', updateFixedPriceBar);
  });

  // Listen for upsell checkbox changes and green deduction changes
  document.addEventListener('change', function (e) {
    if (
      e.target.classList.contains('upsell-checkbox') ||
      e.target.id === 'installation-checkbox' ||
      e.target.classList.contains('green-deduction-radio')
    ) {
      updateFixedPriceBar();
    }
  });

  // Listen for quantity changes
  function handleQuantityChange() {
    updateFixedPriceBar();
  }

  // Add event listeners to existing quantity buttons
  document.addEventListener('click', function (e) {
    if (
      e.target.classList.contains('quantity-increase') ||
      e.target.classList.contains('quantity-decrease')
    ) {
      setTimeout(handleQuantityChange, 100); // Small delay to ensure quantity is updated
    }
  });

  // Buy Now functionality with upsells and installation
  let isBuyNowProcessing = false;

  function handleBuyNow(button) {
    return async function (e) {
      e.preventDefault();

      // Prevent duplicate clicks
      if (isBuyNowProcessing) {
        console.log('Already processing, please wait...');
        return;
      }

      const variantId = button.getAttribute('data-variant-id');
      const quantity = getSelectedQuantity();
      const upsells = getSelectedUpsells();
      const discountCode = getSelectedDiscountCode();

      console.log('🛒 Buy Now clicked!');
      console.log('📦 Variant ID:', variantId);
      console.log('🎁 Discount Code:', discountCode || 'None selected');

      // Store discount code in sessionStorage
      if (discountCode) {
        sessionStorage.setItem('selectedDiscountCode', discountCode);
        console.log('💾 Saved discount code to session:', discountCode);
      }

      // Show loading state
      const originalText = button.innerHTML;
      button.innerHTML = 'Behandlar...';
      button.disabled = true;
      isBuyNowProcessing = true;

      try {
        // Build items array with main product and upsells
        const items = [
          {
            id: variantId,
            quantity: quantity,
          },
          ...upsells,
        ];

        // Check if installation is selected
        const installationCheckbox = document.getElementById('installation-checkbox');
        if (installationCheckbox && installationCheckbox.checked) {
          const installationVariantId = installationCheckbox.dataset.variantId;
          // Add installation product to cart
          items.push({
            id: installationVariantId,
            quantity: 1,
          });
        }

        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: items,
          }),
        });

        if (response.ok) {
          // Go to checkout with discount code if selected
          if (discountCode) {
            const checkoutUrl = '/checkout?discount=' + discountCode;
            console.log('✅ Going to checkout with discount:', checkoutUrl);
            window.location.href = checkoutUrl;
          } else {
            console.log('✅ Going to checkout (no discount)');
            window.location.href = '/checkout';
          }
        } else if (response.status === 429) {
          throw new Error('För många förfrågningar. Vänta några sekunder och försök igen.');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.description || 'Kunde inte lägga till i varukorgen');
        }
      } catch (error) {
        console.error('Error with buy now:', error);

        // Show error state with specific message
        button.innerHTML = error.message.includes('många') ? 'Vänta...' : 'Fel!';
        button.style.background = '#EF4444';
        button.style.color = 'white';

        // Reset button after appropriate delay
        const resetDelay = error.message.includes('många') ? 3000 : 2000;
        setTimeout(() => {
          button.innerHTML = originalText;
          button.disabled = false;
          button.style.background = '';
          button.style.color = '';
          isBuyNowProcessing = false;
        }, resetDelay);
      }
    };
  }

  // Add to Cart functionality with upsells and installation
  let isAddToCartProcessing = false;

  function handleAddToCart(button) {
    return async function (e) {
      e.preventDefault();

      // Prevent duplicate clicks
      if (isAddToCartProcessing) {
        console.log('Already processing, please wait...');
        return;
      }

      const variantId = button.getAttribute('data-variant-id');
      const quantity = getSelectedQuantity();
      const upsells = getSelectedUpsells();
      const discountCode = getSelectedDiscountCode();

      console.log('🛒 Add to Cart clicked!');
      console.log('🎁 Discount Code:', discountCode || 'None selected');

      // Store discount code in sessionStorage so cart drawer can use it
      if (discountCode) {
        sessionStorage.setItem('selectedDiscountCode', discountCode);
        console.log('💾 Saved discount code to session:', discountCode);
      }

      // Show loading state
      const originalText = button.innerHTML;
      button.innerHTML = 'Lägger till...';
      button.disabled = true;
      isAddToCartProcessing = true;

      try {
        // Build items array with main product and upsells
        const items = [
          {
            id: variantId,
            quantity: quantity,
          },
          ...upsells,
        ];

        // Check if installation is selected
        const installationCheckbox = document.getElementById('installation-checkbox');
        if (installationCheckbox && installationCheckbox.checked) {
          const installationVariantId = installationCheckbox.dataset.variantId;
          // Add installation product to cart
          items.push({
            id: installationVariantId,
            quantity: 1,
          });
        }

        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: items,
          }),
        });

        if (response.ok) {
          // Update cart count and show success
          const cartData = await response.json();

          // Show success state
          button.innerHTML = 'Tillagd! ✓';
          button.style.background = '#4ade80';
          button.style.color = 'white';

          // Trigger cart update event for cart.js to reload
          window.dispatchEvent(new CustomEvent('cart:update'));

          // Open cart drawer if available
          const cartDrawer = document.getElementById('cart-drawer');
          const cartOverlay = document.querySelector('[data-cart-overlay]');
          if (cartDrawer) {
            cartDrawer.classList.add('open');
            if (cartOverlay) {
              cartOverlay.classList.add('active');
            }
            document.body.style.overflow = 'hidden';
          }

          // Reset button after 2 seconds
          setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            button.style.background = '';
            button.style.color = '';
            isAddToCartProcessing = false;
          }, 2000);
        } else if (response.status === 429) {
          throw new Error('För många förfrågningar. Vänta några sekunder och försök igen.');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.description || 'Kunde inte lägga till i varukorgen');
        }
      } catch (error) {
        console.error('Error adding to cart:', error);

        // Show error state with specific message
        button.innerHTML = error.message.includes('många') ? 'Vänta...' : 'Fel!';
        button.style.background = '#EF4444';
        button.style.color = 'white';

        // Reset button after appropriate delay
        const resetDelay = error.message.includes('många') ? 3000 : 2000;
        setTimeout(() => {
          button.innerHTML = originalText;
          button.disabled = false;
          button.style.background = '';
          button.style.color = '';
          isAddToCartProcessing = false;
        }, resetDelay);
      }
    };
  }

  // Add event listeners to all add to cart buttons
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn, .add-to-cart-btn-bottom');

  addToCartButtons.forEach((button) => {
    button.addEventListener('click', handleAddToCart(button));
  });

  // Quantity update function
  window.updateQuantity = function (change) {
    const quantityInput = document.getElementById('quantity-input');
    const mobileDisplay = document.getElementById('quantity-display-mobile');
    const desktopDisplay = document.getElementById('quantity-display-desktop');

    if (!quantityInput) return;

    const currentQuantity = parseInt(quantityInput.value) || 1;
    const newQuantity = Math.max(1, currentQuantity + change);

    quantityInput.value = newQuantity;

    if (mobileDisplay) mobileDisplay.textContent = newQuantity;
    if (desktopDisplay) desktopDisplay.textContent = newQuantity;

    // Update the fixed price bar
    updateFixedPriceBar();
  };
});
