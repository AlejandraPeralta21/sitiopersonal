/**
 * ==========================================================================
 * ALEJANDRA SPACE - Validación de Formularios (validation.js)
 * Validación HTML5 + JavaScript en tiempo real y al enviar
 * ==========================================================================
 */

(function (window, document, $) {
  'use strict';

  const AlejandraApp = window.AlejandraApp || {};
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /**
   * Valida un campo individual y actualiza sus indicadores visuales
   * @param {HTMLElement} input
   * @returns {boolean}
   */
  function validateField(input) {
    const group = input.closest('.form-group');
    const feedback = group ? group.querySelector('.field-feedback') : null;
    const value = input.value.trim();
    const fieldType = group ? group.getAttribute('data-field') : '';

    let isValid = true;
    let message = '✓ Campo válido';

    if (input.hasAttribute('required') && value.length === 0) {
      isValid = false;
      message = 'Este campo es obligatorio.';
    } else if (fieldType === 'name' && value.length < 3) {
      isValid = false;
      message = 'El nombre debe tener al menos 3 caracteres.';
    } else if (fieldType === 'email' && !EMAIL_REGEX.test(value)) {
      isValid = false;
      message = 'Por favor ingresa un correo electrónico válido (ej. nombre@dominio.com).';
    } else if (fieldType === 'subject' && value.length < 4) {
      isValid = false;
      message = 'El asunto debe tener al menos 4 caracteres.';
    } else if (fieldType === 'category' && value === '') {
      isValid = false;
      message = 'Por favor selecciona una categoría.';
    } else if (fieldType === 'message' && value.length < 15) {
      isValid = false;
      message = `Faltan ${15 - value.length} caracter(es) para alcanzar el mínimo de 15.`;
    }

    if (group) {
      group.classList.toggle('is-valid', isValid);
      group.classList.toggle('is-error', !isValid);
    }
    if (feedback) {
      feedback.textContent = message;
    }

    return isValid;
  }

  /**
   * Hidrata la validación en tiempo real (input/keyup/blur/change + submit) sin memory leaks
   */
  AlejandraApp.hydrateValidation = function () {
    const form = document.getElementById('contact-form');
    if (!form) return true;

    // Contador de caracteres en tiempo real con limpieza previa .off()
    $(document)
      .off('input.valChar keyup.valChar', '#contact-message')
      .on('input.valChar keyup.valChar', '#contact-message', function () {
        $('#msg-char-count').text(String(this.value.trim().length));
      });

    // Validación en vivo inmediata antes del submit al escribir o perder el foco
    $(document)
      .off('input.valField keyup.valField blur.valField change.valField', '#contact-form .form-control')
      .on('input.valField keyup.valField blur.valField change.valField', '#contact-form .form-control', function () {
        validateField(this);
      });

    // Validación completa al enviar el formulario
    $(document)
      .off('submit.valForm', '#contact-form')
      .on('submit.valForm', '#contact-form', function (e) {
        e.preventDefault();

        const currentForm = this;
        const inputs = currentForm.querySelectorAll('.form-control');
        const charCount = document.getElementById('msg-char-count');
        const successBanner = document.getElementById('contact-success-banner');

        let allValid = true;
        let firstInvalid = null;

        inputs.forEach((input) => {
          const ok = validateField(input);
          if (!ok) {
            allValid = false;
            if (!firstInvalid) firstInvalid = input;
          }
        });

        if (!allValid) {
          if (successBanner) successBanner.classList.remove('is-visible');
          if (firstInvalid) firstInvalid.focus();
          AlejandraApp.showToast?.('Revisa los campos marcados en rojo antes de continuar.');
          return;
        }

        // Todos los datos son válidos; sin simular envío a servidor backend inexistente
        if (successBanner) {
          successBanner.classList.add('is-visible');
        }
        AlejandraApp.showToast?.('✓ Datos validados con éxito');

        currentForm.reset();
        if (charCount) charCount.textContent = '0';
        currentForm.querySelectorAll('.form-group').forEach((g) => {
          g.classList.remove('is-valid', 'is-error');
          const fb = g.querySelector('.field-feedback');
          if (fb) fb.textContent = '';
        });
      });

    form.dataset.validationHydrated = 'true';
    return true;
  };

  window.AlejandraApp = AlejandraApp;
})(window, document, window.jQuery);
