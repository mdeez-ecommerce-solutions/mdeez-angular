import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilService } from '../services/util.service';

@Injectable({
  providedIn: 'root'
})
export class DeactivateGuard implements CanActivate {
  constructor(
    private router: Router,
    private util: UtilService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if (this.util.getLocalStorage('SignInUserData')) {

        alert("You don't have permission to view this page, Redirecting to Dashboard");
        this.router.navigate(['/analytics']);
        return false;
    } else {
      return true
    } 
  }
  
}
