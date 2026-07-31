# MOP OS

Plataforma interna de MOP Modular Places SAS: login/registro real con Supabase Auth
y el "Project Canvas" (tablero de proyectos con cápsulas, panel lateral, calendario,
autoguardado y sincronización en tiempo real entre todo el equipo).

## 1. Crear el proyecto en Supabase

1. Entra a https://supabase.com y crea un proyecto nuevo (elige región cercana, ej. `sa-east-1` o `us-east-1`).
2. Ve a **Project Settings → API** y copia:
   - `Project URL`
   - `anon public key`
3. Copia `.env.local.example` como `.env.local` y pega esos dos valores.

## 2. Crear las tablas y permisos

1. En el panel de Supabase, ve a **SQL Editor → New query**.
2. Pega el contenido completo de `supabase/schema.sql` y ejecútalo.
   Esto crea las tablas (`projects`, `tasks`, `checklist_items`, `comments`, `files`,
   `profiles`), activa **Row Level Security** (cualquier usuario autenticado del
   equipo puede leer/escribir — así todos comparten la misma información), activa
   **Realtime** en esas tablas, y crea el bucket de Storage `project-files` para
   fotos y documentos.
3. Verifica en **Database → Replication** que las 5 tablas queden marcadas para Realtime
   (el script ya lo hace, pero es bueno confirmarlo visualmente).

## 3. Confirmación de correo (opcional pero recomendado)

Por defecto Supabase pide confirmar el correo antes de poder iniciar sesión.
Para el equipo interno, puedes desactivarlo para agilizar el alta de cuentas:

**Authentication → Providers → Email → "Confirm email"** → desactívalo.

Si lo dejas activado, cada persona deberá revisar su correo y confirmar antes
de poder iniciar sesión la primera vez.

## 4. Instalar y correr localmente

```bash
npm install
npm run dev
```

Abre http://localhost:3000 — deberías ver la pantalla de login/crear cuenta.

## 5. Desplegar en Vercel para que todo el equipo lo use

1. Sube este proyecto a un repositorio de GitHub.
2. Entra a https://vercel.com → **New Project** → importa el repositorio.
3. En **Environment Variables**, agrega las mismas dos variables de `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Despliega. Vercel te da un dominio (ej. `mop-os.vercel.app`) — ese es el link
   que compartes con todo el equipo. HTTPS, backups y actualizaciones quedan
   incluidos automáticamente.

## 6. Cómo funciona el acceso compartido del equipo

- Cualquier persona con el link puede crear su cuenta (pestaña "Crear cuenta"),
  eligiendo su rol.
- Todos los usuarios autenticados ven **los mismos proyectos** — es una sola
  base de datos compartida, no una por usuario.
- Los cambios de cualquier persona (mover una tarjeta, marcar una tarea,
  comentar) aparecen para los demás en segundos gracias a Supabase Realtime,
  sin recargar la página.
- Todo se guarda automáticamente; no existe botón "Guardar".

## 7. Próximos pasos sugeridos

- Restringir permisos por rol de verdad (hoy cualquier usuario autenticado
  puede editar todo). Se ajusta cambiando las políticas RLS en `schema.sql`,
  por ejemplo comparando `role` en `profiles` antes de permitir `update`/`delete`.
- Agregar recuperación de contraseña (`supabase.auth.resetPasswordForEmail`).
- Módulos adicionales (Cronograma, Inventario, Finanzas, etc.) como nuevas
  rutas dentro de `app/`, reutilizando el mismo cliente de Supabase.
