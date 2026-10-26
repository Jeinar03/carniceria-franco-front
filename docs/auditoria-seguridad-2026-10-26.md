AUDITORIA DE SEGURIDAD - FRONT DE CARNICERIA FRANCO
Fecha: 2026-10-26
Repo: Jeinar03/carniceria-franco-front, main, commit 18d6596
Herramienta: skill oficial de Cloudflare "security-audit" (6 fases)
JSON de la skill: docs/auditoria-seguridad-2026-10-26.json


RESUMEN (5 LINEAS)

1. Se auditó el front (Angular) en el commit 18d6596 de main con las 6 fases de la skill, perfil estándar; no incluye los 5 commits locales de la rama produccion ni el backend.
2. Resultado: 1 hallazgo confirmado, de gravedad baja (el logout deja datos del cliente en el navegador) y 18 pistas "por validar" que NO tienen gravedad porque dependen de lo que haga el backend.
3. No hay llaves, tokens ni secretos en el código, en las variables que van al navegador ni en los 29 commits del historial, y no hay XSS en la SPA (Angular escapa todo y no hay innerHTML ni bypassSecurityTrust).
4. Lo urgente está en el backend: el front manda ids de cliente, cantidades, montos y campos de perfil que decide el navegador, y solo Laravel puede impedir el abuso (dueño, rol y campos permitidos).
5. Límites: sin acceso al repo carniceria-franco-backend, sin tocar producción y sin poder compilar la app (no hay node_modules); ninguna pista se pudo probar contra un servidor real.


COMO LEER ESTE REPORTE

- "Confirmado": el defecto está demostrado con el código y una prueba local en sandbox. Solo ese tiene gravedad.
- "Por validar": hay un camino concreto en este repo hacia una frontera del backend, pero lo decisivo está en el backend (que no vimos). No tiene gravedad. Se da una "prioridad de revisión" (alta, media, baja) según el daño posible si el backend NO lo cubre. No es una gravedad.
- Columna "Depende del backend": Sí = no se puede saber si es explotable sin ver carniceria-franco-backend. No = el defecto vive solo en este front.
- Regla de la skill: el agente que encuentra un hallazgo nunca es el que lo confirma. Cada candidato lo revisó un verificador distinto que intentó desmentirlo, y después otro verificador distinto revisó el registro final.


TABLA DE HALLAZGOS

Formato: una fila por hallazgo, columnas separadas por " | ".
Columnas: ID | Gravedad | Archivo y línea | Cómo se explota | Prueba del verificador | Arreglo propuesto | Depende del backend

F-01 | BAJA (confirmado) | src/services/auth-service/auth-service.service.ts:68-73 y src/services/login/login.service.ts:38-41 | Quien use después el mismo navegador (equipo compartido) lee teléfono, saldo, tipo de cliente, descuento y carrito del cliente anterior; en /carrito sin sesión se ve "Mayorista" y su descuento. No expone el token. | Un arnés en sandbox ejecutó el texto real de login y logout: tras cerrar sesión quedaron clienteTelefono, clienteSaldo, clienteTipoCliente, clienteDescuentoPreferencial, profileIsComplete y carrito_franco. Confirmado por dos verificadores distintos. | Una sola lista de claves de sesión que logout borre completa (también por inactividad y por 401); decidir si carrito_franco se vacía; agregar una prueba que revise que tras logout no queda ninguna clave de cliente. | No

F-02 | Por validar. Prioridad: ALTA | src/services/login/login.service.ts:36; src/services/auth-service/auth-service.service.ts:79; src/services/ventas/ventas.service.ts:274 (también 281, 336); src/services/customers/customer-service.service.ts:19, 24, 37, 40; src/app/public/pages/carrito/carrito.component.ts:392 | El id del cliente sale de localStorage (editable) y va en las URLs y cuerpos. Si el backend no compara ese id con el usuario del token, un cliente registrado puede leer historial, estadísticas y datos personales de otro, cambiar su perfil, ver o borrar sus fotos y crear pedidos a su nombre o con su descuento de mayorista. | El verificador confirmó por código que nada en el front liga el id al token y que el commit d4f655a solo agregó el Bearer sin cambiar los selectores. No hay prueba de explotación: el backend no está disponible. | Backend: derivar el cliente de $request->user() e ignorar el id recibido, o aplicar una Policy. Front: rutas sin id (por ejemplo /clientes/me) y dejar de mandar customer_id. | Sí

