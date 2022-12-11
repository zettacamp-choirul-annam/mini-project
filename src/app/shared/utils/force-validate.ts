import { FormGroup } from "@angular/forms";

export function forceValidate(form: FormGroup) {
      const controls = form.controls;

      Object.keys(controls).forEach(key => {
            const control = form.get(key);

            control?.markAsTouched();
            control?.updateValueAndValidity();
      });
}