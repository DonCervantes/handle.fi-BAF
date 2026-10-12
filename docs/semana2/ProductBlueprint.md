# Product Blueprint — Handle.Fi

## Priorización de historias

De las historias propuestas se eligieron para el backlog las que atacan directamente el dolor central del Problem Brief (control de principio a fin del pago) y que son demostrables dentro del alcance del curso.

**Criterio de priorización:** (1) impacto en el dolor central —visibilidad y control del pago—, (2) dependencia (lo que habilita a las demás va primero) y (3) factibilidad técnica con Stellar en el tiempo disponible.

Historias que pasan al backlog (MVP):

| # | Historia | Rol | Prioridad |
|---|----------|-----|-----------|
| 1 | Ver estado del pago (enviado / en tránsito / recibido) | Contador | Alta |
| 2 | Conocer el costo total real antes de ejecutar | Contador | Alta |
| 6 | Referencia única compartida para conciliar | Contador | Alta |
| 3 | Adjuntar y recuperar comprobante | Contador | Media |
| 4 | Autorizar pagos antes de ejecutar | Dueño/Admin | Media |

Quedan fuera del MVP (fases posteriores): #5 recepción en banco local del colaborador, #7 pagos recurrentes y reportes fiscales agregados.

## Propuesta de valor

Handle.Fi le da a la contadora o contador de una PyME mexicana **una sola vista confiable para controlar de principio a fin los pagos a colaboradores en el extranjero**: saber cuánto cuesta realmente cada pago antes de hacerlo, en qué estado está en cada momento y tener el comprobante conciliado con su beneficiario, sin salir de una sola herramienta.

Hoy ese control no existe. La autorización, la transferencia y el registro contable viven en sistemas desconectados, por lo que el contador compila documentación a mano, no puede conectar con claridad la salida en pesos con lo que recibe el colaborador en su moneda, y confunde el "envié" con el "ya le llegó". Esa dispersión convierte cada pago internacional en una reconciliación manual y propensa a errores.

El resultado que obtiene el usuario con Handle.Fi es **trazabilidad y certeza**: deja de reconstruir información y pasa a consultarla. Elegiría esta solución porque le quita trabajo manual y le da una referencia verificable y compartida entre los intermediarios involucrados, algo que sus herramientas actuales —hojas de cálculo, portales bancarios separados y correos— no le ofrecen de forma unificada. La diferencia frente a cómo lo resuelve hoy no es hacer el pago (eso ya lo hace), sino **verlo y controlarlo como un solo proceso continuo**, desde la instrucción hasta el depósito. Esto conecta directamente con el usuario del Problem Brief: el contador de PyME que necesita visibilidad unificada de costos, agenda, comprobantes y confirmaciones.

## Flujo de usuario

El recorrido involucra tres roles: **contador** (opera), **dueño/admin** (autoriza) y **colaborador** (recibe).

1. **Registro del pago** — El contador captura el pago: beneficiario, país (Colombia / Chile / Argentina), monto y concepto.
2. **Cálculo de costo y referencia** — El sistema estima el **costo total** (tipo de cambio + comisiones) mostrando cuánto sale en pesos y cuánto recibirá el colaborador, y genera una **referencia única** para ese pago.
3. **Autorización** — El dueño/admin revisa el pago y su costo total, y lo **autoriza** (o lo rechaza). Ningún pago se ejecuta sin este paso.
4. **Ejecución sobre Stellar** — Autorizado el pago, se ejecuta la transferencia sobre la red Stellar; el on-ramp desde pesos se hace vía Etherfuse. La referencia única viaja en la transacción (memo).
5. **Seguimiento de estado** — El estado del pago avanza automáticamente (**enviado → en tránsito → recibido**) leyendo la confirmación de la red, sin captura manual.
6. **Conciliación y comprobante** — El contador consulta el estado en el tablero, adjunta o recupera el comprobante y lo concilia con el beneficiario y la obligación gracias a la referencia única compartida.

**Puntos de interacción clave:** pantalla de registro, pantalla de autorización (dueño), tablero de estados (contador) y recepción en banco local (colaborador, fase posterior).

