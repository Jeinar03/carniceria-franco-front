import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface HorariosAtencion {
  [key: string]: string | HorarioDia | undefined;
}

export interface HorarioDia {
  abierto: boolean;
  apertura: string;
  cierre: string;
}

export interface SitioConfiguracion {
  id: number;
  nombre: string;
  logo: string | null;
  direccion: string;
  correo: string;
  telefono: string;
  facebook_url: string | null;
  instagram_url: string | null;
  whatsapp: string | null;
  horarios: HorariosAtencion;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
  logo_url: string | null;
}

interface SitioConfiguracionResponse {
  success: boolean;
  status: number;
  message: string;
  data: SitioConfiguracion;
}

@Injectable({
  providedIn: 'root',
})
export class SitioConfigService {
  private readonly apiUrl = `${environment.apiUrl}/sitio/config`;
  private readonly config$: Observable<SitioConfiguracion>;

  constructor(private http: HttpClient) {
    this.config$ = this.http.get<SitioConfiguracionResponse>(this.apiUrl).pipe(
      map((response) => response.data),
      catchError(() => of(this.obtenerFallback())),
      shareReplay(1)
    );
  }

  obtenerConfiguracion(): Observable<SitioConfiguracion> {
    return this.config$;
  }

  private obtenerFallback(): SitioConfiguracion {
    return {
      id: 1,
      nombre: 'Carnicería Franco',
      logo: null,
      direccion: 'Av. Melchor Ocampo 1780, Emiliano Zapata, Lázaro Cárdenas, Mich.',
      correo: 'contacto@ejemplo.com',
      telefono: '7531234567',
      facebook_url: 'https://facebook.com/mi-sitio',
      instagram_url: 'https://instagram.com/mi-sitio',
      whatsapp: '7531234567',
      horarios: {
        lunes: '09:00 - 18:00',
        martes: '09:00 - 18:00',
        miercoles: '09:00 - 18:00',
        jueves: '09:00 - 18:00',
        viernes: '09:00 - 18:00',
        sabado: '09:00 - 14:00',
        domingo: 'Cerrado',
      },
      activo: true,
      logo_url: null,
    };
  }
}
