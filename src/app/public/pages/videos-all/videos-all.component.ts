import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GruposMuscularesService } from 'src/services/grupos-musculares/grupos-musculares.service';

@Component({
  selector: 'app-videos-all',
  templateUrl: './videos-all.component.html',
  styleUrls: ['./videos-all.component.css']
})
export class VideosAllComponent implements OnInit {
  loading1 = false;
  loading2 = false;
  page = 1;
perPage = 12;
loadingVIDEOS = false;
hasMoreVideos = true;
  loadingContenido= false;
  rutina!: any;
  selectedGroup: string = '';
  ejercicios: any[] = []; // Array para almacenar los ejercicios
  GM: any[] = [];
  rutinas: any[]  = [];
  tags: any[]  = [];
  equipo: any[]  = [];
  loader2: boolean = false;
  filteredVideos: any[] = []; // Array para almacenar los videos filtrados
  searchText: string = '';
  constructor(private route: ActivatedRoute, private rutinasService: GruposMuscularesService) { }
  filterVideos(): void {
    // Filtrar los videos por nombre y grupo muscular
    this.filteredVideos = this.ejercicios.filter((rutina) => {
      const matchesName = rutina.nombre.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesGroup = this.selectedGroup ? rutina.gm_id === parseInt(this.selectedGroup) : true;
      return matchesName && matchesGroup;
    });
  }
  getMiniaturaSrc(miniatura: string | null): string {
    return miniatura
      ? miniatura
      : 'https://firebasestorage.googleapis.com/v0/b/infinitytech-15a41.appspot.com/o/Rutinas.png?alt=media&token=154bb3ca-abbb-44b6-8335-5cfb31c0057f';
  }


  ngOnInit(): void {
    this.getVideosAll()
    this.getGruposMuscularesAll();
  }
  getVideosAll(): void {
    if (this.loadingVIDEOS || !this.hasMoreVideos) return;

    this.loadingVIDEOS = true;
    this.rutinasService.getAllVideos(this.page, this.perPage).subscribe(
      (res: any) => {
        const newVideos = res.data;
        this.filteredVideos = [...this.filteredVideos, ...newVideos];
        this.page++;

        const meta = res.meta;
        this.hasMoreVideos = this.page <= meta.last_page;
        this.loadingVIDEOS = false;
      },
      (error) => {
        console.error('Error al obtener las rutinas:', error);
        this.loadingVIDEOS = false;
      }
    );
  }
  onScroll(): void {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - 100) {
      this.getVideosAll(); // Carga más si el scroll está cerca del final
    }
  }
  getGruposMuscularesAll(): void {
    this.loader2 = true;
    this.rutinasService.obtenerGruposMusculares().subscribe(
      (data: any) => {
        this.GM = data.data;
        console.log(this.GM);
        this.loader2 = false;
      },
      (error) => {
        console.error('Error al obtener las rutinas:', error);
        this.loader2 = false;
      }
    );
  }
}
