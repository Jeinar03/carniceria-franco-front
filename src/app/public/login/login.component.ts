import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login/login.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LogService } from 'src/services/logs/log-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loading = false;
  usuarioEmail: string = '';
  usuarioPassword: string = '';

  constructor(
    private loginService: LoginService,
    private toastr: ToastrService,
    private logService: LogService
  ) {}
  showSuccess() {
    this.toastr.success('Completado', 'Incio de sesion Exitoso');
  }
  showError() {
    this.toastr.error('Error', 'Credenciales incorrectas');
  }
  enviarLog(accion: string, contenido: string) {
    this.logService.setLog(accion, contenido).subscribe({
      next: () => {
        console.log('Log registrado exitosamente.');
      },
      error: (logError) => {
        console.error('Error al registrar el log:', logError);
      },
    });
  }
  login() {
    this.loading = true;
    this.loginService.login(this.usuarioEmail, this.usuarioPassword).subscribe(
      (response) => {

        this.loginService.handleLoginResponse(response);
        this.loading = false;
        this.showSuccess();
        this.enviarLog('Inicio Sesion', 'El usuario inicio sesion')
      },
      (error) => {
        this.loginService.handleError(error);
        this.loading = false;
        this.showError();
      }
    );
  }
}
