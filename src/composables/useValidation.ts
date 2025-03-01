// composables/useValidation.ts
import { ref } from 'vue';

// Define common validation rules
export const requiredRule = (value: string) => ({
  isValid: !!value && value.trim() !== '',
  message: 'This field is required.',
});

export const minLengthRule = (min: number) => (value: string) => ({
  isValid: value.length >= min,
  message: `Must be at least ${min} characters.`,
});

export const emailRule = (value: string) => ({
  isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  message: 'Invalid email address.',
});

// Define the shape of the errors object
type ValidationErrors = {
  [key: string]: string; // Dynamic keys with string values
};

// Composable function
export function useValidation(rules: { [key: string]: Array<(value: string) => { isValid: boolean; message: string }> }) {
  const errors = ref<ValidationErrors>({});

  const validateField = (fieldName: string, value: string) => {
    console.log(`Validating ${fieldName}:`, value); // Debugging
    const fieldRules = rules[fieldName];
    if (!fieldRules) return;

    for (const rule of fieldRules) {
      const { isValid, message } = rule(value);
      if (!isValid) {
        errors.value[fieldName] = message;
        console.log(`Validation failed for ${fieldName}:`, message); // Debugging
        return;
      }
    }

    // Clear the error if the field is valid
    errors.value[fieldName] = '';
    console.log(`Validation passed for ${fieldName}`); // Debugging
  };

  const validate = (fields: Array<{ name: string; value: string }>) => {
    let isValid = true;
    errors.value = {};

    for (const field of fields) {
      const value = field.value;
      const fieldRules = rules[field.name];
      for (const rule of fieldRules) {
        const { isValid: ruleValid, message } = rule(value);
        if (!ruleValid) {
          errors.value[field.name] = message;
          isValid = false;
          break;
        }
      }
    }

    return isValid;
  };

  const resetValidation = () => {
    errors.value = {}; // Clear all validation errors
  };

  return { errors, validate, validateField, resetValidation };
}