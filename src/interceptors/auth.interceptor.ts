import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AuthService } from '../services/auth-service/auth-service.service';

/**
 * Adjunta el token Sanctum (Authorization: Bearer) a toda petición dirigida a
 * la API y cierra la sesión automáticamente si la API responde 401.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const esPeticionApi = req.url.startsWith(environment.apiUrl);
    const token = esPeticionApi ? localStorage.getItem('token') : null;

    const request = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const esLogout = req.url.includes('/clientes/logout');

        if (esPeticionApi && error.status === 401 && !esLogout) {
          // El token venció o fue revocado: limpiar sesión local y mandar al login.
          this.authService.logout();
        }

        return throwError(() => error);
      })
    );
  }
}
