import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";


export function passwordStrengthValidator(): ValidatorFn {
  const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])(?!.*\s).{8,}$/;

  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Don't validate empty value
    }

    const isValid = passwordPattern.test(control.value);

    return isValid ? null : { passwordStrength: 'Password must be at least 8 characters long and include one uppercase letter, one number, and one special character.' };
  };
}