F-03 | Por validar. Prioridad: ALTA | src/services/productos/productos.service.ts:171, 178; src/services/categorias/categorias.service.ts:49, 70, 77; src/services/ventas/ventas.service.ts:329 | El mismo token de cliente se adjunta a toda la API. Si las rutas de administración (alta y edición de productos y categorías, categorías inactivas, listado global de ventas) solo exigen estar autenticado, un cliente puede cambiar precios y stock o listar las ventas y datos personales de todos. | Ningún componente usa esos métodos y el front no tiene concepto de rol; el interceptor adjunta el mismo Bearer a todo apiUrl. Nada en el repo confirma ni refuta el middleware del servidor. | Backend: middleware de rol o abilities del token en esas rutas, y que los tokens de /clientes/login no las tengan. Front: borrar los métodos que no se usan. | Sí

F-04 | Por validar. Prioridad: ALTA | src/services/customers/customer-service.service.ts:19; src/app/public/pages/user-profile/user-profile.component.ts:749, 795; src/services/crear-cuenta/crear-cuenta.service.ts:19 | PUT /usuarios/update/{id} y POST /clientes/registro aceptan un cuerpo armado en el navegador. Si el modelo usa $fillable o $request->all() sin lista blanca, el cliente puede ponerse tipo_cliente=mayorista, un descuento_preferencial, saldo_cuenta o cambiar su correo de acceso. | Arnés en sandbox: con los controles alterados el payload del front solo lleva {"nombre": ...}; la protección es únicamente un filtro del navegador que una llamada directa se salta. Revisado por dos verificadores. | Backend: FormRequest con lista blanca (validated()/only()); excluir tipo_cliente, descuento_preferencial, saldo_cuenta, total_compras, numero_compras, correo y password; fijar valores iniciales en el registro. | Sí

F-05 | Por validar. Prioridad: ALTA | src/services/ventas/ventas.service.ts:74; src/services/mercadopago/mercadopago.service.ts:14; src/app/public/pages/carrito/carrito.component.ts:391 | El commit 922d086 dice que antes el backend restaba como pesos el "descuento" que mandaba el cliente. El front ya no lo manda, pero si el servidor todavía lo lee, cualquiera agrega "descuento" al JSON de POST /ventas o /mercadopago/create-preference y paga menos, hasta casi gratis. | El arreglo visible está solo en el front; el campo sigue declarado en las dos interfaces; nada demuestra que el servidor lo ignore. | Backend: prohibir o ignorar "descuento" y calcularlo solo desde el cliente autenticado. Front: quitar el campo de las interfaces. | Sí

F-06 | Por validar. Prioridad: ALTA | src/app/public/pages/payment-callback/payment-callback.component.ts:184-203; src/services/mercadopago/mercadopago.service.ts:81 | confirm-payment recibe solo el payment_id de la URL. Si el servidor no exige que ese pago pertenezca a una venta pendiente del cliente del token, que monto y moneda coincidan y que no se reutilice, un pago ajeno o de bajo monto podría completar otra venta o revelar datos de una venta ajena. | El front no manda la venta pendiente (venta_pendiente_mp se guarda y nunca se usa). El verificador aclaró que mandar más datos desde el cliente no sería un control: el vínculo debe salir del pago consultado a Mercado Pago en el servidor. | Backend: buscar la venta por el external_reference del pago consultado a Mercado Pago, filtrar por el cliente del token, comparar transaction_amount y currency_id, y marcar el payment_id como usado. | Sí

