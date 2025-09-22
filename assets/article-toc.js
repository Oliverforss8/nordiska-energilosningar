function addHeadingIds() {
  console.log('Adding heading IDs...');

  // Try multiple selectors to find the article content
  let articleContent = document.getElementById('article-content');
  if (!articleContent) {
    articleContent = document.querySelector('.rte');
  }
  if (!articleContent) {
    articleContent = document.querySelector('article');
  }

  if (!articleContent) {
    console.log('Article content not found, trying document.body...');
    articleContent = document.body;
  }

  console.log('Using container:', articleContent);

  const headings = articleContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
  console.log('Found headings:', headings.length);

  if (headings.length === 0) {
    console.log('No headings found, trying to find any h tags...');
    const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    console.log('All headings in document:', allHeadings.length);
  }

  headings.forEach(function (heading, index) {
    const text = heading.textContent.trim();
    console.log('Processing heading:', text);

    if (!heading.id) {
      let id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

      // Ensure unique IDs
      if (id === '') {
        id = 'heading-' + (index + 1);
      }

      // Check if ID already exists and make it unique
      let originalId = id;
      let counter = 1;
      while (document.getElementById(id)) {
        id = originalId + '-' + counter;
        counter++;
      }

      heading.id = id;
      console.log('Added ID to heading:', text, '->', id);

      // Verify the ID was actually added
      console.log('Heading now has ID:', heading.id);
    } else {
      console.log('Heading already has ID:', text, '->', heading.id);
    }
  });
}

function setupTocLinks() {
  const tocLinks = document.querySelectorAll('nav a[href^="#"]');
  console.log('Found TOC links:', tocLinks.length);

  tocLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      console.log(
        'Clicking TOC link:',
        targetId,
        'Found element:',
        !!targetElement
      );

      if (targetElement) {
        // Calculate offset for fixed header or breathing room
        const headerOffset = 160; // Adjust this value as needed
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      } else {
        console.log('Target element not found:', targetId);
        // Try to find it manually
        const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        console.log('All headings with IDs:');
        allHeadings.forEach(h => {
          if (h.id) {
            console.log('- ' + h.textContent.trim() + ' -> ' + h.id);
          }
        });
      }
    });
  });
}

// Try multiple times to ensure content is loaded
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM loaded, adding heading IDs...');
  addHeadingIds();
  setupTocLinks();
});

// Try after a short delay
setTimeout(function () {
  console.log('Timeout: adding heading IDs...');
  addHeadingIds();
  setupTocLinks();
}, 500);

// Try after a longer delay
setTimeout(function () {
  console.log('Long timeout: adding heading IDs...');
  addHeadingIds();
  setupTocLinks();
}, 2000);

// Try with MutationObserver to catch dynamically loaded content
if (window.MutationObserver) {
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        console.log('Content changed, trying to add heading IDs...');
        addHeadingIds();
        setupTocLinks();
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
