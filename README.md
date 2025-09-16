# Take Home Test Adhivasindo

REST API untuk take home test dari PT. Adhikari Inovasi Indonesia (Adhivasindo) menggunakan Express.js, TypeScript, dan Prisma dengan PostgreSQL.

## 📋 Prerequisites

Sebelum menjalankan aplikasi, pastikan Anda telah menginstall:

- [Node.js](https://nodejs.org/) (versi 22 atau lebih baru)
- [PostgreSQL](https://www.postgresql.org/) (versi 16 atau lebih baru)
- [Git](https://git-scm.com/)

## 🚀 Instalasi

1. **Clone repository:**

    ```bash
    git clone https://github.com/RizkiGunawan23/take-home-test-adhivasindo.git
    cd take-home-test-adhivasindo
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Setup environment variables:**
    - Copy file `.env` dan sesuaikan dengan konfigurasi database Anda:

    ```env
    PORT=3000
    DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
    ```

    **Catatan:** Ganti `username`, `password`, dan `database_name` sesuai dengan setup PostgreSQL Anda.

## 🗄️ Setup Database

1. **Buat database PostgreSQL:**

    ```sql
    CREATE DATABASE adhivasindo_rizki_db;
    ```

2. **Jalankan migrasi Prisma:**

    ```bash
    npx prisma migrate dev --name init
    ```

3. **Generate Prisma Client:**

    ```bash
    npx prisma generate
    ```

4. **Jalankan seeder (opsional, untuk data awal):**

    ```bash
    npx prisma db seed
    ```

    Seeder akan membuat 3 user contoh:
    - Admin: `admin@example.com` / `Admin123`
    - User1: `user1@example.com` / `User1234`

## 🏃‍♂️ Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000` dengan hot reload.

### Production Mode

````bash
npm run build
npm start
```

## 📁 Struktur Proyek

````

take-home-test-adhivasindo/
├── src/
│ ├── index.ts # Entry point aplikasi
│ ├── schemas/ # Validasi schema (Zod)
│ └── ...
├── prisma/
│ ├── schema.prisma # Schema database Prisma
│ ├── seed.ts # Seeder untuk data awal
│ └── migrations/ # File migrasi database
├── generated/ # Prisma Client (generated)
├── .env # Environment variables
├── package.json
├── tsconfig.json
└── README.md

````

## 🛠️ Scripts yang Tersedia

- `npm run dev` - Jalankan aplikasi dalam mode development
- `npm run build` - Build aplikasi untuk production
- `npm run start` - Jalankan aplikasi production
- `npm run type-check` - Cek type TypeScript
- `npm run lint` - Jalankan ESLint
- `npm run lint:fix` - Perbaiki error ESLint otomatis
- `npm run format` - Format kode dengan Prettier
- `npm run format:check` - Cek format kode

## 🔧 Konfigurasi Tambahan

### Prisma Studio

Untuk melihat dan mengelola data database:

```bash
npx prisma studio
````

Akses di `http://localhost:5555`
