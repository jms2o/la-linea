# La Linea

Tienda en linea para venta de camisas al menudeo y mayoreo. El proyecto ya incluye base backend con Prisma y una primera fase frontend en Next.js App Router.

## Fases

1. Base backend: base de datos, Prisma, modelos, seed y configuracion inicial.
2. API reutilizable: productos, categorias, pedidos y configuracion.
3. Tienda publica: inicio, catalogo, detalle de producto, carrito y checkout por WhatsApp.
4. Panel admin visual: dashboard, productos, categorias, pedidos y configuracion.
5. Crecimiento: pagos en linea, envios, cupones, clientes y app movil.

## Instalacion

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
```

Si no hay `DATABASE_URL` o la base no esta disponible, el frontend usa datos demo equivalentes al seed para poder revisar la interfaz. Cuando PostgreSQL este configurado, las mismas pantallas consumen Prisma/API.

## Variables de entorno

```bash
DATABASE_URL=""
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"
STORE_WHATSAPP_NUMBER=""
NEXT_PUBLIC_STORE_NAME="La Linea"
```

## Comandos utiles

```bash
npm run prisma:validate
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run typecheck
```

## Frontend

Rutas principales:

- `/`: inicio comercial.
- `/catalogo`: catalogo con busqueda, filtros y ordenamiento.
- `/producto/[slug]`: detalle con variantes, cantidad y calculo de mayoreo.
- `/carrito`: carrito persistido en `localStorage`.
- `/checkout`: formulario, creacion de pedido y enlace de WhatsApp.
- `/admin/dashboard`: panel administrativo visual.
- `/admin/productos`: tabla y formulario visual de productos.
- `/admin/categorias`: gestion visual de categorias.
- `/admin/pedidos`: listado de pedidos.
- `/admin/pedidos/[id]`: detalle de pedido.
- `/admin/configuracion`: configuracion visual de tienda.

La capa `lib/api.ts` centraliza llamadas desde componentes cliente. Las rutas API delegan en `lib/data.ts`, que intenta usar Prisma y cae a datos demo si el entorno local aun no tiene base de datos.

## Seed

El seed crea:

- Un usuario admin de desarrollo: `admin@lalinea.local` / `password123`
- Configuracion inicial de tienda.
- Categorias de ejemplo.
- Productos con imagenes y variantes por talla/color/stock.

No se avanzo al frontend en esta fase.
