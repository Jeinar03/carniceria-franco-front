import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

/** Datos que pide el registro. Los de entrega son opcionales: se pueden dar despues, al comprar. */
export interface DatosRegistro {
  nombre: string;
  apellido: string;
  apellido2?: string;
  correo: string;
  password: string;
  telefono: string;
  direccion?: string;
  referencias?: string;
  ubicacion_url?: string;
  ciudad?: string;
  estado?: string;
  codigo_postal?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CrearCuentaService {

  constructor(private http: HttpClient) { }

  crearCuenta(datos: DatosRegistro) {
    // Los campos opcionales vacios no se mandan: el servidor los guarda como nulos.
    const formData = Object.fromEntries(
      Object.entries(datos).filter(([, valor]) => valor !== undefined && valor !== null && String(valor).trim() !== '')
    );

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
