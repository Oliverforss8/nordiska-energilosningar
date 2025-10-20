document.addEventListener('DOMContentLoaded', function () {
  // Find all carousel sections and initialize each one
  const carouselSections = document.querySelectorAll('.banner-med-2-produkter');

  carouselSections.forEach(function (section) {
    const carousel = section.querySelector('.carousel-track');
    const prevButton = section.querySelector('.carousel-prev');
    const nextButton = section.querySelector('.carousel-next');

    if (!carousel || !prevButton || !nextButton) return;

    const slides = carousel.querySelectorAll('.product-card');
    const totalSlides = slides.length;
    let currentSlide = 0;
    let autoChangeInterval;

    function updateCarousel() {
      const translateX = -currentSlide * 100;
      carousel.style.transform = `translateX(${translateX}%)`;
      carousel.setAttribute('data-current', currentSlide);

      // Update button states
      prevButton.disabled = currentSlide === 0;
      nextButton.disabled = currentSlide === totalSlides - 1;

      // Add visual feedback for disabled state
      if (prevButton.disabled) {
        prevButton.style.opacity = '0.5';
        prevButton.style.cursor = 'not-allowed';
      } else {
        prevButton.style.opacity = '1';
        prevButton.style.cursor = 'pointer';
      }

      if (nextButton.disabled) {
        nextButton.style.opacity = '0.5';
        nextButton.style.cursor = 'not-allowed';
      } else {
        nextButton.style.opacity = '1';
        nextButton.style.cursor = 'pointer';
      }
    }

    function nextSlide() {
      if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateCarousel();
      }
    }

    function prevSlide() {
      if (currentSlide > 0) {
        currentSlide--;
        updateCarousel();
      }
    }

    function startAutoChange() {
      if (totalSlides > 1) {
        autoChangeInterval = setInterval(nextSlide, 8000); // 8 seconds
      }
    }

    function stopAutoChange() {
      if (autoChangeInterval) {
        clearInterval(autoChangeInterval);
      }
    }

    function restartAutoChange() {
      stopAutoChange();
      startAutoChange();
    }

    // Event listeners
    nextButton.addEventListener('click', function (e) {
      e.preventDefault();
      nextSlide();
      restartAutoChange(); // Restart timer when user interacts
    });

    prevButton.addEventListener('click', function (e) {
      e.preventDefault();
      prevSlide();
      restartAutoChange(); // Restart timer when user interacts
    });

    // Pause auto-change on hover
    const carouselContainer = section.querySelector('.carousel-container');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', stopAutoChange);
      carouselContainer.addEventListener('mouseleave', startAutoChange);
    }

    // Initialize carousel
    updateCarousel();

    // Start auto-change
    startAutoChange();

    // Handle touch events for swipe gestures
    let startX = 0;
    let isDragging = false;

    carousel.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      isDragging = true;
      stopAutoChange();
    });

    carousel.addEventListener('touchmove', function (e) {
      if (!isDragging) return;
      e.preventDefault();
    });

    carousel.addEventListener('touchend', function (e) {
      if (!isDragging) return;
      isDragging = false;

      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;

      if (Math.abs(diffX) > 50) {
        // Minimum swipe distance
        if (diffX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }

      restartAutoChange();
    });
  });

  // Handle desktop product card hover behavior - EXACT same logic as collection page
  const bannerSections = document.querySelectorAll('.banner-med-2-produkter');

  bannerSections.forEach(function (section) {
    // Get desktop grid container
    const desktopGrid = section.querySelector('[id^="desktop-products-grid-"]');
    if (!desktopGrid) return;

    const productCards = desktopGrid.querySelectorAll('.product-card');

    if (productCards.length === 0) return;

    productCards.forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        // Remove active class from all cards
        productCards.forEach(function (otherCard) {
          otherCard.classList.remove('active');
        });

        // Add active class to hovered card
        this.classList.add('active');
      });
    });

    // Handle mouse leave from the entire grid to reset to first item
    desktopGrid.addEventListener('mouseleave', function () {
      // Remove active class from all cards
      productCards.forEach(function (card) {
        card.classList.remove('active');
      });

      // Add active class back to first card
      if (productCards.length > 0) {
        productCards[0].classList.add('active');
      }
    });
  });
});
