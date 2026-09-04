import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

/**
 * Protege las rutas que requieren un cliente con sesión iniciada.
 * Si no hay token en localStorage, redirige al login.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    const token = localStorage.getItem('token');
    if (!token) {
      return this.router.createUrlTree(['/login']);
    }
    return true;
  }
}
