import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard  {
  constructor(private router: Router, private auth: AuthService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user = this.auth.getcurrentuser();
    
    if (user && this.auth.getRole() == 'Admin') {
      return true;
    } else {
      // Redirect to login page if not logged in or not admin
      return this.router.parseUrl('/login');
    }
  }
  
}
