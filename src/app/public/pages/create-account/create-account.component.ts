import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrearCuentaService } from 'src/services/crear-cuenta/crear-cuenta.service';
import { LoginService } from 'src/services/login/login.service';
import { ToastrService } from 'ngx-toastr';
import { esLinkGoogleMaps } from 'src/services/utils/ubicacion-maps';
@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent {
  loading = false;
  nombre: string = '';
  apellido: string = '';
  apellido2: string = '';
  correo: string = '';
  telefono: string = '';
  // Dirección para los envíos: opcional, se puede dar después al hacer el primer pedido.
  direccion: string = '';
  referencias: string = '';
  ciudad: string = '';
  estado: string = '';
  codigoPostal: string = '';
  ubicacionUrl: string = '';
  password: string = '';
  confirmarPassword: string = '';

  constructor(
    private crearCuentaService: CrearCuentaService,
    private loginService: LoginService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  login() {
    this.router.navigate(['/login']);
  }

  get linkInvalido(): boolean {
    return !!this.ubicacionUrl.trim() && !esLinkGoogleMaps(this.ubicacionUrl);
  }

  crearCuenta() {
    if (this.password !== this.confirmarPassword) {
      this.toastr.error('Las contrasenas no coinciden', 'Error');
      return;
    }

    if (!this.nombre || !this.apellido || !this.correo || !this.password || !this.telefono) {
      this.toastr.error('Completa todos los campos obligatorios', 'Error');
      return;
    }

    if (!/^[0-9]{10}$/.test(this.telefono.trim())) {
      this.toastr.error('El teléfono debe tener 10 dígitos', 'Error');
      return;
    }

    if (this.codigoPostal.trim() && !/^[0-9]{5}$/.test(this.codigoPostal.trim())) {
      this.toastr.error('El código postal debe tener 5 dígitos', 'Error');
      return;
    }

    if (this.linkInvalido) {
      this.toastr.error('El link debe ser de Google Maps', 'Error');
      return;
    }

    this.loading = true;
    this.crearCuentaService
      .crearCuenta({
        nombre: this.nombre.trim(),
        apellido: this.apellido.trim(),
        apellido2: this.apellido2.trim(),
        correo: this.correo.trim(),
        password: this.password,
        telefono: this.telefono.trim(),
        direccion: this.direccion.trim(),
        referencias: this.referencias.trim(),
        ubicacion_url: this.ubicacionUrl.trim(),
        ciudad: this.ciudad.trim(),
        estado: this.estado.trim(),
        codigo_postal: this.codigoPostal.trim()
      })
      .subscribe(
        response => {
          this.crearCuentaService.handleCrearCuentaResponse(response);

          if (response?.success && Number(response?.status) === 201) {
            this.toastr.success('Usuario creado correctamente', 'Completado');

            this.loginService.login(this.correo, this.password).subscribe(
              loginResponse => {
                this.loginService.handleLoginResponse(loginResponse);
                this.loading = false;
              },
              loginError => {
                this.loginService.handleError(loginError);
                this.loading = false;
                this.toastr.error('Se creo la cuenta pero no se pudo iniciar sesion', 'Error');
                this.router.navigate(['/login']);
              }
            );

            return;
          }

          this.loading = false;
          this.toastr.error('No se pudo crear la cuenta', 'Error');
        },
        error => {
          this.crearCuentaService.handleError(error);
          this.loading = false;
          this.toastr.error(this.obtenerMensajeError(error), 'Error');
        }
      );
  }

  /**
   * El backend manda el detalle de validacion en error.error.data (ej. correo
   * duplicado). Si no viene en ese formato, usa el mensaje general o uno generico.
   */
  private obtenerMensajeError(error: any): string {
    const erroresValidacion = error?.error?.data;

    if (erroresValidacion?.correo?.length) {
      return erroresValidacion.correo[0];
    }

    if (erroresValidacion && typeof erroresValidacion === 'object') {
      const primerCampo = Object.values(erroresValidacion)[0];
      if (Array.isArray(primerCampo) && primerCampo.length) {
        return primerCampo[0];
      }
    }

    return error?.error?.message || 'Error al crear cuenta';
  }

}
