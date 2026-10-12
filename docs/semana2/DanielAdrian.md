# Historias de usuario — Daniel Adrián Elías Cruz Cervantes

**Proyecto:** Handle.Fi · **Fecha:** Semana 2

## Mis historias de usuario

1. **Como** contador de una PyME mexicana **quiero** ver en un solo lugar el estado de cada pago (enviado / en tránsito / recibido) **para** dejar de confundir "ya lo envié" con "ya le llegó" y dar seguimiento sin incertidumbre.

2. **Como** contador **quiero** conocer el costo total real de cada pago (tipo de cambio + comisiones) antes de ejecutarlo **para** saber cuánto sale en pesos y cuánto recibe el colaborador en su moneda local.

3. **Como** contador **quiero** adjuntar y recuperar el comprobante de cada transferencia junto a su registro **para** no reconstruir la documentación a mano cuando la necesito.

4. **Como** administrador/dueño de la PyME **quiero** autorizar los pagos antes de que se ejecuten **para** mantener control sobre las salidas de dinero.

5. **Como** colaborador en el extranjero (Colombia, Chile, Argentina) **quiero** recibir el dinero en moneda local en mi banco sin tener que manejar cripto **para** cobrar sin fricción ni conocimientos técnicos.

6. **Como** contador **quiero** conciliar cada pago con su beneficiario y su obligación mediante una referencia única compartida **para** evitar el cruce manual entre los identificadores de distintos intermediarios.

7. **Como** contador **quiero** programar pagos recurrentes **para** no capturar la misma información cada mes y reducir errores.

## La más importante y por qué

Las historias están ordenadas de mayor a menor importancia. **La más importante es la #1 (visibilidad del estado del pago de principio a fin).**

Es el dolor central descrito en el Problem Brief: hoy la información vive dispersa y "enviado" se confunde con "recibido", lo que genera incertidumbre en el seguimiento. Sin resolver esto, las demás funciones son mejoras incrementales sobre un proceso que sigue siendo opaco. Darle al contador una sola vista confiable del estado real de cada pago es lo que convierte a Handle.Fi en una herramienta de *control*, no solo de ejecución. Le siguen en importancia conocer el costo total (#2) y tener el comprobante conciliado (#3), porque completan la trazabilidad; la autorización del dueño (#4) añade control; y recepción local (#5), referencia única (#6) y recurrencia (#7) amplían el valor una vez resuelto el núcleo.
