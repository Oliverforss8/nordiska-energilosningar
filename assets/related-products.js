document.addEventListener('DOMContentLoaded', function () {
  console.log('Related products JS loaded'); // Debug
  // Find the related products section
  const section = document.querySelector('.section-relaterade-produkter');
  console.log('Section found:', section); // Debug
  if (!section) {
    console.log('No section found with class .section-relaterade-produkter'); // Debug
    return;
  }

  // Carousel functionality
  const carousel = section.querySelector('.carousel-track');
  const prevButton = section.querySelector('.carousel-prev');
  const nextButton = section.querySelector('.carousel-next');

  if (carousel && prevButton && nextButton) {
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
      restartAutoChange();
    });

    prevButton.addEventListener('click', function (e) {
      e.preventDefault();
      prevSlide();
      restartAutoChange();
    });

    // Pause auto-change on hover
    const carouselContainer = section.querySelector('.carousel-container');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', stopAutoChange);
      carouselContainer.addEventListener('mouseleave', startAutoChange);
    }

    // Initialize carousel
    updateCarousel();
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
        if (diffX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }

      restartAutoChange();
    });
  }

  // Handle desktop product card hover behavior
  const desktopGrid = section.querySelector(
    '.hidden.md\\:grid, [class*="grid-cols-3"]'
  );
  console.log('Desktop grid found:', desktopGrid); // Debug
  if (desktopGrid) {
    const productCards = desktopGrid.querySelectorAll('.product-card');
    const learnMoreButtons = desktopGrid.querySelectorAll(
      '.banner-3-learn-more-btn'
    );
    const buyNowButtons = desktopGrid.querySelectorAll('.buy-now-btn');

    console.log('Product cards found:', productCards.length); // Debug
    console.log('Learn more buttons found:', learnMoreButtons.length); // Debug
    console.log('Buy now buttons found:', buyNowButtons.length); // Debug

    if (productCards.length > 0) {
      function resetToFirstCard() {
        // Clear all active states
        productCards.forEach(card => (card.style.backgroundColor = ''));
        learnMoreButtons.forEach(btn =>
          btn.classList.remove('banner-3-active')
        );
        buyNowButtons.forEach(btn => btn.classList.remove('banner-3-active'));

        // Set first card active
        if (productCards[0]) {
          productCards[0].style.backgroundColor = '#f3f1e8';
          if (learnMoreButtons[0]) {
            learnMoreButtons[0].classList.add('banner-3-active');
          }
          if (buyNowButtons[0]) {
            buyNowButtons[0].classList.add('banner-3-active');
          }
        }
      }

      function setCardActive(index) {
        console.log('Setting card active:', index); // Debug
        // Clear all active states
        productCards.forEach(card => (card.style.backgroundColor = ''));
        learnMoreButtons.forEach(btn =>
          btn.classList.remove('banner-3-active')
        );
        buyNowButtons.forEach(btn => btn.classList.remove('banner-3-active'));

        // Set current card active
        if (productCards[index]) {
          console.log('Setting background for card:', index); // Debug
          productCards[index].style.backgroundColor = '#f3f1e8';
          if (learnMoreButtons[index]) {
            learnMoreButtons[index].classList.add('banner-3-active');
            console.log('Added active to learn more button:', index); // Debug
          }
          if (buyNowButtons[index]) {
            buyNowButtons[index].classList.add('banner-3-active');
            console.log('Added active to buy now button:', index); // Debug
          }
        }
      }

      // Initialize first card as active
      resetToFirstCard();

      // Add hover events to each card
      productCards.forEach(function (card, index) {
        card.addEventListener('mouseenter', function () {
          console.log('Card hovered:', index); // Debug
          setCardActive(index);
        });
      });

      // Reset to first card when leaving the entire grid
      desktopGrid.addEventListener('mouseleave', function () {
        resetToFirstCard();
      });
    }
  }

  // Buy Now functionality for related products
  const buyNowButtons = section.querySelectorAll('.buy-now-btn');
  buyNowButtons.forEach(button => {
    button.addEventListener('click', async function (e) {
      e.preventDefault();
      console.log('Buy now button clicked from related products'); // Debug

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
          const errorData = await response.json();
          console.error('Cart add error:', errorData);
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
  });
});
