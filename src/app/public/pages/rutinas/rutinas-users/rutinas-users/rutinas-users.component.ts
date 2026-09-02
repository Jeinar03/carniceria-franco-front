import { Component, OnInit } from '@angular/core';
import {Rutina} from "../../../../../../interfaces/Rutinas";
import {MisRutinasService} from "../../../../../../services/mis-rutinas/mis-rutinas.service";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../../../../../services/auth-service/auth-service.service";

@Component({
  selector: 'app-rutinas-users',
  templateUrl: './rutinas-users.component.html',
  styleUrls: ['./rutinas-users.component.css']
})
export class RutinasUsersComponent implements OnInit {

  loading: boolean = false;
  rutinas: Rutina[]  = [];

  constructor(
    private rutinasService: MisRutinasService,
    private toastr: ToastrService,
    private authService:AuthService,
    ) { }

  ngOnInit(): void {
    this.obtenerRutinas();
  }
  showSuccess() {
    this.toastr.info('Completado', 'Rutinas perzonalizadas cargadas');
  }
  showError() {
    this.toastr.error('Error', 'Ocurrio un error');
  }
  obtenerRutinas(): void {
    const id=this.authService.getUserId()
    this.loading = true;
    this.rutinasService.obtenerRutinasPersonalizadas(id!).subscribe({
      next: (data: any) => {
        this.rutinas = data.data;
        console.log(data);
        this.loading = false;
        this.showSuccess()
      },
      error: (error) => {
        console.error('Error al obtener las rutinas:', error);
        this.loading = false;
      }
    });

  }

}
