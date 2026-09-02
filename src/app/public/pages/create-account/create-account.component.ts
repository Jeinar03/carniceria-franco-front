import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrearCuentaService } from 'src/services/crear-cuenta/crear-cuenta.service';
import { LoginService } from 'src/services/login/login.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent {
  loading = false;
  nombre: string = '';
  apellido: string = '';
  correo: string = '';
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

  crearCuenta() {
    if (this.password !== this.confirmarPassword) {
      this.toastr.error('Las contrasenas no coinciden', 'Error');
      return;
    }

    if (!this.nombre || !this.apellido || !this.correo || !this.password) {
      this.toastr.error('Completa todos los campos obligatorios', 'Error');
      return;
    }

    this.loading = true;
    this.crearCuentaService
      .crearCuenta(this.nombre, this.apellido, this.correo, this.password)
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
          this.toastr.error('Error al crear cuenta', 'Error');
        }
      );
  }

}
