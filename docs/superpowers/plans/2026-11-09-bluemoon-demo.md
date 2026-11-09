# Bluemoon demo: plan de construcción

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** construir la demo funcional de la tienda online de Bluemoon (catálogo, ficha de prenda, Match y apartados por WhatsApp) con sus prendas reales, lista para mandarles por link.

**Architecture:** sitio Next.js generado de forma estática. Los datos viven en `src/data/` y solo se leen a través de `src/lib/catalogo.ts`, para poder cambiarlos por un CMS después. La lógica pura (filtros, medidas, mensaje de WhatsApp, URL) va en `src/lib/` con pruebas en Vitest. El estado del cliente (apartados y tema) va en un contexto de React respaldado por localStorage.

**Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Vitest · Vercel. Mismas versiones que `../pc-store-web/package.json`.

**Spec:** `docs/superpowers/specs/2026-11-09-bluemoon-demo-design.md`. Léelo antes de cada tarea. Este plan no repite su contenido.

## Global Constraints

- Todo el texto visible va en español de Colombia y tutea a la clienta. Precios en COP, con formato `$65.000` (`Intl.NumberFormat('es-CO')`, sin decimales).
- **Prohibido en la página:** bienvenida, sección de propuesta, explicación del servicio, contacto de Erick, banner de "demo" o "prototipo" (spec §2, anti-objetivos).
- Número de WhatsApp: `573206624270`. Links con el formato `https://wa.me/573206624270?text=<encodeURIComponent(texto)>`.
- Todas las páginas llevan `robots: { index: false, follow: false }`. Además existe `src/app/robots.ts` con `disallow: '/'`.
- Sin analítica ni scripts de terceros. Lo único externo permitido son las fuentes de Google vía `next/font/google`.
- Oscuro por defecto, con modo claro opcional. El único acento es el azul neón del logo. Respetar `prefers-reduced-motion`.
- Pensado primero para celular: debe verse y funcionar a 375 px de ancho y en el navegador interno de Instagram. Nada puede depender de pasar el mouse por encima.
- Estilos: `['gotico', 'dark-feminine', 'coquette', 'casual']`, definidos en un solo lugar (`src/lib/tipos.ts`).
- Categorías (spec §9.8): `corsets, vestidos, conjuntos, blusas, bottoms, lenceria, bodys, medias, cardigan, bikinis, pijamas, accesorios`. Solo se muestran las que tengan al menos una prenda.

## Review Focus

1. **Apartados guardados que ya no sirven:** localStorage trae un slug que no existe o una prenda que ahora está vendida. Se descartan sin romper nada. Prueba en la Tarea 5.
2. **Medidas mal escritas:** vacías, con letras, en cero o negativas. Se ignoran esas medidas y no hay error. Prueba en la Tarea 3.
3. **Parámetros inválidos en el link** (`?categoria=xyz&talla=ZZ&estilo=`): se ignoran y se muestra el catálogo completo. Prueba en la Tarea 3.
4. **Mensaje de WhatsApp con tildes, ñ, `&`, `#` o saltos de línea, y con muchas prendas:** el link queda bien codificado y el total es correcto. Prueba en la Tarea 4.
5. **Match sin prendas:** el filtro deja 0 disponibles, o ya se deslizaron todas. Se muestra el estado final, nunca una carta vacía. Prueba en la Tarea 3 (`deckMatch`).

---

