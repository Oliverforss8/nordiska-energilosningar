/**
 * Related Products Carousel functionality
 * Handles mobile carousel navigation for related products
 */
class RelatedProductsCarousel {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.bindEvents());
    } else {
      this.bindEvents();
    }
  }

  bindEvents() {
    const carouselTrack = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');

    if (!carouselTrack || !prevButton || !nextButton) {
      return; // Exit if elements not found
    }

    const cards = carouselTrack.querySelectorAll('.product-card');
    const totalCards = cards.length;
    let currentIndex = 0;

    // Update carousel position
    const updateCarousel = () => {
      const translateX = -currentIndex * 100;
      carouselTrack.style.transform = `translateX(${translateX}%)`;
      carouselTrack.setAttribute('data-current', currentIndex);
    };

    // Previous button click
    prevButton.addEventListener('click', () => {
      currentIndex = currentIndex > 0 ? currentIndex - 1 : totalCards - 1;
      updateCarousel();
    });

    // Next button click
    nextButton.addEventListener('click', () => {
      currentIndex = currentIndex < totalCards - 1 ? currentIndex + 1 : 0;
      updateCarousel();
    });

    // Touch/swipe support for mobile
    let startX = 0;
    let isDragging = false;

    carouselTrack.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    carouselTrack.addEventListener('touchmove', e => {
      if (!isDragging) return;
      e.preventDefault();
    });

    carouselTrack.addEventListener('touchend', e => {
      if (!isDragging) return;
      isDragging = false;

      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;

      // Minimum swipe distance
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // Swipe left - next
          currentIndex = currentIndex < totalCards - 1 ? currentIndex + 1 : 0;
        } else {
          // Swipe right - previous
          currentIndex = currentIndex > 0 ? currentIndex - 1 : totalCards - 1;
        }
        updateCarousel();
      }
    });

    // Auto-play (optional)
    if (totalCards > 1) {
      setInterval(() => {
        currentIndex = currentIndex < totalCards - 1 ? currentIndex + 1 : 0;
        updateCarousel();
      }, 5000); // Change slide every 5 seconds
    }
  }
}

// Initialize carousel when script loads
new RelatedProductsCarousel();
