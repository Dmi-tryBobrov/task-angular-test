import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

/** A hero's name can't match the hero's alter ego */
export const sameValueValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const min = control.get('minValue');
  const max = control.get('maxValue');

  return min && max && min.value === max.value ? { sameValue: true } : null;
};

@Directive({
  selector: '[appSameValue]',
  providers: [{provide: NG_VALIDATORS, useExisting: SameValueDirective, multi: true}]
})
export class SameValueDirective implements Validator {

  constructor() { }

  validate(control: AbstractControl): ValidationErrors | null {
    return sameValueValidator(control);
  }

}