### Task 1: Base del proyecto

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `vitest.config.mts`, `eslint.config.mjs`, `.gitignore`
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx` (vacía por ahora), `src/app/robots.ts`
- Create: `src/lib/tipos.ts`
- Test: `src/lib/tipos.test.ts`

**Interfaces:**
- Produces, en `src/lib/tipos.ts`:
  - `ESTILOS`, `CATEGORIAS`, `TALLAS` como arreglos `as const`, con sus tipos `Estilo`, `Categoria`, `Talla`. Tallas: `'XS' | 'S' | 'M' | 'L' | 'XL' | 'Única'`.
  - `ETIQUETA_ESTILO: Record<Estilo, string>`: Gótico, Dark feminine, Coquette, Casual.
  - `ETIQUETA_CATEGORIA: Record<Categoria, string>`: Corsés, Vestidos, Conjuntos, Blusas, Bottoms, Lencería, Bodys, Medias, Cárdigan, Bikinis, Pijamas, Accesorios.
  - `type Medidas = { busto?: number; cintura?: number; cadera?: number; largo?: number }`.
  - `type Prenda`, según spec §6, con `categoria: Categoria` y `talla: Talla`.
  - `type Resena = { nombre: string; texto: string }`.
  - `formatoCOP(n: number): string`.

- [ ] **Step 1:** crear el proyecto con `npx create-next-app@16.4.3 . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm` (el repo está vacío). Agregar `vitest@` con la versión de `../pc-store-web` y el script `"test": "vitest run"`.
- [ ] **Step 2:** escribir la prueba `formatoCOP(65000) === '$65.000'` y `formatoCOP(1234567) === '$1.234.567'`. Normalizar espacios duros si `Intl` los produce.
- [ ] **Step 3:** correr `npm test`. Esperado: FAIL.
- [ ] **Step 4:** implementar `src/lib/tipos.ts`.
- [ ] **Step 5:** en `layout.tsx`, poner `lang="es-CO"`, `metadata.robots = { index: false, follow: false }`, `metadataBase` desde `process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'` y el título `Bluemoon · tienda online`. Crear `robots.ts` con `disallow: '/'`.
- [ ] **Step 6:** correr `npm test && npm run build`. Esperado: PASS, y la compilación termina sin errores.
- [ ] **Step 7:** commit `chore: base Next.js 16 + Tailwind 4 + Vitest`. Incluir en el mismo commit el spec y este plan si aún no están commiteados.

### Task 2: Contenido real desde Instagram

Lo hace el agente principal, no un subagente, porque necesita el navegador integrado con la sesión de Instagram de Erick. Erick autorizó las descargas (spec §8).

**Files:**
- Create: `src/data/productos.ts`, `src/data/resenas.ts`, `public/prendas/<slug>-<n>.webp`, `public/marca/logo.svg` (o `.webp`)
- Test: `src/data/productos.test.ts`

**Interfaces:**
- Produces: `export const PRODUCTOS: Prenda[]` y `export const RESENAS: Resena[]`.

- [ ] **Step 1: Write the failing test** `productos.test.ts`, que verifica:
  - `PRODUCTOS.length` está entre 20 y 30.
  - Las vendidas son entre 4 y 6.
  - Los slugs son únicos y cumplen `/^[a-z0-9-]+$/`.
  - Cada `precio` es un entero mayor que 0.
  - Cada `estilos` es no vacío y está dentro de `ESTILOS`.
  - Cada foto existe en disco (`fs.existsSync('public' + foto)`) y termina en `.webp`.
  - `ingreso` es una fecha ISO válida.
  - `RESENAS.length` está entre 3 y 6.
- [ ] **Step 2:** correr `npm test`. Esperado: FAIL, porque los módulos no existen.
- [ ] **Step 3:** recorrer `https://www.instagram.com/bluemoon_shop.co/` en el navegador integrado. Por cada publicación elegida (criterio en spec §8), copiar del pie de foto el precio, la talla, las medidas y las viñetas de descripción. Descargar las fotos con la sesión del navegador (por ejemplo, leyendo el `src` de la imagen y usando `fetch` dentro de la página para obtener los bytes). Convertir a WebP con `sharp` (dependencia de desarrollo), a 1200 px de ancho como máximo.
- [ ] **Step 4:** escribir los registros. Las fechas de `ingreso` son las de cada publicación. El estado `vendida` sale de las publicaciones marcadas "❌VENDIDOS❌". Las reseñas se toman de la historia destacada "Clientes felices", con solo el nombre de pila o el usuario. El logo sale de la foto de perfil.
- [ ] **Step 5:** correr `npm test`. Esperado: PASS.
- [ ] **Step 6:** commit `content: prendas y reseñas reales de @bluemoon_shop.co`.

### Task 3: Lógica del catálogo