F-07 | Por validar. Prioridad: ALTA | src/services/ventas/ventas.service.ts:295; src/app/public/pages/user-profile/user-profile.component.ts:129 | GET /ventas/{id} pide la venta solo por su id numérico. Si el backend no filtra por dueño, un cliente recorre ids y obtiene pedidos, montos y, si la respuesta trae la relación customer, correo, teléfono y dirección de otros. | La petición no lleva nada que limite el dueño; el tipo Venta incluye customer con esos datos. Que los ids sean secuenciales no está demostrado. | Backend: filtrar por customer_id del usuario autenticado o usar una Policy "view". | Sí

F-08 | Por validar. Prioridad: MEDIA | src/services/ventas/ventas.service.ts:301-302 | PUT /ventas/{id}/cancelar solo lleva el id de la venta. Si el servidor solo exige sesión, un cliente podría cancelar ventas ajenas o ya completadas y devolver stock, alterando inventario y estadísticas. | Ningún componente lo llama; el comentario del método dice que devuelve stock. Nada en el repo confirma el control del servidor. | Backend: Policy de dueño más regla de estados permitidos para cancelar. Front: quitar el método si no se usa. | Sí

F-09 | Por validar. Prioridad: MEDIA | src/services/carrito/carrito.service.ts:113-118; src/app/public/pages/carrito/carrito.component.ts:391-408, 469; src/services/ventas/ventas.service.ts:263 | cantidad y monto_pesos se calculan en el navegador con el precio guardado en localStorage (editable) y la única validación es que sean mayores que 0. Si el backend usa la cantidad enviada junto con monto_pesos o no rechaza fracciones, se paga menos o se descuadra el inventario. | Arnés en sandbox: un carrito manipulado pasa la validación y genera {cantidad: 100000, monto_pesos: 1} y {cantidad: 0.001}; lo repitió un segundo verificador. El efecto real depende del servidor. | Backend: recalcular precio y cantidad desde la base de datos cuando llega monto_pesos y rechazar cantidades menores o iguales a 0, fraccionarias en productos por pieza e incoherentes. | Sí

F-10 | Por validar. Prioridad: MEDIA | src/services/ventas/ventas.service.ts:347; src/app/public/pages/user-profile/user-profile.component.ts:358-404 | La evidencia de transferencia se sube a cualquier saleId. El tipo (MIME declarado), el límite de 5 MB y la condición "transferencia pendiente" solo se revisan en el navegador y se manda el nombre original del archivo. Sin validación en el servidor: comprobantes en pedidos ajenos, o un HTML/SVG renombrado servido desde el origen del panel. | Los controles son solo de interfaz (MIME declarado, 5 MB, atributo accept). El verificador corrigió las líneas citadas. | Backend: dueño y estado de la venta, validar el tipo por contenido, generar el nombre al guardar, servir con Content-Disposition attachment y X-Content-Type-Options nosniff. | Sí

F-11 | Por validar. Prioridad: MEDIA | src/app/public/pages/create-account/create-account.component.ts:43; src/app/public/pages/user-profile/user-profile.component.ts:795; src/app/public/pages/carrito/carrito.component.ts:394; src/services/ventas/ventas.service.ts:263 (y otros campos de texto libre) | Nombre, dirección, notas de venta, comentarios de fotos y de encuesta, nombre de archivo y bitácora se guardan sin restricción. Si una vista del panel admin los imprime sin escapar ({!! !!}, innerHTML, tablas con HTML), un cliente o visitante ejecuta script en la sesión del operador. | En el front no hay punto de inyección (sin innerHTML ni bypassSecurityTrust, Angular escapa). El riesgo está en el panel Laravel, que no está en este repo. | Panel/backend: escapar la salida con {{ }}, poner CSP en el panel, neutralizar fórmulas en exportaciones CSV/Excel y limitar longitud y caracteres. | Sí

