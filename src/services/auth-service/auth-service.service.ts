import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();
  // Subject para detectar cambios en localStorage
  private profileStatusSubject = new Subject<void>();
  profileStatus$ = this.profileStatusSubject.asObservable();
  private INACTIVITY_TIME = 10 * 60 * 1000; // 10 minutos en milisegundos
  private LAST_ACTIVITY_KEY = 'lastActivityTime';
  private inactivityTimer: any;
  showSuccess() {
    this.toastr.info('Completado', 'Sesion Borrada');
  }
  constructor(private router: Router, private toastr: ToastrService) {
    // Comprobar si el usuario está logueado al iniciar la aplicación
    this.checkLoginStatus();
    this.checkInactivity();
    this.setupInactivityListeners();
  }
  updateProfileStatus(status: string) {
    localStorage.setItem('profileIsComplete', status);
    this.profileStatusSubject.next(); // Emite un evento cuando se actualiza el estado del perfil
  }
  // Función para comprobar el estado de inicio de sesión al iniciar la aplicación
  private checkLoginStatus(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.setLoggedIn(true);
    } else {
      this.setLoggedIn(false);
    }
  }
  setLoggedIn(value: boolean): void {
    this.isLoggedInSubject.next(value);
    if (value) {
      this.resetInactivityTimer();
    }
  }
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('clienteEmail');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('clienteNombre');
    localStorage.removeItem('clienteApellidoPaterno');
    localStorage.removeItem('clienteId');
    this.showSuccess();
    this.router.navigate(['/']);
    this.setLoggedIn(false);
  }
  getUserId(): number | null {
    const userId = localStorage.getItem('clienteId');
    return userId ? parseInt(userId, 10) : null;
  }

  // Función para guardar el ID del usuario en el local storage
  setUserId(userId: number): void {
    localStorage.setItem('userId', userId.toString());
  }

  // Función para eliminar el ID del usuario del local storage
  clearUserId(): void {
    localStorage.removeItem('userId');
  }
  getUserData(): {
    email: string | null;
    nombre: string | null;
    apellidoPaterno: string | null;
    id: number | null;
    image: string | null;
    profileIsComplete: string | null;
  } {
    const email = localStorage.getItem('clienteEmail');
    const nombre = localStorage.getItem('clienteNombre');
    const apellidoPaterno = localStorage.getItem('clienteApellidoPaterno');
    const id = this.getUserId();
    const image = localStorage.getItem('image');
    const profileIsComplete = localStorage.getItem('profileIsComplete');
    return { email, nombre, apellidoPaterno, id, image, profileIsComplete };
  }
  private setupInactivityListeners() {
    this.resetInactivityTimer();
    window.addEventListener('mousemove', () => this.resetInactivityTimer());
    window.addEventListener('keydown', () => this.resetInactivityTimer());
    window.addEventListener('click', () => this.resetInactivityTimer());
  }

  private resetInactivityTimer() {
    const currentTime = new Date().getTime();
    localStorage.setItem(this.LAST_ACTIVITY_KEY, currentTime.toString());

    // Clear the existing timer
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    // Set a new timer
    this.inactivityTimer = setTimeout(() => {
      this.logout();
    }, this.INACTIVITY_TIME);
  }

  private checkInactivity() {
    const lastActivityTime = localStorage.getItem(this.LAST_ACTIVITY_KEY);
    if (lastActivityTime) {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - parseInt(lastActivityTime, 10);

      if (elapsedTime >= this.INACTIVITY_TIME) {
        this.logout();
      }
    }
  }
}
