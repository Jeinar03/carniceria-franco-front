import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GruposMuscularesService } from 'src/services/grupos-musculares/grupos-musculares.service';

@Component({
  selector: 'app-videos-select',
  templateUrl: './videos-select.component.html',
  styleUrls: ['./videos-select.component.css']
})
export class VideosSelectComponent implements OnInit {
  loading1 = false;
  loading2 = false;
  loadingContenido= false;
  rutina!: any;
  ejercicios: any[] = []; // Array para almacenar los ejercicios
  rutinas: any[]  = [];
  tags: any[]  = [];
  equipo: any[]  = [];
  loading: boolean = false;
  nombre!: string; // Inicializamos esta propiedad

  constructor(private route: ActivatedRoute, private rutinasService: GruposMuscularesService) { }
  getImageSrc(rutina: any): string {
    if (rutina.miniatura.startsWith('https')) {
      // Si la miniatura comienza con "https", es una URL directa
      return rutina.miniatura;
    } else {
      // Si no comienza con "https", asumimos que es Base64
      return 'data:image/png;base64,' + rutina.miniatura;
    }
  }
  ngOnInit(): void {
    // Nos suscribimos a los cambios en los parámetros de la ruta
    this.route.paramMap.subscribe(params => {
      this.nombre = String(params.get('nombre'));
      this.getVideos(); // Hacemos la petición cada vez que cambia el parámetro
    });
  }

  getVideos(): void {
    this.loading2 = true;
    const id = this.nombre;
    console.log(id);
    this.rutinasService.getEjerciciosVideos(id).subscribe(
      (data: any) => {
        this.ejercicios = data.data;
        console.log(this.ejercicios);
        this.loading2 = false;
      },
      (error) => {
        console.error('Error al obtener el detalle de la rutina:', error);
        this.loading2 = false;
      }
    );
  }
}
