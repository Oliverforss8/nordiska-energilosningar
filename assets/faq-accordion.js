/**
 * FAQ Accordion functionality
 * Handles opening/closing of FAQ items with smooth animations
 */
class FAQAccordion {
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
    const faqItems = document.querySelectorAll('.faq-item');
    console.log('FAQ items found:', faqItems.length);

    faqItems.forEach((faqItem) => {
      faqItem.addEventListener('click', (e) => this.handleItemClick(e, faqItem));
    });
  }

  handleItemClick(event, faqItem) {
    event.preventDefault();
    console.log('FAQ item clicked');

    const answer = faqItem.querySelector('.faq-answer');
    const icon = faqItem.querySelector('.faq-icon');
    const isExpanded = faqItem.getAttribute('aria-expanded') === 'true';

    console.log('Answer found:', !!answer);
    console.log('Icon found:', !!icon);
    console.log('Is expanded:', isExpanded);

    // Close all other FAQ items
    this.closeAllFAQs(faqItem);

    // Toggle current FAQ item
    if (isExpanded) {
      this.closeFAQ(faqItem, answer, icon);
    } else {
      this.openFAQ(faqItem, answer, icon);
    }
  }

  closeAllFAQs(currentItem) {
    const allItems = document.querySelectorAll('.faq-item');

    allItems.forEach((faqItem) => {
      if (faqItem !== currentItem) {
        const answer = faqItem.querySelector('.faq-answer');
        const icon = faqItem.querySelector('.faq-icon');
        this.closeFAQ(faqItem, answer, icon);
      }
    });
  }

  openFAQ(faqItem, answer, icon) {
    faqItem.setAttribute('aria-expanded', 'true');
    answer.setAttribute('aria-hidden', 'false');
    answer.classList.remove('max-h-0');
    answer.classList.add('max-h-96');
    if (icon) {
      icon.style.transform = 'rotate(45deg)';
    }
  }

  closeFAQ(faqItem, answer, icon) {
    faqItem.setAttribute('aria-expanded', 'false');
    answer.setAttribute('aria-hidden', 'true');
    answer.classList.remove('max-h-96');
    answer.classList.add('max-h-0');
    if (icon) {
      icon.style.transform = 'rotate(0deg)';
    }
  }
}

// Initialize FAQ accordion when script loads
new FAQAccordion();
