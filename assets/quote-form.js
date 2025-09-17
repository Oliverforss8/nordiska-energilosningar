// Quote form functionality
document.addEventListener('DOMContentLoaded', function () {
  const serviceOptions = document.querySelectorAll('.service-option');
  const selectedServiceInput = document.getElementById('selected_service');
  const quoteSubmitBtn = document.querySelector('.quote-submit-btn');

  // Handle service option selection
  serviceOptions.forEach(option => {
    option.addEventListener('click', function (e) {
      e.preventDefault();

      // Remove active state from all options
      serviceOptions.forEach(opt => {
        opt.classList.remove('bg-[#EFD959]');
        opt.classList.add('bg-white');
      });

      // Add active state to clicked option
      this.classList.remove('bg-white');
      this.classList.add('bg-[#EFD959]');

      // Update hidden input
      const service = this.getAttribute('data-service');
      if (selectedServiceInput) {
        selectedServiceInput.value = service;
      }

      console.log('Selected service:', service);
    });
  });

  // Handle form submission
  const quoteForm = document.getElementById('quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Basic validation
      const name = this.querySelector('input[name="name"]');
      const email = this.querySelector('input[name="email"]');
      const selectedService = selectedServiceInput
        ? selectedServiceInput.value
        : '';

      if (!name || !name.value.trim()) {
        alert('Vänligen fyll i ditt namn');
        if (name) name.focus();
        return;
      }

      if (!email || !email.value.trim()) {
        alert('Vänligen fyll i din e-postadress');
        if (email) email.focus();
        return;
      }

      if (!selectedService) {
        alert('Vänligen välj en tjänst');
        return;
      }

      const submitBtn = this.querySelector('.quote-submit-btn');

      // Show loading state
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Skickar...';
        submitBtn.disabled = true;

        try {
          // Submit to Formspree
          const formData = new FormData(this);

          const response = await fetch('https://formspree.io/f/mdkllzwo', {
            method: 'POST',
            body: formData,
            headers: {
              Accept: 'application/json',
            },
          });

          if (response.ok) {
            alert('Tack för din förfrågan! Vi återkommer inom kort.');

            // Reset form
            this.reset();
            if (selectedServiceInput) selectedServiceInput.value = '';

            // Reset service buttons
            serviceOptions.forEach(opt => {
              opt.classList.remove('bg-[#EFD959]');
              opt.classList.add('bg-white');
            });
          } else {
            throw new Error('Form submission failed');
          }
        } catch (error) {
          console.error('Error submitting form:', error);
          alert(
            'Det uppstod ett fel när formuläret skickades. Vänligen försök igen.'
          );
        } finally {
          // Reset button
          if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
          }
        }
      }
    });
  }
});
