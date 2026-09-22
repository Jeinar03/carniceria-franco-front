import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CarritoService } from 'src/services/carrito/carrito.service';
import { MercadoPagoService } from 'src/services/mercadopago/mercadopago.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-callback',
  template: `
    <div class="payment-callback-container">
      <div class="container">
        <div class="callback-content text-center">
          <!-- Loading State -->
          <div *ngIf="processing" class="loading-state">
            <i class="fas fa-spinner fa-spin fa-4x mb-4" style="color: #D9BB84;"></i>
            <h3 style="color: #59514F;">Procesando tu pago...</h3>
            <p class="text-muted">Por favor espera mientras verificamos tu transacción</p>
          </div>

          <!-- Success State -->
          <div *ngIf="!processing && status === 'approved'" class="success-state">
            <i class="fas fa-check-circle fa-5x mb-4 text-success"></i>
            <h2 class="text-success mb-3">¡Pago Aprobado!</h2>
            <p class="text-muted mb-4">Tu compra se procesó correctamente</p>
            <div class="payment-details" *ngIf="paymentDetails">
              <div class="detail-card">
                <h5>Detalles de la transacción</h5>
                <p *ngIf="paymentDetails.folio"><strong>Folio:</strong> {{ paymentDetails.folio }}</p>
                <p><strong>ID de Pago:</strong> {{ paymentDetails.payment_id }}</p>
                <p *ngIf="paymentDetails.merchant_order_id"><strong>Orden:</strong> {{ paymentDetails.merchant_order_id }}</p>
              </div>
            </div>
            <button class="btn-primary mt-3" (click)="goToProfile()">
              <i class="fas fa-shopping-bag me-2"></i>
              Ver mis Compras
            </button>
          </div>

          <!-- Pending State -->
          <div *ngIf="!processing && status === 'pending'" class="pending-state">
            <i class="fas fa-hourglass-half fa-5x mb-4" style="color: #f39c12;"></i>
            <h2 style="color: #f39c12;" class="mb-3">Pago Pendiente</h2>
            <p class="text-muted mb-4">Tu pago está siendo procesado. Te notificaremos cuando se confirme.</p>
            <button class="btn-primary mt-3" (click)="goToProfile()">
              <i class="fas fa-shopping-bag me-2"></i>
              Ver mis Compras
            </button>
          </div>

          <!-- Failed State -->
          <!-- Cancelled State: el cliente salió de Mercado Pago sin pagar -->
          <div *ngIf="!processing && status === 'cancelled'" class="pending-state">
            <i class="fas fa-info-circle fa-5x mb-4" style="color: #f39c12;"></i>
            <h2 style="color: #f39c12;" class="mb-3">Pago no completado</h2>
            <p class="text-muted mb-4">Saliste de Mercado Pago sin terminar el pago, así que no se hizo ningún cargo.</p>
            <button class="btn-secondary mt-3" (click)="backToCart()">
              <i class="fas fa-shopping-cart me-2"></i>
              Volver al Carrito
            </button>
          </div>

          <!-- Failed State -->
          <div *ngIf="!processing && status === 'rejected'" class="failed-state">
            <i class="fas fa-times-circle fa-5x mb-4 text-danger"></i>
            <h2 class="text-danger mb-3">Pago Rechazado</h2>
            <p class="text-muted mb-4">No se pudo procesar tu pago. Intenta con otro método de pago.</p>
            <button class="btn-secondary mt-3" (click)="backToCart()">
              <i class="fas fa-shopping-cart me-2"></i>
              Volver al Carrito
            </button>
          </div>

          <!-- Error State -->
          <div *ngIf="!processing && status === 'error'" class="error-state">
            <i class="fas fa-exclamation-triangle fa-5x mb-4" style="color: #dc3545;"></i>
            <h2 style="color: #dc3545;" class="mb-3">No pudimos confirmar tu pago</h2>
            <p class="text-muted mb-4">Si Mercado Pago te hizo el cargo, tu compra se confirmará sola en unos minutos y la verás en Mis compras. Si no aparece, contáctanos.</p>
            <button class="btn-secondary mt-3" (click)="backToCart()">
              <i class="fas fa-arrow-left me-2"></i>
              Volver al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .payment-callback-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      background: linear-gradient(135deg, #F2F2F2 0%, #E8E8E8 100%);
    }

    .callback-content {
      padding: 60px 20px;
    }

    .loading-state, .success-state, .pending-state, .failed-state, .error-state {
      max-width: 500px;
      margin: 0 auto;
      padding: 40px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .detail-card {
      background: #F2E6D0;
      padding: 20px;
      border-radius: 10px;
      margin-top: 20px;
    }

    .detail-card h5 {
      color: #59514F;
      margin-bottom: 15px;
      font-weight: 700;
    }

    .detail-card p {
      margin-bottom: 8px;
      color: #59514F;
    }

    .btn-primary {
      background: linear-gradient(135deg, #D9BB84, #D9B384);
      border: none;
      padding: 12px 30px;
      border-radius: 25px;
      color: #59514F;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(217,187,132,0.4);
    }

    .btn-secondary {
      background: #6c757d;
      border: none;
      padding: 12px 30px;
      border-radius: 25px;
      color: white;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s;
    }

    .btn-secondary:hover {
      background: #545b62;
      transform: translateY(-2px);
    }
  `]
})
export class PaymentCallbackComponent implements OnInit {
  processing: boolean = true;
  status: string = '';
  paymentDetails: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mercadoPagoService: MercadoPagoService,
    private carritoService: CarritoService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.handleMercadoPagoCallback(params);
    });
  }

  /**
   * Mercado Pago regresa aquí con ?payment_id=...&status=...&external_reference=...
   * La URL no se toma como verdad (cualquiera podría escribir ?status=approved): el
   * resultado sale de la respuesta del servidor, que consulta el pago a Mercado Pago.
   */
  handleMercadoPagoCallback(params: Params): void {
    const paymentId = params['payment_id'] || params['collection_id'];

    this.paymentDetails = {
      payment_id: paymentId,
      merchant_order_id: params['merchant_order_id'],
      preference_id: params['preference_id'],
      folio: null
    };

    this.processing = true;

    // Sin payment_id numérico el cliente salió de Mercado Pago sin pagar (llega "null").
    if (!/^\d+$/.test(String(paymentId ?? ''))) {
      this.finalizar('cancelled');
      return;
    }

    this.mercadoPagoService.confirmPayment(String(paymentId)).subscribe({
      next: (response) => {
        this.paymentDetails.folio = response.data.folio;
        this.finalizar(this.resolverEstado(response.data));
      },
      error: (error) => {
        console.error('Error al confirmar el pago de Mercado Pago:', error);
        this.finalizar('error');
      }
    });
  }

  private resolverEstado(data: { estatus: string; pago_status: string }): string {
    if (data.estatus === 'completada') {
      return 'approved';
    }

    if (data.pago_status === 'rejected' || data.pago_status === 'cancelled') {
      return 'rejected';
    }

    // pending / in_process / authorized, o cobrado pero aún confirmándose en el servidor
    return 'pending';
  }

  private finalizar(status: string): void {
    this.processing = false;
    this.status = status;

    switch (status) {
      case 'approved':
        this.limpiarCompra();
        this.toastr.success('¡Pago aprobado! Tu compra se procesó correctamente.', 'Pago Exitoso');
        break;

      case 'pending':
        this.limpiarCompra();
        this.toastr.info('Pago pendiente. Tu compra se confirmará cuando se acredite.', 'Pago Pendiente');
        break;

      case 'rejected':
        this.toastr.error('Pago rechazado. Intenta con otro método de pago.', 'Pago Rechazado');
        break;

      case 'cancelled':
        this.toastr.warning('No se completó el pago. No se hizo ningún cargo.', 'Pago no completado');
        break;

      default:
        this.status = 'error';
        this.toastr.error('No pudimos confirmar tu pago.', 'Error');
        break;
    }
  }

  /** La compra ya existe en el servidor (aprobada o por acreditarse): se vacía el carrito. */
  private limpiarCompra(): void {
    this.carritoService.vaciarCarrito();
    localStorage.removeItem('venta_pendiente_mp');
  }

  goToProfile(): void {
    this.router.navigate(['/pages/profile'], {
      queryParams: { tab: 'compras' }
    });
  }

  backToCart(): void {
    this.router.navigate(['/pages/carrito']);
  }
}
