<script>
(() => {
  /** Formatera öre → SEK (sv-SE) */
  function formatMoney(cents) {
    try {
      return new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format((cents || 0) / 100);
    } catch (_) {
      return ((cents || 0) / 100).toFixed(2) + ' SEK';
    }
  }

  /** Hämta antal från mängdfält (fallback 1) */
  function getQuantity() {
    const qtyInput = document.querySelector('#quantity-input');
    const qty = qtyInput ? parseInt(qtyInput.value, 10) : 1;
    return isNaN(qty) || qty < 1 ? 1 : qty;
  }

  /** Robust tolkning av betal-sats (svenska format) */
  function parsePayRate(root) {
    // Tillåt "0,515", "0.515", "51,5%", "51.5%", "0,00515" (om 0,515%)
    const raw = (root.getAttribute('data-green-rate') || '').trim();
    if (!raw) return 0.515; // default = 51,5% att betala
    let s = raw.replace('%', '').replace(',', '.');
    let num = parseFloat(s);
    if (isNaN(num)) return 0.515;
    if (num > 1) num = num / 100; // 51,5 → 0.515
    // Begränsa [0..1]
    return Math.max(0, Math.min(num, 1));
  }

  /** Omräkning av pris och state */
  function recalc(root) {
    const toggle = root.querySelector('#green-tech-toggle');
    const countWrap = root.querySelector('#green-tech-count-wrap');
    const countSelect = root.querySelector('#green-tech-count');
    const summary = root.querySelector('#green-tech-summary');
    const deductionEl = root.querySelector('#green-tech-deduction');
    const finalEl = root.querySelector('#green-tech-final');
    const basePriceDisplay = root.querySelector('#base-price-display');
    const stateEl = root.querySelector('#green-tech-state-json');

    // Baspris i öre (cents)
    const baseUnitPrice = parseInt(root.getAttribute('data-base-price'), 10) || 0;
    // Ny betal-sats (andel av beloppet man BETALAR, ex 0.515 = 51,5 %)
    const payRate = parsePayRate(root);

    const quantity = getQuantity();
    const subtotal = baseUnitPrice * quantity;

    const state = { enabled: false, count: 1, payRate, subtotal, deduction: 0, final: subtotal };

    // När grön teknik är av (toggle ej vald)
    if (!toggle || !toggle.checked) {
      if (basePriceDisplay) basePriceDisplay.textContent = formatMoney(subtotal);
      if (countWrap) countWrap.style.display = 'none';
      if (summary) summary.style.display = 'none';
      if (stateEl) stateEl.value = JSON.stringify(state);
      // Töm kundvagnsattribut så ev. backend-funktion inte försöker applicera något
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

    // Cap: 50 000 kr per person i öre
    const capPerCount = 5_000_000;
    const totalCap = capPerCount * count; // 50k eller 100k

    // Räkna slutpris från betal-sats, härled avdrag
    const intendedFinal = Math.round(subtotal * payRate);
    const intendedDeduction = subtotal - intendedFinal;

    // Applicera cap på avdraget (inte på slutpriset)
    const deduction = Math.min(Math.max(intendedDeduction, 0), totalCap);
    const finalPrice = Math.max(subtotal - deduction, 0);

    if (basePriceDisplay) basePriceDisplay.textContent = formatMoney(subtotal);
    if (deductionEl) deductionEl.textContent = '− ' + formatMoney(deduction);
    if (finalEl) finalEl.textContent = formatMoney(finalPrice);
    if (summary) summary.style.display = 'block';

    const newState = { enabled: true, count, payRate, subtotal, deduction, final: finalPrice };
    if (stateEl) stateEl.value = JSON.stringify(newState);

    // Spara val i cart attributes för ev. Discount Function/uppföljning
    try {
      fetch('/cart/update.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attributes: { green_deductions: String(count) } })
      });
    } catch (_) {}
    return newState;
  }

  /** Hooka Add to Cart / Köp nu och skicka med properties */
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
          'Grön teknik – betal-sats': String(state.payRate),             // ex 0.515
          'Grön teknik – avdrag (SEK)': (state.deduction / 100).toFixed(2),
          'Belopp att betala (SEK)': (state.final / 100).toFixed(2)      // <- skickas till varukorgen som property
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
          document.dispatchEvent(new CustomEvent('cart:updated'));
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

  /** Lyssnare för UI */
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

    // Hooka ev. global kvantitetsfunktion
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

  /** Init */
  document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('[data-green-tech]');
    if (!root) return;
    recalc(root);
    attachListeners(root);
    hookAddToCart(root);
  });
})();
</script>
