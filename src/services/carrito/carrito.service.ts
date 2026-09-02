import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Producto } from '../productos/productos.service';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  monto_pesos?: number;
  tipoVenta: 'cantidad' | 'pesos';
  subtotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private CARRITO_KEY = 'carrito_franco';
  private carritoSubject = new BehaviorSubject<ItemCarrito[]>(this.obtenerCarrito());

  public carrito$ = this.carritoSubject.asObservable();

  constructor() { }

  /**
   * Obtener items del carrito desde localStorage
   */
  private obtenerCarrito(): ItemCarrito[] {
    try {
      const carritoString = localStorage.getItem(this.CARRITO_KEY);
      return carritoString ? JSON.parse(carritoString) : [];
    } catch (error) {
      console.error('Error al obtener carrito:', error);
      return [];
    }
  }

  /**
   * Guardar carrito en localStorage
   */
  private guardarCarrito(carrito: ItemCarrito[]): void {
    try {
      localStorage.setItem(this.CARRITO_KEY, JSON.stringify(carrito));
      this.carritoSubject.next(carrito);
    } catch (error) {
      console.error('Error al guardar carrito:', error);
    }
  }

  /**
   * Agregar producto al carrito
   */
  agregarProducto(producto: Producto, cantidad: number = 1): void {
    const carrito = this.obtenerCarrito();
    const index = carrito.findIndex(item => item.producto.id === producto.id);

    const precioFinal = Number(producto.precio_final || producto.precio_oferta || producto.precio || 0);
    const cantidadNum = Number(cantidad);

    if (index !== -1) {
      // Si ya existe, incrementar cantidad
      carrito[index].cantidad = Number(carrito[index].cantidad) + cantidadNum;
      carrito[index].subtotal = Number(carrito[index].cantidad) * precioFinal;
    } else {
      // Si no existe, agregarlo
      carrito.push({
        producto: producto,
        cantidad: cantidadNum,
        monto_pesos: undefined,
        tipoVenta: 'cantidad',
        subtotal: cantidadNum * precioFinal
      });
    }

    this.guardarCarrito(carrito);
  }

  /**
   * Actualizar cantidad de un producto
   */
  actualizarCantidad(productoId: number, cantidad: number): void {
    const carrito = this.obtenerCarrito();
    const index = carrito.findIndex(item => item.producto.id === productoId);
    const cantidadNum = Number(cantidad);

    if (index !== -1 && cantidadNum > 0) {
      const precioFinal = Number(carrito[index].producto.precio_final ||
                          carrito[index].producto.precio_oferta ||
                          carrito[index].producto.precio || 0);
      carrito[index].cantidad = cantidadNum;
      carrito[index].tipoVenta = 'cantidad';
      carrito[index].monto_pesos = undefined;
      carrito[index].subtotal = cantidadNum * precioFinal;
      this.guardarCarrito(carrito);
    } else if (cantidadNum <= 0) {
      this.eliminarProducto(productoId);
    }
  }

  /**
   * Actualizar venta por pesos
   */
  actualizarMontoPesos(productoId: number, monto: number): void {
    const carrito = this.obtenerCarrito();
    const index = carrito.findIndex(item => item.producto.id === productoId);
    const montoNum = Number(monto);

    if (index !== -1 && montoNum > 0) {
      const precioFinal = Number(carrito[index].producto.precio_final ||
                          carrito[index].producto.precio_oferta ||
                          carrito[index].producto.precio || 0);

      // Calcular cantidad basada en el monto
      let cantidad = montoNum / precioFinal;

      // Ajustar según la unidad de venta
      const unidad = carrito[index].producto.unidad_venta.toLowerCase();
      if (unidad === 'gramo' || unidad === 'gramos') {
        cantidad = cantidad * 1000; // Convertir kg a gramos
      }

      carrito[index].cantidad = Number(cantidad);
      carrito[index].monto_pesos = montoNum;
      carrito[index].tipoVenta = 'pesos';
      carrito[index].subtotal = montoNum;
      this.guardarCarrito(carrito);
    }
  }

  /**
   * Eliminar producto del carrito
   */
  eliminarProducto(productoId: number): void {
    let carrito = this.obtenerCarrito();
    carrito = carrito.filter(item => item.producto.id !== productoId);
    this.guardarCarrito(carrito);
  }

  /**
   * Eliminar productos seleccionados
   */
  eliminarSeleccionados(productosIds: number[]): void {
    let carrito = this.obtenerCarrito();
    carrito = carrito.filter(item => !productosIds.includes(item.producto.id));
    this.guardarCarrito(carrito);
  }

  /**
   * Vaciar carrito completamente
   */
  vaciarCarrito(): void {
    this.guardarCarrito([]);
  }

  /**
   * Obtener items del carrito como observable
   */
  obtenerCarritoObservable(): Observable<ItemCarrito[]> {
    return this.carrito$;
  }

  /**
   * Obtener items del carrito (snapshot)
   */
  obtenerItems(): ItemCarrito[] {
    return this.obtenerCarrito();
  }

  /**
   * Obtener cantidad total de items
   */
  obtenerCantidadTotal(): number {
    const carrito = this.obtenerCarrito();
    return carrito.reduce((total, item) => total + item.cantidad, 0);
  }

  /**
   * Obtener total del carrito
   */
  obtenerTotal(): number {
    const carrito = this.obtenerCarrito();
    return carrito.reduce((total, item) => total + item.subtotal, 0);
  }

  /**
   * Verificar si un producto está en el carrito
   */
  estaEnCarrito(productoId: number): boolean {
    const carrito = this.obtenerCarrito();
    return carrito.some(item => item.producto.id === productoId);
  }

  /**
   * Obtener cantidad de un producto específico en el carrito
   */
  obtenerCantidadProducto(productoId: number): number {
    const carrito = this.obtenerCarrito();
    const item = carrito.find(item => item.producto.id === productoId);
    return item ? item.cantidad : 0;
  }
}
