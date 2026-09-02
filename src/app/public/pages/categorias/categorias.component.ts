import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriasService, Categoria } from 'src/services/categorias/categorias.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {

  private readonly adminBaseUrl = 'https://www.carniceriafrancoadmin.shop';
  private readonly defaultCategoryImage = 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=500';

  categorias: Categoria[] = [];
  cargando: boolean = false;
  error: string | null = null;

  constructor(
    private categoriasService: CategoriasService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.cargando = true;
    this.error = null;

    this.categoriasService.getCategorias().subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.categorias = response.data;
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.error = 'No se pudieron cargar las categorías. Por favor, intenta de nuevo.';
        this.cargando = false;
      }
    });
  }

  get categoriasDestacadas(): Categoria[] {
    // Las primeras 6 categorías se consideran destacadas, o puedes usar otro criterio
    return this.categorias.slice(0, 6);
  }

  verCategoria(categoria: Categoria): void {
    // Navegar a productos filtrando por categoría
    this.router.navigate(['/pages/productos'], {
      queryParams: { categoria: categoria.id }
    });
  }

  getImagenUrl(imagen: string | null): string {
    if (!imagen) {
      return this.defaultCategoryImage;
    }

    const imagenLimpia = imagen.replace(/\\/g, '');

    // Si la imagen es una URL completa, usarla directamente.
    if (imagenLimpia.startsWith('http')) {
      return imagenLimpia;
    }

    // Si viene como /storage/... o storage/..., anexar dominio.
    if (imagenLimpia.startsWith('/storage/')) {
      return `${this.adminBaseUrl}${imagenLimpia}`;
    }

    if (imagenLimpia.startsWith('storage/')) {
      return `${this.adminBaseUrl}/${imagenLimpia}`;
    }

    // Si viene solo el nombre de archivo, usar carpeta de categorias.
    return `${this.adminBaseUrl}/storage/categories/${imagenLimpia}`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img && img.src !== this.defaultCategoryImage) {
      img.src = this.defaultCategoryImage;
    }
  }
}
