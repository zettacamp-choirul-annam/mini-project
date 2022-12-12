import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Injectable({
      providedIn: 'root'
})
export class StockGuard implements CanActivate {
      constructor(
            private authService: AuthService,
            private router: Router
      ) { }
      
      canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
            const user = this.authService.getUser();
            const isAdmin = user && user.role == 'ADMIN';

            if (!isAdmin) {
                  return this.router.navigate(['/home']);
            }

            return true;
      }
}