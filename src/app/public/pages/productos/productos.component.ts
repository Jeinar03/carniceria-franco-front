import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService, Producto } from 'src/services/productos/productos.service';
import { CategoriasService, Categoria } from 'src/services/categorias/categorias.service';
import { CarritoService } from 'src/services/carrito/carrito.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  private readonly adminBaseUrl = 'https://www.carniceriafrancoadmin.shop';

  categoriaSeleccionada: number | null = null;
  categoriaSeleccionadaNombre: string = 'Todos';
  busqueda: string = '';
  cargando: boolean = false;
  error: string | null = null;
  modalDetalleAbierta: boolean = false;
  cargandoDetalle: boolean = false;
  errorDetalle: string | null = null;
  productoDetalle: Producto | null = null;

  productos: Producto[] = [];
  categorias: Categoria[] = [];

  constructor(
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
    private carritoService: CarritoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarCategorias();

    // Verificar si viene un filtro de categoría por query params
    this.route.queryParams.subscribe(params => {
      if (params['categoria']) {
        this.categoriaSeleccionada = +params['categoria'];
        this.cargarProductos();
      } else {
        this.cargarProductos();
      }
    });
  }

  cargarCategorias(): void {
    this.categoriasService.getCategorias().subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.categorias = response.data;
        }
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  cargarProductos(): void {
    this.cargando = true;
    this.error = null;

    const params: any = {};

    if (this.categoriaSeleccionada) {
      params.category_id = this.categoriaSeleccionada;
    }

    if (this.busqueda.trim().length >= 2) {
      // Si hay búsqueda, usar endpoint de búsqueda
      this.productosService.buscarProductos(this.busqueda).subscribe({
        next: (response) => {
          if (response.success && Array.isArray(response.data)) {
            this.productos = response.data;
          }
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al buscar productos:', error);
          this.error = 'No se pudieron cargar los productos. Por favor, intenta de nuevo.';
          this.cargando = false;
        }
      });
    } else {
      // Cargar productos normales
      this.productosService.getProductos(params).subscribe({
        next: (response) => {
          if (response.success) {
            if (Array.isArray(response.data)) {
              this.productos = response.data;
            } else if (response.data && 'data' in response.data) {
              // Es paginado
              this.productos = (response.data as any).data;
            }
          }
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar productos:', error);
          this.error = 'No se pudieron cargar los productos. Por favor, intenta de nuevo.';
          this.cargando = false;
        }
      });
    }
  }

  get productosFiltrados(): Producto[] {
    return this.productos;
  }

  filtrarPorCategoria(categoriaId: number | null): void {
    this.categoriaSeleccionada = categoriaId;

    if (categoriaId) {
      const cat = this.categorias.find(c => c.id === categoriaId);
      this.categoriaSeleccionadaNombre = cat ? cat.nombre : 'Todos';
    } else {
      this.categoriaSeleccionadaNombre = 'Todos';
    }

    this.cargarProductos();
  }

  onBusquedaChange(): void {
    if (this.busqueda.trim().length >= 2 || this.busqueda.trim().length === 0) {
      this.cargarProductos();
    }
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregarProducto(producto, 1);
    // Mostrar notificación de éxito (puedes usar un toast service aquí)
    console.log('Producto agregado al carrito:', producto.nombre);
  }

  verDetalle(producto: Producto): void {
    this.modalDetalleAbierta = true;
    this.cargandoDetalle = true;
    this.errorDetalle = null;
    this.productoDetalle = null;

    this.productosService.getProducto(producto.id).subscribe({
      next: (response) => {
        if (response.success && response.data && !Array.isArray(response.data) && !('current_page' in response.data)) {
          this.productoDetalle = response.data as Producto;
        } else {
          this.errorDetalle = 'No se pudo obtener el detalle del producto.';
        }
        this.cargandoDetalle = false;
      },
      error: (error) => {
        console.error('Error al obtener detalle del producto:', error);
        this.errorDetalle = 'No se pudo obtener el detalle del producto. Intenta nuevamente.';
        this.cargandoDetalle = false;
      }
    });
  }

  cerrarModalDetalle(): void {
    this.modalDetalleAbierta = false;
    this.cargandoDetalle = false;
    this.errorDetalle = null;
    this.productoDetalle = null;
  }

  generarEstrellas(calificacion: number): string[] {
    const estrellas = [];
    const calif = calificacion || 0;
    for (let i = 1; i <= 5; i++) {
      estrellas.push(i <= calif ? 'fas fa-star' : 'far fa-star');
    }
    return estrellas;
  }

  getImagenUrl(imagen: string | null): string {
    if (!imagen) {
      return 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400';
    }
    if (imagen.startsWith('http')) {
      return imagen;
    }
    return `${environment.apiUrl.replace('/api/v1', '')}/${imagen}`;
  }

  getImagenUrlFromProduct(producto: Producto): string {
    // Soporta rutas relativas como /storage/... o con barras escapadas.
    if (producto.imagen_url) {
      const imagenUrl = producto.imagen_url.replace(/\\/g, '');

      if (imagenUrl.startsWith('http')) {
        return imagenUrl;
      }

      if (imagenUrl.startsWith('/')) {
        return `${this.adminBaseUrl}${imagenUrl}`;
      }

      return `${this.adminBaseUrl}/${imagenUrl}`;
    }

    // Fallback al método original
    return this.getImagenUrl(producto.imagen);
  }

  tieneStock(producto: Producto): boolean {
    return producto.tiene_stock !== false && producto.stock > 0;
  }

  getPrecioFinal(producto: Producto): number {
    return producto.precio_final || producto.precio_oferta || producto.precio;
  }
}
