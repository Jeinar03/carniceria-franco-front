import { Component, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { ProductosService, Producto } from 'src/services/productos/productos.service';
import { CategoriasService, Categoria } from 'src/services/categorias/categorias.service';
import { CarritoService } from 'src/services/carrito/carrito.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Meta, Title } from '@angular/platform-browser';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private readonly adminBaseUrl = 'https://carniceriafrancoadmin.shop';

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: Categoria[] = [];
  categoriaSeleccionada: number | null = null;
  busqueda: string = '';
  loading = false;
  loadingCategorias = false;
  modalDetalleAbierta = false;
  cargandoDetalle = false;
  errorDetalle: string | null = null;
  productoDetalle: Producto | null = null;

  constructor(
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
    private carritoService: CarritoService,
    private toastr: ToastrService,
    private router: Router,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.configurarSeoHome();
    this.cargarCategorias();
    this.cargarProductos();
  }

  cargarCategorias(): void {
    this.loadingCategorias = true;
    this.categoriasService.getCategorias().subscribe({
      next: (response) => {
        if (response.success) {
          this.categorias = Array.isArray(response.data) ? response.data : [response.data];
        }
        this.loadingCategorias = false;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.loadingCategorias = false;
      }
    });
  }

  cargarProductos(categoriaId?: number): void {
    this.loading = true;

    const observable = categoriaId
      ? this.categoriasService.getProductosCategoria(categoriaId)
      : this.productosService.getProductos();

    observable.subscribe({
      next: (response: any) => {
        if (response.success) {
          this.productos = this.extraerListaProductos(response?.data);
          this.aplicarFiltrosLocales();
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar productos:', error);
        this.toastr.error('Error al cargar productos', 'Error');
        this.loading = false;
      }
    });
  }

  filtrarPorCategoria(categoriaId: number | null): void {
    this.categoriaSeleccionada = categoriaId;
    if (categoriaId === null) {
      this.cargarProductos();
    } else {
      this.cargarProductos(categoriaId);
    }
  }

  onBusquedaChange(): void {
    this.aplicarFiltrosLocales();
  }

  private aplicarFiltrosLocales(): void {
    const termino = this.busqueda.trim().toLowerCase();

    this.productosFiltrados = this.productos.filter((producto) => {
      if (!termino) {
        return true;
      }

      const nombre = (producto.nombre || '').toLowerCase();
      const codigo = (producto.codigo || '').toLowerCase();
      const categoria = (producto.category?.nombre || '').toLowerCase();
      return nombre.includes(termino) || codigo.includes(termino) || categoria.includes(termino);
    });
  }

  private extraerListaProductos(data: unknown): Producto[] {
    if (Array.isArray(data)) {
      return data as Producto[];
    }

    if (data && typeof data === 'object' && 'data' in data) {
      const paginado = data as { data?: unknown };
      if (Array.isArray(paginado.data)) {
        return paginado.data as Producto[];
      }
    }

    if (data && typeof data === 'object' && 'products' in data) {
      const porCategoria = data as { products?: unknown };
      if (Array.isArray(porCategoria.products)) {
        return porCategoria.products as Producto[];
      }
    }

    return [];
  }

  agregarAlCarrito(producto: Producto): void {
    if (!localStorage.getItem('token')) {
      this.toastr.info('Inicia sesión para agregar productos al carrito', 'Sesión requerida');
      this.router.navigate(['/login']);
      return;
    }

    if (this.tieneStock(producto)) {
      this.carritoService.agregarProducto(producto, 1);
      this.toastr.success(`${producto.nombre} agregado al carrito`, 'Producto Agregado');
    } else {
      this.toastr.warning('Producto sin stock', 'No Disponible');
    }
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

  verProductos(): void {
    this.router.navigate(['/pages/productos']);
  }

  getImagenProducto(producto: Producto): string {
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

    const imagen = producto.imagen;
    if (!imagen) {
      return 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400';
    }
    if (imagen.startsWith('http')) {
      return imagen;
    }
    return `${environment.apiUrl.replace('/api/v1', '')}/${imagen}`;
  }

  generarEstrellas(producto: Producto): string[] {
    // Generar calificación aleatoria entre 4 y 5 basada en el ID del producto
    const calificacion = producto.id % 2 === 0 ? 5 : 4;
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      estrellas.push(i <= calificacion ? 'fas fa-star' : 'far fa-star');
    }
    return estrellas;
  }

  getCalificacion(producto: Producto): number {
    return producto.id % 2 === 0 ? 5 : 4;
  }

  getPrecioFinal(producto: Producto): number {
    const precio = producto.precio_final ?? producto.precio_oferta ?? producto.precio;
    const precioNumero = Number(precio);
    return Number.isFinite(precioNumero) ? precioNumero : 0;
  }

  getPrecioBase(producto: Producto): number {
    const precioNumero = Number(producto.precio);
    return Number.isFinite(precioNumero) ? precioNumero : 0;
  }

  tieneStock(producto: Producto): boolean {
    const stockNumero = Number(producto.stock);
    return Number.isFinite(stockNumero) && stockNumero > 0;
  }

  private configurarSeoHome(): void {
    const title = 'Carniceria Franco | Carnes Premium y Entrega Rapida';
    const description = 'Compra carne de res, cerdo, pollo y cortes premium en Carniceria Franco. Productos frescos, calidad garantizada y entrega rapida.';
    const canonicalUrl = 'https://tienda.carniceriafrancoadmin.shop/';
    const imageUrl = 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=1200';

    this.titleService.setTitle(title);

    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ name: 'keywords', content: 'carniceria, carnes premium, carne fresca, carne de res, cortes finos, carniceria franco' });
    this.metaService.updateTag({ name: 'robots', content: 'index, follow' });

    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Carniceria Franco' });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:url', content: canonicalUrl });
    this.metaService.updateTag({ property: 'og:image', content: imageUrl });

    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: imageUrl });

    const existingCanonical = this.document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.setAttribute('href', canonicalUrl);
    } else {
      const link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', canonicalUrl);
      this.document.head.appendChild(link);
    }
  }
}
