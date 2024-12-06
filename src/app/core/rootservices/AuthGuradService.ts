import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LocalStorageService } from 'angular-web-storage';
import { AccountService } from '../services/account.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuradService implements CanActivate {

  constructor(private router: Router, private accountService: AccountService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const loggedInUser = this.accountService.isLoggedIn();
    if (!loggedInUser) {
      this.router.navigate(['./auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // if (route.data['hasRole'] && (
    //   route.data['hasRole'] !== loggedInUser.role || route.data['hasRole'] !== sessionUser.role)) {
    //   // User does not have the required role, navigate to access denied page
    //   this.router.navigate(['./accessdenied']);
    //   return false;
    // }

    return true;
  }
}