**Files:**
- Create: `src/lib/catalogo.ts`, `src/lib/filtros.ts`
- Test: `src/lib/filtros.test.ts`, `src/lib/catalogo.test.ts`

**Interfaces:**
- Consumes: `Prenda`, `PRODUCTOS`, constantes de `tipos.ts`.
- Produces:
  - Lectura de datos:
    - `getProductos(): Prenda[]`
    - `getProducto(slug: string): Prenda | undefined`
    - `getCategoriasConPrendas(): Categoria[]`
    - `getRecientes(n: number): Prenda[]`: solo disponibles, por `ingreso` de la más nueva a la más vieja.
  - Filtros:
    - `type Filtros = { categoria?: Categoria; estilo?: Estilo; talla?: Talla; medidas?: Medidas; orden: 'nuevo' | 'precio-asc' | 'precio-desc' }`
    - `parseFiltros(params: URLSearchParams): Filtros` y `serializarFiltros(f: Filtros): string`. Las medidas en la URL van como `busto`, `cintura` y `cadera`.
    - `limpiarMedidas(raw: Record<string, string | undefined>): Medidas`: descarta valores vacíos, no numéricos o ≤ 0.
    - `esCompatible(prenda: Medidas, clienta: Medidas, tolerancia = 4): boolean`
    - `filtrar(prendas: Prenda[], f: Filtros): Prenda[]`: las disponibles van primero y las vendidas al final, cada grupo según `orden`.
    - `deckMatch(prendas: Prenda[], vistos: Set<string>, f?: Filtros): Prenda[]`: solo disponibles y no vistas.

- [ ] **Step 1: Write the failing tests**
  - `esCompatible({busto:80,cintura:63},{busto:83}) === true`
  - `esCompatible({busto:80},{busto:85}) === false`
  - `esCompatible({cintura:66},{busto:90}) === false`: la clienta dio una medida que la prenda no tiene (spec §9.11). Una prenda sin ninguna de las medidas pedidas no es compatible.
  - `esCompatible(cualquiera, {}) === true`
  - `limpiarMedidas({busto:'abc', cintura:'', cadera:'-3'})` devuelve `{}`, y `limpiarMedidas({busto:'84'})` devuelve `{busto:84}`.
  - `parseFiltros(new URLSearchParams('categoria=xyz&talla=ZZ&estilo='))` devuelve `{ orden: 'nuevo' }`.
  - `serializarFiltros(parseFiltros(x))` es idempotente para una URL válida con categoría, talla, busto y orden.
  - `filtrar` con `orden: 'precio-asc'` pone las vendidas al final aunque sean más baratas.
  - `deckMatch(prendas, new Set(todosLosSlugs))` devuelve `[]`, y `deckMatch` nunca incluye vendidas.
  - En `catalogo.test.ts`, `getRecientes(3)` no incluye vendidas y está ordenado por `ingreso` descendente.
- [ ] **Step 2:** correr `npm test`. Esperado: FAIL.
- [ ] **Step 3:** implementar.
- [ ] **Step 4:** correr `npm test`. Esperado: PASS.
- [ ] **Step 5:** commit `feat: filtros, medidas y lectura del catálogo`.

### Task 4: Mensaje de WhatsApp

**Files:**
- Create: `src/lib/whatsapp.ts`
- Test: `src/lib/whatsapp.test.ts`

**Interfaces:**
- Produces:
  - `WHATSAPP = '573206624270'`
  - `mensajeApartado(prendas: Prenda[], baseUrl: string): string`
  - `linkWhatsApp(texto: string): string`

Texto exacto, con una línea por prenda y el total solo si hay más de una:
```
Hola Bluemoon, quiero apartar:
• {nombre} · talla {talla} · {formatoCOP(precio)}
  {baseUrl}/prenda/{slug}
Total: {formatoCOP(suma)}
```

- [ ] **Step 1: Write the failing tests**
  - Con una prenda: el mensaje no incluye "Total".
  - Con 3 prendas: el total es la suma exacta.
  - `linkWhatsApp('Falda tartán & cruz #1\nok')` empieza por `https://wa.me/573206624270?text=` y `decodeURIComponent` del parámetro devuelve el texto original.
  - Con 15 prendas el link sigue siendo válido (`new URL(link)` no lanza error).
