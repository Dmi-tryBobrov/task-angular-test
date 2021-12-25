import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  public readonly isLoggedIn$ = this._isLoggedIn.asObservable();

  public login?: string;
  public redirectUrl: string | null = null;

  constructor() { }

  ngOnInit(): void {
    if(sessionStorage.getItem('loginState') === 'true'){
      this._isLoggedIn.next(true);
    }

  }

  get isLoggedIn() {
    if(sessionStorage.getItem('loginState') === 'true'){
      this._isLoggedIn.next(true);
      if(sessionStorage.getItem('login'))
        this.login = sessionStorage.getItem('login')!;
    }
    return this._isLoggedIn.getValue();
  }

  logIn(login: string): void {
    this._isLoggedIn.next(true);
    this.login = login;
    sessionStorage.setItem('loginState', 'true');
    sessionStorage.setItem('login', login);
  }

  logOut(): void {
    this._isLoggedIn.next(false);
    this.login = '';
    sessionStorage.setItem('loginState', 'false');
    sessionStorage.setItem('login', this.login);
  }
}
