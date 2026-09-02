import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface AlertaSitio {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string | null;
  link_url: string | null;
  link_texto: string | null;
  fecha_inicio: string | null;
  dias_duracion: number;
  tipo: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
  imagen_url: string | null;
  fecha_fin: string | null;
}

export interface AlertasSitioResponse {
  success: boolean;
  status: number;
  message: string;
  data: AlertaSitio[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {


  constructor(private http: HttpClient) { }

  obtenerAlertasSitio(): Observable<AlertasSitioResponse> {
    return this.http.get<AlertasSitioResponse>(`${environment.apiUrl}/sitio/alertas`);
  }


}