- [ ] **Step 2:** correr `npm test`. Esperado: FAIL.
- [ ] **Step 3:** implementar.
- [ ] **Step 4:** correr `npm test`. Esperado: PASS.
- [ ] **Step 5:** commit `feat: mensaje de apartado por WhatsApp`.

### Task 5: Estado de apartados y tema

**Files:**
- Create: `src/lib/almacen.ts`, `src/components/estado/ApartadosProvider.tsx`, `src/components/estado/TemaProvider.tsx`
- Test: `src/lib/almacen.test.ts`

**Interfaces:**
- Produces:
  - `leerSlugs(key: string): string[]` y `guardarSlugs(key: string, slugs: string[]): void`. Las dos con try/catch: si fallan, devuelven `[]` o no hacen nada.
  - `sanear(slugs: string[], productos: Prenda[]): string[]`: quita duplicados, slugs inexistentes y prendas vendidas.
  - `useApartados(): { slugs: string[]; tiene(slug): boolean; alternar(slug): void; quitar(slug): void; vaciar(): void }`. Clave en localStorage: `bm-apartados`. Al montar aplica `sanear`.
  - `useVistosMatch(): { vistos: Set<string>; marcar(slug): void; reiniciar(): void }`. Solo dura la sesión.
  - `useTema(): { tema: 'oscuro' | 'claro'; alternar(): void }`. Clave en localStorage: `bm-tema`. Por defecto es `oscuro`. Pone `data-theme` en `<html>`, con un script en línea en `layout.tsx` para que no parpadee al cargar.

- [ ] **Step 1: Write the failing tests**
  - `sanear(['a','a','no-existe','vendida-1','b'], productos)` devuelve `['a','b']`.
  - `leerSlugs` con un `localStorage` que lanza error devuelve `[]`.
  - `leerSlugs` con JSON corrupto devuelve `[]`.
- [ ] **Step 2:** correr `npm test`. Esperado: FAIL.
- [ ] **Step 3:** implementar y montar los providers en `layout.tsx`.
- [ ] **Step 4:** correr `npm test && npm run build`. Esperado: PASS.
- [ ] **Step 5:** commit `feat: apartados y tema persistentes`.

### Task 6: Identidad visual y estructura

**Files:**
- Modify: `src/app/globals.css`, `src/app/layout.tsx`
- Create:
  - `src/components/marca/Logo.tsx`
  - `src/components/nav/Encabezado.tsx`, `src/components/nav/PestanasMovil.tsx`
  - `src/components/prenda/TarjetaPrenda.tsx`, `src/components/prenda/Precio.tsx`
  - `src/app/opengraph-image.tsx` (o `public/og.png` con `metadata.openGraph`)

**Interfaces:**
- Consumes: `useApartados`, `useTema`, `ETIQUETA_*`, `formatoCOP`.
- Produces:
  - `<TarjetaPrenda prenda={Prenda} />`: foto con `next/image` en proporción 4/5, nombre, precio y talla. Si la prenda está vendida, lleva el sello **VENDIDA**, se ve atenuada y no muestra el corazón. Si no, muestra el corazón para alternar el apartado. Toda la tarjeta enlaza a `/prenda/{slug}`.
  - Encabezado para computador desde 900 px: logo, enlaces Inicio · Catálogo · Match, botón de tema y botón "Apartados (n)".
  - Pestañas para celular por debajo de 900 px: Inicio · Catálogo · Match · Apartados, con contador.

- [ ] **Step 1:** definir los tokens de color y tipografía en `globals.css` (`@theme` de Tailwind 4) en dos bloques: `[data-theme="oscuro"]` (por defecto) y `[data-theme="claro"]`. Cargar las fuentes con `next/font/google`.
- [ ] **Step 2:** crear los componentes. La vista previa de Open Graph lleva el logo y el texto "Bluemoon · tienda online", en 1200×630.
- [ ] **Step 3:** correr `npm run build && npm run dev`. Abrir `http://localhost:3000` a 375 px y a 1366 px. Esperado: encabezado o pestañas según el ancho, y el botón de tema cambia toda la paleta sin parpadeo al recargar.
- [ ] **Step 4:** commit `feat: identidad visual, navegación y tarjeta de prenda`.

