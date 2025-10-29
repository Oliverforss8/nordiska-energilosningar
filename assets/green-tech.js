(() => {
  function formatMoney(cents) {
    try {
      return new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format((cents || 0) / 100);
    } catch (_) {
      return ((cents || 0) / 100).toFixed(2) + ' SEK';
    }
  }

  function getQuantity() {
    const qtyInput = document.querySelector('#quantity-input');
    const qty = qtyInput ? parseInt(qtyInput.value, 10) : 1;
    return isNaN(qty) || qty < 1 ? 1 : qty;
  }

  function recalc(root) {
    const toggle = root.querySelector('#green-tech-toggle');
    const countWrap = root.querySelector('#green-tech-count-wrap');
    const countSelect = root.querySelector('#green-tech-count');
    const summary = root.querySelector('#green-tech-summary');
    const deductionEl = root.querySelector('#green-tech-deduction');
    const finalEl = root.querySelector('#green-tech-final');
    const basePriceDisplay = root.querySelector('#base-price-display');
    const stateEl = root.querySelector('#green-tech-state-json');

    const baseUnitPrice = parseInt(root.getAttribute('data-base-price'), 10) || 0; // cents
    const rate = parseFloat(root.getAttribute('data-green-rate')) || 0.53;

    const quantity = getQuantity();
    const subtotal = baseUnitPrice * quantity;

    const state = { enabled: false, count: 1, rate, subtotal, deduction: 0, final: subtotal };

    if (!toggle || !toggle.checked) {
      if (basePriceDisplay) basePriceDisplay.textContent = formatMoney(subtotal);
      if (countWrap) countWrap.style.display = 'none';
      if (summary) summary.style.display = 'none';
      if (stateEl) stateEl.value = JSON.stringify(state);
      // Update cart attribute so Function doesn't apply discount
      try {
        fetch('/cart/update.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attributes: { green_deductions: '' } })
        });
      } catch (_) {}
      return state;
    }

    if (countWrap) countWrap.style.display = 'flex';
    const count = countSelect ? (parseInt(countSelect.value, 10) === 2 ? 2 : 1) : 1;

    const capPerCount = 5000000; // 50,000 SEK in cents
    const totalCap = capPerCount * count; // 50k or 100k

    const potentialDeduction = Math.round(subtotal * rate);
    const deduction = Math.min(potentialDeduction, totalCap);
    const finalPrice = Math.max(subtotal - deduction, 0);

    if (basePriceDisplay) basePriceDisplay.textContent = formatMoney(subtotal);
    if (deductionEl) deductionEl.textContent = '− ' + formatMoney(deduction);
    if (finalEl) finalEl.textContent = formatMoney(finalPrice);
    if (summary) summary.style.display = 'block';

    const newState = { enabled: true, count, rate, subtotal, deduction, final: finalPrice };
    if (stateEl) stateEl.value = JSON.stringify(newState);
    // Persist selection to cart attribute for Discount Function
    try {
      fetch('/cart/update.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attributes: { green_deductions: String(count) } })
      });
    } catch (_) {}
    return newState;
  }

  function hookAddToCart(root) {
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const buyNowBtn = document.querySelector('.buy-now-btn');

    async function addWithProperties(variantId, quantity, properties, redirectToCheckout) {
      const payload = { id: variantId, quantity, properties };
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Failed to add to cart');
      if (redirectToCheckout) window.location.href = '/checkout';
    }

    function getGreenProperties() {
      try {
        const stateEl = root.querySelector('#green-tech-state-json');
        const state = stateEl ? JSON.parse(stateEl.value || '{}') : {};
        if (!state.enabled) return {};
        return {
          'Grön teknik': 'Ja',
          'Grön teknik – antal': String(state.count),
          'Grön teknik – sats': String(state.rate),
          'Grön teknik – avdrag (SEK)': (state.deduction / 100).toFixed(2),
          'Pris efter avdrag (SEK)': (state.final / 100).toFixed(2)
        };
      } catch (_) {
        return {};
      }
    }

    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', async function (e) {
        e.preventDefault();
        const variantId = this.getAttribute('data-variant-id');
        const quantity = getQuantity();
        const props = getGreenProperties();
        try {
          await addWithProperties(variantId, quantity, props, false);
          // Open cart drawer if available
          const drawerOpenEvent = new CustomEvent('cart:updated');
          document.dispatchEvent(drawerOpenEvent);
        } catch (err) {
          console.error(err);
        }
      });
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener('click', async function (e) {
        e.preventDefault();
        const variantId = this.getAttribute('data-variant-id');
        const quantity = getQuantity();
        const props = getGreenProperties();
        try {
          await addWithProperties(variantId, quantity, props, true);
        } catch (err) {
          console.error(err);
        }
      });
    }
  }

  function attachListeners(root) {
    const toggle = root.querySelector('#green-tech-toggle');
    const countSelect = root.querySelector('#green-tech-count');
    const qtyInput = document.querySelector('#quantity-input');

    const run = () => recalc(root);

    if (toggle) toggle.addEventListener('change', run);
    if (countSelect) countSelect.addEventListener('change', run);
    if (qtyInput) {
      qtyInput.addEventListener('change', run);
      qtyInput.addEventListener('input', run);
    }

    // Hook into existing global quantity function if present
    if (window.updateQuantity && !window.__greenPatched) {
      const original = window.updateQuantity;
      window.updateQuantity = function(delta) {
        const result = original.call(this, delta);
        setTimeout(run, 0);
        return result;
      };
      window.__greenPatched = true;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('[data-green-tech]');
    if (!root) return;
    // initial calc
    recalc(root);
    // listeners
    attachListeners(root);
    // wire cart/checkout
    hookAddToCart(root);
  });
})();



