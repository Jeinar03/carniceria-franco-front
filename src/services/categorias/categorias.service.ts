import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  imagen: string | null;
  activo: number;
  orden: number;
  created_at: string;
  updated_at: string;
  products_count?: number;
}

export interface CategoriaResponse {
  success: boolean;
  status: number;
  message: string;
  data: Categoria | Categoria[];
}

export interface CategoriaConProductos {
  category: Categoria;
  products: any[];
}

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private apiUrl = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) { }

  /**
   * Obtener todas las categorías activas
   */
  getCategorias(): Observable<CategoriaResponse> {
    return this.http.get<CategoriaResponse>(this.apiUrl);
  }

  /**
   * Obtener todas las categorías incluyendo inactivas
   */
  getAllCategorias(): Observable<CategoriaResponse> {
    return this.http.get<CategoriaResponse>(`${this.apiUrl}/all`);
  }

  /**
   * Obtener detalle de una categoría con sus productos
   */
  getCategoria(id: number): Observable<CategoriaResponse> {
    return this.http.get<CategoriaResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtener productos de una categoría específica
   */
  getProductosCategoria(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/productos`);
  }

  /**
   * Crear una nueva categoría
   */
  crearCategoria(categoria: Partial<Categoria>): Observable<CategoriaResponse> {
    return this.http.post<CategoriaResponse>(this.apiUrl, categoria);
  }

  /**
   * Actualizar una categoría existente
   */
  actualizarCategoria(id: number, categoria: Partial<Categoria>): Observable<CategoriaResponse> {
    return this.http.put<CategoriaResponse>(`${this.apiUrl}/${id}`, categoria);
  }
}
