// Quantity selector functionality - Global functions
window.updateQuantity = function (change) {
  const quantityInput = document.getElementById('quantity-input');
  const quantityDisplay = document.getElementById('quantity-display');

  if (!quantityInput || !quantityDisplay) {
    console.log('Quantity elements not found');
    return;
  }

  const currentQuantity = parseInt(quantityInput.value) || 1;
  const maxQuantity = parseInt(quantityInput.max) || 99;
  const newQuantity = Math.max(
    1,
    Math.min(currentQuantity + change, maxQuantity)
  );

  console.log('Updating quantity from', currentQuantity, 'to', newQuantity); // Debug

  quantityInput.value = newQuantity;
  quantityDisplay.textContent = newQuantity;

  // Update button states
  updateQuantityButtons();
};

function updateQuantityButtons() {
  const quantityInput = document.getElementById('quantity-input');
  const decreaseBtn = document.querySelector('.quantity-decrease');
  const increaseBtn = document.querySelector('.quantity-increase');

  if (!quantityInput || !decreaseBtn || !increaseBtn) return;

  const currentQuantity = parseInt(quantityInput.value) || 1;
  const maxQuantity = parseInt(quantityInput.max) || 99;

  // Disable decrease button if at minimum
  if (currentQuantity <= 1) {
    decreaseBtn.disabled = true;
    decreaseBtn.classList.add('opacity-50', 'cursor-not-allowed');
  } else {
    decreaseBtn.disabled = false;
    decreaseBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  }

  // Disable increase button if at maximum
  if (currentQuantity >= maxQuantity) {
    increaseBtn.disabled = true;
    increaseBtn.classList.add('opacity-50', 'cursor-not-allowed');
  } else {
    increaseBtn.disabled = false;
    increaseBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  }
}

function getSelectedQuantity() {
  const quantityInput = document.getElementById('quantity-input');
  return parseInt(quantityInput.value) || 1;
}

// Initialize quantity buttons after DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  console.log('Initializing quantity selector'); // Debug
  updateQuantityButtons();
});
