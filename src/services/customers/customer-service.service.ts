import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

public customer=localStorage.getItem('clienteId');
  constructor(private http: HttpClient) {}

  getCustomerData(clienteId: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/getData?clienteId=${clienteId}`);
  }

  updateCustomer(clienteId: number, customerData: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/usuarios/update/${clienteId}`, customerData);
  }
  uploadCustomerImages(images: { base64: string, peso: string, comentarios: string }[]): Observable<any> {
    const url = `${environment.apiUrl}/usuarios/store-images`; // Ruta del endpoint de Laravel
    const payload = {
      customer_id: this.customer,
      images: images // Enviar el arreglo completo con base64, peso y comentarios
    };

    // Se puede agregar un header para que sea en formato JSON (opcional)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(url, payload, { headers });
  }

  getImagenes(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/usuarios/store-images/${this.customer}/cliente`);
  }
  deleteImage(imageId: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/usuarios/borrar/${this.customer}/imagenes/${imageId}`);
  }
}
