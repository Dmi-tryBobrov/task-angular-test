import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

const floatNumber = /^-?\d*[,.]?\d*$/;
const intPositiveNumber = /^[1-9]\d*$/;
const floatPositiveNumber = /^[0-9]*[,.]?\d*$/;
const decimalZero = /^0*[,.]?0*$/;

export function isNumberValidator(input: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors| null => {
    if(typeof control.value === 'string'){
      let val = control.value.trim();
      if(input === 'float')
        return isFloatNumber(val);
      else if(input === 'positiveFloat')
        return isFloatPositiveNumber(val);
      else
        return isIntPositiveNumber(val);
    }
    else return null;
  }
}

export function isFloatNumber(str: string): ValidationErrors | null {
  return str.match(floatNumber) ? null : {notAFloat: {value: str} }
}

export function isFloatPositiveNumber(str: string): ValidationErrors | null {
  return (str.match(floatPositiveNumber) && !str.match(decimalZero))
  ? null : {notAPositiveFloat: {value: str} }
}

export function isIntPositiveNumber(str: string): ValidationErrors | null {
  return str.match(intPositiveNumber) ? null : {notAPositiveInt: {value: str} }
}

@Directive({
  selector: '[appIsNumber]',
  providers: [{provide: NG_VALIDATORS, useExisting: IsNumberDirective, multi: true}]
})
export class IsNumberDirective implements Validator{

  @Input('appIsNumber') input = '';

  constructor() { }
  validate(control: AbstractControl): ValidationErrors | null {
    return this.input ? isNumberValidator(this.input)(control) : null;
  }

}
