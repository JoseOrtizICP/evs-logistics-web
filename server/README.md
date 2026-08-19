# API de rastreo — EVS Logistics

Servicio que guarda las guías y sus movimientos. El sitio web (GitHub Pages)
lo consulta para mostrar el rastreo al cliente y para el panel interno.

- **Panel interno:** `https://www.evslogist.com/admin`
- **Rastreo del cliente:** sección "Rastrear Envío" del sitio

---

## Puesta en marcha en Railway (una sola vez)

### 1. Subir el código a GitHub

Desde la carpeta `evs-logistics-web`:

```bash
git add . && git commit -m "Agrega rastreo de guías y panel de administración" && git push
```

### 2. Crear el proyecto en Railway

1. Entra a [railway.app](https://railway.app) → **New Project**.
2. Elige **Deploy from GitHub repo** y selecciona `joseortiz-EVS/evs-logistics-web`.
3. Cuando termine de crearse el servicio, entra a **Settings**:
   - **Root Directory**: escribe `server`
     *(esto es importante: sin esto Railway intentaría desplegar el sitio web en vez de la API)*
   - **Health Check Path**: `/api/salud`

### 3. Agregar la base de datos

1. Dentro del mismo proyecto: **New** → **Database** → **Add PostgreSQL**.
2. Railway la crea y la conecta a la red interna del proyecto. No hay que configurar nada más.

### 3b. Agregar el volumen de archivos

Las facturas en PDF y los comprobantes de pago se guardan como archivos. Para que
no se borren en cada despliegue:

1. En el servicio de la API: **Settings** → **Volumes** → **New Volume**.
2. Mount path: `/datos`.
3. Asegúrate de que la variable `CARPETA_ARCHIVOS` valga `/datos/archivos`.

### 4. Configurar las variables

En el servicio de la API, pestaña **Variables**, agrega:

| Variable | Valor |
|---|---|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
| `JWT_SECRET` | una cadena larga y aleatoria (ver abajo) |
| `CORS_ORIGINS` | `https://www.evslogist.com,https://evslogist.com` |
| `ADMIN_EMAIL` | tu correo, ej. `jose_ortiz@evslogist.com` |
| `ADMIN_PASSWORD_INICIAL` | una contraseña temporal de mínimo 8 caracteres |
| `ADMIN_NOMBRE` | tu nombre |
| `DEV_PORTAL_NUMERO` | número de la puerta de desarrollador, ej. `EVS-DEV` |
| `DEV_PORTAL_PASSWORD` | contraseña de esa puerta (larga y secreta, la eliges tú) |
| `CARPETA_ARCHIVOS` | `/datos/archivos` (ruta del volumen, ver abajo) |

Para generar el `JWT_SECRET`, corre esto en tu Mac y pega el resultado:

```bash
openssl rand -base64 48
```

> `DATABASE_URL` debe escribirse tal cual, con las llaves: Railway lo reemplaza
> solo por la dirección real de la base de datos.

### 5. Publicar la API

1. Pestaña **Settings** → **Networking** → **Generate Domain**.
   Railway te da una dirección tipo `https://evs-api-production.up.railway.app`.
2. *(Opcional pero recomendado)* En **Custom Domain** agrega `api.evslogist.com`
   y crea en tu proveedor de dominio el registro CNAME que Railway te indique.
3. Comprueba que responde abriendo en el navegador:
   `https://TU-DIRECCION/api/salud` → debe mostrar `{"ok":true,"servicio":"evs-tracking-api"}`

### 6. Conectar el sitio web con la API

1. En GitHub, ve al repositorio → **Settings** → **Secrets and variables** →
   **Actions** → pestaña **Variables** → **New repository variable**.
2. Nombre: `VITE_API_URL`. Valor: la dirección de la API **sin diagonal final**,
   por ejemplo `https://api.evslogist.com`.
3. Ve a la pestaña **Actions** del repositorio y vuelve a ejecutar el último
   despliegue (**Re-run all jobs**) para que el sitio se compile con esa dirección.

> Si usas la dirección `.up.railway.app` en vez de `api.evslogist.com`, funciona
> igual: el sitio ya tiene permitidos ambos dominios.

### 7. Entrar al panel

1. Abre `https://www.evslogist.com/admin`.
2. Entra con el `ADMIN_EMAIL` y el `ADMIN_PASSWORD_INICIAL` que configuraste.
3. Ícono de usuario (arriba a la derecha) → **cambia tu contraseña**.
4. Vuelve a Railway y **borra la variable `ADMIN_PASSWORD_INICIAL`**.
   Ya no se necesita y no conviene dejarla escrita.

Listo. Desde ahí puedes dar de alta a las demás personas del equipo en la misma
pantalla de "Cuenta y usuarios".

---

## Uso diario

1. Llega la carga → **Nueva guía**: se genera un número (o escribes el tuyo),
   pones cliente, origen, destino, servicio y fecha estimada.
2. Le pasas ese número al cliente.
3. Cada vez que el envío avanza, abres la guía y das **Agregar movimiento**:
   estatus, fecha, ubicación y una descripción corta.
4. El cliente ve el cambio de inmediato en la sección de rastreo del sitio.

**Qué ve el cliente:** número de guía, origen, destino, servicio, fecha estimada,
etapa actual y todo el historial de movimientos.

**Qué NO ve el cliente:** el campo "Cliente" y las "Notas internas". Esos dos son
solo para ustedes.

### Clientes y facturas (pestañas del panel maestro)

- **Clientes**: crea un cliente, el sistema le genera su número y una contraseña
  temporal. Cópialos y entrégaselos; con eso entra a `/portal`. Puedes editar sus
  datos, restablecer su contraseña o desactivar su acceso.
- **Facturas**: crea la factura de un cliente (folio, concepto, monto, vencimiento)
  y marca su estatus (pendiente, pagada, vencida). Cuando el cliente sube un
  comprobante, la factura aparece en **Por revisar**; ahí puedes **Aprobar pago**.

### Puerta de desarrollador

Entra a `/portal` con el `DEV_PORTAL_NUMERO` y `DEV_PORTAL_PASSWORD` que definiste
en Railway. Verás una barra de "Modo desarrollador" para consultar la cuenta de
cualquier cliente (soporte). Cada acceso queda registrado en la tabla `accesos_dev`.
No hay ningún botón visible: solo se entra con esas credenciales, que nunca están
escritas en el código.

---

## Detalles técnicos

**Estatus disponibles:** `recibido`, `documentacion`, `en_transito`, `en_aduana`,
`en_reparto`, `entregado`, `incidencia`. Se definen en `src/estatus.js` y deben
coincidir con `../src/data/estatus.js` del sitio web.

**Tablas:** `usuarios`, `guias`, `eventos`. Se crean solas al arrancar; el
arranque es idempotente y nunca borra información existente.

**Seguridad:**
- Contraseñas guardadas con bcrypt (nunca en texto plano).
- Sesión por token JWT con vigencia de 12 horas.
- Máximo 10 intentos de inicio de sesión por IP cada 15 minutos.
- Máximo 40 consultas públicas de rastreo por IP cada 15 minutos, para que nadie
  pueda probar números al azar hasta dar con guías ajenas.
- La consulta pública devuelve únicamente la guía cuyo número exacto se conoce;
  no existe forma de pedir la lista completa sin iniciar sesión.

**Endpoints principales:**

| Método | Ruta | Acceso |
|---|---|---|
| `GET` | `/api/salud` | público |
| `GET` | `/api/rastreo/:numero` | público |
| `POST` | `/api/auth/login` | público |
| `GET` `POST` | `/api/guias` | con sesión |
| `GET` `PATCH` `DELETE` | `/api/guias/:id` | con sesión |
| `POST` | `/api/guias/:id/eventos` | con sesión |
| `DELETE` | `/api/guias/:id/eventos/:eventoId` | con sesión |
| `GET` `POST` | `/api/auth/usuarios` | con sesión |
| `GET` `POST` | `/api/clientes` | con sesión |
| `GET` `PATCH` | `/api/clientes/:id` | con sesión |
| `GET` `POST` `PATCH` `DELETE` | `/api/facturas` | con sesión |
| `POST` | `/api/portal/login` | público |
| `GET` | `/api/portal/envios` · `/api/portal/facturas` | cliente |
| `POST` | `/api/portal/facturas/:id/comprobante` | cliente |

---

## Desarrollo local

Sin configurar nada, `npm run dev` en la carpeta del sitio levanta un **modo de
prueba** con guías de ejemplo en memoria: sirve para ver y probar la interfaz sin
base de datos. Ese modo nunca se activa en el sitio publicado.

Para trabajar contra la API de verdad, copia `.env.example` a `.env`, llénalo y:

```bash
npm install && npm run dev
```

Luego crea `.env.local` en la carpeta del sitio con `VITE_API_URL=http://localhost:3001`.
