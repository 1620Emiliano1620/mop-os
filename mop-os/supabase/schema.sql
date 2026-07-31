-- ============================================================
-- MOP OS · esquema de Supabase
-- Ejecuta este archivo completo en: Supabase → SQL Editor → New query
-- ============================================================

-- --------- perfiles (uno por usuario, guarda el rol) ---------
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  role text default 'CLIENTE',
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;

create policy "profiles visibles para el equipo autenticado"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "cada usuario crea su propio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "cada usuario edita su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- --------- proyectos ---------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  client text,
  city text,
  responsible text,
  status text default 'verde',
  start_date date,
  delivery_date date,
  progress int default 0,
  description text,
  observations text,
  team text[] default '{}',
  x int default 40,
  y int default 40,
  created_by uuid references auth.users,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.projects enable row level security;

create policy "equipo lee proyectos" on public.projects for select using (auth.role() = 'authenticated');
create policy "equipo crea proyectos" on public.projects for insert with check (auth.role() = 'authenticated');
create policy "equipo edita proyectos" on public.projects for update using (auth.role() = 'authenticated');
create policy "equipo elimina proyectos" on public.projects for delete using (auth.role() = 'authenticated');

-- --------- tareas ---------
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  name text,
  responsible text,
  priority text default 'Media',
  due_date date,
  status text default 'Pendiente',
  progress int default 0,
  created_at timestamptz default now()
);
alter table public.tasks enable row level security;
create policy "equipo administra tareas" on public.tasks for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- --------- checklist ---------
create table if not exists public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  text text,
  done boolean default false,
  created_at timestamptz default now()
);
alter table public.checklist_items enable row level security;
create policy "equipo administra checklist" on public.checklist_items for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- --------- comentarios ---------
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  author text,
  text text,
  created_at timestamptz default now()
);
alter table public.comments enable row level security;
create policy "equipo administra comentarios" on public.comments for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- --------- archivos / fotos (metadatos; el binario vive en Storage) ---------
create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  name text,
  kind text default 'doc', -- 'doc' | 'foto'
  storage_path text,
  created_at timestamptz default now()
);
alter table public.files enable row level security;
create policy "equipo administra archivos" on public.files for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- --------- activar Realtime en las tablas que necesitan sincronización en vivo ---------
alter publication supabase_realtime add table
  public.projects, public.tasks, public.checklist_items, public.comments, public.files;

-- ============================================================
-- Storage: crea el bucket manualmente en Supabase → Storage → New bucket
--   nombre: project-files
--   público: sí (lectura pública para poder mostrar fotos/archivos con una URL directa)
-- Luego aplica esta política para permitir subir/leer solo a usuarios autenticados:
-- ============================================================

insert into storage.buckets (id, name, public)
values ('project-files', 'project-files', true)
on conflict (id) do nothing;

create policy "equipo autenticado sube archivos"
  on storage.objects for insert
  with check (bucket_id = 'project-files' and auth.role() = 'authenticated');

create policy "lectura pública de archivos del proyecto"
  on storage.objects for select
  using (bucket_id = 'project-files');