```
Contador        Sistema              Dueño        Stellar/Etherfuse     Colaborador
   │ registra ──▶ │                     │                 │                  │
   │              │ calcula costo       │                 │                  │
   │              │ + referencia ──────▶│ autoriza ──────▶│ ejecuta pago     │
   │              │                     │                 │ ──────────────▶  │ recibe (fase post.)
   │ ◀── estado (enviado→tránsito→recibido) ◀─────────────│                  │
   │ concilia + comprobante             │                 │                  │
```

## Alcance del MVP

**Funcionalidad central (dentro del MVP):**

- Registro de un pago internacional (beneficiario, país, monto, concepto).
- Cálculo y despliegue del **costo total** (tipo de cambio + comisiones) antes de ejecutar.
- Generación de una **referencia única** por pago.
- **Autorización** del dueño/admin antes de la ejecución.
- Ejecución de la transferencia sobre **Stellar (testnet)** y lectura automática del **estado** (enviado → en tránsito → recibido).
- Adjuntar y recuperar el **comprobante**, conciliado por la referencia única.

**Fuera del MVP (deseable, fase posterior):**

- Recepción productiva en el banco local del colaborador (off-ramp real por país).
- Pagos recurrentes / programados.
- Reportes fiscales y dashboard de gasto agregado.
- Multiusuario avanzado y roles granulares.

**Justificación del recorte:** aun sin off-ramp productivo (se demuestra en testnet), sin recurrencia y sin reportes, el usuario ya resuelve su dolor central: **saber cuánto cuesta cada pago, en qué estado está y tener el comprobante conciliado**. Es decir, el MVP entrega exactamente el control de principio a fin que motiva el Problem Brief; lo que queda fuera amplía el valor pero no es necesario para validar que la propuesta resuelve el problema.

## Lean Canvas

> Reemplazar por imagen del lienzo (exportado de Canva / Miro / Lean Canvas) o enlace. Mientras tanto, contenido en tabla:

| Bloque | Contenido |
|--------|-----------|
| **Problema** | Las PyMEs mexicanas no controlan de principio a fin los pagos a colaboradores en el extranjero; información dispersa, costo total poco claro, estado ambiguo y conciliación manual. |
| **Segmento de clientes** | Contador(a)/administrador de PyME mexicana que paga a freelancers o contratistas en Colombia, Chile y Argentina. Early adopters: PyMEs de servicios/tech con equipo remoto en LATAM. |
| **Propuesta de valor única** | Una sola vista para controlar el pago internacional de principio a fin: costo real antes de pagar, estado verificable en tiempo real y comprobante conciliado. |
| **Solución** | App web: registro de pago, cálculo de costo, autorización, ejecución sobre Stellar con referencia única y seguimiento automático de estado + comprobantes. |
| **Canales** | Contacto directo con despachos contables y PyMEs; comunidad Stellar/Etherfuse; referidos; contenido educativo sobre pagos cross-border. |
| **Métricas clave** | # de pagos gestionados, % de pagos con estado "recibido" confirmado, tiempo de conciliación por pago, costo total promedio vs. alternativa tradicional, # de PyMEs activas. |
| **Ventaja diferencial** | Referencia única verificable y compartida sobre Stellar entre intermediarios independientes, ligada al control contable (difícil de replicar con portales bancarios aislados). |
| **Estructura de costos** | Desarrollo y mantenimiento, infraestructura cloud, comisiones de red/anchors, cumplimiento/legal, soporte. |
| **Fuentes de ingreso** | Comisión por pago procesado y/o suscripción mensual por empresa (SaaS); posible spread sobre el tipo de cambio. |

## Backlog priorizado (Kanban)

