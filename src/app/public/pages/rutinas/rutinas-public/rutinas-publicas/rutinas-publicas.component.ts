import { Component, OnInit } from '@angular/core';
import { Rutina } from 'src/interfaces/Rutinas';
import { MisRutinasService } from 'src/services/mis-rutinas/mis-rutinas.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-rutinas-publicas',
  templateUrl: './rutinas-publicas.component.html',
  styleUrls: ['./rutinas-publicas.component.css']
})
export class RutinasPublicasComponent implements OnInit {
  loading: boolean = false;
  rutinas: Rutina[]  = [];

  constructor(private rutinasService: MisRutinasService,private toastr: ToastrService) { }
  getMiniaturaSrc(miniatura: string | null): string {
    return miniatura
      ? miniatura
      : 'https://firebasestorage.googleapis.com/v0/b/infinitytech-15a41.appspot.com/o/Rutinas.png?alt=media&token=154bb3ca-abbb-44b6-8335-5cfb31c0057f';
  }
  ngOnInit(): void {
    this.obtenerRutinas();
  }
  showSuccess() {
    this.toastr.info('Completado', 'Rutinas publicas cargadas');
  }
  showError() {
    this.toastr.error('Error', 'Ocurrio un error');
  }
  obtenerRutinas(): void {
    this.loading = true;
    this.rutinasService.obtenerRutinas().subscribe({
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
