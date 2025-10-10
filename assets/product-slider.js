/**
 * Product Slider Component
 * Handles horizontal sliding of product cards
 */

class ProductSlider {
  constructor(slider) {
    this.slider = slider;
    this.track = slider.querySelector('[data-slider-track]');
    this.prevButton = slider.parentElement.querySelector('[data-slider-prev]');
    this.nextButton = slider.parentElement.querySelector('[data-slider-next]');
    this.progressBar = slider.parentElement.querySelector('[data-slider-progress]');

    if (!this.track) return;

    this.currentIndex = 0;
    this.itemsPerView = this.getItemsPerView();
    this.totalItems = this.track.children.length;

    this.init();
  }

  init() {
    // Add event listeners
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => this.prev());
    }
    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => this.next());
    }

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.itemsPerView = this.getItemsPerView();
        this.updateSlider();
      }, 250);
    });

    // Initialize button states
    this.updateButtons();

    // Touch/swipe support
    this.addTouchSupport();
  }

  getItemsPerView() {
    const width = window.innerWidth;
    if (width >= 1280) return 4; // xl breakpoint - 4 full cards
    if (width >= 768) return 2; // md breakpoint - 2 full cards
    return 1.5; // mobile - 1.5 cards (show peek of next card)
  }

  next() {
    const maxIndex = Math.max(0, this.totalItems - this.itemsPerView);
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
      this.updateSlider();
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateSlider();
    }
  }

  updateSlider() {
    // Calculate the offset
    const item = this.track.children[0];
    if (!item) return;

    const itemWidth = item.offsetWidth;
    const gap = parseInt(getComputedStyle(this.track).gap) || 20;
    const offset = -(this.currentIndex * (itemWidth + gap));

    // Apply transform
    this.track.style.transform = `translateX(${offset}px)`;

    // Update button states
    this.updateButtons();

    // Update progress bar
    this.updateProgressBar();
  }

  updateButtons() {
    const maxIndex = Math.max(0, this.totalItems - this.itemsPerView);

    if (this.prevButton) {
      this.prevButton.disabled = this.currentIndex === 0;
    }

    if (this.nextButton) {
      this.nextButton.disabled = this.currentIndex >= maxIndex;
    }
  }

  updateProgressBar() {
    if (!this.progressBar) return;

    // Calculate progress
    const maxIndex = Math.max(0, this.totalItems - this.itemsPerView);
    if (maxIndex === 0) {
      this.progressBar.style.width = '100%';
      this.progressBar.style.transform = 'translateX(0)';
      return;
    }

    // Calculate the width of the progress bar
    const progressWidth = (1 / this.totalItems) * 100;

    // Calculate the position based on current index
    const progressPosition = (this.currentIndex / this.totalItems) * 100;

    this.progressBar.style.width = `${progressWidth * this.itemsPerView}%`;
    this.progressBar.style.transform = `translateX(${(progressPosition / (progressWidth * this.itemsPerView)) * 100}%)`;
  }

  addTouchSupport() {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    this.track.addEventListener(
      'touchstart',
      (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        this.track.style.transition = 'none';
      },
      { passive: true }
    );

    this.track.addEventListener(
      'touchmove',
      (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diff = currentX - startX;

        const item = this.track.children[0];
        const itemWidth = item.offsetWidth;
        const gap = parseInt(getComputedStyle(this.track).gap) || 20;
        const baseOffset = -(this.currentIndex * (itemWidth + gap));

        this.track.style.transform = `translateX(${baseOffset + diff}px)`;
      },
      { passive: true }
    );

    this.track.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      this.track.style.transition = '';

      const diff = currentX - startX;
      const threshold = 50;

      if (diff > threshold) {
        this.prev();
      } else if (diff < -threshold) {
        this.next();
      } else {
        this.updateSlider();
      }
    });
  }
}

// Initialize all sliders on the page
document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('[data-slider]');
  sliders.forEach((slider) => new ProductSlider(slider));
});

// Re-initialize on Shopify section reload (for theme editor)
if (window.Shopify && window.Shopify.designMode) {
  document.addEventListener('shopify:section:load', (event) => {
    const slider = event.target.querySelector('[data-slider]');
    if (slider) {
      new ProductSlider(slider);
    }
  });
}
