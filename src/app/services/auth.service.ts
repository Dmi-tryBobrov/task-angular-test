import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  public readonly isLoggedIn$ = this._isLoggedIn.asObservable();

  public login?: string;
  public redirectUrl: string | null = null;

  constructor() { }

  get isLoggedIn() {
    return this._isLoggedIn.getValue();
  }

  logIn(login: string): void {
    this._isLoggedIn.next(true);
    this.login = login;
  }

  logOut(): void {
    this._isLoggedIn.next(false);
    this.login = '';
  }
}