F-12 | Por validar. Prioridad: MEDIA | src/services/mercadopago/mercadopago.service.ts:51, 80; src/app/public/pages/payment-callback/payment-callback.component.ts:183 | El método heredado handlePaymentCallback (quitado en 009e9f8) llamaba POST /mercadopago/callback con el status. Si esa ruta sigue viva en el backend y cree el status recibido, se completan ventas sin pagar. | El verificador corrigió la hipótesis: el front nunca envió el status (el método no tuvo llamadores desde el primer commit). Solo es un indicio de que la ruta existe en el servidor. | Backend: revisar route:list; retirar la ruta o hacer que consulte a Mercado Pago e ignore el status. | Sí

F-13 | Por validar. Prioridad: MEDIA | src/services/customers/customer-service.service.ts:11, 24, 37, 40; src/services/login/login.service.ts:43; src/services/auth-service/auth-service.service.ts:75 | CustomerService guarda el clienteId una sola vez. Si A usa Seguimiento, cierra sesión y B entra en la misma pestaña (la app no recarga), las fotos de B se listan, suben y borran con el id de A y el token de B. Si el backend usa el id de la ruta, las fotos se mezclan entre cuentas. | Arnés en sandbox: A(101) cierra sesión y entra B(202); salen GET /usuarios/store-images/101/cliente, POST con customer_id 101 y DELETE .../101/... con el Bearer de B. El defecto del front está demostrado; su efecto depende del backend. | Front: leer el id en cada llamada (AuthService.getUserId()) o recargar al cambiar de sesión. Backend: usar siempre el usuario del token. | Sí (impacto)

F-14 | Por validar. Prioridad: BAJA | src/app/public/pages/carrito/carrito.component.ts:23, 79, 274, 393; src/services/ventas/ventas.service.ts:73 | La interfaz solo ofrece transferencia y Mercado Pago y bloquea fuera de horario, pero POST /ventas acepta metodo_pago "credito", "efectivo" o "tarjeta" y no hay control de horario en el servidor visible. Podría crearse un pedido a crédito sin línea autorizada o fuera de horario. | Los dos controles (métodos y horario) existen solo en la interfaz. | Backend: lista blanca de metodo_pago según el tipo de cliente y validar horario y limitar_horario al crear la venta. | Sí

F-15 | Por validar. Prioridad: BAJA | src/services/ventas/ventas.service.ts:353, 366; src/app/public/pages/user-profile/user-profile.component.ts:207, 291 | La encuesta manda sale_id y customer_id desde el navegador, y la regla de "una sola respuesta" solo está en la interfaz. Se podrían responder encuestas de ventas ajenas o repetir respuestas y sesgar los indicadores. | Los controles son de interfaz (Set en memoria y ya_respondio). | Backend: venta propia, completada y respuesta única (restricción única sale_id + pregunta_id). | Sí

F-16 | Por validar. Prioridad: BAJA | src/app/app.component.ts:16; src/services/logs/log-service.service.ts:20, 30; src/interceptors/auth.interceptor.ts:24 | Cada navegación manda a /historial/guardar-accion el campo "usuario" (clienteId o "20" sin sesión), incluso a visitantes anónimos. Si el servidor lo guarda tal cual, se puede falsificar a quién se atribuye una acción en la bitácora que lee el operador. | Indicio fuerte de que el endpoint acepta escrituras anónimas (si respondiera 401, el interceptor cerraría sesión en cada visita). No está probado. | Backend: ignorar "usuario" y usar auth()->id() o un invitado fijo; limitar la tasa de escritura. | Sí

F-17 | Por validar. Prioridad: BAJA | src/services/mercadopago/mercadopago.service.ts:65-73 | GET /mercadopago/payment-status/{id} y /venta-by-preference/{id} se piden solo por id externo. Si el servidor no filtra por dueño, un cliente podría leer estado de pagos y ventas ajenas. | Ningún componente los usa. El verificador corrigió: los ids de Mercado Pago no son secuenciales, enumerarlos es costoso. | Backend: confirmar si las rutas existen y filtran por dueño; si no se usan, borrarlas. | Sí

