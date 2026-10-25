import { environment } from 'src/environments/environment';
import { Producto } from 'src/services/productos/productos.service';
import { CarritoRecomendado, ProductoRecomendado } from './ventas.service';

/**
 * Ayudas de las recomendaciones (hiperpersonalizacion). Las usan el perfil
 * (pestana Recomendaciones) y la seccion "Para ti" del inicio.
 */

export function normalizarProductoRecomendado(producto: any): ProductoRecomendado {
  const precio = Number(producto?.precio || 0);
  const precioOferta = producto?.precio_oferta != null ? Number(producto.precio_oferta) : undefined;
  const cantidadRecomendada = Number(
    producto?.cantidad_recomendada ?? producto?.cantidad_sugerida ?? 1
  );

  return {
    id: Number(producto?.id ?? producto?.product_id ?? 0),
    nombre: producto?.nombre || '',
    codigo: producto?.codigo || '',
    precio,
    descripcion: producto?.descripcion || producto?.motivo || '',
    unidad_venta: producto?.unidad_venta || 'unidad',
    precio_oferta: precioOferta,
    en_oferta: Number(producto?.en_oferta || (precioOferta !== undefined ? 1 : 0)),
    imagen: producto?.imagen || null,
    stock: Number(producto?.stock ?? 100),
    cantidad_recomendada: cantidadRecomendada,
    subtotal: Number(producto?.subtotal ?? cantidadRecomendada * (precioOferta ?? precio)),
    categoria_id: Number(producto?.categoria_id || 0),
    categoria_nombre: producto?.categoria_nombre || producto?.categoria || ''
  };
}

export function normalizarCarritoRecomendado(carrito: any): CarritoRecomendado {
  const productos = (carrito?.productos || []).map((producto: any) =>
    normalizarProductoRecomendado(producto)
  );

  return {
    id: Number(carrito?.id || 0),
    nombre: carrito?.nombre || 'Recomendado',
    descripcion: carrito?.descripcion || '',
    productos,
    total_estimado: Number(carrito?.total_estimado || 0),
    ahorro_estimado: Number(carrito?.ahorro_estimado || 0),
    icono: carrito?.icono,
    color: carrito?.color
  };
}

/** Convierte un producto recomendado al formato del carrito. */
export function aProductoParaCarrito(producto: ProductoRecomendado): Producto {
  return {
    id: producto.id,
    codigo: producto.codigo || '',
    nombre: producto.nombre,
    descripcion: producto.descripcion || '',
    precio: Number(producto.precio || 0),
    precio_oferta: producto.precio_oferta ? Number(producto.precio_oferta) : null,
    precio_final: producto.precio_oferta ? Number(producto.precio_oferta) : Number(producto.precio || 0),
    stock: producto.stock || 100,
    stock_minimo: 0,
    unidad_venta: producto.unidad_venta || 'unidad',
    category_id: producto.categoria_id || 0,
    imagen: producto.imagen || null,
    imagen_url: null,
    en_oferta: Number(producto.en_oferta) || 0,
    activo: 1,
    destacado: 0,
    refrigerado: 0,
    fecha_vencimiento: null,
    tiene_stock: true,
    created_at: '',
    updated_at: ''
  };
}

/** URL de la foto de un producto; sin foto, una imagen generica. */
export function urlImagenProducto(imagen: string | null | undefined): string {
  if (!imagen) {
    return 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400';
  }

  // Si ya es una URL completa, limpiar las barras invertidas
  if (imagen.startsWith('http')) {
    return imagen.replace(/\\/g, '');
  }

  const base = environment.apiUrl.replace('/api/v1', '');
  const ruta = imagen.replace(/\\/g, '');

  // Si empieza con '/', construir la URL completa
  if (imagen.startsWith('/')) {
    return `${base}${ruta}`;
  }

  // Las fotos de productos se guardan como "productos/archivo.jpg" y se sirven desde /storage.
  return ruta.startsWith('storage/') ? `${base}/${ruta}` : `${base}/storage/${ruta}`;
}
