/**
 * Datos que solo usan las paginas legales (decision 13 del spec: fijos aqui, cambian poco y pasan
 * por revision del abogado). Direccion, correo, telefono y WhatsApp NO van aqui: salen de
 * SitioConfigService, igual que en el pie, para no tener dos versiones.
 *
 * Todo lo que dice [ENTRE CORCHETES] es un dato que falta capturar: Einar lo da, el abogado lo
 * revisa, y entonces se sustituye aqui. No publicar mientras quede alguno.
 *
 * Spec: "Spec - Paginas legales y consentimiento de la tienda" (vault, Carniceria Franco).
 */

/** Debe coincidir con config/legal.php del backend ('version'). Al cambiarla, todos aceptan de nuevo. */
export const VERSION_LEGAL = '2026-11-04-borrador';

/** Texto que se muestra como "ultima actualizacion" en las cuatro paginas. */
export const FECHA_ACTUALIZACION_LEGAL = '4 de noviembre de 2026 (borrador sin revision legal)';

export const DATOS_LEGALES = {
  /** Persona fisica o moral, nombre completo. Hay dos grafias en uso (Franco y Franko). */
  nombreLegal: '[NOMBRE LEGAL]',
  rfc: '[RFC]',
  domicilioFiscal: '[DOMICILIO FISCAL, si es distinto al de la tienda]',
  /** Correo para derechos ARCO y revocacion; puede ser distinto al de contacto de la tienda. */
  correoDatosPersonales: '[CORREO PARA DATOS PERSONALES]',
  /** Persona o departamento de datos personales (articulo 29). */
  responsableDatos: '[PERSONA ENCARGADA DE DATOS PERSONALES]',
  /** Quien es el mandadito: empleado, repartidor externo o plataforma. */
  quienEsMandadito: '[QUIEN HACE LA ENTREGA: empleado, repartidor externo o plataforma]',
  zonaEntrega: '[ZONA DE ENTREGA]',
  tiemposEntrega: '[TIEMPOS DE ENTREGA]',
  costoMandadito: '[COSTO O RANGO DEL MANDADITO]',
  tiempoParaRecoger: '[TIEMPO PARA RECOGER EL PEDIDO]',
  seFactura: '[SI SE EMITE FACTURA Y COMO SE PIDE]',
  edadMinima: '[EDAD MINIMA]',
  leyYTribunal: '[LEY Y TRIBUNALES COMPETENTES]',
  paisServidor: '[PAIS DEL SERVIDOR DE HOSTINGER]',
  /** Plazo para reportar un producto mal al recibirlo (decision 5: guia de 24 horas). */
  plazoReporte: '24 horas',
  /** Tiempo para devolver el dinero y si se devuelve el mandadito: Einar los decide. */
  tiempoDevolucion: '[TIEMPO PARA DEVOLVER EL DINERO]',
  devuelveMandadito: '[SI SE DEVUELVE EL COSTO DEL MANDADITO]',
  /** Plazos de conservacion (decision 12): los define el contador. */
  conservacionVentas: '[PLAZO DE CONSERVACION DE VENTAS Y COMPROBANTES, segun el contador]',
};
