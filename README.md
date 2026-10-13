# Handle.Fi

Front del producto Handle.Fi, construido con **Next.js 14 (App Router) + React + TypeScript + Tailwind CSS**.
Todo el código del front está en la carpeta [`frontend/`](frontend/).

## Requisitos

- **Node.js 18.17 o superior** (recomendado 20 LTS). Verifica tu versión con `node -v`.
- **npm 9 o superior** (viene incluido con Node.js). Verifica con `npm -v`.
- Conexión a internet: la vista de detalle de un pago lee en vivo la **red de pruebas (testnet) de Stellar** a través de Horizon (`https://horizon-testnet.stellar.org`).
- No se necesitan variables de entorno para correrlo: los valores por defecto están en `frontend/.env.example` y ya vienen aplicados en el código.

## Instalación

Desde la raíz del repositorio, entra a la carpeta del front e instala las dependencias:

```bash
cd frontend
npm install
```

## Cómo correrlo

### Modo desarrollo

```bash
cd frontend
npm run dev
```

Luego abre **[http://localhost:3000](http://localhost:3000)** en el navegador. Si el puerto 3000 está ocupado, puedes usar otro, por ejemplo: `npm run dev -- -p 3001`.

Rutas disponibles una vez levantado:

| Ruta | Pantalla |
|------|----------|
| `/` | Inicio / propuesta de valor |
| `/dashboard` | Tablero de pagos (estado de cada pago) |
| `/pagos/nuevo` | Registrar un pago (cálculo de costo total) |
| `/autorizacion` | Autorización del administrador |
| `/pagos/detalle?id=<id>` | Detalle del pago + verificación on-chain en Stellar testnet |

### Modo producción (opcional)

```bash
cd frontend
npm run build
npm run start
```

Esto compila la aplicación y la sirve en **[http://localhost:3000](http://localhost:3000)**.
