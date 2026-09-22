import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface PreferenceData {
  customer_id: number;
  productos: {
    product_id: number;
    cantidad?: number;
    monto_pesos?: number;
  }[];
  metodo_pago: string;
  descuento?: number;
  notas?: string;
}

export interface PreferenceResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    preference_id: string;
    init_point: string;
    sandbox_init_point: string;
    venta_pendiente_id: number;
  };
}

export interface ConfirmPaymentResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    venta_id: number;
    folio: string | null;
    /** Estado real de la venta en el servidor. */
    estatus: 'pendiente' | 'completada' | 'cancelada';
    total: string;
    /** Estado del pago según Mercado Pago (approved, pending, in_process, rejected...). */
    pago_status: string;
    pago_status_detail: string | null;
  };
}

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Crear preferencia de pago para Mercado Pago
   */
  createPreference(paymentData: PreferenceData): Observable<PreferenceResponse> {
    return this.http.post<PreferenceResponse>(`${this.apiUrl}/mercadopago/create-preference`, paymentData);
  }

  /**
   * Verificar el estado de un pago
   */
  checkPaymentStatus(paymentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/mercadopago/payment-status/${paymentId}`);
  }

  /**
   * Obtener detalles de una venta por preference_id
   */
  getVentaByPreference(preferenceId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/mercadopago/venta-by-preference/${preferenceId}`);
  }

  /**
   * Confirmar un pago al regresar de Mercado Pago. El servidor lo verifica contra
   * la API de Mercado Pago (no confía en lo que diga la URL) y devuelve el estado real.
   */
  confirmPayment(paymentId: string): Observable<ConfirmPaymentResponse> {
    return this.http.post<ConfirmPaymentResponse>(`${this.apiUrl}/mercadopago/confirm-payment`, {
      payment_id: paymentId
    });
  }
}
