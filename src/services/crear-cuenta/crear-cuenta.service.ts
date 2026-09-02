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
    // Maneja la respuesta después de crear la cuenta
    // Puedes agregar acciones adicionales aquí, como redirigir al usuario a la página de inicio de sesión
   // this.router.navigate(['/login']);
   console.log('bien')
  }

  handleError(error: any) {
    console.error('Error al crear cuenta:', error);
    // Maneja el error al crear la cuenta
    // Puedes mostrar un mensaje de error al usuario si la creación de la cuenta falla
  }
}
