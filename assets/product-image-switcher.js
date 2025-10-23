/**
 * Product Image Switcher
 * Handles switching the main product image when clicking on thumbnails
 */

class ProductImageSwitcher {
  constructor() {
    this.mainImageContainer = document.getElementById('main-product-image');
    this.thumbnails = document.querySelectorAll('[data-thumbnail]');

    if (!this.mainImageContainer || this.thumbnails.length === 0) {
      return;
    }

    this.init();
  }

  init() {
    this.thumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener('click', (e) => this.handleThumbnailClick(e));
    });
  }

  handleThumbnailClick(e) {
    const thumbnail = e.currentTarget;
    const mediaId = thumbnail.dataset.mediaId;

    if (!mediaId) return;

    // Find the image element inside the thumbnail
    const thumbnailImg = thumbnail.querySelector('img');

    if (!thumbnailImg) return;

    // Get image data from thumbnail
    const newImageSrc = thumbnailImg.src;
    const newImageSrcset = thumbnailImg.srcset;
    const newImageAlt = thumbnailImg.alt;
    const newImageWidth = thumbnailImg.width;
    const newImageHeight = thumbnailImg.height;

    // Update the main image
    const mainImg = this.mainImageContainer.querySelector('img');

    if (mainImg) {
      mainImg.src = newImageSrc;
      if (newImageSrcset) {
        mainImg.srcset = newImageSrcset;
      }
      mainImg.alt = newImageAlt;

      // Update width and height attributes if they exist
      if (newImageWidth) {
        mainImg.width = newImageWidth;
      }
      if (newImageHeight) {
        mainImg.height = newImageHeight;
      }

      // Add a subtle fade effect
      mainImg.style.opacity = '0';
      setTimeout(() => {
        mainImg.style.opacity = '1';
      }, 50);
    }

    // Update active state on thumbnails (optional visual feedback)
    this.thumbnails.forEach((thumb) => {
      thumb.classList.remove('active');
    });
    thumbnail.classList.add('active');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ProductImageSwitcher();
  });
} else {
  new ProductImageSwitcher();
}