F-18 | Por validar. Prioridad: BAJA | src/app/public/pages/seguimiento/seguimiento.component.ts:158, 244-263; src/services/customers/customer-service.service.ts:33 | Las fotos de seguimiento se mandan en base64 sin límite de tamaño ni cantidad y el plazo de 15 días entre subidas solo se aplica en la interfaz (el propio botón "Subir fotos" aparece justo cuando no se puede subir). Sin validación en el servidor: contenido arbitrario o llenar el almacenamiento. | El verificador revisó que canUpload se calcula en el navegador y que el botón reenvía los mismos archivos. En el front no hay XSS (una imagen data: en <img> no ejecuta script). | Backend: validar tipo real, tamaño y cantidad, limitar tasa y aplicar el plazo de 15 días. | Sí

F-19 | Por validar. Prioridad: BAJA | src/app/public/pages/carrito/carrito.component.ts:304, 358; src/app/public/pages/payment-callback/payment-callback.component.ts:197, 245; src/services/ventas/ventas.service.ts:301 | Con registro abierto, un cliente puede crear muchas ventas pendientes (transferencia o preferencia de Mercado Pago) y el front nunca las cancela. Si el servidor descuenta stock al crearlas y no las expira, podría dejar productos "Sin stock" para los demás. | El verificador matizó: el comentario de cancelarVenta no prueba que el stock se descuente en ventas pendientes; es un indicio débil. | Backend: expirar ventas pendientes, límite por cliente y throttle. Front: cancelar la venta pendiente cuando Mercado Pago regresa "cancelled". | Sí


LAS 3 MAS URGENTES (PRIORIDAD DE REVISION, NO GRAVEDAD)

1. F-02: el id del cliente lo decide el navegador. Si el backend no compara ese id con el token, es lectura y escritura de datos de otros clientes. Se resuelve revisando una sola cosa en Laravel: que cada ruta use el usuario del token.
2. F-03: rutas de administración (productos, categorías, listado global de ventas) accesibles con el mismo token que un cliente. Basta revisar el middleware de esas rutas.
3. F-04: campos privilegiados (tipo_cliente, descuento_preferencial, saldo_cuenta, correo) enviables en el perfil y el registro. Basta revisar $fillable y la validación del controlador.
Siguientes: F-05 (campo "descuento" heredado) y F-06 (confirm-payment solo con payment_id).
Nota: ninguna de las tres está confirmada. Se vuelve confirmada solo si el backend resulta no tener esos controles.


QUE REVISAR EN EL BACKEND (CHECKLIST)

- php artisan route:list: middleware de cada ruta de /api/v1, en especial /ventas, /usuarios, /productos, /categorias, /mercadopago, /historial, /indicadores. Verificar que /mercadopago/callback exista o no.
- Controladores y Policies: cada ruta con {id} o customer_id debe comparar con $request->user() (F-02, F-07, F-08, F-10, F-13, F-15, F-17).
- Modelo de cliente: $fillable/$guarded y FormRequest de registro y de update (F-04).
- Ventas y Mercado Pago: ignorar "descuento", recalcular precio y cantidad, lista blanca de metodo_pago, horario, expiración de ventas pendientes (F-05, F-09, F-14, F-19).
- confirm-payment: external_reference, monto, moneda y uso único (F-06).
- Panel admin: escape de salida y CSP (F-11); cómo se sirven los comprobantes (F-10).
- Los pasos de prueba local de cada registro están en el JSON (campo validation_plan), siempre sobre una base de prueba, nunca contra producción.


NOTAS DE ENDURECIMIENTO (NO SON HALLAZGOS)