### Task 7: Inicio y ficha de prenda

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/prenda/[slug]/page.tsx`, `src/components/prenda/TablaMedidas.tsx`, `src/components/prenda/GaleriaFotos.tsx`, `src/components/prenda/AccionesPrenda.tsx` (cliente)

**Interfaces:**
- Consumes:
  - de catálogo: `getRecientes`, `getCategoriasConPrendas`, `getProducto`, `getProductos`
  - de datos: `RESENAS`
  - de WhatsApp: `mensajeApartado`, `linkWhatsApp`
  - de estado: `useApartados`
  - componentes: `TarjetaPrenda`
- Produces: rutas `/` y `/prenda/[slug]`, con `generateStaticParams` y `generateMetadata` (título y vista previa con la primera foto). Un slug inexistente llama a `notFound()`.

- [ ] **Step 1:** construir el Inicio con estas secciones, en orden:
  1. Recién llegadas (`getRecientes(8)`), con el texto "Quedan {n} disponibles", donde n es el total de disponibles.
  2. Entrada por estilo: 4 accesos a `/catalogo?estilo=…`.
  3. Categorías con prendas.
  4. Acceso a Match.
  5. Clientes felices (`RESENAS`).
- [ ] **Step 2:** construir la ficha:
  - Galería y precio.
  - Talla única con la tabla de medidas en cm. Si no hay medidas, mostrar "Pregunta tus medidas por WhatsApp".
  - Descripción en viñetas y etiquetas de estilo.
  - Si está disponible: botón principal "Apartar por WhatsApp" (`linkWhatsApp(mensajeApartado([prenda], origin))`, en una pestaña nueva) y botón secundario "Agregar a apartados" / "En tus apartados".
  - Si está vendida: sello VENDIDA, sin botones de apartar, y un enlace "Ver prendas parecidas" a `/catalogo?categoria=…`.
- [ ] **Step 3:** correr `npm run build`. Esperado: genera todas las rutas `/prenda/*` sin errores.
- [ ] **Step 4:** en `npm run dev`, a 375 px, abrir una prenda disponible y una vendida. Esperado: lo descrito en el Step 2. El link de WhatsApp abre el número `573206624270` con el texto completo.
- [ ] **Step 5:** commit `feat: inicio y ficha de prenda`.

### Task 8: Catálogo con filtros en la URL

**Files:**
- Create: `src/app/catalogo/page.tsx`, `src/components/catalogo/PanelFiltros.tsx` (cliente), `src/components/catalogo/FormMedidas.tsx` (cliente), `src/components/catalogo/GrillaCatalogo.tsx` (cliente)

**Interfaces:**
- Consumes:
  - de filtros: `parseFiltros`, `serializarFiltros`, `filtrar`, `limpiarMedidas`
  - de catálogo: `getProductos`, `getCategoriasConPrendas`
  - componentes: `TarjetaPrenda`
- Produces: ruta `/catalogo`. La página entrega todas las prendas a la grilla, que filtra en el cliente leyendo `useSearchParams` dentro de un `<Suspense>`, para que la página siga siendo estática.

- [ ] **Step 1:** construir el panel. En celular, los grupos de chips se desplazan de lado. En computador, va como columna fija a la izquierda.
  - Grupos: Categoría, Estilo, Talla y "Según mis medidas" (campos numéricos de busto, cintura y cadera en cm, con `inputMode="numeric"`).
  - Selector de orden.
  - Contador "N prendas" y botón "Limpiar filtros".
  - Cada cambio actualiza la URL con `router.replace` sin hacer scroll.
- [ ] **Step 2:** cuando no hay resultados, mostrar el mensaje "Ninguna prenda con esos filtros" y un botón para limpiar.
- [ ] **Step 3:** en `npm run dev`, abrir `/catalogo?estilo=gotico&busto=82` y recargar. Esperado: los filtros siguen aplicados. `/catalogo?categoria=xyz` muestra todo. Escribir "abc" en busto no rompe la página.
- [ ] **Step 4:** commit `feat: catálogo con filtros y medidas`.

### Task 9: Match

**Files:**
- Create: `src/app/match/page.tsx`, `src/components/match/Mazo.tsx` (cliente), `src/components/match/CartaMatch.tsx` (cliente)

**Interfaces:**
- Consumes:
  - de catálogo y filtros: `getProductos`, `deckMatch`, `parseFiltros` (respeta `?estilo=`)
  - de estado: `useVistosMatch`, `useApartados`
- Produces: ruta `/match`.

- [ ] **Step 1:** construir el mazo, con la carta de arriba y 2 detrás.
  - Gestos: arrastrar con eventos de puntero (`touch-action: none`). Si pasa de 90 px decide: derecha llama `alternar` (solo si no estaba) y `marcar`; izquierda solo `marcar`.
  - Mientras se arrastra se ven los sellos "ME ENCANTA" y "PASO".
  - También funcionan los botones Pasar · Ver detalle · Me encanta y las flechas ←/→.
  - Debajo se lee el progreso "x de y".
- [ ] **Step 2:** cuando el mazo queda vacío, mostrar "Tu clóset ideal" con las miniaturas de los apartados y los botones "Ver mis apartados" y "Volver a jugar" (`reiniciar`). Si no había ninguna disponible desde el inicio, mostrar el mismo estado con el texto "No hay prendas disponibles con este estilo" y un enlace al catálogo.
- [ ] **Step 3:** en computador, mostrar al lado un panel "Te encantaron" con las miniaturas.
- [ ] **Step 4:** en `npm run dev`, a 375 px, deslizar con el dedo emulado, el mouse y el teclado hasta vaciar el mazo. Esperado: nunca aparece una carta vacía y el contador de apartados sube en las pestañas.
- [ ] **Step 5:** commit `feat: Match para deslizar prendas`.

### Task 10: Apartados

**Files:**
- Create: `src/app/apartados/page.tsx`, `src/components/apartados/ListaApartados.tsx` (cliente)

**Interfaces:**
- Consumes:
  - de estado: `useApartados`
  - de catálogo: `getProductos`
  - de WhatsApp: `mensajeApartado`, `linkWhatsApp`
- Produces: ruta `/apartados`.

- [ ] **Step 1:** construir la lista. Cada fila lleva foto, nombre, talla, precio y "Quitar". El resumen muestra el total y una vista previa del mensaje tal como le llegará a Bluemoon. Botón principal: "Apartar todo por WhatsApp". En computador el resumen va fijo a la derecha.
- [ ] **Step 2:** con la lista vacía, mostrar "Aún no has apartado nada" y enlaces a Catálogo y Match.
- [ ] **Step 3:** en `npm run dev`, apartar 3 prendas desde lugares distintos (corazón, ficha y Match), recargar y abrir `/apartados`. Esperado: las 3 siguen ahí, el total es correcto y el link de WhatsApp lleva las 3.
- [ ] **Step 4:** commit `feat: apartados con pedido único por WhatsApp`.

### Task 11: Verificación final y publicación

- [ ] **Step 1:** correr `npm test && npm run lint && npm run build`. Esperado: todo pasa.
- [ ] **Step 2:** revisar en el navegador integrado a 375×812 y a 1366×860, en oscuro y en claro, todas las rutas. Buscar desbordes horizontales, texto ilegible y fotos deformadas. Corregir lo que aparezca.
- [ ] **Step 3:** **pedirle confirmación a Erick antes de publicar.** Con su sí, desplegar en Vercel con el nombre de proyecto `bluemoon-demo` y `NEXT_PUBLIC_SITE_URL` apuntando al dominio de Vercel.
- [ ] **Step 4:** en el dominio publicado, verificar:
  - que `/robots.txt` diga `Disallow: /`;
  - que el HTML de `/` lleve `<meta name="robots" content="noindex, nofollow">`;
  - que la vista previa de Open Graph salga con un validador de OG o pegando el link en un chat.
- [ ] **Step 5:** commit final si hubo correcciones. Entregar a Erick el link y la lista de lo que se verificó.
