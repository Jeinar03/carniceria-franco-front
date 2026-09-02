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

export interface PaymentCallbackData {
  payment_id?: string;
  status?: string;
  merchant_order_id?: string;
  preference_id?: string;
  collection_status?: string;
  payment_type?: string;
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
   * Manejar el callback de éxito/fallo de Mercado Pago
   */
  handlePaymentCallback(callbackData: PaymentCallbackData): Observable<any> {
    return this.http.post(`${this.apiUrl}/mercadopago/callback`, callbackData);
  }
}
