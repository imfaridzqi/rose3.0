# Project Setup Planning — rose3.0

## Overview

Proyek ini menggunakan arsitektur **monorepo** dengan dua folder utama:
- `backend/` — API server
- `frontend/` — UI web app

---

## Struktur Folder

```
rose3.0/
├── backend/
│   ├── src/
│   │   ├── db/          # koneksi & schema Drizzle
│   │   ├── routes/      # endpoint ElysiaJS
│   │   ├── middlewares/
│   │   └── index.ts     # entry point
│   ├── drizzle.config.ts
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # UI components (shadcn, custom)
│   │   ├── pages/       # halaman / views
│   │   ├── stores/      # Zustand state
│   │   ├── hooks/       # custom hooks (react-query, form)
│   │   ├── lib/         # utils, cn helper, api client
│   │   └── main.tsx
│   ├── tailwind.config.ts
│   └── package.json
│
└── issue.md
```

---

## Backend Setup

### 1. Init project dengan Bun

```bash
mkdir backend && cd backend
bun init
```

### 2. Install dependencies

```bash
bun add elysia @elysiajs/cors drizzle-orm mysql2 zod pino dotenv
bun add -d drizzle-kit
```

### 3. Setup `.env`

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=rose3_0
PORT=3000
```

### 4. Koneksi Database (Drizzle + MySQL)

File: `src/db/index.ts`
- Buat koneksi MySQL pakai `mysql2`
- Inisialisasi Drizzle ORM dengan koneksi tersebut

### 5. Buat Schema

File: `src/db/schema.ts`
- Definisikan tabel pakai sintaks Drizzle (mirip TypeScript object)
- Contoh: tabel `users` dengan field `id`, `name`, `email`, `created_at`

### 6. Konfigurasi drizzle-kit

File: `drizzle.config.ts`
- Arahkan ke file schema & koneksi DB
- Digunakan untuk generate & run migration via CLI

```bash
bun drizzle-kit generate   # generate file migrasi
bun drizzle-kit migrate    # jalankan migrasi ke DB
```

### 7. Setup ElysiaJS

File: `src/index.ts`
- Inisialisasi app Elysia
- Pasang plugin CORS (`@elysiajs/cors`)
- Pasang logger Pino
- Daftarkan semua routes
- Jalankan server di port dari `.env`

### 8. Buat Route

File: `src/routes/[nama].ts`
- Setiap resource (misal: `users`, `products`) punya file route sendiri
- Validasi input pakai **Zod**
- Handler berisi logika query ke DB via Drizzle

---

## Frontend Setup

### 1. Init project dengan Vite + React + TypeScript

```bash
bun create vite frontend --template react-ts
cd frontend
```

### 2. Install dependencies

```bash
bun add tailwindcss @tailwindcss/vite framer-motion three zustand
bun add @tanstack/react-query @tanstack/react-table
bun add react-hook-form @hookform/resolvers zod
bun add lucide-react clsx tailwind-merge class-variance-authority tailwindcss-animate
```

### 3. Setup Tailwind CSS

- Konfigurasi `tailwind.config.ts` dengan path ke semua file `src/**`
- Tambahkan plugin `tailwindcss-animate`
- Import Tailwind di `src/index.css`

### 4. Setup shadcn/ui

```bash
bunx shadcn@latest init
```

- Pilih style, warna, dan path alias (`@/`)
- Setelah init, tambah komponen dengan: `bunx shadcn@latest add button`

### 5. Helper `cn()`

File: `src/lib/utils.ts`
- Buat fungsi `cn()` gabungan `clsx` + `tailwind-merge`
- Dipakai di semua komponen untuk kondisional class Tailwind

```ts
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs) { return twMerge(clsx(inputs)) }
```

### 6. Setup API Client

File: `src/lib/api.ts`
- Buat fungsi fetch ke backend (base URL dari env `VITE_API_URL`)
- Semua request API melewati file ini

### 7. Setup React Query

File: `src/main.tsx`
- Bungkus app dengan `QueryClientProvider`
- Buat custom hooks per resource di `src/hooks/` (misal: `useUsers.ts`)

### 8. Setup Zustand

File: `src/stores/[nama].ts`
- Buat store per domain (misal: `useAuthStore`, `useUIStore`)
- Simpan state global yang perlu diakses banyak komponen

### 9. Setup Form

- Pakai `react-hook-form` + `zodResolver` untuk validasi form
- Schema validasi didefinisikan dengan **Zod**, bisa dishare dengan backend

### 10. Three.js & Framer Motion

- **Three.js**: dipakai untuk elemen 3D/visual interaktif, bungkus dalam komponen tersendiri di `src/components/three/`
- **Framer Motion**: dipakai untuk animasi UI (page transition, reveal, hover effect)

---

## Checklist

### Backend
- [ ] `bun init` di folder `backend/`
- [ ] Install semua dependencies backend
- [ ] Buat file `.env`
- [ ] Setup koneksi DB di `src/db/index.ts`
- [ ] Buat schema di `src/db/schema.ts`
- [ ] Konfigurasi `drizzle.config.ts`
- [ ] Jalankan migrasi DB
- [ ] Setup server Elysia di `src/index.ts`
- [ ] Buat minimal 1 route sebagai contoh

### Frontend
- [ ] `bun create vite` di folder `frontend/`
- [ ] Install semua dependencies frontend
- [ ] Setup Tailwind CSS
- [ ] Init shadcn/ui
- [ ] Buat `src/lib/utils.ts` dengan fungsi `cn()`
- [ ] Buat `src/lib/api.ts`
- [ ] Setup `QueryClientProvider` di `main.tsx`
- [ ] Buat 1 Zustand store sebagai contoh
- [ ] Buat 1 form dengan react-hook-form + zod sebagai contoh

---

## Catatan Penting

- Selalu gunakan **TypeScript** di kedua sisi (backend & frontend)
- Jangan hardcode nilai apapun — semua config lewat `.env`
- Validasi input **selalu** pakai Zod, baik di backend (route) maupun frontend (form)
- Komponen UI yang bisa dipakai ulang taruh di `src/components/ui/` (shadcn)
- Komponen custom taruh di `src/components/` dengan subfolder per domain
