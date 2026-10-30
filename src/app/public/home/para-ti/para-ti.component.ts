import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/services/auth-service/auth-service.service';
import { CarritoService } from 'src/services/carrito/carrito.service';
import { CarritoRecomendado, VentasService } from 'src/services/ventas/ventas.service';
import {
  aProductoParaCarrito,
  normalizarCarritoRecomendado,
  urlImagenProducto
} from 'src/services/ventas/producto-recomendado.helper';

/**
 * Hiperpersonalizacion en el inicio: los carritos recomendados del cliente segun su historial.
 * Solo aparece con sesion iniciada y recomendaciones; si algo falla no muestra nada
 * (el inicio no debe llenarse de errores por una seccion opcional).
 */
@Component({
  selector: 'app-para-ti',
  templateUrl: './para-ti.component.html',
  styleUrls: ['./para-ti.component.css']
})
export class ParaTiComponent implements OnInit {
  // Cuantos carritos se muestran en el inicio; el resto se ve en el perfil.
  private static readonly MAXIMO_EN_INICIO = 3;
  // Productos que se muestran por carrito antes de "y N mas".
  private static readonly PRODUCTOS_POR_TARJETA = 4;

  nombre = '';
  carritos: CarritoRecomendado[] = [];
  hayMas = false;

  constructor(
    private authService: AuthService,
    private ventasService: VentasService,
    private carritoService: CarritoService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const clienteId = this.authService.getUserId();
    if (!clienteId || localStorage.getItem('isLoggedIn') !== 'true') {
      return;
    }

    this.nombre = (this.authService.getUserData().nombre || '').trim();

    this.ventasService.obtenerRecomendaciones(clienteId).subscribe({
      next: (respuesta) => {
        if (!respuesta?.success) {
          return;
        }
        const todos = (respuesta.data?.recomendaciones || [])
          .map((carrito) => normalizarCarritoRecomendado(carrito))
          .filter((carrito) => carrito.productos.length > 0);

        this.carritos = todos.slice(0, ParaTiComponent.MAXIMO_EN_INICIO);
        this.hayMas = todos.length > this.carritos.length;
      },
      error: () => {
        this.carritos = [];
      }
    });
  }

  productosVisibles(carrito: CarritoRecomendado) {
    return carrito.productos.slice(0, ParaTiComponent.PRODUCTOS_POR_TARJETA);
  }

  productosOcultos(carrito: CarritoRecomendado): number {
    return Math.max(0, carrito.productos.length - ParaTiComponent.PRODUCTOS_POR_TARJETA);
  }

  imagen(imagen: string | null | undefined): string {
    return urlImagenProducto(imagen);
  }

  agregarTodo(carrito: CarritoRecomendado): void {
    let agregados = 0;

    carrito.productos.forEach((producto) => {
      if (!producto?.id) {
        return;
      }
      this.carritoService.agregarProducto(
        aProductoParaCarrito(producto),
        Number(producto.cantidad_recomendada || 1)
      );
      agregados++;
    });

    if (agregados === 0) {
      this.toastr.warning('No hay productos para agregar', 'Carrito vacío');
      return;
    }

    this.toastr.success(`${agregados} producto(s) agregado(s) al carrito`, carrito.nombre, { timeOut: 3000 });
  }

  verTodas(): void {
    this.router.navigate(['/pages/profile'], { queryParams: { tab: 'recomendaciones' } });
  }

  trackByCarrito(_indice: number, carrito: CarritoRecomendado): number {
    return carrito.id;
  }
}
