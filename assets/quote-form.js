// Quote form functionality
document.addEventListener('DOMContentLoaded', function () {
  // Prevent duplicate initialization
  if (window.quoteFormInitialized) {
    console.log('Quote form already initialized, skipping...');
    return;
  }
  window.quoteFormInitialized = true;

  console.log('Quote form script loaded!');

  const serviceOptions = document.querySelectorAll('.service-option');
  const selectedServiceInput = document.getElementById('selected_service');
  const quoteSubmitBtn = document.querySelector('.quote-submit-btn');
  const quoteForm = document.getElementById('quote-form');

  console.log('Found service options:', serviceOptions.length);
  console.log('Found submit button:', !!quoteSubmitBtn);
  console.log('Found form:', !!quoteForm);
  console.log('Found selectedServiceInput:', !!selectedServiceInput);

  if (!selectedServiceInput) {
    console.error('ERROR: Cannot find #selected_service input!');
  }
  if (!quoteForm) {
    console.error('ERROR: Cannot find #quote-form!');
  }
  if (!quoteSubmitBtn) {
    console.error('ERROR: Cannot find .quote-submit-btn button!');
  }

  // Handle service option selection (multiple selection)
  serviceOptions.forEach((option, index) => {
    console.log('Setting up listener for option', index);

    option.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation(); // Prevent event bubbling
      console.log('Service button clicked!', this);

      const service = this.getAttribute('data-service');
      const currentState = this.getAttribute('data-selected');
      const isSelected = currentState === 'true';

      console.log(
        'Service:',
        service,
        'Current data-selected:',
        currentState,
        'Is selected:',
        isSelected
      );

      if (isSelected) {
        // Deselect this option
        this.setAttribute('data-selected', 'false');
        console.log('Deselected:', service);
      } else {
        // Select this option
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

      console.log('All selected services:', selectedServices);

      if (selectedServiceInput) {
        selectedServiceInput.value = selectedServices.join(', ');
        console.log('Updated hidden input value to:', selectedServiceInput.value);
      } else {
        console.error('ERROR: selectedServiceInput is null, cannot update value!');
      }
    });
  });

  // Handle button click instead of form submit
  if (quoteSubmitBtn && quoteForm) {
    quoteSubmitBtn.addEventListener('click', async function (e) {
      e.preventDefault();
      console.log('Submit button clicked');

      // Custom validation with data-required attribute
      const selectedService = selectedServiceInput ? selectedServiceInput.value : '';

      // Check all fields marked as required via data-required
      const requiredFields = quoteForm.querySelectorAll('[data-required="true"]');
      console.log('Required fields found:', requiredFields.length);

      for (let field of requiredFields) {
        const value = field.value ? field.value.trim() : '';
        console.log('Checking field:', field.name, 'Value:', value);

        if (!value) {
          const placeholder = field.getAttribute('placeholder') || 'Detta fält';
          alert(`Vänligen fyll i: ${placeholder}`);
          field.focus();
          return;
        }

        // Check email format if it's an email field
        if (field.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            alert('Vänligen ange en giltig e-postadress');
            field.focus();
            return;
          }
        }

        // Check pattern if specified via data-pattern
        const dataPattern = field.getAttribute('data-pattern');
        if (dataPattern) {
          try {
            const pattern = new RegExp(dataPattern);
            if (!pattern.test(value)) {
              const placeholder = field.getAttribute('placeholder') || 'Detta fält';
              alert(`Ogiltigt format för: ${placeholder}`);
              field.focus();
              return;
            }
          } catch (e) {
            console.error('Invalid pattern:', dataPattern, e);
          }
        }
      }

      if (!selectedService || selectedService.trim() === '') {
        alert('Vänligen välj minst en tjänst');
        return;
      }

      console.log('All validation passed, submitting...');

      // Show loading state
      const originalText = quoteSubmitBtn.innerHTML;
      quoteSubmitBtn.innerHTML = 'Skickar...';
      quoteSubmitBtn.disabled = true;

      try {
        // Submit to Formspree
        const formData = new FormData(quoteForm);

        const response = await fetch('https://formspree.io/f/mdkllzwo', {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
          },
        });

        if (response.ok) {
          console.log('Form submitted successfully!');

          // Hide the form section and show the success section
          const formSection = document.querySelector('.quote-form-section');
          const successSection = document.querySelector('.quote-success-section');

          if (formSection && successSection) {
            formSection.style.display = 'none';
            successSection.style.display = 'flex';
          } else {
            // Fallback to alert if sections not found
            alert('Tack för din förfrågan! Vi återkommer inom kort.');
          }

          // Reset form
          quoteForm.reset();
          if (selectedServiceInput) selectedServiceInput.value = '';

          // Reset service buttons
          serviceOptions.forEach((opt) => {
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
        quoteSubmitBtn.innerHTML = originalText;
        quoteSubmitBtn.disabled = false;
      }
    });
  } else {
    console.error('Submit button or form not found!');
  }
});
