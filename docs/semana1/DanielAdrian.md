# Propuesta individual — Handle.Fi

**Autor:** Daniel Adrián Elías Cruz Cervantes  
**GitHub:** [DonCervantes](https://github.com/DonCervantes)  
**Fecha:** 26 de septiembre de 2026  
**Fase:** 1. Propuestas individuales y elección

## El problema

Los contadores de pequeñas y medianas empresas mexicanas necesitan controlar desde un solo lugar el costo, la programación, los comprobantes y la recepción de los pagos que envían a colaboradores en otros países.

## ¿Quién lo sufre?

El usuario principal propuesto es el contador de una pyme mexicana con colaboradores o freelancers en el extranjero. Necesita organizar los egresos y conocer el estado de cada pago hasta su recepción bancaria. Los colaboradores son usuarios afectados porque dependen de recibir el importe acordado y disponer de él en su moneda local.

El alcance inicial contempla envíos desde México hacia Colombia, Chile y Argentina. Estos son destinos deseados; su viabilidad operativa todavía debe verificarse. La visión posterior incluye recibir pagos y ampliar la gestión de ingresos y egresos de la empresa en Latinoamérica.

## ¿Cómo se resuelve hoy y qué cuesta?

Está pendiente investigar qué bancos, plataformas y procedimientos utilizan las pymes del segmento elegido. Como referencia complementaria, conozco freelancers que viven en México, cobran de empresas extranjeras y expresan inconformidad por comisiones y demoras. Según lo que me han compartido, utilizan DolarApp o reciben cripto directamente; algunos encuentran complicado convertir esos activos a moneda local y retirar a una cuenta bancaria.

Esta evidencia es informal y corresponde al sentido inverso del flujo prioritario. No demuestra cómo operan las pymes mexicanas que pagan al exterior ni permite atribuir una comisión o demora específica a una plataforma. No cuento todavía con montos, tiempos medidos, número documentado de casos o entrevistas estructuradas. Los costos por investigar son dinero descontado, costo cambiario y esfuerzo para seguir, convertir y conciliar cada pago.

## ¿Por qué creo que blockchain podría aportar?

Mi hipótesis es que una transferencia sobre Stellar podría aportar una referencia verificable y compartida entre proveedores independientes, vinculada al seguimiento que consulta el contador. Esto se relaciona con el criterio de la Sesión 1 sobre varias partes que necesitan compartir un registro sin depender exclusivamente de la versión de una sola de ellas.

Propongo explorar Etherfuse para las rampas, sujeto a cobertura e integración. Su documentación describe conversiones entre moneda tradicional y activos digitales y soporte para Stellar; las salidas bancarias en los países de destino requieren validación adicional.[1]

La experiencia deseada es que la pyme pague en pesos mexicanos y el colaborador reciba moneda local en su banco, sin gestionar cripto directamente. Un panel de control puede construirse con una base de datos tradicional; blockchain solo se justificaría si mejora la transferencia y su verificación entre participantes. La confirmación en Stellar no equivale por sí misma a un abono bancario.

## Referencia consultada

1. Etherfuse. [How it works](https://docs.etherfuse.com/overview). Consulta: 26 de septiembre de 2026. Documentación técnica; no constituye evidencia de demanda del segmento.
