import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth-service/auth-service.service';
import { EMPTY } from 'rxjs';

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
    // Solo se registra a quien tiene sesion. Sin sesion no se guarda nada: antes se usaba el id 20
    // y las visitas anonimas quedaban a nombre de ese cliente.
    const userId = localStorage.getItem('clienteId');
    if (!userId) {
      return EMPTY;
    }

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
