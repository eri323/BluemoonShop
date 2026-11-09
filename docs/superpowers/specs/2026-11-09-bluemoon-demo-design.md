# Bluemoon Shop: demo de tienda online

Fecha: 2026-11-09 · Autor: Erick Gutiérrez · Estado: borrador para aprobación

## 1. Intención

Bluemoon (@bluemoon_shop.co) es una tienda de ropa alternativa para mujer, solo online, que vende desde Medellín a todo Colombia desde 2020. Tiene 31,3 mil seguidores y más de 600 publicaciones. Hoy vende solo por Instagram y WhatsApp, y su catálogo vive en las historias destacadas.

**El problema:** para comprar hay que ver historia por historia, sin orden ni filtros. Además, la talla, el precio y la disponibilidad están regados entre publicaciones, historias y mensajes directos. En los comentarios se repite siempre lo mismo: "¿Tallas?". Esto lo confirmó una clienta real (la novia de Erick): lo feo es el catálogo desordenado.

**Qué se construye:** una página web que Erick les mandará **por mensaje de Instagram**, sin estar presente, para ofrecerles hacerles la tienda. No es una presentación de venta. Es un **avance funcional** de cómo se vería su tienda terminada: su marca, sus prendas reales y sus precios, en web y en celular, para que la recorran solas y piensen "esta es mi tienda, ordenada".

**Éxito:** que respondan el mensaje con ganas de hablar del proyecto.

## 2. Objetivos, no-objetivos y anti-objetivos

**Objetivos**
- Que se sienta como **su** tienda: logo, estética, categorías, fotos, precios y número de WhatsApp reales.
- Encontrar una prenda en segundos por categoría, estilo y talla.
- Que cada prenda muestre lo que hoy hay que preguntar: precio, talla, medidas en cm y si está disponible.
- Que el pedido llegue completo por WhatsApp.
- Que funcione impecable en celular, sobre todo en el navegador interno de Instagram, y que también se vea completa en computador.
- Dejar el código listo para conectar un administrador de catálogo después, sin rehacer las páginas.

**No-objetivos (quedan para cuando acepten)**
- Pagos en línea, cuentas de usuario, panel de administración o CMS.
- Sincronizar inventario real. El catálogo es una foto fija tomada de su Instagram.
- Dominio propio.

**Anti-objetivos (aunque funcione, sería un fracaso si...)**
- La página tiene bienvenida, sección de propuesta, explicación del servicio, contacto de Erick o cualquier cosa que la haga sentir como un pitch. **Eso va en el mensaje, no en la página** (decisión de Erick).
- Se ve como plantilla genérica de tienda, o con la estética clara y pastel del primer mockup. Su marca es oscura y nocturna.
- Algo se rompe, carga lento o depende de pasar el mouse por encima cuando la abren desde Instagram en el celular.
- Aparece en Google o se comparte más allá de ellas, porque usa sus fotos.

## 3. Lo que sabemos del negocio (Instagram, revisado el 2026-11-09)

- **Estilo:** gótico, dark feminine y alternativo (corsés, encaje negro, tartán, hebillas, cadenas), además de vestidos florales y "aesthetic". Hashtags: `#gothicfashion #darkfeminine #alternativefashion #ropamedellin`.
- **Categorías** (sus historias destacadas): Medias, Conjuntos, Vestidos, Cárdigan, Blusas, Bottoms, Lencería, Bikinis, Bodys, Pijamas, Accesorios. Los corsés salen mucho en publicaciones.
- **Unidades casi únicas:** cada publicación indica una talla concreta ("Blusa gótica, $65.000, talla XS"). Cuando se venden, editan la publicación con "❌VENDIDOS❌". Mensajes propios: "se agotan muy rápido", "la mayoría no vuelve a llegar".
- **Medidas por prenda:** busto, cintura, cadera y largo en cm. Ofrecen asesoría: "envíanos tus medidas y te asesoramos".
- **Precios:** corsés desde $35.000, vestidos desde $49.000 y faldas alrededor de $85.000.
- **Fotos:** muy consistentes. Prenda en maniquí blanco sobre fondo gris claro.
- **Marca:** logo circular azul intenso con "BLUE MOON" en blanco y efecto neón.
- **Canal de venta:** WhatsApp `+57 320 662 4270` (`wa.me/573206624270`), comentarios y mensajes directos. Cuenta de respaldo: @bluemoon_shop.respaldo.
- **Confianza:** tienen una historia destacada "Clientes felices".

