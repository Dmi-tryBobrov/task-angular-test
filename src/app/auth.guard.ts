import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const url: string = state.url;
    return this.checkLogin(url);
  }
  
  checkLogin(url: string): true | UrlTree {
    console.log(this.auth.isLoggedIn);
    if(this.auth.isLoggedIn){ return true;}

    this.auth.redirectUrl = url;
    return this.router.parseUrl('/login');
  }
}