🔗 **Tablero en GitHub Projects:** [Handle.Fi — Backlog Semana 2](https://github.com/users/DonCervantes/projects/1)

Vista **Kanban**, pública, enlazada al repositorio. Columnas: **Backlog → To Do → In Progress → Done**. Las cinco tarjetas del MVP están en **Backlog**, cada una con sus criterios de aceptación.

**Tarjeta 1 — Ver estado del pago (Historia 1)**
- Criterios de aceptación:
  - Dado un pago registrado, el contador ve su estado actual entre: enviado, en tránsito, recibido.
  - El estado se actualiza automáticamente al confirmarse la transacción en la red (sin captura manual).
  - La lista permite filtrar pagos por estado.

**Tarjeta 2 — Calcular costo total antes de ejecutar (Historia 2)**
- Criterios de aceptación:
  - Antes de confirmar, el sistema muestra: monto en pesos, tipo de cambio aplicado, comisiones y monto estimado que recibe el colaborador.
  - Si cambian los parámetros, el costo se recalcula antes de ejecutar.

**Tarjeta 3 — Referencia única compartida (Historia 6)**
- Criterios de aceptación:
  - Cada pago genera una referencia única e inmutable.
  - La referencia viaja en la transacción de Stellar (memo) y es visible en el registro del pago.
  - Dos pagos distintos nunca comparten referencia.

**Tarjeta 4 — Adjuntar y recuperar comprobante (Historia 3)**
- Criterios de aceptación:
  - El contador puede adjuntar un archivo de comprobante a un pago.
  - El comprobante queda asociado al registro y a su referencia única, y se puede descargar después.

**Tarjeta 5 — Autorización del dueño (Historia 4)**
- Criterios de aceptación:
  - Un pago no puede ejecutarse sin autorización del rol dueño/admin.
  - El dueño ve monto, costo total y beneficiario antes de autorizar o rechazar.
  - Queda registro de quién autorizó y cuándo.

## Arquitectura inicial

La solución se organiza en tres capas más la red:

- **Interfaz (frontend web):** pantallas de registro de pago, autorización (dueño) y tablero de estados/comprobantes. Es donde el contador y el dueño interactúan.
- **Lógica (backend/API):** cálculo del costo total (tipo de cambio + comisiones), generación de la referencia única, orquestación del flujo de autorización → ejecución, persistencia de registros y comprobantes, y lectura del estado desde la red.
- **Stellar (red):** capa de liquidación. La transacción en la red es la **fuente de verdad verificable y compartida**; la referencia única viaja como memo y el estado del pago se deriva de la confirmación on-chain.
- **Etherfuse (anchor/on-ramp):** convierte pesos mexicanos al activo digital para iniciar la transferencia (y, en fases posteriores, el off-ramp a moneda local del colaborador).

**En qué punto entra la red:** Stellar entra en el paso de *ejecución* del pago (después de la autorización) y en el *seguimiento de estado* (la confirmación on-chain alimenta el tablero). El resto del recorrido —registro, cálculo, autorización, comprobantes— vive en la lógica de la aplicación.

```
[ Frontend web ]  ──▶  [ Backend / API ]  ──▶  [ Etherfuse on-ramp (MXN→activo) ]
   registro             costo + referencia            │
   autorización         orquestación            ──▶ [ Stellar: transacción + memo ]
   tablero estados ◀──  lee estado on-chain ◀─────────┘
```

## Uso de Stellar y justificación

Handle.Fi usaría los siguientes componentes de Stellar:

- **Payments / transacciones:** mover el valor del pago con una confirmación verificable y de bajo costo. Es el mecanismo que permite derivar el estado "recibido" sin depender de la confirmación manual del contador.
- **Memo en la transacción:** transporta la **referencia única** del pago, lo que habilita la conciliación compartida entre intermediarios independientes (resuelve la historia #6 y el punto de fricción "complejidad de reconciliación" del Problem Brief).
- **Anchors (SEP-24 / SEP-31) con Etherfuse:** on-ramp de pesos mexicanos al activo digital y, en fase posterior, off-ramp a la moneda local del colaborador, para que la PyME pague en MXN y el colaborador reciba en su banco sin manejar cripto.

**Justificación de pertinencia (según el criterio del Problem Brief):** blockchain se justifica no por "usar blockchain", sino porque aporta algo que las integraciones tradicionales aisladas no dan de forma natural: una **referencia verificable y compartida entre participantes independientes**, ligada al control contable, que sostiene la trazabilidad de principio a fin. El estado del pago deja de ser una afirmación de un portal bancario y pasa a ser un hecho verificable en una red común. Este punto sigue sujeto a la validación comprometida en el Problem Brief: comparar contra soluciones convencionales y confirmar la cobertura real de los anchors en los tres países destino.

## Pendientes para completar el entregable

- [x] Tablero creado en GitHub Projects, con las 5 tarjetas y sus criterios, enlazado arriba.
- [ ] Exportar el **Lean Canvas** como imagen o enlace y sustituir la tabla provisional.
- [x] `DanielAdrian.md` quedó en un commit propio de DonCervantes, anterior a este blueprint.
- El documento de trabajo marcaba como fecha límite el 4 de octubre de 2026. No hay en este material una fecha posterior confirmada.