## 4. Experiencia

Referencia visual de la interacción: el mockup publicado (https://claude.ai/artifact/NYE8ZdFVFh2KAu2Qs7jYNu) y su fuente `../bluemoon/mockup.html`. **Se toma de ahí el flujo y la interacción, no la estética ni los datos.**

### Pantallas

| Ruta | Qué hace |
|---|---|
| `/` Inicio | Marca con su logo neón. Recién llegadas arriba con urgencia honesta ("quedan N disponibles"). Entrada por **estilo**. Accesos a sus categorías. Acceso a Match. Bloque "Clientes felices". |
| `/catalogo` | Grilla de fotos. Filtros por categoría, estilo, talla y **"según mis medidas"**. Orden por nuevo y por precio. Los filtros viven en la URL, para poder compartir una vista filtrada. Las vendidas se ven atenuadas con sello **VENDIDA**: no se pueden apartar, pero muestran que la tienda se mueve. |
| `/prenda/[slug]` | Fotos, nombre, precio, talla única, tabla de medidas en cm, descripción y estilo. Botón principal **"Apartar por WhatsApp"** y botón de favorito. Cada prenda tiene su propio link con vista previa. |
| `/match` | Deslizar prendas disponibles: derecha guarda, izquierda pasa. Funciona con dedo, mouse, botones y flechas del teclado. Al final muestra lo guardado y deja apartar todo junto. |
| `/apartados` | Favoritos y prendas elegidas. Genera **un solo mensaje de WhatsApp** con cada prenda (nombre, talla, precio y link) y el total. |

Navegación: barra de pestañas abajo en celular y menú arriba en computador, como en el mockup.

### Comportamientos clave
- **Mensaje de WhatsApp:** abre `https://wa.me/573206624270?text=…` con el texto ya armado, en tono de clienta ("Hola Bluemoon, quiero apartar: …"). Se usa su número real porque las únicas que verán la demo son ellas.
- **"Según mis medidas":** la clienta escribe busto, cintura y/o cadera. Se muestran las prendas cuyas medidas son compatibles. *Decisión mía:* una prenda es compatible si cada medida que la clienta dio está a ±4 cm de la de la prenda, ignorando las medidas que la prenda no tenga. La regla vive en una sola función con pruebas, para poder ajustarla.
- **Favoritos y apartados** se guardan en el navegador (localStorage, con manejo de error). Si falla, la página sigue funcionando.
- **Prendas vendidas:** se pueden ver pero no apartar, y no entran en Match.

## 5. Estética

- **Oscura primero:** fondo casi negro, azul neón del logo como único acento y tipografía con carácter (gótica y editorial, sin caer en disfraz). Las fotos de fondo gris claro resaltan como tarjetas iluminadas.
- **Modo claro** disponible con un botón, como en el mockup.
- Movimiento con intención: el deslizar de Match, transiciones cortas y nada que distraiga. Respeta "reducir movimiento" del sistema.
- **Lo que queda en manos de quien construye:** elegir las fuentes (Google Fonts), la paleta exacta y el sistema de componentes, siempre que se cumplan los anti-objetivos.

## 6. Stack (decisión de Erick, con propuesta mía aceptada)

Es el mismo stack de `../pc-store-web`, que ya usa Erick, para mantener una sola forma de trabajar.

- **Next.js 16 (App Router) + React 19 + TypeScript.** Las páginas del catálogo y las prendas se generan de forma estática al compilar.
- **Tailwind CSS 4.**
- **Vitest** para la lógica: filtros, compatibilidad de medidas y armado del mensaje.
- **Vercel** para publicar, con un link limpio tipo `bluemoon-demo.vercel.app`.
- **Datos:** `src/data/productos.ts` tipado. Toda lectura pasa por una capa (`src/lib/catalogo.ts`: `getProductos()`, `getProducto(slug)`, etc.) para que mañana se pueda cambiar el archivo por un CMS sin tocar las páginas.
- Animación del deslizar: queda a criterio de quien construye (Motion o eventos de puntero propios).

### Modelo de prenda (propuesta mía)
```ts
type Prenda = {
  slug: string; nombre: string;
  categoria: 'corsets' | 'vestidos' | 'conjuntos' | 'blusas' | 'bottoms' | 'lenceria' | 'bodys' | 'medias' | 'cardigan' | 'accesorios';
  estilos: Estilo[];            // ver sección 8
  precio: number;               // COP, entero
  talla: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'Única';
  medidas: { busto?: number; cintura?: number; cadera?: number; largo?: number }; // cm
  descripcion: string[];        // viñetas, como en sus publicaciones
  fotos: string[];              // rutas en /public/prendas
  estado: 'disponible' | 'vendida';
  ingreso: string;              // fecha ISO, para "recién llegadas"
};
```

## 7. Privacidad y publicación

- `noindex, nofollow` en todas las páginas y `robots.txt` con `Disallow: /`.
- Vista previa del link (Open Graph) con su logo y "Bluemoon · tienda online", para que en el chat de Instagram se vea confiable.
- Sin analítica ni cookies de terceros.

## 8. Contenido

- **Prendas:** entre 20 y 30 reales, sacadas de sus publicaciones e historias, con foto, precio, talla, medidas y descripción tal como las publican. Unas 4–6 marcadas como vendidas.
- **Quién las recoge (decisión de Erick):** Claude, desde el navegador integrado con la sesión de Instagram de Erick. Lee las publicaciones, descarga las fotos a `public/prendas/` (convertidas a WebP) y escribe cada registro en `src/data/productos.ts`. Erick autorizó estas descargas. Es una tarea propia del plan, no un detalle: va primero, porque las páginas se construyen sobre esos datos.
- **Criterio para elegir prendas (decisión mía):** se priorizan las publicaciones con precio, talla y medidas completas, buscando variedad de categorías y de estilos. Las vendidas se toman de publicaciones marcadas "❌VENDIDOS❌".
- **Estilos:** *propuesta mía, por confirmar con la novia de Erick:* Gótico, Dark feminine, Coquette y Casual. Se arranca con estos. Los nombres viven en un solo lugar del código, así que cambiarlos después no obliga a rehacer nada. Cada prenda la etiqueta Claude al recogerla.
- **Clientes felices:** 3–6 reseñas de su historia destacada.
- **Logo:** su foto de perfil, recreada en SVG si hace falta para que se vea nítida.

## 9. Decisiones que tomé yo (para que Erick las revise)

1. Regla de "según mis medidas": ±4 cm por medida.
2. Las prendas vendidas se ven pero no se apartan, y no entran en Match.
3. El botón de WhatsApp va a su número real.
4. Los filtros viven en la URL.
5. El modelo de datos de la sección 6.
6. Los nombres de los estilos de la sección 8.
7. Ruta `/apartados` en vez de "bolsa", porque ellas venden apartando, no con carrito.
8. **Una sola lista ("Mis apartados").** El corazón en una prenda, el "me encanta" de Match y el botón "Agregar a apartados" llenan la misma lista. En la ficha de la prenda, "Apartar por WhatsApp" manda el mensaje solo con esa prenda, en el momento. En `/apartados` se manda un solo mensaje con toda la lista y el total.
9. **Categorías:** las de sus historias destacadas, tal cual (Medias, Conjuntos, Vestidos, Cárdigan, Blusas, Bottoms, Lencería, Bikinis, Bodys, Pijamas, Accesorios), más **Corsés**, que en el feed es de lo que más publican. Solo se muestran las categorías que tengan al menos una prenda en la demo. El tipo `categoria` de la sección 6 se ajusta a esta lista.
10. **Privacidad:** basta con un link no listado y `noindex`. No se pone contraseña, porque rompería la vista previa del link en el chat de Instagram y los links por prenda.
11. **Prendas sin medidas:** se muestran normal en el catálogo, pero salen del resultado cuando el filtro "según mis medidas" está activo. En su ficha dice "Pregunta tus medidas por WhatsApp".

## 10. Lo que queda a criterio de quien construye

Fuentes, paleta exacta, componentes, librería de animación, estructura de carpetas dentro de `src/`, y cómo optimizar las imágenes (se recomienda `next/image` con WebP).