- Falta de cabeceras X-Frame-Options / CSP frame-ancestors, CSP, Referrer-Policy y X-Content-Type-Options en los tres modos de despliegue (src/.htaccess, server.js, vercel.json). Hoy no hay una acción sensible enmarcable porque la sesión vive en localStorage.
- src/index.html carga jQuery 3.4.1, bootstrap 5.0.0 y otros recursos desde CDN sin atributo integrity (versiones fijas, pero sin SRI). jQuery 3.4.1 tiene CVE-2020-11022 y CVE-2020-11023; main.js no pasa HTML externo a jQuery, pero conviene actualizar a 3.5 o más, o quitar jQuery si el template ya no lo usa.
- vercel.json reescribe /api/v1/* hacia otra API en Heroku (infinity-api-app-...), de otro proyecto; el front no la usa. Borrar el rewrite.
- server.js sirve dist/onvert-theme pero angular.json genera dist/convert-theme: el modo Express/Heroku (Procfile) está roto. Corregir o retirar server.js, Procfile y las dependencias express, cors e http-proxy-middleware.
- carrito.component.ts:369 navega a response.data.init_point sin validar que sea https y del dominio de Mercado Pago; añadir una lista blanca.
- footer.component.html:15 y 18 enlazan facebook_url e instagram_url de la configuración directo en [href]; Angular los sanea, pero conviene validar https y dominio.
- Console.log de depuración en carrito.component.ts (312-315, 356, 411) y user-profile.component.ts (761) con datos del carrito y del cliente.
- src/assets/lib/waypoints/links.php (se copia a dist y Apache lo ejecutaría; es inocuo) y src/assets/lib/flaticon/backup.txt: borrarlos del build.
- El historial conserva 4 URLs públicas de Firebase Storage con token de descarga (bucket infinitytech-15a41, imágenes del tema de gimnasio retirado). Son lectura de objetos públicos; revocar solo si esos objetos no deben ser públicos.
- AppComponent registra la URL completa con query (incluye payment_id y preference_id de Mercado Pago) en la bitácora; registrar solo la ruta.
- Backend viejo en Heroku (carniceriafrancobackend-app-...) que aparece en el historial de environment.prod.ts: si sigue vivo sería una puerta paralela sin las correcciones recientes. Solo el dueño puede verificarlo.


LO QUE ESTA BIEN

- Cero coincidencias de patrones de secretos (llaves privadas, AKIA, ghp_, sk_live, APP_USR/TEST de Mercado Pago, client_secret, access_token, password literal) en los 29 commits de todas las ramas, y ningún .env, .pem ni credencial jamás versionado. environment.prod.ts solo expone production y apiUrl (HTTPS).
- Las llaves de Mercado Pago no están en el front: la preferencia se crea en el backend.
- Sin innerHTML, outerHTML, bypassSecurityTrust, DomSanitizer, eval ni document.write en src/app y src/services; ngx-toastr sin enableHtml.
- El interceptor adjunta el token solo a URLs que empiezan con environment.apiUrl (host fijo) y cierra sesión ante 401; logout revoca el token en el servidor.
- payment-callback no confía en ?status de la URL y usa confirm-payment.
- El carrito ya no manda el descuento (commit 922d086).
- package-lock.json resuelve todo desde registry.npmjs.org con integridad; no hay .npmrc ni dependencias git/http.
- El AuthGuard solo comprueba que haya token: es correcto como control de interfaz porque ningún dato protegido viaja en el bundle; toda la protección real queda en el backend (ver F-02 a F-07).


COBERTURA Y METODO

- Perfil estándar, 24 unidades de cobertura (superficie x frontera x clase de ataque): 10 cubiertas sin hallazgo, 12 con candidato (todas con decisión final), 1 bloqueada y 1 fuera de alcance.
- Unidad bloqueada: consultas del catálogo público (order_by, order_dir, per_page, search, filtro de productos inactivos). No hay causa raíz en este repo; queda pendiente que el backend use lista blanca en order_by/order_dir, tope en per_page, LIKE con binding y filtro activo=1.
- Unidad fuera de alcance: el backend viejo en Heroku (ver notas de endurecimiento).
- 3 olas de cazadores (9 cazadores), 5 críticos de cobertura (los dos últimos, el post-ola 3 y el final-clean, sin trabajo nuevo), 19 verificadores de candidatos, 19 verificadores finales y 3 re-verificaciones de reemplazos materiales: 55 agentes, más 3 reintentos tras un corte por límite de uso.
- Se consolidó una causa raíz reportada por dos cazadores (clienteId obsoleto, F-13) bajo una sola huella. El reconocimiento (fase 1) lo hizo el agente principal directamente, sin los 4 agentes de reconocimiento que describe la skill; la separación entre quien encuentra y quien confirma no se afecta porque cada candidato lo revisaron agentes distintos al cazador.
- La ejecución de código del objetivo se hizo en un sandbox propio (espacio de red aislado sin red, entorno vacío, repo en solo lectura, escritura solo en scratch, límites de CPU, memoria, procesos, archivos y tiempo). No se tocó producción ni ningún servicio externo.
- Ajuste menor al JSON: en dos registros se corrigió solo el campo "kind" de pasos de la traza (de sink/entrypoint a propagation) para que cumpliera el esquema de la skill; el contenido no cambió.
- Validadores de la skill: validate-findings.cjs (19 registros, PASS) y validate-coverage-ledger.cjs (24 unidades, PASS).

NO CUBIERTO
- El backend carniceria-franco-backend (se audita en otra sesión).
- Los 5 commits locales de la rama produccion que no están en GitHub.
- Cabeceras y comportamiento reales del despliegue (solo se revisó la configuración del repo).
- No se corrió npm audit ni se revisaron CVE de dependencias más allá de lo anotado (sin red; la skill prohíbe instalar o descargar).
- Una sola pasada no agota el objetivo; una corrida posterior con el backend a la vista convertiría varias pistas en confirmadas o descartadas.


ANEXO: ID A HUELLA (campo "fingerprint" del JSON)

F-01 src/services/auth-service/auth-service.service.ts:AuthService.logout:incomplete-localstorage-cleanup
F-02 src/services:clienteId-localStorage:customer-selector-without-owner-binding
F-03 src/services/productos/productos.service.ts:ProductosService.crearProducto:admin-endpoints-on-customer-api
F-04 src/services/customers/customer-service.service.ts:CustomerService.updateCustomer:privileged-field-mass-assignment
F-05 src/services/ventas/ventas.service.ts:CrearVentaRequest.descuento:legacy-client-discount-field
F-06 src/app/public/pages/payment-callback/payment-callback.component.ts:PaymentCallbackComponent.handleMercadoPagoCallback:payment-id-unbound-to-pending-sale
F-07 src/services/ventas/ventas.service.ts:VentasService.obtenerDetalleVenta:sale-owner-check
F-08 src/services/ventas/ventas.service.ts:VentasService.cancelarVenta:sale-cancel-owner-state-check
F-09 src/app/public/pages/carrito/carrito.component.ts:CarritoComponent.realizarCompraTradicional:client-derived-checkout-body
F-10 src/services/ventas/ventas.service.ts:VentasService.subirEvidenciaTransferencia:sale-owner-and-file-validation
F-11 src/app/public:customer-free-text:admin-panel-stored-xss
F-12 src/services/mercadopago/mercadopago.service.ts:MercadoPagoService.handlePaymentCallback:legacy-callback-endpoint-client-status
F-13 src/services/customers/customer-service.service.ts:CustomerService.customer:stale-clienteid-after-account-switch
F-14 src/app/public/pages/carrito/carrito.component.ts:CarritoComponent.procederPago:client-only-payment-method-and-schedule-gate
F-15 src/services/ventas/ventas.service.ts:VentasService.guardarRespuestasSatisfaccion:sale-and-customer-from-client
F-16 src/services/logs/log-service.service.ts:LogService.setLog:client-asserted-usuario-anonymous-audit-write
F-17 src/services/mercadopago/mercadopago.service.ts:MercadoPagoService.checkPaymentStatus:payment-lookup-owner-check
F-18 src/services/customers/customer-service.service.ts:CustomerService.uploadCustomerImages:server-side-image-validation
F-19 src/app/public/pages/carrito/carrito.component.ts:CarritoComponent.confirmarCompra:unbounded-pending-sales-stock-hold
