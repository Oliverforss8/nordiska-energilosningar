document.addEventListener('DOMContentLoaded', function () {
  const carousel = document.querySelector('.image-carousel');
  if (!carousel) return;

  const images = carousel.querySelectorAll('.carousel-image');
  const dots = document.querySelectorAll('.carousel-dot');
  let currentIndex = 0;

  function showImage(index) {
    images.forEach((img, i) => {
      img.style.opacity = i === index ? '1' : '0';
    });

    dots.forEach((dot, i) => {
      dot.style.opacity = i === index ? '1' : '0.3';
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      showImage(currentIndex);
    });
  });

  if (images.length > 1) {
    setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    }, 5000);
  }
});


