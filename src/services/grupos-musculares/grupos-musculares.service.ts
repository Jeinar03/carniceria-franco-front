import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GruposMuscularesService {


  constructor(private http: HttpClient) { }

  obtenerGruposMusculares(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/grupos-musculares`);
  }
  obtenerDetalleGruposMuscular(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/grupos-musculares/${id}`);
  }
  obtenerVideosGM(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/grupos-musculares/${id}/video`);
  }
  getAllVideos(page: number, perPage: number = 12): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/videos?page=${page}&per_page=${perPage}`);
  }

  VideosGMDetalle(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/grupos-musculares/video/${id}`);
  }
  getTags(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/grupos-musculares/${id}/tags`);
  }
  getEquipo(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/grupos-musculares/${id}/equipo`);
  }
  getTagsVideo(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/videos/${id}/tags`);
  }
  getEquipoVideo(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/videos/${id}/equipo`);
  }
  getEjerciciosVideos(nombre: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/videos/equipo/${nombre}`);
  }
}
