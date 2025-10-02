// Product page interactions (extracted from sections/product.liquid)

// Global dropdown toggle function for mobile-friendly interaction
function toggleDropdown(contentId, trigger) {
  const content = document.getElementById(contentId);
  const icon = trigger.querySelector('.dropdown-icon');

  if (content && (content.style.display === 'none' || content.style.display === '')) {
    content.style.display = 'block';
    content.classList.add('show');
    trigger.classList.add('active');
  } else if (content) {
    content.style.display = 'none';
    content.classList.remove('show');
    trigger.classList.remove('active');
  }
}

document.addEventListener('DOMContentLoaded', function() {
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
    variantSelects.forEach(select => {
      const position = select.dataset.optionPosition;
      selectedOptions['option' + position] = select.value;
    });
    return productVariants.find(variant => {
      return Object.keys(selectedOptions).every(optionKey => {
        return variant[optionKey] === selectedOptions[optionKey];
      });
    });
  }

  // Function to update variant
  function updateVariant() {
    const selectedVariant = findMatchingVariant();
    if (selectedVariant) {
      console.log('Selected variant:', selectedVariant.id, selectedVariant.title);
      if (buyNowBtn) {
        buyNowBtn.setAttribute('data-variant-id', selectedVariant.id);
      }
      if (addToCartBtn) {
        addToCartBtn.setAttribute('data-variant-id', selectedVariant.id);
      }
      if (priceDisplay) {
        priceDisplay.textContent = new Intl.NumberFormat('sv-SE', {
          style: 'currency',
          currency: 'SEK'
        }).format(selectedVariant.price / 100);
      }
      if (comparePriceDisplay) {
        if (selectedVariant.compare_at_price && selectedVariant.compare_at_price > selectedVariant.price) {
          comparePriceDisplay.textContent = new Intl.NumberFormat('sv-SE', {
            style: 'currency',
            currency: 'SEK'
          }).format(selectedVariant.compare_at_price / 100);
          comparePriceDisplay.style.display = 'inline';
        } else {
          comparePriceDisplay.style.display = 'none';
        }
      }
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('variant', selectedVariant.id);
      window.history.replaceState({}, '', newUrl);
      console.log('Updated URL to:', newUrl.toString());
    } else {
      console.log('No matching variant found');
    }
  }

  // Add change listeners to variant selects
  variantSelects.forEach(select => {
    select.addEventListener('change', updateVariant);
  });

  const mainImageContainer = document.getElementById('main-product-image');
  const thumbnails = document.querySelectorAll('[data-thumbnail]');

  if (mainImageContainer && thumbnails.length > 0) {
    // Store all product media for easy access
    const productMediaRaw = document.getElementById('product-media-data');
    const productMedia = productMediaRaw ? JSON.parse(productMediaRaw.textContent) : [];

    // Function to update main image
    function updateMainImage(mediaId) {
      const media = productMedia.find(m => m.id === mediaId);
      if (!media) return;
      const img = mainImageContainer.querySelector('img');
      if (img) {
        img.src = media.src;
        img.alt = media.alt;
      }
      thumbnails.forEach(thumb => {
        thumb.classList.remove('active');
        if (parseInt(thumb.dataset.mediaId) === mediaId) {
          thumb.classList.add('active');
        }
      });
    }

    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', function() {
        const mediaId = parseInt(this.dataset.mediaId);
        updateMainImage(mediaId);
      });
    });

    if (productMedia.length > 0) {
      const featuredMedia = productMedia.find(m => m.isFeatured);
      if (featuredMedia) {
        const featuredThumbnail = Array.from(thumbnails).find(thumb =>
          parseInt(thumb.dataset.mediaId) === featuredMedia.id
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
    greenDeductionWrapper.style.display = installationCheckbox.checked ? 'block' : 'none';
    installationCheckbox.addEventListener('change', function() {
      if (this.checked) {
        greenDeductionWrapper.style.display = 'block';
      } else {
        greenDeductionWrapper.style.display = 'none';
        const greenDeductionRadios = document.querySelectorAll('.green-deduction-radio');
        greenDeductionRadios.forEach(radio => {
          radio.checked = false;
        });
      }
    });
  }

  // Function to get selected discount code (supports radios and checkboxes)
  function getSelectedDiscountCode() {
    const selectedRadio = document.querySelector('.green-deduction-radio:checked, input[type="radio"][data-discount-code]:checked');
    if (selectedRadio) {
      const code = selectedRadio.dataset.discountCode || null;
      console.log('🔍 Discount (radio) selected:', code);
      return code;
    }
    const checkedCheckbox = document.querySelector('.green-deduction-checkbox:checked, input[type="checkbox"][data-discount-code]:checked');
    if (checkedCheckbox) {
      const code = checkedCheckbox.dataset.discountCode || null;
      console.log('🔍 Discount (checkbox) selected:', code);
      return code;
    }
    console.log('🔍 No discount selected');
    return null;
  }

  // Persist discount selection immediately on any discount input change and notify cart
  const discountInputs = document.querySelectorAll('.green-deduction-radio, .green-deduction-checkbox, [data-discount-code]');
  console.log('🧩 Discount inputs init - found count:', discountInputs ? discountInputs.length : 0);
  if (discountInputs && discountInputs.length > 0) {
    discountInputs.forEach((input) => {
      input.addEventListener('change', function() {
        console.log('🖱️ Discount input changed:', this.type, this.dataset.discountCode, 'checked:', this.checked);
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
    upsellCheckboxes.forEach(checkbox => {
      selectedUpsells.push({
        id: checkbox.dataset.variantId,
        quantity: 1
      });
    });
    return selectedUpsells;
  }

  // Buy Now functionality with upsells and installation
  let isBuyNowProcessing = false;
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', async function (e) {
      e.preventDefault();
      if (isBuyNowProcessing) {
        console.log('Already processing, please wait...');
        return;
      }
      const variantId = this.getAttribute('data-variant-id');
      const quantity = typeof getSelectedQuantity === 'function' ? getSelectedQuantity() : 1;
      const upsells = getSelectedUpsells();
      const discountCode = getSelectedDiscountCode();
      console.log('🛒 Buy Now clicked!');
      console.log('📦 Variant ID:', variantId);
      console.log('🎁 Discount Code:', discountCode || 'None selected');
      if (discountCode) {
        sessionStorage.setItem('selectedDiscountCode', discountCode);
        console.log('💾 Saved discount code to session:', discountCode);
      }
      const originalText = this.innerHTML;
      this.innerHTML = 'Behandlar...';
      this.disabled = true;
      isBuyNowProcessing = true;
      try {
        const items = [
          { id: variantId, quantity: quantity },
          ...upsells
        ];
        const installationCheckbox = document.getElementById('installation-checkbox');
        if (installationCheckbox && installationCheckbox.checked) {
          const installationVariantId = installationCheckbox.dataset.variantId;
          items.push({ id: installationVariantId, quantity: 1 });
        }
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items })
        });
        if (response.ok) {
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
        this.innerHTML = error.message.includes('många') ? 'Vänta...' : 'Fel!';
        this.style.background = '#EF4444';
        this.style.color = 'white';
        const resetDelay = error.message.includes('många') ? 3000 : 2000;
        setTimeout(() => {
          this.innerHTML = originalText;
          this.disabled = false;
          this.style.background = '';
          this.style.color = '';
          isBuyNowProcessing = false;
        }, resetDelay);
      }
    });
  }

  // Add to Cart functionality with upsells and installation
  let isAddToCartProcessing = false;
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', async function (e) {
      e.preventDefault();
      if (isAddToCartProcessing) {
        console.log('Already processing, please wait...');
        return;
      }
      const variantId = this.getAttribute('data-variant-id');
      const quantity = typeof getSelectedQuantity === 'function' ? getSelectedQuantity() : 1;
      const upsells = getSelectedUpsells();
      const discountCode = getSelectedDiscountCode();
      console.log('🛒 Add to Cart clicked!');
      console.log('🎁 Discount Code:', discountCode || 'None selected');
      if (discountCode) {
        sessionStorage.setItem('selectedDiscountCode', discountCode);
        console.log('💾 Saved discount code to session:', discountCode);
      }
      const originalText = this.innerHTML;
      this.innerHTML = 'Lägger till...';
      this.disabled = true;
      isAddToCartProcessing = true;
      try {
        const items = [
          { id: variantId, quantity: quantity },
          ...upsells
        ];
        const installationCheckbox = document.getElementById('installation-checkbox');
        if (installationCheckbox && installationCheckbox.checked) {
          const installationVariantId = installationCheckbox.dataset.variantId;
          items.push({ id: installationVariantId, quantity: 1 });
        }
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items })
        });
        if (response.ok) {
          await response.json();
          this.innerHTML = 'Tillagd! ✓';
          this.style.background = '#4ade80';
          this.style.color = 'white';
          window.dispatchEvent(new CustomEvent('cart:update'));
          const cartDrawer = document.getElementById('cart-drawer');
          const cartOverlay = document.querySelector('[data-cart-overlay]');
          if (cartDrawer) {
            cartDrawer.classList.add('open');
            if (cartOverlay) {
              cartOverlay.classList.add('active');
            }
            document.body.style.overflow = 'hidden';
          }
          setTimeout(() => {
            this.innerHTML = originalText;
            this.disabled = false;
            this.style.background = '';
            this.style.color = '';
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
        this.innerHTML = error.message.includes('många') ? 'Vänta...' : 'Fel!';
        this.style.background = '#EF4444';
        this.style.color = 'white';
        const resetDelay = error.message.includes('många') ? 3000 : 2000;
        setTimeout(() => {
          this.innerHTML = originalText;
          this.disabled = false;
          this.style.background = '';
          this.style.color = '';
          isAddToCartProcessing = false;
        }, resetDelay);
      }
    });
  }
});


