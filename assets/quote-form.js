// Quote form functionality
console.log('Quote form script loaded!');

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM loaded, setting up form...');

  // Check if quote form exists on this page
  const quoteForm = document.getElementById('quote-form');
  if (!quoteForm) {
    console.log('Quote form not found on this page, skipping setup');
    return;
  }

  const serviceOptions = document.querySelectorAll('.service-option');
  const selectedServiceInput = document.getElementById('selected_service');
  const quoteSubmitBtn = document.querySelector('.quote-submit-btn');

  console.log('Elements found:');
  console.log('- Service options:', serviceOptions.length);
  console.log('- Selected service input:', selectedServiceInput);
  console.log('- Submit button:', quoteSubmitBtn);

  // Handle service option selection (multiple selection)
  if (serviceOptions.length === 0) {
    console.log('No service options found on quote form');
    return;
  }

  serviceOptions.forEach((option, index) => {
    console.log(`Setting up listener for option ${index}:`, option);

    option.addEventListener('click', function (e) {
      e.preventDefault();
      console.log('Button clicked!', this);

      const service = this.getAttribute('data-service');
      const isSelected = this.getAttribute('data-selected') === 'true';

      console.log('Service:', service, 'Is selected:', isSelected);

      if (isSelected) {
        // Deselect this option
        this.style.backgroundColor = 'white';
        this.setAttribute('data-selected', 'false');
        console.log('Deselected:', service);
      } else {
        // Select this option
        this.style.backgroundColor = '#EFD959';
        this.setAttribute('data-selected', 'true');
        console.log('Selected:', service);
      }

      // Update hidden input with all selected services
      const selectedServices = [];
      serviceOptions.forEach((opt) => {
        if (opt.getAttribute('data-selected') === 'true') {
          selectedServices.push(opt.getAttribute('data-service'));
        }
      });

      if (selectedServiceInput) {
        selectedServiceInput.value = selectedServices.join(', ');
      }

      console.log('All selected services:', selectedServices);
    });
  });

  // Handle form submission (quoteForm already exists, checked above)
  if (quoteForm) {
    quoteForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Basic validation
      const name = this.querySelector('input[name="name"]');
      const email = this.querySelector('input[name="email"]');
      const selectedService = selectedServiceInput ? selectedServiceInput.value : '';

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

      if (!selectedService || selectedService.trim() === '') {
        alert('Vänligen välj minst en tjänst');
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
            // Hide the form section and show the success section
            const formSection = document.querySelector('.quote-form-section');
            const successSection = document.querySelector('.quote-success-section');

            if (formSection && successSection) {
              formSection.style.display = 'none';
              successSection.style.display = 'block';
            } else {
              // Fallback to alert if sections not found
              alert('Tack för din förfrågan! Vi återkommer inom kort.');
            }

            // Reset form
            this.reset();
            if (selectedServiceInput) selectedServiceInput.value = '';

            // Reset service buttons
            serviceOptions.forEach((opt) => {
              opt.style.backgroundColor = 'white';
              opt.setAttribute('data-selected', 'false');
            });
          } else {
            throw new Error('Form submission failed');
          }
        } catch (error) {
          console.error('Error submitting form:', error);
          alert('Det uppstod ett fel när formuläret skickades. Vänligen försök igen.');
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
