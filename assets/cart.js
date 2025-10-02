// Cart functionality
document.addEventListener('DOMContentLoaded', function () {
  // Cart functionality
  const cartToggle = document.querySelector('[data-cart-toggle]');
  const cartDrawer = document.querySelector('[data-cart-drawer]');
  const cartOverlay = document.querySelector('[data-cart-overlay]');
  const cartClose = document.querySelector('[data-cart-close]');
  const cartCount = document.querySelector('[data-cart-count]');
  const cartTotal = document.querySelector('[data-cart-total]');
  // Removed cart empty state
  const cartItemsList = document.querySelector('[data-cart-items-list]');

  // Debug: Check if elements are found
  console.log('Cart elements found:', {
    cartToggle: !!cartToggle,
    cartDrawer: !!cartDrawer,
    cartOverlay: !!cartOverlay,
    cartClose: !!cartClose,
  });

  // Open cart drawer
  function openCart() {
    console.log('Opening cart drawer');
    if (cartDrawer) {
      console.log('Adding open class to cart drawer');
      cartDrawer.classList.add('open');
      console.log('Cart drawer classes:', cartDrawer.className);
    }
    if (cartOverlay) {
      cartOverlay.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
    loadCartData();
  }

  // Close cart drawer
  function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Clear entire cart
  async function clearCart() {
    try {
      await fetch('/cart/clear.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // Reload cart data and UI after clearing
      await loadCartData();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }

  // Expose clearCart globally for UI bindings
  window.clearCart = clearCart;

  // Load cart data from Shopify
  async function loadCartData() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      updateCartUI(cart);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }

  // Update cart UI
  function updateCartUI(cart) {
    // Update cart count
    const itemCount = cart.item_count;
    if (cartCount) {
      cartCount.textContent = itemCount;

      if (itemCount > 0) {
        cartCount.classList.add('show');
      } else {
        cartCount.classList.remove('show');
      }
    }

    // Update total
    if (cartTotal) {
      cartTotal.textContent = formatMoney(cart.total_price);
    }

    // Update items list
    if (cartItemsList) {
      cartItemsList.innerHTML = cart.items.map((item) => createCartItemHTML(item)).join('');

      // Add event listeners to quantity buttons
      addQuantityListeners();
    }
  }

  // Create cart item HTML
  function createCartItemHTML(item) {
    return `
       <div class="cart-item" data-key="${item.key}">
         <img src="${item.image}" alt="${item.title}" class="cart-item-image" width="70" height="70">
         <div class="cart-item-details">
           <div class="cart-item-header">
             <div class="cart-item-title">${item.product_title}</div>
             <div class="cart-item-price">${formatMoney(item.final_line_price)}</div>
           </div>
           ${item.variant_title ? `<div class="cart-item-variant">${item.variant_title}</div>` : ''}
           <div class="cart-item-controls">
             <div class="cart-item-quantity">
               <button class="quantity-btn" data-action="decrease" data-key="${item.key}">−</button>
               <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-key="${item.key}">
               <button class="quantity-btn" data-action="increase" data-key="${item.key}">+</button>
             </div>
             <button class="cart-item-remove" data-key="${item.key}">Ta bort</button>
           </div>
         </div>
       </div>
     `;
  }

  // Add quantity change listeners
  function addQuantityListeners() {
    if (!cartItemsList) return;

    const quantityBtns = cartItemsList.querySelectorAll('.quantity-btn');
    const quantityInputs = cartItemsList.querySelectorAll('.quantity-input');
    const removeBtns = cartItemsList.querySelectorAll('.cart-item-remove');

    quantityBtns.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const key = e.target.dataset.key;
        const action = e.target.dataset.action;
        const input = cartItemsList.querySelector(`input[data-key="${key}"]`);
        let quantity = parseInt(input.value);

        if (action === 'increase') {
          quantity++;
        } else if (action === 'decrease' && quantity > 1) {
          quantity--;
        }

        await updateCartItem(key, quantity);
      });
    });

    quantityInputs.forEach((input) => {
      input.addEventListener('change', async (e) => {
        const key = e.target.dataset.key;
        const quantity = Math.max(1, parseInt(e.target.value));
        await updateCartItem(key, quantity);
      });
    });

    removeBtns.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const key = e.target.dataset.key;
        await updateCartItem(key, 0);
      });
    });
  }

  // Update cart item quantity
  async function updateCartItem(key, quantity) {
    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: key,
          quantity: quantity,
        }),
      });

      const cart = await response.json();
      updateCartUI(cart);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  }

  // Format money
  function formatMoney(cents) {
    return (cents / 100).toLocaleString('sv-SE', {
      style: 'currency',
      currency: 'SEK',
    });
  }

  // Event listeners
  if (cartToggle) {
    cartToggle.addEventListener('click', function (e) {
      e.preventDefault();
      console.log('Cart button clicked');
      openCart();
    });
  }

  if (cartClose) {
    cartClose.addEventListener('click', closeCart);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
  }

  // Close cart with escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartDrawer && cartDrawer.classList.contains('open')) {
      closeCart();
    }
  });

  // Load initial cart data
  loadCartData();

  // Listen for cart update events from product page
  window.addEventListener('cart:update', function() {
    loadCartData();
  });
});

