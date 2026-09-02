import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MisRutinasGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    const token = localStorage.getItem('token');
    if (!token) {
      // Si no hay token, redirige al usuario al login
      return this.router.createUrlTree(['/login']);
    }
    // Si hay token, permite la navegación a la ruta
    return true;
  }
}
