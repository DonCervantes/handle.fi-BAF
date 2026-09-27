# Entregable 1: Problem Brief

## Decisión del problema

### Problema elegido

Los contadores de pequeñas y medianas empresas mexicanas necesitan controlar desde un solo lugar el costo, la programación, los comprobantes y la recepción de los pagos que envían a colaboradores en otros países.

**Propuesto por:** Daniel Adrián Elías Cruz Cervantes ([DonCervantes](https://github.com/DonCervantes)).

### Por qué elegimos este

Handle.Fi fue la única propuesta considerada. Elegí este problema por su relación con dificultades que freelancers de mi entorno han expresado al cobrar internacionalmente y por la posibilidad de investigar un flujo concreto: pagos de pymes mexicanas a colaboradores en Colombia, Chile y Argentina. Prioricé el control de los pagos para el contador, acompañado de visibilidad de costos y recepción.

El criterio de la Sesión 1 que exploraré es el registro compartido entre participantes independientes: la empresa y los proveedores de origen y destino podrían necesitar verificar la misma transferencia sin depender únicamente del registro interno de Handle.Fi. Esta pertinencia es una hipótesis por contrastar; no se presupone que blockchain sea indispensable. Las referencias de freelancers corresponden al flujo inverso y no sustituyen la validación del segmento elegido.

### Propuestas descartadas

No aplica: no se consideraron otras propuestas. La gestión amplia de ingresos y egresos y la recepción de pagos permanecen como visión futura del mismo proyecto; no se presentan como propuestas independientes descartadas.

### Cómo tomamos la decisión

Decisión individual de Daniel Adrián Elías Cruz Cervantes, único integrante. Durante la definición del alcance se seleccionaron el contador como usuario principal, los pagos salientes desde México como flujo prioritario y el control centralizado como beneficio principal. No hubo votación ni debate entre varios integrantes.

## Problem Brief

### Encabezado

**Proyecto:** Handle.Fi  
**Problema:** Dificultad para controlar de principio a fin los pagos de pymes mexicanas a colaboradores en otros países.  
**Fecha:** 26 de septiembre de 2026  
**Estado:** Planteamiento inicial; validación del segmento y viabilidad de los corredores pendientes.

### Equipo y roles

| Integrante | GitHub | Roles asumidos | Responsabilidad |
| --- | --- | --- | --- |
| Daniel Adrián Elías Cruz Cervantes | [DonCervantes](https://github.com/DonCervantes) | Responsable único; definición de producto, investigación y preparación técnica inicial | Elaboración, revisión, commits y entrega del repositorio en Apex |

**Responsable de las entregas:** Daniel Adrián Elías Cruz Cervantes.  
**Canal de coordinación interna:** No aplica un canal entre integrantes por tratarse de trabajo individual. Los pendientes y las decisiones se registran en este repositorio y en sus issues.  
**Repositorio del equipo:** [handle.fi-BAF](https://github.com/DonCervantes/handle.fi-BAF).  
**Entrega:** 27 de septiembre de 2026, 10:00 a. m., hora de Ciudad de México.

### Problema y evidencia

Los contadores de pequeñas y medianas empresas mexicanas necesitan controlar desde un solo lugar el costo, la programación, los comprobantes y la recepción de los pagos que envían a colaboradores en otros países.

El contexto de estudio son empresas establecidas en México con colaboradores o freelancers en Colombia, Chile y Argentina. La unidad de análisis será cada pago, desde su preparación hasta el abono y registro final. No se ha determinado la frecuencia de envío, el volumen mensual, el importe típico ni la cantidad de empresas afectadas; estos datos requieren investigación y no se presentan como resultados.

La evidencia inicial proviene del testimonio del proponente: conoce freelancers residentes en México que cobran de empresas extranjeras y se quejan de comisiones y demoras. Reporta que utilizan DolarApp o reciben cripto directamente; algunos tienen dificultades para convertir lo recibido a moneda local. Se trata de referencias informales, sin entrevistas estructuradas ni registros cuantitativos disponibles.[1]

Estos casos corresponden al sentido inverso del flujo seleccionado. Sugieren dificultades en pagos internacionales, pero no prueban la necesidad del contador de una pyme mexicana que paga al exterior. La siguiente validación deberá documentar operaciones reales de ese segmento y separar problemas de envío, recepción, conversión y control contable. Las fuentes técnicas consultadas acreditan capacidades de infraestructura, no demanda comercial.[2][3]

### Usuario y actores

El usuario principal es el contador de una pyme mexicana que necesita gestionar pagos a colaboradores en otros países. Su necesidad prioritaria es controlar cada operación: identificar al destinatario, consultar comisiones y tipo de cambio, programar el pago y obtener comprobantes. El resultado deseado es conocer quién recibió efectivamente el dinero y relacionar el egreso con su registro contable.

El colaborador extranjero es el beneficiario. Se busca que reciba fondos en su cuenta bancaria y moneda local sin gestionar cripto o conversiones manualmente. La empresa aporta los recursos; la persona que autoriza pagos dentro de ella todavía debe identificarse. Los bancos y proveedores de pago intervienen en movimiento, conversión y abono. Su combinación actual está pendiente de investigación.

No existe aún una descripción verificada de cómo resuelve esta tarea el segmento elegido. Se investigarán portales bancarios, plataformas de pago y herramientas contables como alternativas posibles, sin afirmar que las empresas utilizan alguna en particular. Se medirán comisiones, diferencia cambiaria y tiempo dedicado a seguimiento y conciliación.

En la solución propuesta, Handle.Fi organizaría la experiencia del contador, Stellar sería la red explorada y Etherfuse un proveedor propuesto de rampas. Los proveedores capaces de completar el abono local en cada destino siguen por definir. No se asume que una sola integración cubra los tres países.

### Flujo actual de valor

La siguiente secuencia es un modelo de referencia para investigar, no la descripción observada de una empresa. Debe contrastarse con un contador antes de considerarla validada. Explicita dónde podrían intervenir intermediarios y cómo se relacionan dinero e información.

1. **Origen de la obligación.** La pyme acuerda un servicio con el colaborador. El contador recibe importe, fecha y datos de cobro, junto con el soporte comercial disponible.
2. **Preparación y autorización.** El contador registra la obligación y solicita autorización a la persona responsable de la empresa. El procedimiento real está pendiente de conocer.
3. **Orden de pago.** La pyme entrega fondos e instrucciones a su banco o proveedor de pagos. Debe identificarse qué verificaciones de identidad, empresa y beneficiario exige ese proveedor.
4. **Conversión y transferencia.** El proveedor de origen procesa el cambio y envío. Según la ruta, podrían intervenir bancos corresponsales u otros procesadores; no se presupone su participación en todos los pagos.
5. **Recepción.** Un proveedor o banco de destino abona al colaborador. Debe comprobarse importe neto, moneda y fecha de disponibilidad.
6. **Cierre.** El contador reúne confirmaciones y registra el egreso contra la obligación original.

**Dimensión normativa:** los pasos 3 a 5 son puntos de posibles controles obligatorios y el paso 6 puede involucrar conservación documental. Su fundamento, alcance y responsables deben verificarse por proveedor y jurisdicción; aquí no se atribuyen obligaciones legales específicas sin esa revisión.

### Fricciones identificadas

Estas fricciones son hipótesis asociadas al flujo de referencia. Las que afectan al contador todavía no cuentan con observación directa; las referencias de freelancers solo aportan señales complementarias sobre costos, demoras y complejidad de conversión.

1. **Información dispersa — pasos 2, 3 y 6.** Si la autorización, el envío y el registro quedan en herramientas separadas, el contador debe reunirlos manualmente. La causa propuesta es la falta de referencias compartidas entre sistemas. Afecta el control de pendientes y comprobantes.
2. **Costo total difícil de anticipar — pasos 3 a 5.** Las distintas conversiones o tarifas podrían dificultar relacionar el egreso en pesos con el importe neto recibido. Afectaría tanto a la empresa como al colaborador; todavía no se conocen proveedores ni tarifas reales.
3. **Estado del pago ambiguo — pasos 4 y 5.** Una confirmación de envío puede confundirse con recepción efectiva. La causa a investigar es la falta de continuidad entre estados de distintos intermediarios. El contador podría necesitar contactar al beneficiario para cerrar el seguimiento.
4. **Conciliación y recolección de soportes — paso 6.** Identificadores o comprobantes separados podrían incrementar el esfuerzo para asociar pago, colaborador y obligación. Se deben medir minutos por operación y casos sin correspondencia.

Se prioriza la primera fricción, vinculada al seguimiento del pago, porque el proponente eligió el control centralizado como beneficio principal. No se asignan ahorros ni tasas de error sin una línea base.

### Oportunidad e hipótesis

La oportunidad priorizada es ofrecer al contador una vista continua de cada pago internacional, desde la instrucción hasta la recepción bancaria. El motivo es su necesidad declarada de controlar operaciones desde un solo lugar. Las cuatro capacidades propuestas son seguimiento del estado, consulta de comisiones y tipo de cambio, programación y descarga de comprobantes.

La hipótesis de producto es que vincular instrucciones, costos, referencias de transferencia y confirmaciones de destino podría reducir el seguimiento manual y facilitar el registro de egresos. La empresa pagaría en pesos mexicanos y el colaborador recibiría moneda local en su banco, sin gestionar cripto directamente. Se trata de una experiencia objetivo, no de una capacidad implementada.

La hipótesis tecnológica es utilizar Stellar para el tramo de transferencia digital y Etherfuse para la rampa mexicana, complementados por proveedores de salida cuya cobertura debe verificarse.[2][3] El identificador de la transferencia se relacionaría con la orden comercial y con la confirmación bancaria. Esta última seguiría dependiendo de información externa a la red.

Para contrastar la propuesta se comparará el flujo actual con un prototipo: tiempo de seguimiento por pago, operaciones con comprobante asociado y claridad del costo total. La programación deberá mostrar cuándo un importe depende de una cotización futura. No se prometen reducciones porcentuales ni una liquidación bancaria instantánea antes de realizar pruebas.

### Criterio de pertinencia

El criterio de la Sesión 1 seleccionado es que varias partes independientes necesitan compartir un registro sin confiar exclusivamente en una de ellas. En la arquitectura propuesta, proveedores de origen y destino podrían utilizar una referencia común de transferencia, verificable sin depender únicamente de lo que Handle.Fi muestre en su base interna. La falta de confianza relevante sería institucional: no todas las partes administran el mismo sistema ni controlan sus registros.

Esta es una justificación condicionada al uso de Stellar para mover valor entre esos participantes. Una base de datos de Handle.Fi puede guardar información, pero su registro interno no ejecuta por sí solo una transferencia entre proveedores. La alternativa a comparar es una integración con servicios de pago existentes que ofrezcan trazabilidad suficiente sin este tramo distribuido.

El panel, la programación, los documentos y la contabilidad no requieren blockchain. Tampoco se propone publicar datos personales o facturas en la red. Su uso se limitaría al movimiento y la verificación de activos digitales, conservando la información comercial en sistemas con acceso controlado.

La pertinencia quedaría descartada si una integración convencional satisface el control requerido con menor complejidad y resultados equivalentes. Además, verificar una transferencia digital no prueba el abono bancario final. El proyecto mantiene dependencia de bancos, emisores y rampas; no afirma eliminar toda intermediación ni haber demostrado todavía la necesidad de blockchain.

### Supuestos y riesgos

1. **El problema de control existe en el segmento elegido.** Se supone que contadores de pymes mexicanas dedican esfuerzo relevante a seguir pagos al exterior. El supuesto se invalidaría si sus herramientas actuales ya resuelven el proceso o si el problema principal es otro. La comprobación será por entrevistas y operaciones reales, con frecuencia, tiempo y errores, sin extrapolar desde los freelancers conocidos.

2. **Es viable conectar origen y destino.** Se supone que existirán proveedores para pagos empresariales desde México y abonos locales en Colombia, Chile y Argentina. Etherfuse documenta México como mercado operativo y Argentina como próximo mercado; la página consultada no confirma los tres destinos.[2] Hay que verificar proveedores de salida, condiciones, liquidez, controles y si el alta admite el caso empresarial. Sin esa cobertura, el alcance debería reducirse a un solo corredor.

3. **La trazabilidad añadida supera la complejidad introducida.** Se supone que unir estados de proveedores y una referencia de transferencia mejorará el control del contador. El supuesto caería si las confirmaciones son incompletas, si el costo total sube o si una integración convencional basta. Habrá que separar la transferencia digital del abono bancario y revisar fallos de proveedores, custodia y exposición de datos. Una prueba de extremo a extremo debe acreditar el importe recibido y su correspondencia con la orden; un ensayo en desarrollo no equivale a una operación comercial validada.

## Fuentes y alcance de la evidencia

1. **Fuente primaria informal:** Daniel Adrián Elías Cruz Cervantes. Declaraciones aportadas durante la definición del proyecto, 26 de septiembre de 2026: conoce freelancers en México que reciben pagos extranjeros mediante DolarApp o cripto y reportan comisiones, demoras y dificultades con rampas. No hay transcripciones, muestra cuantificada ni comprobantes disponibles; no equivale a entrevistas validadas con pymes emisoras.
2. **Etherfuse.** [How it works](https://docs.etherfuse.com/overview). Consulta: 26 de septiembre de 2026. Fuente para funciones de rampas, soporte de Stellar y cobertura documentada. No demuestra cobertura bancaria de todos los destinos, idoneidad jurídica del proyecto ni demanda de usuarios.
3. **Stellar Development Foundation.** [Stellar Network On and Off-Ramps](https://stellar.org/use-cases/ramps). Consulta: 26 de septiembre de 2026. Fuente sobre conexión de activos digitales con medios tradicionales mediante proveedores de rampas. La disponibilidad depende de cada proveedor.

## Pendientes de validación

- Entrevistar a contadores de pymes mexicanas que paguen al exterior y reconstruir al menos una operación real del segmento.
- Establecer frecuencia, importes, proveedores, costos totales y tiempo de seguimiento; no hay cifras de referencia confirmadas.
- Verificar recepción bancaria, admisión de empresas, condiciones y responsabilidades en cada corredor.
- Comparar la solución propuesta con una integración convencional antes de concluir que blockchain es pertinente.
- La propuesta individual y este brief quedan en commits separados de la cuenta [DonCervantes](https://github.com/DonCervantes).