// Add to cart functionality
document.addEventListener('DOMContentLoaded', function () {
  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  const buyNowBtn = document.querySelector('.buy-now-btn');
  const cartToggle = document.querySelector('[data-cart-toggle]');

  // Buy Now functionality - add to cart and go to checkout
  if (buyNowBtn) {
    console.log('Buy now button found:', buyNowBtn); // Debug
    buyNowBtn.addEventListener('click', async function (e) {
      e.preventDefault();
      console.log('Buy now button clicked'); // Debug

      const variantId = this.getAttribute('data-variant-id');
      const quantity = 1;

      console.log('Variant ID:', variantId); // Debug

      // Show loading state
      const originalText = this.innerHTML;
      this.innerHTML = 'Behandlar...';
      this.disabled = true;

      try {
        console.log('Adding to cart...'); // Debug
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: variantId,
            quantity: quantity,
          }),
        });

        console.log('Cart add response:', response); // Debug

        if (response.ok) {
          console.log('Success - redirecting to checkout'); // Debug
          // Success - redirect to checkout
          window.location.href = '/checkout';
        } else {
          throw new Error('Failed to add to cart');
        }
      } catch (error) {
        console.error('Error with buy now:', error);

        // Show error state
        this.innerHTML = 'Fel!';
        this.style.background = '#EF4444';
        this.style.color = 'white';

        // Reset button after 2 seconds
        setTimeout(() => {
          this.innerHTML = originalText;
          this.disabled = false;
          this.style.background = '';
          this.style.color = '';
        }, 2000);
      }
    });
  } else {
    console.log('Buy now button not found'); // Debug
  }

  // Add to Cart functionality
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', async function (e) {
      e.preventDefault();

      const variantId = this.getAttribute('data-variant-id');
      const quantity = 1; // Default quantity

      // Show loading state
      const originalText = this.innerHTML;
      this.innerHTML = 'Lägger till...';
      this.disabled = true;

      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: variantId,
            quantity: quantity,
          }),
        });

        if (response.ok) {
          // Success - show success message
          this.innerHTML = 'Tillagd!';
          this.style.background = '#10B981';
          this.style.borderColor = '#10B981';
          this.style.color = 'white';

          // Open cart drawer
          if (cartToggle) {
            cartToggle.click();
          }

          // Reset button after 2 seconds
          setTimeout(() => {
            this.innerHTML = originalText;
            this.disabled = false;
            this.style.background = '';
            this.style.borderColor = '#171717';
            this.style.color = '';
          }, 2000);
        } else {
          throw new Error('Failed to add to cart');
        }
      } catch (error) {
        console.error('Error adding to cart:', error);

        // Show error state
        this.innerHTML = 'Fel!';
        this.style.background = '#EF4444';
        this.style.borderColor = '#EF4444';
        this.style.color = 'white';

        // Reset button after 2 seconds
        setTimeout(() => {
          this.innerHTML = originalText;
          this.disabled = false;
          this.style.background = '';
          this.style.borderColor = '#171717';
          this.style.color = '';
        }, 2000);
      }
    });
  }
});
