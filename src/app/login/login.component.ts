import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public hide = true;

  private _minLoginLength = 1;
  private _minPasswordLength = 6;

  public loginForm = new FormGroup({
    login: new FormControl('', [
      Validators.required,
      Validators.minLength(this._minLoginLength),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(this._minPasswordLength),
    ]),
  });

  public login = this.loginForm.get('login') as FormControl;
  constructor() {}

  showErrorMessage(): string {
    if (
      this.loginForm.controls['login'].hasError('required') ||
      this.loginForm.controls['password'].hasError('required')
    ) {
      return 'You must enter a value';
    }

    if (this.loginForm.controls['login'].hasError('minlength')) {
      return `Type at least ${this._minLoginLength} character`;
    }

    if (this.loginForm.controls['password'].hasError('minlength')) {
      return `Password must contain at least ${this._minPasswordLength} characters`;
    }

    return '';
  }

  ngOnInit(): void {}
}
