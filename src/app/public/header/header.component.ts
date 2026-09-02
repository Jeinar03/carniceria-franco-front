import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth-service/auth-service.service';
import {
  AlertaSitio,
  NotificacionService,
} from 'src/services/notificacion-service/notificaciones.service';
import { CarritoService, ItemCarrito } from 'src/services/carrito/carrito.service';
import { environment } from 'src/environments/environment';
declare var bootstrap: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  private readonly alertasLeidasStorageKey = 'alertas_leidas_ids';
  private modalInstance: any;
  private colaAlertasModal: AlertaSitio[] = [];

  modalNotificacion: AlertaSitio | null = null;
  selectedTheme: string | undefined;
  loading: boolean = false;
  alertas: AlertaSitio[] = [];
  alertasNoLeidas: AlertaSitio[] = [];
  alertasLeidas: AlertaSitio[] = [];
  isLoggedIn = false;
  buttonText!: string;
  userImage: string | null = null;
  userName: string | null = null;
  profileStatusIcon: string | null = null;
  itemsCarrito: ItemCarrito[] = [];
  cantidadCarrito: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificacionService: NotificacionService,
    private carritoService: CarritoService
  ) {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if (this.isLoggedIn) {
        this.updateUserData();
      } else {
        this.userImage = null;
        this.userName = null;
        this.profileStatusIcon = null;
      }
    });

    // Suscribirse a los cambios en el estado del perfil
    this.authService.profileStatus$.subscribe(() => {
      this.updateProfileStatusIcon();
    });

    // Suscribirse a los cambios del carrito
    this.carritoService.obtenerCarritoObservable().subscribe(items => {
      this.itemsCarrito = items;
      this.cantidadCarrito = items.length;
    });
  }
  private updateUserData() {
    const userData = this.authService.getUserData();
    this.userName = `${userData.nombre}`;
    this.userImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      this.userName
    )}`;
    this.updateProfileStatusIcon();
  }

  private updateProfileStatusIcon(): void {
    const profileIsComplete = localStorage.getItem('profileIsComplete') || 'no';
    this.profileStatusIcon =
      profileIsComplete === 'si'
        ? 'fa-check-circle' // Icono de check
        : 'fa-exclamation-circle'; // Icono de admiración
  }
  ngOnInit() {
    // Obtener el tema seleccionado del localStorage al cargar la aplicación
    this.selectedTheme = localStorage.getItem('selectedTheme') || 'light'; // Establecer el tema predeterminado como 'light' si no hay ningún tema seleccionado
    this.updateButtonText(this.selectedTheme); // Actualizar el texto del botón al cargar la aplicación
    this.applyTheme(this.selectedTheme); // Aplicar el tema al cargar la aplicación
    this.obtenerAlertas();
  }

  get cantidadAlertasNoLeidas(): number {
    return this.alertasNoLeidas.length;
  }

  obtenerAlertas(): void {
    this.loading = true;

    this.notificacionService.obtenerAlertasSitio().subscribe(
      (response) => {
        this.alertas = response?.data || [];
        this.sincronizarAlertasPorLectura();
        this.iniciarColaDeModales();
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener las alertas:', error);
        this.loading = false;
      }
    );
  }

  abrirAlertaEnModal(alerta: AlertaSitio): void {
    this.modalNotificacion = alerta;
    this.abrirModal();
  }

  marcarComoLeida(alerta: AlertaSitio, cerrarModal: boolean = false): void {
    const idsLeidos = this.obtenerIdsLeidos();

    if (!idsLeidos.includes(alerta.id)) {
      idsLeidos.push(alerta.id);
      localStorage.setItem(this.alertasLeidasStorageKey, JSON.stringify(idsLeidos));
    }

    this.sincronizarAlertasPorLectura();

    if (cerrarModal && this.modalNotificacion?.id === alerta.id && this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  private sincronizarAlertasPorLectura(): void {
    const idsLeidos = this.obtenerIdsLeidos();
    const leidasSet = new Set(idsLeidos);

    this.alertasNoLeidas = this.alertas.filter((alerta) => !leidasSet.has(alerta.id));
    this.alertasLeidas = this.alertas.filter((alerta) => leidasSet.has(alerta.id));
  }

  private iniciarColaDeModales(): void {
    this.colaAlertasModal = [...this.alertasNoLeidas];
    this.mostrarSiguienteAlertaEnModal();
  }

  private mostrarSiguienteAlertaEnModal(): void {
    if (this.colaAlertasModal.length === 0) {
      return;
    }

    this.modalNotificacion = this.colaAlertasModal.shift() || null;
    this.abrirModal();
  }

  private abrirModal(): void {
    const modalElement = document.getElementById('notificacionModal');

    if (!modalElement || !this.modalNotificacion) {
      return;
    }

    if (!this.modalInstance) {
      this.modalInstance = new bootstrap.Modal(modalElement);
      modalElement.addEventListener('hidden.bs.modal', () => {
        if (this.colaAlertasModal.length > 0) {
          this.mostrarSiguienteAlertaEnModal();
        }
      });
    }

    this.modalInstance.show();
  }

  private obtenerIdsLeidos(): number[] {
    const idsRaw = localStorage.getItem(this.alertasLeidasStorageKey);

    if (!idsRaw) {
      return [];
    }

    try {
      const parsed = JSON.parse(idsRaw);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .map((value) => Number(value))
        .filter((value) => Number.isInteger(value));
    } catch {
      return [];
    }
  }

  formatFecha(fecha: string | null): string {
    if (!fecha) {
      return 'Sin fecha';
    }

    const fechaObj = new Date(fecha);
    const opciones: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return fechaObj.toLocaleDateString('es-ES', opciones);
  }

  changeTheme(theme: string) {
    this.selectedTheme = theme; // Actualizar el tema seleccionado
    localStorage.setItem('selectedTheme', theme); // Guardar el tema seleccionado en localStorage
    this.updateButtonText(theme); // Actualizar el texto del botón al cambiar de tema
    this.applyTheme(theme); // Aplicar el nuevo tema
  }

  private updateButtonText(theme: string) {
    this.buttonText = theme === 'light' ? 'Cambiar a Dark' : 'Cambiar a Light'; // Definir el texto del botón según el tema actual
  }

  private applyTheme(theme: string) {
    const body = document.body as HTMLElement;
    body.setAttribute('data-bs-theme', theme); // Aplicar el tema
  }
  closeDropdowns() {
    // Cerrar todos los dropdowns
    const dropdowns = document.querySelectorAll('.dropdown-menu.show');
    dropdowns.forEach((dropdown: any) => {
      dropdown.classList.remove('show');
    });
  }

  logout(): void {
    // Llamar al método logout() del servicio AuthService
    this.authService.logout();
  }

  getImagenProducto(imagen: string | null): string {
    if (!imagen) {
      return 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=100';
    }
    if (imagen.startsWith('http')) {
      return imagen;
    }
    return `${environment.apiUrl.replace('/api/v1', '')}/${imagen}`;
  }

  verCarritoCompleto(): void {
    this.router.navigate(['/pages/carrito']);
  }

  eliminarDelCarrito(productoId: number): void {
    this.carritoService.eliminarProducto(productoId);
  }

  getClaseTipoAlerta(tipo: string): string {
    switch ((tipo || '').toLowerCase()) {
      case 'oferta':
        return 'badge bg-danger-subtle text-danger';
      case 'anuncio':
        return 'badge bg-primary-subtle text-primary';
      default:
        return 'badge bg-secondary-subtle text-secondary';
    }
  }
}
