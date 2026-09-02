import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GruposMuscularesService } from 'src/services/grupos-musculares/grupos-musculares.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-detalle-gm',
  templateUrl: './video-detalle-gm.component.html',
  styleUrls: ['./video-detalle-gm.component.css'],
})
export class VideoDetalleGMComponent implements OnInit {
  loading1 = false;
  loading2 = false;
  loadingContenido = false;
  rutina!: any;
  ejercicios: any[] = []; // Array para almacenar los ejercicios
  rutinas: any[] = [];
  tags: any[] = [];
  equipo: any[] = [];
  loading: boolean = false;
  sanitizedVideoUrl!: SafeResourceUrl;
  sanitizedYouTubeUrl!: SafeResourceUrl;
  constructor(
    private route: ActivatedRoute,
    private rutinasService: GruposMuscularesService,
    private sanitizer: DomSanitizer
  ) {}
  isYouTubeUrl(url: string): boolean {
    console.warn(url)
    return url?.includes('youtube.com') || url?.includes('youtu.be');
  }
  safeVideoUrl!: SafeResourceUrl;
  getSafeVideoUrl(url: string): SafeResourceUrl {
    const videoId = this.extractVideoId(url);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  extractVideoId(url: string): string {
    // Soporta links tipo youtu.be o youtube.com/watch?v=
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }
  updateYouTubeUrl(): void {
    if (this.isYouTubeUrl(this.rutina.video_url)) {
      const videoId = this.extractYouTubeId(this.rutina.video_url);
      this.sanitizedYouTubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${videoId}`
      );
    }
  }

  extractYouTubeId(url: string): string {
    try {
      if (url.includes('youtu.be')) {
        return url.split('youtu.be/')[1].split('?')[0];
      } else if (url.includes('watch?v=')) {
        return new URL(url).searchParams.get('v') || '';
      }
    } catch (e) {
      return '';
    }
    return '';
  }
  ngOnInit(): void {
    if (this.rutina && this.rutina.video_url) {
      this.safeVideoUrl = this.getSafeVideoUrl(this.rutina.video_url);
    }
 //   this.updateYouTubeUrl();
    this.obtenerDetalleRutina();
    // this.obtenerEjerciciosDeRutina();
    this.obtenerGruposMusculares();
    this.getTags();
    this.getEquipo();
  }

  obtenerDetalleRutina(): void {
    this.loadingContenido = true;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.rutinasService.VideosGMDetalle(id).subscribe(
      (data: any) => {
        this.rutina = data.data;
        console.log(this.rutina);
        if (this.rutina && this.rutina.video_url) {
          this.safeVideoUrl = this.getSafeVideoUrl(this.rutina.video_url);
        }
        this.loadingContenido = false;
      },
      (error) => {
        console.error('Error al obtener el detalle de la rutina:', error);
        this.loadingContenido = false;
      }
    );
  }
  getTags(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.rutinasService.getTagsVideo(id).subscribe(
      (data: any) => {
        this.equipo = data.data; // Asegúrate de que data sea un array de rutinas
        console.log(data);
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
    this.rutinasService.getEquipoVideo(id).subscribe(
      (data: any) => {
        this.tags = data.data; // Asegúrate de que data sea un array de rutinas
        console.log(data);
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
        console.log(data);
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener las rutinas:', error);
        this.loading = false;
      }
    );
  }
}
