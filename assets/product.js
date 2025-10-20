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

      // Update price summary section
      const comparePriceSummary = document.getElementById('compare-price-summary');
      const currentPriceSummary = document.getElementById('current-price-summary');

      if (comparePriceSummary) {
        if (
          selectedVariant.compare_at_price &&
          selectedVariant.compare_at_price > selectedVariant.price
        ) {
          comparePriceSummary.textContent = new Intl.NumberFormat('sv-SE', {
            style: 'currency',
            currency: 'SEK',
          }).format(selectedVariant.compare_at_price / 100);
          comparePriceSummary.style.display = 'inline';
        } else {
          comparePriceSummary.style.display = 'none';
        }
      }

      if (currentPriceSummary) {
        currentPriceSummary.textContent = new Intl.NumberFormat('sv-SE', {
          style: 'currency',
          currency: 'SEK',
        }).format(selectedVariant.price / 100);
      }

      // Update discounted price display if it exists
      const discountedPriceDisplay = document.getElementById('discounted-price-display');
      const discountedPrice = document.getElementById('discounted-price');
      if (discountedPriceDisplay && discountedPrice) {
        discountedPrice.textContent = new Intl.NumberFormat('sv-SE', {
          style: 'currency',
          currency: 'SEK',
        }).format(selectedVariant.price / 100);
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
        // Auto-select first green deduction option if none selected
        const anySelected = document.querySelector('.green-deduction-radio:checked');
        const firstOption = document.getElementById('green-deduction-1');
        if (!anySelected && firstOption) {
          firstOption.checked = true;
          firstOption.dispatchEvent(new Event('change', { bubbles: true }));
        }
      } else {
        greenDeductionWrapper.style.display = 'none';
        // Uncheck any selected green deduction option
        const greenDeductionRadios = document.querySelectorAll('.green-deduction-radio');
        greenDeductionRadios.forEach((radio) => {
          radio.checked = false;
        });
      }
    });

    // If installation starts checked, ensure a default green deduction is selected
    if (installationCheckbox.checked) {
      const anySelected = document.querySelector('.green-deduction-radio:checked');
      const firstOption = document.getElementById('green-deduction-1');
      if (!anySelected && firstOption) {
        firstOption.checked = true;
        firstOption.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
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
    // Green deduction: final price = total price * 0.515 (customer pays 51.5% of total)
    if (discountCode) {
      showDiscount = true;

      // Calculate discounted price: customer pays 51.5% of total price
      finalPrice = Math.round(totalPrice * 0.515);
      const discountAmount = totalPrice - finalPrice;

      console.log('💰 Green deduction applied:', {
        totalPrice: totalPrice / 100,
        discountPercentage: '48.5%',
        discountAmount: discountAmount / 100,
        finalPrice: finalPrice / 100,
        customerPays: '51.5% of total',
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

    // Update all other price displays on the page
    updateAllPriceDisplays(totalPrice, showDiscount, finalPrice);

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

    // Update button data attributes and styling
    const addToCartBtnBottom = document.querySelector('.add-to-cart-btn-bottom');

    if (addToCartBtnBottom) {
      addToCartBtnBottom.setAttribute('data-variant-id', selectedVariant.id);

      // Update button color based on discount state
      if (showDiscount) {
        addToCartBtnBottom.style.color = '#3e753e';
      } else {
        addToCartBtnBottom.style.color = '#171717';
      }
    }
  }

  // Function to update all price displays on the page
  function updateAllPriceDisplays(totalPrice, showDiscount, finalPrice) {
    // Update main product price display - NO discount effects on main price
    const currentPriceDisplay = document.getElementById('current-price');
    if (currentPriceDisplay) {
      const selectedVariant = findMatchingVariant();
      if (selectedVariant) {
        const variantPrice = selectedVariant.price * getSelectedQuantity();
        currentPriceDisplay.textContent = new Intl.NumberFormat('sv-SE', {
          style: 'currency',
          currency: 'SEK',
        }).format(variantPrice / 100);
        // Never apply strikethrough to main product price
        currentPriceDisplay.classList.remove('strikethrough');
      }
    }

    // Apply discount effects ONLY to upsell prices
    const upsellPrices = document.querySelectorAll('.upsell-price');
    upsellPrices.forEach((priceElement) => {
      if (showDiscount) {
        // Only apply discount if not already applied
        if (!priceElement.classList.contains('discount-applied')) {
          priceElement.classList.add('strikethrough', 'discount-applied');
          // Calculate discounted upsell price (customer pays 51.5% of original)
          const upsellCheckbox = document.querySelector(
            `[data-product-id="${priceElement.dataset.productId}"]`
          );
          if (upsellCheckbox) {
            const originalPrice = parseInt(upsellCheckbox.dataset.price);
            const discountedPrice = Math.round(originalPrice * 0.515);

            // Get original text from stored data or clean textContent
            const originalText = priceElement.dataset.originalText || priceElement.textContent;
            const discountedText =
              '+' +
              new Intl.NumberFormat('sv-SE', {
                style: 'currency',
                currency: 'SEK',
              }).format(discountedPrice / 100);

            // Store original text for restoration
            if (!priceElement.dataset.originalText) {
              priceElement.dataset.originalText = originalText;
            }

            priceElement.innerHTML = `
              <span class="line-through">${originalText}</span>
              <span class="ml-3" style="color: #3e753e;">${discountedText}</span>
            `;
          }
        }
      } else {
        priceElement.classList.remove('strikethrough', 'discount-applied');
        // Restore original upsell price display - clean up any existing HTML
        const upsellCheckbox = document.querySelector(
          `[data-product-id="${priceElement.dataset.productId}"]`
        );
        if (upsellCheckbox) {
          const price = upsellCheckbox.dataset.price;
          // Clear any existing HTML and set clean text content
          priceElement.innerHTML = '';
          priceElement.textContent =
            '+' +
            new Intl.NumberFormat('sv-SE', {
              style: 'currency',
              currency: 'SEK',
            }).format(price / 100);
          // Clear stored original text
          delete priceElement.dataset.originalText;
        }
      }
    });

    // Apply discount effects ONLY to installation price
    const installationPriceElements = document.querySelectorAll('.installation-card .headline1');
    installationPriceElements.forEach((element) => {
      if (element.textContent.includes('+') && element.textContent.includes('kr')) {
        if (showDiscount) {
          // Only apply discount if not already applied
          if (!element.classList.contains('discount-applied')) {
            element.classList.add('strikethrough', 'discount-applied');
            // Calculate discounted installation price (customer pays 51.5% of original)
            const installationCheckbox = document.getElementById('installation-checkbox');
            if (installationCheckbox) {
              const originalPrice = parseInt(installationCheckbox.dataset.price);
              const discountedPrice = Math.round(originalPrice * 0.515);

              // Get original text from stored data or clean textContent
              const originalText = element.dataset.originalText || element.textContent;
              const discountedText =
                '+' +
                new Intl.NumberFormat('sv-SE', {
                  style: 'currency',
                  currency: 'SEK',
                }).format(discountedPrice / 100);

              // Store original text for restoration
              if (!element.dataset.originalText) {
                element.dataset.originalText = originalText;
              }

              element.innerHTML = `
                <span class="line-through">${originalText}</span>
                <span class="ml-3" style="color: #3e753e;">${discountedText}</span>
              `;
            }
          }
        } else {
          element.classList.remove('strikethrough', 'discount-applied');
          // Restore original installation price display - clean up any existing HTML
          const installationCheckbox = document.getElementById('installation-checkbox');
          if (installationCheckbox) {
            const price = installationCheckbox.dataset.price;
            // Clear any existing HTML and set clean text content
            element.innerHTML = '';
            element.textContent =
              '+' +
              new Intl.NumberFormat('sv-SE', {
                style: 'currency',
                currency: 'SEK',
              }).format(price / 100);
            // Clear stored original text
            delete element.dataset.originalText;
          }
        }
      }
    });
  }

  // Conditional upsell visibility and variant mapping
  function getCurrentMainOptionValue(index) {
    const select = document.querySelector('.variant-select[data-option-position="' + index + '"]');
    return select ? (select.value || '').toLowerCase() : '';
  }

  function evaluateUpsells() {
    const cards = document.querySelectorAll('.upsell-product-card');
    cards.forEach(function (card) {
      const enabled = card.getAttribute('data-condition-enabled') === 'true';
      if (!enabled) {
        card.style.removeProperty('display');
        applyVariantMap(card);
        return;
      }
      const idx = card.getAttribute('data-option-index');
      const allowed = (card.getAttribute('data-allowed-values') || '')
        .split(',')
        .map(function (s) {
          return s.trim();
        })
        .filter(function (s) {
          return s.length;
        });
      if (!idx || !allowed.length) {
        card.style.removeProperty('display');
        applyVariantMap(card);
        return;
      }
      const current = getCurrentMainOptionValue(idx);
      if (current && allowed.indexOf(current) !== -1) {
        card.style.removeProperty('display');
        applyVariantMap(card, current);
      } else {
        card.style.display = 'none';
      }
    });
  }

  function parseVariantMap(mapStr) {
    const out = {};
    if (!mapStr) return out;
    mapStr.split('|').forEach(function (line) {
      const trimmed = line.trim();
      if (!trimmed) return;
      const parts = trimmed.split('=');
      if (parts.length < 2) return;
      const key = parts[0].trim().toLowerCase();
      const val = parts.slice(1).join('=').trim().toLowerCase();
      if (key && val) out[key] = val;
    });
    return out;
  }

  function applyVariantMap(card, currentMainValue) {
    const mapStr = card.getAttribute('data-variant-map') || '';
    if (!mapStr) return;
    const map = parseVariantMap(mapStr);
    const idx = card.getAttribute('data-option-index');
    const current = currentMainValue || (idx ? getCurrentMainOptionValue(idx) : '');
    if (!current || !map[current]) return;

    const wanted = map[current];
    const select = card.querySelector('.upsell-variant-select');
    if (!select) return;

    const matchOption = Array.prototype.find.call(select.options, function (opt) {
      const idMatch = (opt.value || '').toLowerCase() === wanted;
      const skuMatch = (opt.getAttribute('data-sku') || '').toLowerCase() === wanted;
      const titleMatch = (opt.getAttribute('data-title') || '').toLowerCase() === wanted;
      return idMatch || skuMatch || titleMatch;
    });
    if (matchOption && !matchOption.selected) {
      select.value = matchOption.value;
      const evt = new Event('change', { bubbles: true });
      select.dispatchEvent(evt);
    }
  }

  // Listen for variant changes to re-evaluate upsells
  document.addEventListener('change', function (e) {
    if (e.target && e.target.matches('.variant-select')) {
      evaluateUpsells();
    }
  });

  // Initial evaluation of upsells on page load
  evaluateUpsells();

  // Service option button handling for quote form
  const serviceOptions = document.querySelectorAll('.service-option');
  serviceOptions.forEach(function (button) {
    button.addEventListener('click', function () {
      const isSelected = this.getAttribute('data-selected') === 'true';

      if (isSelected) {
        // Deselect this option
        this.style.background = 'white';
        this.setAttribute('data-selected', 'false');
      } else {
        // Deselect all other options first
        serviceOptions.forEach(function (opt) {
          opt.style.background = 'white';
          opt.setAttribute('data-selected', 'false');
        });

        // Select this option
        this.style.background = 'linear-gradient(135deg, #FFA94D 0%, #FF4E33 100%)';
        this.setAttribute('data-selected', 'true');

        // Update hidden field
        const serviceField = document.getElementById('selected_service');
        if (serviceField) {
          serviceField.value = this.getAttribute('data-service');
        }
      }
    });
  });

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

  // Ensure initial visibility evaluation runs once on load
  togglePriceBarVisibility();

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

  // Upsell variant selection handling: update displayed price and checkbox data
  function formatCurrencySEK(amountInCents) {
    return new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(
      amountInCents / 100
    );
  }

  document.querySelectorAll('.upsell-variant-select').forEach((select) => {
    select.addEventListener('change', function () {
      const productId = this.dataset.productId;
      const selectedOption = this.options[this.selectedIndex];
      const newVariantId = selectedOption.value;
      const newPrice = parseInt(selectedOption.dataset.price || '0', 10);

      console.log('🔄 Upsell variant changed:', {
        productId,
        newVariantId,
        newPrice: newPrice / 100,
      });

      // Update the upsell price text for this product
      const priceEl = document.querySelector('.upsell-price[data-product-id="' + productId + '"]');
      if (priceEl) {
        // Clear any existing discount state and restore original price
        priceEl.classList.remove('strikethrough', 'discount-applied');
        priceEl.innerHTML = '';
        delete priceEl.dataset.originalText;

        priceEl.textContent = '+' + formatCurrencySEK(newPrice);
        console.log('✅ Updated upsell price display:', priceEl.textContent);

        // If discount is currently active, reapply discount effects to the new price
        const discountRadios = document.querySelectorAll('.green-deduction-radio:checked');
        if (discountRadios.length > 0) {
          // Reapply discount logic for the new variant price (customer pays 51.5%)
          const discountedPrice = Math.round(newPrice * 0.515);

          const originalText = priceEl.textContent;
          const discountedText = '+' + formatCurrencySEK(discountedPrice);

          // Store original text and apply discount
          priceEl.dataset.originalText = originalText;
          priceEl.classList.add('strikethrough', 'discount-applied');
          priceEl.innerHTML = `
            <span class="line-through">${originalText}</span>
            <span class="ml-3" style="color: #3e753e;">${discountedText}</span>
          `;
          console.log('✅ Reapplied discount to new variant:', discountedText);
        }
      }

      // Update the corresponding checkbox data attributes used for totals
      const checkbox = document.querySelector(
        '.upsell-checkbox[data-product-id="' + productId + '"]'
      );
      if (checkbox) {
        checkbox.setAttribute('data-variant-id', newVariantId);
        checkbox.setAttribute('data-price', String(newPrice));
        console.log('✅ Updated checkbox data attributes:', {
          variantId: newVariantId,
          price: newPrice,
        });
      }

      // Recalculate totals for the fixed price bar
      updateFixedPriceBar();
    });
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
