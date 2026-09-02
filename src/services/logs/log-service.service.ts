import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth-service/auth-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  setLog(accion: string, contenido: string) {
    // Obtener el ID del usuario desde el localStorage
    const userId = localStorage.getItem('clienteId') ?? '20';

    // Validar si el ID del usuario existe

    const formData = {
      accion: accion,
      contenido: contenido,
      usuario: userId, // Usar el ID del localStorage
    };

    return this.http.post<any>(
      `${environment.apiUrl}/historial/guardar-accion`,
      formData
    );
  }
}
