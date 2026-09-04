import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CrearCuentaService {

  constructor(private http: HttpClient) { }

  crearCuenta(nombre: string, apellido: string, correo: string, password: string) {
    const formData = {
      nombre,
      apellido,
      correo,
      password
    };

    return this.http.post<any>(`${environment.apiUrl}/clientes/registro`, formData);
  }

  handleCrearCuentaResponse(response: any) {
    // El registro ya devuelve un token Sanctum (auto-login). Se guarda por si
    // el flujo deja de re-loguear más adelante; si el componente vuelve a llamar
    // a login, ese token simplemente lo reemplaza.
    const token = response?.data?.token;
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('isLoggedIn', 'true');
    }
  }

  handleError(error: any) {
    console.error('Error al crear cuenta:', error);
    // Maneja el error al crear la cuenta
    // Puedes mostrar un mensaje de error al usuario si la creación de la cuenta falla
  }
}
