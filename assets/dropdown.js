// Global dropdown functionality
function toggleDropdown(contentId, trigger) {
  console.log('Toggle dropdown called:', contentId); // Debug

  const content = document.getElementById(contentId);
  const icon = trigger.querySelector('.dropdown-icon');

  if (content) {
    const isHidden =
      content.style.display === 'none' || content.style.display === '';

    if (isHidden) {
      content.style.display = 'block';
      content.classList.add('show');
      trigger.classList.add('active');
      if (icon) icon.style.transform = 'rotate(45deg)';
      console.log('Opened dropdown:', contentId);
    } else {
      content.style.display = 'none';
      content.classList.remove('show');
      trigger.classList.remove('active');
      if (icon) icon.style.transform = 'rotate(0deg)';
      console.log('Closed dropdown:', contentId);
    }
  } else {
    console.error('Content not found:', contentId);
  }
}

// Make function globally available
window.toggleDropdown = toggleDropdown;
