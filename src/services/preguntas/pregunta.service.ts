import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class PreguntaService {

  constructor(private http: HttpClient) { }

  getPreguntas(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/questions/questions`);
  }

  enviarResultados(resultados: any[], userId: number | null | undefined,puntajeTotal: number): Observable<any> {
    const payload = {
      userId: userId,
      respuestas: resultados,
      puntaje:puntajeTotal
    };
    return this.http.post<any>(`${environment.apiUrl}/questions/guardar-respuestas`, payload);
  }
}
