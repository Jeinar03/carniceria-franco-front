import { Component, OnInit } from '@angular/core';
import { GruposMuscularesService } from 'src/services/grupos-musculares/grupos-musculares.service';

@Component({
  selector: 'app-grupos-musculares',
  templateUrl: './grupos-musculares.component.html',
  styleUrls: ['./grupos-musculares.component.css']
})
export class GruposMuscularesComponent implements OnInit {

  loading: boolean = false;
  rutinas: any[]  = [];

  constructor(private rutinasService: GruposMuscularesService) { }

  ngOnInit(): void {
    this.obtenerRutinas();
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
  
  obtenerRutinas(): void {
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

}
