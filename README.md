# Take Home Test Adhivasindo

REST API untuk take home test dari PT. Adhikari Inovasi Indonesia (Adhivasindo) menggunakan Express.js, TypeScript, dan Prisma dengan PostgreSQL.

## 📋 Prerequisites

Sebelum menjalankan aplikasi, pastikan Anda telah menginstall:

- [Node.js](https://nodejs.org/) (versi 22 atau lebih baru)
- [PostgreSQL](https://www.postgresql.org/) (versi 16 atau lebih baru)
- [Git](https://git-scm.com/)
- [Postman](https://www.postman.com/) (untuk testing API)

**Catatan:** Project ini sudah menyertakan:

- File backup database (`adhivasindo_rizki_db_backup`)
- Collection Postman (`Take Home Test Adhivasindo.postman_collection.json`) untuk testing API

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

### Opsi 1: Setup Database Baru

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

### Opsi 2: Restore dari Backup Database

Jika Anda ingin menggunakan data yang sudah disiapkan, ikuti langkah berikut:

1. **Buat database PostgreSQL:**

    ```sql
    CREATE DATABASE adhivasindo_rizki_db;
    ```

2. **Restore backup database:**

    ```bash
    psql -U username -d adhivasindo_rizki_db -f adhivasindo_rizki_db_backup
    ```

    **Catatan:** Ganti `username` dengan username PostgreSQL Anda.

3. **Generate Prisma Client:**

    ```bash
    npx prisma generate
    ```

## 🏃‍♂️ Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000` dengan hot reload.

### Production Mode

```bash
npm run build
npm start
```

## 🧪 Testing API dengan Postman

1. **Import Collection Postman:**
    - Buka aplikasi Postman
    - Klik tombol "Import" di kiri atas
    - Pilih tab "File"
    - Upload file `Take Home Test Adhivasindo.postman_collection.json` yang tersedia di root project

2. **Setup Environment (Opsional):**
    - Buat environment baru di Postman
    - Set variable `baseURL` dengan nilai `http://localhost:3000`

3. **Test Endpoint:**

    Collection ini berisi berbagai endpoint untuk testing API, termasuk:
    - Authentication (login, register)
    - User management
    - Student management

    **Catatan:** Pastikan aplikasi sudah berjalan di `http://localhost:3000` sebelum testing.

## 📁 Struktur Proyek

```
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
├── adhivasindo_rizki_db_backup # Backup database PostgreSQL
├── Take Home Test Adhivasindo.postman_collection.json # Collection Postman untuk testing
├── .env # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Scripts yang Tersedia

- `npm run dev` - Jalankan aplikasi dalam mode development
- `npm run build` - Build aplikasi untuk production
- `npm run start` - Jalankan aplikasi production
- `npm run type-check` - Cek type TypeScript
- `npm run lint` - Jalankan ESLint
- `npm run lint:fix` - Perbaiki error ESLint otomatis
- `npm run format` - Format kode dengan Prettier
- `npm run format:check` - Cek format kode

## 🔧 Troubleshooting

### Error Database Connection

- Pastikan PostgreSQL sudah berjalan
- Periksa konfigurasi `DATABASE_URL` di file `.env`
- Pastikan database `adhivasindo_rizki_db` sudah dibuat

### Error saat Restore Backup

- Pastikan Anda memiliki permission untuk membuat database
- Gunakan username PostgreSQL yang benar saat menjalankan `psql`
- Jika error permission, coba jalankan sebagai superuser: `sudo -u postgres psql -d adhivasindo_rizki_db -f adhivasindo_rizki_db_backup`

### Error Port Already in Use

- Pastikan tidak ada aplikasi lain yang menggunakan port 3000
- Atau ubah port di file `.env`: `PORT=3001`

### Error saat Import Postman Collection

- Pastikan file `Take Home Test Adhivasindo.postman_collection.json` tidak rusak
- Coba import ulang atau restart Postman

## 🔧 Konfigurasi Tambahan

### Prisma Studio

Untuk melihat dan mengelola data database:

```bash
npx prisma studio
```

Akses di `http://localhost:5555`
