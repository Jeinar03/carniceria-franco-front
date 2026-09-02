import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {LoginService} from "../../../../services/login/login.service";
import {AuthService} from "../../../../services/auth-service/auth-service.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CustomerService} from "../../../../services/customers/customer-service.service";
import { CarritoRecomendado, PreguntaSatisfaccion, ProductoRecomendado, RespuestaSatisfaccion, Venta, VentasService } from 'src/services/ventas/ventas.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import {catchError, of} from "rxjs";
import { CarritoService } from 'src/services/carrito/carrito.service';
import { Producto } from 'src/services/productos/productos.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  myForm!: FormGroup;
  loading = false;
  loadingBTN = false;
  loadingCompras = false;
  loadingRecomendaciones = false;
  activeTab: string = 'datos';
  private datosPerfilOriginales: Record<string, any> = {};
  // Declara una variable para almacenar la respuesta del servicio
  solicitud: any;
  compras: Venta[] = [];
  comprasRecientes: Venta[] = [];
  estadisticas: any = null;
  // Paginación
  paginaActual = 1;
  totalPaginas = 1;
  totalCompras = 0;
  comprasPorPagina = 10;
  // Detalle de compra seleccionada
  compraSeleccionada: Venta | null = null;
  mostrandoDetalle = false;
  // Evidencia de transferencia
  mostrandoModalEvidencia = false;
  compraEvidenciaSeleccionada: Venta | null = null;
  archivoEvidencia: File | null = null;
  nombreArchivoEvidencia = '';
  subiendoEvidencia = false;
  // Recomendaciones
  recomendaciones: CarritoRecomendado[] = [];
  datosRecomendaciones: any = null;
  // Encuesta de satisfaccion
  mostrandoModalEncuesta = false;
  cargandoEncuesta = false;
  guardandoEncuesta = false;
  compraEncuestaSeleccionada: Venta | null = null;
  preguntasEncuesta: PreguntaSatisfaccion[] = [];
  respuestasEncuesta: Record<number, number | null> = {};
  comentariosEncuesta: Record<number, string> = {};
  escalaEncuesta = { min: 1, max: 10 };
  encuestasRespondidas: Set<number> = new Set();

  get encuestaCompleta(): boolean {
    return this.preguntasEncuesta.length > 0 &&
      this.preguntasEncuesta.every((pregunta) => {
        const respuesta = this.respuestasEncuesta[pregunta.id];
        return respuesta !== null &&
          respuesta !== undefined &&
          respuesta >= this.escalaEncuesta.min &&
          respuesta <= this.escalaEncuesta.max;
      });
  }

  switchTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'compras' && this.compras.length === 0) {
      this.loadCompras();
      this.loadEstadisticas();
    }
    if (tab === 'recomendaciones' && this.recomendaciones.length === 0) {
      this.loadRecomendaciones();
    }
  }

  loadCompras() {
    const customerId = this.authService.getUserId();
    if (!customerId) {
      this.toastr.error('No se pudo obtener el ID del cliente');
      return;
    }

    this.loadingCompras = true;
    this.ventasService.obtenerHistorialCliente(customerId, this.paginaActual, this.comprasPorPagina)
      .pipe(
        catchError(err => {
          console.error('Error al cargar compras:', err);
          this.toastr.error('No se pudieron cargar las compras', 'Error');
          this.loadingCompras = false;
          return of(null);
        })
      )
      .subscribe(response => {
        if (response && response.success) {
          this.compras = response.data.purchases.data;
          this.paginaActual = response.data.purchases.current_page;
          this.totalPaginas = response.data.purchases.last_page;
          this.totalCompras = response.data.purchases.total;
          this.loadingCompras = false;
        }
      });
  }

  loadEstadisticas() {
    const customerId = this.authService.getUserId();
    if (!customerId) return;

    this.ventasService.obtenerEstadisticasCliente(customerId)
      .pipe(
        catchError(err => {
          console.error('Error al cargar estadísticas:', err);
          return of(null);
        })
      )
      .subscribe(response => {
        if (response && response.success) {
          this.estadisticas = response.data;
        }
      });
  }

  verDetalleCompra(compraId: number) {
    this.ventasService.obtenerDetalleVenta(compraId)
      .pipe(
        catchError(err => {
          console.error('Error al cargar detalle:', err);
          this.toastr.error('No se pudo cargar el detalle de la compra', 'Error');
          return of(null);
        })
      )
      .subscribe(response => {
        if (response && response.success) {
          this.compraSeleccionada = response.data;
          this.mostrandoDetalle = true;
        }
      });
  }

  cerrarDetalle() {
    this.mostrandoDetalle = false;
    this.compraSeleccionada = null;
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas && pagina !== this.paginaActual) {
      this.paginaActual = pagina;
      this.loadCompras();
    }
  }

  getImagenProducto(imagen: string | null | undefined): string {
    if (!imagen) {
      return 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400';
    }

    // Si ya es una URL completa, limpiar las barras invertidas
    if (imagen.startsWith('http')) {
      return imagen.replace(/\\/g, '');
    }

    // Si empieza con '/', construir la URL completa
    if (imagen.startsWith('/')) {
      return `${environment.apiUrl.replace('/api/v1', '')}${imagen.replace(/\\/g, '')}`;
    }

    return `${environment.apiUrl.replace('/api/v1', '')}/${imagen}`;
  }

  getEstatusClass(estatus: string): string {
    switch(estatus) {
      case 'completada': return 'status-completada';
      case 'pendiente': return 'status-pendiente';
      case 'cancelada': return 'status-cancelada';
      case 'entregada': return 'status-entregada';
      default: return 'status-default';
    }
  }

  getMetodoPagoIcon(metodo: string): string {
    switch(metodo) {
      case 'tarjeta': return 'fa-credit-card';
      case 'efectivo': return 'fa-money-bill';
      case 'transferencia': return 'fa-exchange-alt';
      case 'credito': return 'fa-file-invoice-dollar';
      default: return 'fa-dollar-sign';
    }
  }

  esTransferenciaPendiente(compra: Venta): boolean {
    const metodoPago = (compra?.metodo_pago || '').toLowerCase().trim();
    const estatus = (compra?.estatus || '').toLowerCase().trim();
    return metodoPago === 'transferencia' && estatus === 'pendiente';
  }

  puedeResponderSatisfaccion(compra: Venta): boolean {
    const estatus = (compra?.estatus || '').toLowerCase().trim();
    return estatus === 'completada' && !this.encuestasRespondidas.has(compra.id);
  }

  abrirModalEncuesta(compra: Venta) {
    const customerId = this.authService.getUserId();
    if (!customerId) {
      this.toastr.error('No se pudo obtener el ID del cliente', 'Error');
      return;
    }

    this.compraEncuestaSeleccionada = compra;
    this.preguntasEncuesta = [];
    this.respuestasEncuesta = {};
    this.comentariosEncuesta = {};
    this.escalaEncuesta = { min: 1, max: 10 };
    this.cargandoEncuesta = true;
    this.guardandoEncuesta = false;
    this.mostrandoModalEncuesta = true;

    this.ventasService.obtenerPreguntasSatisfaccion(compra.id, customerId)
      .pipe(
        catchError(err => {
          console.error('Error al obtener encuesta de satisfaccion:', err);
          this.toastr.error('No se pudo cargar la encuesta', 'Encuesta');
          this.cargandoEncuesta = false;
          return of(null);
        })
      )
      .subscribe(response => {
        this.cargandoEncuesta = false;

        if (!response) {
          return;
        }

        if (response.data?.ya_respondio) {
          this.encuestasRespondidas.add(compra.id);
          this.toastr.info('Este pedido ya tiene encuesta respondida', 'Encuesta');
          this.cerrarModalEncuesta();
          return;
        }

        const preguntas = response.data?.preguntas || [];
        if (preguntas.length === 0) {
          this.toastr.info('No hay preguntas disponibles para este pedido', 'Encuesta');
          this.cerrarModalEncuesta();
          return;
        }

        this.escalaEncuesta = response.data?.escala || { min: 1, max: 10 };
        this.preguntasEncuesta = [...preguntas].sort((a, b) => a.orden - b.orden);
        this.preguntasEncuesta.forEach((pregunta) => {
          this.respuestasEncuesta[pregunta.id] = null;
          this.comentariosEncuesta[pregunta.id] = '';
        });
      });
  }

  cerrarModalEncuesta() {
    if (this.guardandoEncuesta) {
      return;
    }

    this.mostrandoModalEncuesta = false;
    this.compraEncuestaSeleccionada = null;
    this.preguntasEncuesta = [];
    this.respuestasEncuesta = {};
    this.comentariosEncuesta = {};
    this.cargandoEncuesta = false;
  }

  seleccionarRespuestaEncuesta(preguntaId: number, valor: number): void {
    this.respuestasEncuesta[preguntaId] = valor;
  }

  obtenerValoresEscala(): number[] {
    const valores: number[] = [];
    for (let valor = this.escalaEncuesta.min; valor <= this.escalaEncuesta.max; valor++) {
      valores.push(valor);
    }
    return valores;
  }

  guardarEncuesta(): void {
    const customerId = this.authService.getUserId();
    if (!this.compraEncuestaSeleccionada || !customerId) {
      this.toastr.error('No se pudo identificar el pedido', 'Encuesta');
      return;
    }

    if (!this.encuestaCompleta) {
      this.toastr.warning('Responde todas las preguntas para continuar', 'Encuesta incompleta');
      return;
    }

    const respuestas: RespuestaSatisfaccion[] = this.preguntasEncuesta.map((pregunta) => {
      const comentario = (this.comentariosEncuesta[pregunta.id] || '').trim();
      const respuesta: RespuestaSatisfaccion = {
        pregunta_id: pregunta.id,
        respuesta: Number(this.respuestasEncuesta[pregunta.id])
      };

      if (comentario) {
        respuesta.comentario = comentario;
      }

      return respuesta;
    });

    this.guardandoEncuesta = true;
    this.ventasService.guardarRespuestasSatisfaccion(this.compraEncuestaSeleccionada.id, customerId, respuestas)
      .pipe(
        catchError(err => {
          console.error('Error al guardar encuesta de satisfaccion:', err);
          this.toastr.error('No se pudieron guardar tus respuestas', 'Encuesta');
          this.guardandoEncuesta = false;
          return of(null);
        })
      )
      .subscribe(response => {
        this.guardandoEncuesta = false;

        if (response?.success && this.compraEncuestaSeleccionada) {
          this.encuestasRespondidas.add(this.compraEncuestaSeleccionada.id);
          this.toastr.success('Gracias por compartir tu opinion', 'Encuesta guardada');
          this.cerrarModalEncuesta();
          return;
        }

        if (response) {
          this.toastr.warning(response.message || 'No se pudo guardar la encuesta', 'Encuesta');
        }
      });
  }

  abrirModalEvidencia(compra: Venta) {
    this.compraEvidenciaSeleccionada = compra;
    this.archivoEvidencia = null;
    this.nombreArchivoEvidencia = '';
    this.subiendoEvidencia = false;
    this.mostrandoModalEvidencia = true;
  }

  cerrarModalEvidencia() {
    this.mostrandoModalEvidencia = false;
    this.compraEvidenciaSeleccionada = null;
    this.archivoEvidencia = null;
    this.nombreArchivoEvidencia = '';
    this.subiendoEvidencia = false;
  }

  onArchivoEvidenciaSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length > 0 ? input.files[0] : null;

    if (!file) {
      this.archivoEvidencia = null;
      this.nombreArchivoEvidencia = '';
      return;
    }

    const tiposPermitidos = ['image/jpeg', 'image/png', 'application/pdf'];
    const tamanoMaximoBytes = 5 * 1024 * 1024;

    if (!tiposPermitidos.includes(file.type)) {
      this.toastr.warning('Solo se permite JPG, PNG o PDF', 'Archivo no valido');
      input.value = '';
      this.archivoEvidencia = null;
      this.nombreArchivoEvidencia = '';
      return;
    }

    if (file.size > tamanoMaximoBytes) {
      this.toastr.warning('El archivo excede 5MB', 'Archivo demasiado grande');
      input.value = '';
      this.archivoEvidencia = null;
      this.nombreArchivoEvidencia = '';
      return;
    }

    this.archivoEvidencia = file;
    this.nombreArchivoEvidencia = file.name;
  }

  subirEvidenciaTransferencia() {
    if (!this.compraEvidenciaSeleccionada?.id) {
      this.toastr.error('No se identifico la compra para subir evidencia', 'Error');
      return;
    }

    if (!this.archivoEvidencia) {
      this.toastr.warning('Selecciona un archivo antes de continuar', 'Archivo requerido');
      return;
    }

    this.subiendoEvidencia = true;
    this.ventasService
      .subirEvidenciaTransferencia(this.compraEvidenciaSeleccionada.id, this.archivoEvidencia)
      .pipe(
        catchError(err => {
          console.error('Error al subir evidencia:', err);
          this.toastr.error('No se pudo subir la evidencia', 'Error');
          this.subiendoEvidencia = false;
          return of(null);
        })
      )
      .subscribe(response => {
        if (response?.success) {
          this.toastr.success('Evidencia subida correctamente', 'Transferencia');
          this.cerrarModalEvidencia();
          this.loadCompras();
          return;
        }

        this.toastr.warning(response?.message || 'No se pudo subir la evidencia', 'Aviso');
        this.subiendoEvidencia = false;
      });
  }

  // Helper para convertir string a número
  toNumber(value: any): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value) || 0;
    return 0;
  }

  // Helper para formatear valores monetarios
  formatMoney(value: any): string {
    return this.toNumber(value).toFixed(2);
  }

  // Métodos para Recomendaciones
  private normalizarProductoRecomendado(producto: any): ProductoRecomendado {
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

  private normalizarCarritoRecomendado(carrito: any): CarritoRecomendado {
    const productos = (carrito?.productos || []).map((producto: any) =>
      this.normalizarProductoRecomendado(producto)
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

  loadRecomendaciones() {
    const customerId = this.authService.getUserId();
    if (!customerId) {
      this.toastr.error('No se pudo obtener el ID del cliente');
      return;
    }

    this.loadingRecomendaciones = true;
    this.ventasService.obtenerRecomendaciones(customerId)
      .pipe(
        catchError(err => {
          console.error('Error al cargar recomendaciones:', err);
          this.toastr.error('No se pudieron cargar las recomendaciones', 'Error');
          this.loadingRecomendaciones = false;
          return of(null);
        })
      )
      .subscribe(response => {
        if (response && response.success) {
          this.recomendaciones = (response.data.recomendaciones || []).map(carrito =>
            this.normalizarCarritoRecomendado(carrito)
          );
          this.datosRecomendaciones = response.data;
        } else {
          this.recomendaciones = [];
        }
        this.loadingRecomendaciones = false;
      });
  }

  // TrackBy function para optimizar el rendering de carritos
  trackByCarrito(index: number, carrito: CarritoRecomendado): number {
    return carrito.id;
  }

  // Obtener la clase CSS del ícono del carrito según su ID
  getCarritoIconClass(carritoId: number): string {
    switch(carritoId) {
      case 1: return 'favoritos';
      case 2: return 'mix';
      case 3: return 'ofertas';
      default: return 'favoritos';
    }
  }

  // Obtener el ícono del carrito según su nombre
  getCarritoIcon(carritoNombre: string): string {
    if (carritoNombre.includes('Favoritos')) return 'fas fa-heart';
    if (carritoNombre.includes('Mix') || carritoNombre.includes('Recomendado')) return 'fas fa-magic';
    if (carritoNombre.includes('Ofertas')) return 'fas fa-tags';
    return 'fas fa-shopping-cart';
  }

  // Agregar un producto individual al carrito
  agregarProductoAlCarrito(producto: ProductoRecomendado) {
    if (!producto?.id) {
      this.toastr.error('Producto invalido para agregar al carrito', 'Error');
      return;
    }

    // Convertir ProductoRecomendado a Producto para el servicio de carrito
    const productoParaCarrito: Producto = {
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

    // Agregar al carrito con la cantidad recomendada
    const cantidadAgregar = Number(producto.cantidad_recomendada || 1);
    this.carritoService.agregarProducto(productoParaCarrito, cantidadAgregar);

    this.toastr.success(
      `${cantidadAgregar} ${producto.unidad_venta}(s) agregado(s)`,
      `${producto.nombre}`
    );
  }

  // Agregar todo el carrito recomendado
  agregarCarritoCompleto(carrito: CarritoRecomendado) {
    if (!carrito.productos || carrito.productos.length === 0) {
      this.toastr.warning('No hay productos para agregar', 'Carrito vacío');
      return;
    }

    let productosAgregados = 0;

    // Agregar cada producto del carrito recomendado
    carrito.productos.forEach(producto => {
      if (!producto?.id) {
        return;
      }

      const productoParaCarrito: Producto = {
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

      const cantidadAgregar = Number(producto.cantidad_recomendada || 1);
      this.carritoService.agregarProducto(productoParaCarrito, cantidadAgregar);
      productosAgregados++;
    });

    this.toastr.success(
      `${productosAgregados} producto(s) agregado(s) al carrito`,
      carrito.nombre,
      { timeOut: 3000 }
    );
  }

  // Contar productos favoritos (productos que aparecen en las recomendaciones)
  contarProductosFavoritos(): number {
    if (!this.recomendaciones || this.recomendaciones.length === 0) return 0;
    const productosUnicos = new Set();
    this.recomendaciones.forEach(carrito => {
      carrito.productos.forEach(producto => {
        productosUnicos.add(producto.id);
      });
    });
    return productosUnicos.size;
  }

  // Contar categorías diferentes en las recomendaciones
  contarCategorias(): number {
    if (!this.recomendaciones || this.recomendaciones.length === 0) return 0;
    const categoriasUnicas = new Set();
    this.recomendaciones.forEach(carrito => {
      carrito.productos.forEach(producto => {
        if (producto.categoria_id) {
          categoriasUnicas.add(producto.categoria_id);
        }
      });
    });
    return categoriasUnicas.size;
  }

  // Calcular ahorro total de todas las recomendaciones
  calcularAhorroTotal(): number {
    if (!this.recomendaciones || this.recomendaciones.length === 0) return 0;
    return this.recomendaciones.reduce((total, carrito) => {
      return total + this.toNumber(carrito.ahorro_estimado);
    }, 0);
  }

  constructor(
    private loginService: LoginService,
    private fb: FormBuilder,
    private authService:AuthService,
    private customerService: CustomerService,
    private ventasService: VentasService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private carritoService: CarritoService
  ) {
    this.myForm  = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      apellido2: [''],
      correo: [{ value: '', disabled: true }],
      telefono: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      direccion: [''],
      ciudad: [''],
      estado: [''],
      codigo_postal: ['', [Validators.pattern(/^[0-9]{5}$/)]],
      pais: ['México'],
      rfc: [''],
      tipo_cliente: [{ value: 'minorista', disabled: true }],
      saldo_cuenta: [{ value: '0.00', disabled: true }],
      total_compras: [{ value: '0.00', disabled: true }],
      numero_compras: [{ value: 0, disabled: true }]
    });
  }
getData(){
  this.loading=true;
  const clienteId = this.authService.getUserId(); // Obtén el ID del cliente desde AuthService
  if (clienteId) {
    this.loginService.getCustomerData(clienteId).subscribe(
      data => {
        // Rellenar el formulario con los datos del cliente
        this.myForm.patchValue(data.data);
        this.datosPerfilOriginales = this.obtenerDatosEditablesPerfil();
        console.log(this.myForm)
        this.loading=false;
      },
      error => {
        this.loading=false;
        console.error(error); // Maneja cualquier error de la solicitud
      }
    );
  } else {
    console.error('No se pudo obtener el ID del cliente.');
  }
}
  ngOnInit(): void {
    this.getData();

    // Verificar si hay parámetro de tab en la URL
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'compras') {
        this.switchTab('compras');
      } else if (params['tab'] === 'recomendaciones') {
        this.switchTab('recomendaciones');
      }
    });
  }

  submitForm() {
    try {
      this.loadingBTN=true;
      const id = this.authService.getUserId();
      if (!id) {
        this.loadingBTN = false;
        this.toastr.error('No se pudo obtener el ID del cliente', 'Error');
        return;
      }

      if (this.myForm.invalid) {
        this.myForm.markAllAsTouched();
        this.loadingBTN = false;
        this.toastr.warning('Revisa los campos con formato invalido', 'Datos incompletos');
        return;
      }

      if (this.myForm.valid && id) {
        const formValue = this.construirPayloadPerfil();

        if (Object.keys(formValue).length === 0) {
          this.loadingBTN = false;
          this.toastr.info('No hay cambios para guardar', 'Sin cambios');
          return;
        }

        this.customerService.updateCustomer(id, formValue)
          .pipe(
            catchError(err => {
              this.loadingBTN=false
              console.error('Error al actualizar el cliente:', err);
              this.showError();
              return of(null); // Retorna un observable vacío para continuar con la ejecución
            })
          )
          .subscribe(response => {

            if (response) {
              console.log('Cliente actualizado:', response);
              this.showSuccess();
              this.loadingBTN=false;
              this.datosPerfilOriginales = {
                ...this.datosPerfilOriginales,
                ...formValue
              };
              this.getData();
              this.authService.updateProfileStatus('si');
            }
          });
      }
    } catch (error) {
      console.error('Error en el formulario:', error);
      this.showError();
      this.loadingBTN=false
    }
  }

  private construirPayloadPerfil(): any {
    const datosActuales = this.obtenerDatosEditablesPerfil();
    const payload: Record<string, any> = {};

    Object.keys(datosActuales).forEach((campo) => {
      if (this.normalizarValorPerfil(datosActuales[campo]) !== this.normalizarValorPerfil(this.datosPerfilOriginales[campo])) {
        payload[campo] = datosActuales[campo];
      }
    });

    return payload;
  }

  private obtenerDatosEditablesPerfil(): Record<string, any> {
    const formValue = this.myForm.getRawValue();
    const camposEditables = [
      'nombre',
      'apellido',
      'apellido2',
      'telefono',
      'direccion',
      'ciudad',
      'estado',
      'codigo_postal',
      'pais',
      'rfc'
    ];
    const datos: Record<string, any> = {};

    camposEditables.forEach((campo) => {
      datos[campo] = formValue[campo] ?? null;
    });

    return datos;
  }

  private normalizarValorPerfil(valor: any): string {
    if (valor === null || valor === undefined) {
      return '';
    }

    if (typeof valor === 'string') {
      return valor.trim();
    }

    return String(valor);
  }

  hasCambiosPerfil(): boolean {
    const datosActuales = this.obtenerDatosEditablesPerfil();

    return Object.keys(datosActuales).some((campo) => {
      return this.normalizarValorPerfil(datosActuales[campo]) !== this.normalizarValorPerfil(this.datosPerfilOriginales[campo]);
    });
  }

  showSuccess() {
    this.toastr.info('Completado', 'Datos Actualizados');
  }
  showError() {
    this.toastr.error('No Completado', 'Ocurrio un error');
  }
}
