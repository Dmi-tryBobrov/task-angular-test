import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AutofillMonitor } from '@angular/cdk/text-field';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  public hide = true;

  private _minLoginLength = 2;
  private _minPasswordLength = 6;

  @ViewChild('loginId', {read: ElementRef}) loginInput!: ElementRef<HTMLElement>;
  @ViewChild('passwordId', {read: ElementRef}) passwordInput!: ElementRef<HTMLElement>;
  public loginAutofilled?: boolean;
  public passwordAutofilled?: boolean;


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

  constructor(
      private auth: AuthService,
      private router: Router,
      private _autofill: AutofillMonitor
      ) {}

  ngAfterViewInit(): void {
    /*AutofillMonitor is needed because browser autofill doesn't
     *fill in the credentials before user-side click or focus
     *therefore form state is invalid and log in button is disabled
     */
    this._autofill
    .monitor(this.loginInput)
    .subscribe(e => (this.loginAutofilled = e.isAutofilled));
  this._autofill
    .monitor(this.passwordInput)
    .subscribe(e => (this.passwordAutofilled = e.isAutofilled));
  }

  ngOnDestroy(): void {
    this._autofill.stopMonitoring(this.loginInput);
    this._autofill.stopMonitoring(this.passwordInput);      
  }

  showPasswordErrorMessage(): string {
    if (this.loginForm.controls['password'].hasError('minlength')) {
      return `Password must contain at least ${this._minPasswordLength} characters`;
    }

    if (this.loginForm.controls['password'].hasError('required')) {
      return 'You must enter a value';
    }

    return '';
  }


  showLoginErrorMessage(): string {
    if (this.loginForm.controls['login'].hasError('required')) {
      return 'You must enter a value';
    }

    if (this.loginForm.controls['login'].hasError('minlength')) {
      return `Type at least ${this._minLoginLength} characters`;
    }

    return '';
  }

  get login() {
    return this.loginForm.get('login') as FormControl;
  }


  get password() {
    return this.loginForm.get('password') as FormControl;
  }

  onFormSubmit(login: string, password: string): void {
    console.log(login, password);
    this.auth.logIn(login);
    this.router.navigate(['/home']);
  }

  checkFormState(): boolean {  
    if(
      this.loginForm.valid ||
      (this.loginAutofilled && this.passwordAutofilled)
      )
      return false;
    else {return true;}
  }
}
