import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ejercicio } from 'src/interfaces/Ejercicios';
import { Rutina } from 'src/interfaces/Rutinas';
import { GruposMuscularesService } from 'src/services/grupos-musculares/grupos-musculares.service';
import { MisRutinasService } from 'src/services/mis-rutinas/mis-rutinas.service';

@Component({
  selector: 'app-rutinas-publicas-detalle',
  templateUrl: './rutinas-publicas-detalle.component.html',
  styleUrls: ['./rutinas-publicas-detalle.component.css']
})
export class RutinasPublicasDetalleComponent implements OnInit {
  loading: boolean = false;
  rutina!: Rutina;
  ejercicios: any[] = []; // Array para almacenar los ejercicios
  constructor(private route: ActivatedRoute, private rutinasService: MisRutinasService,private rutinasService2: GruposMuscularesService) { }
  rutinas: any[]  = [];
  tags: any[]  = [];
  equipo: any[]  = [];
  ejerciciosPorDia: { [key: string]: any[] } = {};
  ngOnInit(): void {
    this.obtenerDetalleRutina();
    this.obtenerEjerciciosDeRutina();


    this.obtenerGruposMusculares()
    this.getTags()
    this.getEquipo()
  }
  getImageSrc(miniatura: string): string {
    if (miniatura.startsWith('https')) {
      // Si la miniatura comienza con "https", es una URL directa (Firebase)
      return miniatura;
    } else {
      // Si no comienza con "https", asumimos que es Base64
      return 'data:image/jpeg;base64,' + miniatura;
    }
  }

  obtenerGruposMusculares(): void {
    this.loading = true;
    this.rutinasService2.obtenerGruposMusculares().subscribe(
      (data: any) => {
        this.rutinas = data.data; // Asegúrate de que data sea un array de rutinas
        console.log(data)
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener las rutinas:', error);
        this.loading = false;
      }
    );
  }
  getTags(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.rutinasService2.getTags(id).subscribe(
      (data: any) => {
        this.equipo = data.data; // Asegúrate de que data sea un array de rutinas
        console.log(data)
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener las rutinas:', error);
        this.loading = false;
      }
    );
  }
  getEquipo(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.rutinasService2.getEquipo(id).subscribe(
      (data: any) => {
        this.tags = data.data; // Asegúrate de que data sea un array de rutinas
        console.log(data)
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener las rutinas:', error);
        this.loading = false;
      }
    );
  }

  obtenerDetalleRutina(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.rutinasService.obtenerDetalleRutina(id).subscribe(
      (data: any) => {
        this.rutina = data.data;
        console.log(this.rutina)
      },
      (error) => {
        console.error('Error al obtener el detalle de la rutina:', error);
      }
    );
  }
  diasOrden = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  ejerciciosOrdenados: any[] = [];

  obtenerEjerciciosDeRutina(): void {
    this.loading = true;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.rutinasService.obtenerEjerciciosDeRutina(id).subscribe(
      (data: any) => {
        const ejercicios = data.data || {};
        // Ordenamos los días de la semana
        this.ejerciciosOrdenados = this.diasOrden
          .filter(dia => ejercicios.hasOwnProperty(dia))
          .map(dia => ({ key: dia, value: ejercicios[dia] }));
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener los ejercicios de la rutina:', error);
        this.loading = false;
      }
    );
  }


}
