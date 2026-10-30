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

export const MENSAJE_WHATSAPP_POR_OMISION = 'Hola, quiero hacer un pedido o pedir información.';

/** Mensaje de los botones de WhatsApp: el capturado en el panel o, si no hay, el de omisión. */
export function mensajeWhatsapp(config: SitioConfiguracion): string {
  return config.mensaje_whatsapp?.trim() || MENSAJE_WHATSAPP_POR_OMISION;
}

export interface SitioConfiguracion {
  id: number;
  nombre: string;
  logo: string | null;
  direccion: string;
  /** Link de Google Maps de la carniceria, capturado en el panel. */
  ubicacion_url?: string | null;
  /** Link para llegar: el capturado o una busqueda en Maps con la direccion (lo arma el servidor). */
  enlace_mapa?: string | null;
  correo: string;
  telefono: string;
  facebook_url: string | null;
  instagram_url: string | null;
  whatsapp: string | null;
  /** Mensaje que ya aparece escrito al abrir WhatsApp. Vacío = MENSAJE_WHATSAPP_POR_OMISION. */
  mensaje_whatsapp?: string | null;
  banco?: string | null;
  titular_cuenta?: string | null;
  numero_cuenta?: string | null;
  clabe?: string | null;
  horarios: HorariosAtencion;
  /** false = la tienda deja comprar a cualquier hora (modo pruebas). Si no viene, se limita. */
  limitar_horario?: boolean;
  /** Zona horaria en la que se evalúa el horario (no la del dispositivo del cliente). */
  zona_horaria?: string;
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
      nombre: 'Carnicería Franko',
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
