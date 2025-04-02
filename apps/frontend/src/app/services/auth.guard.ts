import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { tap, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    const expectedRoles = next.data['expectedRole'];

    return this.authService.getUserProfile().pipe(
      map(user => {
        const userRole = this.authService.getCurrentUserRole();
        console.log('Expected Roles:', expectedRoles); // Debug
        console.log('User Role:', userRole); // Debug

        if (this.authService.isAuthenticated() && expectedRoles.includes(userRole)) {
          return true;
        } else {
          this.router.navigate(['/404']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/404']);
        return of(false);
      })
    );
  }
}