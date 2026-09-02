import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Producto {
  id: number;
  category_id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  precio_oferta: number | null;
  en_oferta: number;
  unidad_venta: string;
  stock: number;
  stock_minimo: number;
  imagen: string | null;
  imagen_url?: string | null;
  activo: number;
  destacado: number;
  refrigerado: number;
  fecha_vencimiento: string | null;
  created_at: string;
  updated_at: string;
  precio_final?: number;
  tiene_stock?: boolean;
  stock_bajo?: boolean;
  category?: {
    id: number;
    nombre: string;
    descripcion?: string;
    imagen?: string;
  };
}

export interface ProductoResponse {
  success: boolean;
  status: number;
  message: string;
  data: Producto | Producto[] | PaginatedProductos;
}

export interface PaginatedProductos {
  current_page: number;
  data: Producto[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface StockResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    product_id: number;
    nombre: string;
    stock: number;
    stock_minimo: number;
    tiene_stock: boolean;
    stock_bajo: boolean;
  };
}

export interface ProductosPorCategoriaResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    category: {
      id: number;
      nombre: string;
      descripcion: string | null;
      imagen: string | null;
    };
    products: Producto[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) { }

  /**
   * Obtener todos los productos activos con stock (con paginación)
   * @param params Parámetros opcionales: category_id, en_oferta, destacado, search, order_by, order_dir, per_page
   */
  getProductos(params?: {
    category_id?: number;
    en_oferta?: number;
    destacado?: number;
    search?: string;
    order_by?: string;
    order_dir?: 'asc' | 'desc';
    per_page?: number;
  }): Observable<ProductoResponse> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof typeof params];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ProductoResponse>(this.apiUrl, { params: httpParams });
  }

  /**
   * Obtener los 10 productos destacados más recientes
   */
  getProductosDestacados(): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(`${this.apiUrl}/destacados`);
  }

  /**
   * Obtener todos los productos en oferta
   */
  getProductosOfertas(): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(`${this.apiUrl}/ofertas`);
  }

  /**
   * Buscar productos por nombre o código
   * @param query Texto a buscar (mínimo 2 caracteres)
   */
  buscarProductos(query: string): Observable<ProductoResponse> {
    const params = new HttpParams().set('query', query);
    return this.http.get<ProductoResponse>(`${this.apiUrl}/buscar`, { params });
  }

  /**
   * Obtener productos de una categoría específica
   */
  getProductosPorCategoria(categoryId: number): Observable<ProductosPorCategoriaResponse> {
    return this.http.get<ProductosPorCategoriaResponse>(`${this.apiUrl}/categoria/${categoryId}`);
  }

  /**
   * Obtener detalle completo de un producto
   */
  getProducto(id: number): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Verificar disponibilidad de stock de un producto
   */
  verificarStock(id: number): Observable<StockResponse> {
    return this.http.get<StockResponse>(`${this.apiUrl}/${id}/stock`);
  }

  /**
   * Crear un nuevo producto
   */
  crearProducto(producto: Partial<Producto>): Observable<ProductoResponse> {
    return this.http.post<ProductoResponse>(this.apiUrl, producto);
  }

  /**
   * Actualizar un producto existente
   */
  actualizarProducto(id: number, producto: Partial<Producto>): Observable<ProductoResponse> {
    return this.http.put<ProductoResponse>(`${this.apiUrl}/${id}`, producto);
  }
}
