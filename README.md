# MISI BERBUDI — Serang Investment Journey

Frontend publik untuk menyusun profil minat investasi Kota Serang sebagai perjalanan interaktif, bukan formulir konvensional.

## Arsitektur

- **GitHub** adalah source of truth dan tempat seluruh perubahan aplikasi dikelola.
- **Cloudflare Pages** menyajikan frontend publik dan otomatis mendeploy setiap perubahan pada branch `main` melalui Git integration.
- **Google Apps Script** tetap menjadi backend untuk validasi server, pencatatan Google Sheets, scoring internal, notifikasi, dan dashboard petugas.
- Tidak ada Firebase SDK, Firestore, database, atau secret admin di frontend.
- Pengelolaan harian tidak memerlukan VS Code atau terminal; perubahan cukup dilakukan pada repository GitHub.

## Pengalaman pengguna

Perjalanan terdiri dari enam checkpoint:

1. **Visi** — bidang usaha dan ide proyek.
2. **Arah** — investasi baru, ekspansi, relokasi, atau kemitraan.
3. **Lokasi** — enam kecamatan Kota Serang atau bantuan pencarian lokasi.
4. **Dampak** — estimasi nilai investasi dan tenaga kerja.
5. **Dukungan** — fasilitasi yang dibutuhkan dan kendala utama.
6. **Profil** — ringkasan otomatis dan kontak investor.

Bahasa Indonesia menjadi default dan seluruh antarmuka dapat dialihkan ke English.

## Ketahanan submit

Versi migrasi memperbaiki pengalaman submit dengan:

- idempotency token untuk mencegah duplikasi saat retry;
- hidden honeypot;
- draft lokal yang tidak dihapus sebelum backend mengonfirmasi sukses;
- `requestId` per pengiriman;
- callback `postMessage` yang diverifikasi;
- status **belum terkonfirmasi** saat backend lambat, bukan langsung menganggap gagal;
- retry menggunakan idempotency token yang sama;
- tombol submit dikunci saat request aktif.

> Catatan: frontend tidak boleh menyimpan kunci admin atau credential Google.

## Struktur

```text
misiberbudi/
├── index.html
├── styles.css
├── app.js
├── config.js
├── 404.html
├── .nojekyll
└── apps-script/
    └── FirebaseBridge.gs
```

## Deploy Cloudflare Pages

Gunakan Git integration langsung dari Cloudflare Dashboard:

- Repository: `nrwtkd/misiberbudi`
- Production branch: `main`
- Framework preset: None
- Build command: kosong
- Build output directory: `.`

Cloudflare Pages akan otomatis deploy ulang setiap ada commit baru di `main`. Nama project disarankan `misiberbudi`, sehingga URL default menjadi `https://misiberbudi.pages.dev/` bila nama tersebut tersedia.

## Hubungkan Apps Script

1. Buka project Apps Script backend yang terhubung dengan spreadsheet investor.
2. Salin/selaraskan `apps-script/FirebaseBridge.gs` ke project tersebut.
3. Deploy sebagai **Web app** dan gunakan URL deployment yang berakhiran `/exec`.
4. Masukkan URL tersebut ke `config.js` pada `appsScriptUrl`.
5. Origin Cloudflare `https://misiberbudi.pages.dev` sudah disiapkan pada bridge.

## Prinsip tata kelola

- Skor prioritas hanya untuk petugas dan tidak tampil di frontend investor.
- Visual wilayah bersifat eksploratif, bukan peta batas administratif resmi.
- Draft hanya disimpan di browser pengguna dan dihapus setelah submit terkonfirmasi.
- Akses edit Spreadsheet dan Apps Script hanya untuk petugas berwenang.
- Kebijakan privasi/retensi data perlu mengikuti ketentuan instansi.
