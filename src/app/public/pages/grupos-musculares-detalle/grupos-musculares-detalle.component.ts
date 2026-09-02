import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GruposMuscularesService } from 'src/services/grupos-musculares/grupos-musculares.service';

@Component({
  selector: 'app-grupos-musculares-detalle',
  templateUrl: './grupos-musculares-detalle.component.html',
  styleUrls: ['./grupos-musculares-detalle.component.css']
})
export class GruposMuscularesDetalleComponent implements OnInit {

  loading1 = false;
  loading2 = false;
  rutina!: any;
  ejercicios: any[] = []; // Array para almacenar los ejercicios
  loading: boolean = false;
  rutinas: any[]  = [];
  tags: any[]  = [];
  equipo: any[]  = [];
  constructor(private route: ActivatedRoute, private rutinasService: GruposMuscularesService) { }

  ngOnInit(): void {
    this.obtenerDetalleRutina();
   this.obtenerVideos();
   this.obtenerGruposMusculares()
   this.getTags()
   this.getEquipo()
  }
  getImageSrc(imagen: string): string {
    if (imagen.startsWith('https')) {
      // Si la imagen comienza con "https", es una URL directa (Firebase)
      return imagen;
    } else {
      // Si no comienza con "https", asumimos que es Base64
      return 'data:image/jpeg;base64,' + imagen;
    }
  }
  
  obtenerDetalleRutina(): void {
    this.loading1 = true;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.rutinasService.obtenerDetalleGruposMuscular(id).subscribe(
      (data: any) => {
        console.log(id)
        this.rutina = data.data;
        console.log(this.rutina)
        this.loading1 = false;
      },
      (error) => {
        console.error('Error al obtener el detalle de la rutina:', error);
        this.loading1 = false;
      }
    );
  }
  getTags(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.rutinasService.getTags(id).subscribe(
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
    this.rutinasService.getEquipo(id).subscribe(
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
  obtenerGruposMusculares(): void {
    this.loading = true;
    this.rutinasService.obtenerGruposMusculares().subscribe(
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
  obtenerVideos(): void {
    this.loading2 = true;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.rutinasService.obtenerVideosGM(id).subscribe(
      (data: any) => {
        this.ejercicios = data.data;
        this.loading2 = false;
        console.log(this.ejercicios)
      },
      (error) => {
        console.error('Error al obtener los ejercicios de la rutina:', error);
        this.loading2 = false;
      }
    );
  }

}
