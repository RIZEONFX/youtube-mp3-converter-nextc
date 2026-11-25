# Wavecut — YouTube → MP3 Converter

Wavecut adalah frontend untuk mengubah video YouTube yang boleh diunduh menjadi MP3. Wizard memuat informasi video, mengizinkan pengeditan metadata ID3 dan pemilihan bitrate, menampilkan progres, lalu memberikan tautan unduhan. Pemrosesan audio, cover art, dan penyimpanan hasil berjalan di backend Oracle Cloud yang terpisah.

## Menjalankan secara lokal

Gunakan Node.js 20.9+ dan npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Isi `NEXT_PUBLIC_API_BASE_URL` di `.env.local` dengan URL backend sebenarnya sebelum mencoba konversi. URL di `.env.example` hanya contoh. `NEXT_PUBLIC_API_TIMEOUT_MS` bersifat opsional dan default-nya 60000 milidetik. Buka `http://localhost:3000`. Variabel berawalan `NEXT_PUBLIC_` dikirim ke browser; jangan isi dengan kredensial.

## Deploy ke Netlify

Hubungkan repositori ke Netlify. `netlify.toml` memakai `npm run build`, direktori `.next`, dan adapter `@netlify/plugin-nextjs` dengan output Next.js default. Untuk konfigurasi frontend di dashboard: Open Manage and search for 'environment variables'. Gunakan URL backend HTTPS untuk `NEXT_PUBLIC_API_BASE_URL` di konteks deploy yang relevan. Redeploy jika nilai `NEXT_PUBLIC_` berubah karena Next.js menyertakannya saat build.

Backend perlu mengizinkan origin lokal dan origin Netlify yang digunakan, termasuk deploy preview jika diperlukan. Untuk preflight CORS, izinkan `GET`, `POST`, `OPTIONS`, dan header `Content-Type`. Endpoint download harus mengirim `Content-Type: audio/mpeg` serta `Content-Disposition: attachment` dengan nama file yang diinginkan. Sertakan `Access-Control-Expose-Headers: Content-Disposition` jika header tersebut perlu dibaca oleh JavaScript; unduhan Wavecut sendiri menggunakan tautan langsung.

## Integrasi API

| Endpoint | Pemakaian frontend |
| --- | --- |
| `POST /api/info` | Memuat preview video dan opsi bitrate; cache 5 menit per URL. |
| `POST /api/process` | Mengirim URL, metadata, dan bitrate (`auto` atau opsi dari backend); menerima ID job. |
| `GET /api/jobs/{jobId}` | Polling setiap 1,5 detik sampai terminal; setelah 10 menit status diperiksa manual. |
| `GET /api/jobs/{jobId}/download` | Unduh MP3 langsung dari backend. |

## Struktur

- `app/` — App Router, halaman `/`, metadata, ikon, dan tema global.
- `components/wizard/` — empat langkah wizard beserta indikator dan fokus antar-langkah.
- `components/ui/`, `components/layout/` — komponen shadcn/ui, header, dan footer.
- `hooks/` — mutasi serta polling TanStack Query.
- `lib/` — klien REST bertipe, validator Zod, store Zustand, dan helper format.
- `public/` — aset statis.

Next.js, TypeScript, Tailwind CSS, dan shadcn/ui membentuk antarmuka. React Hook Form menangani metadata; `next-themes` menyimpan preferensi tema dan Sonner menyampaikan notifikasi. Aplikasi tidak memiliki auth, riwayat permanen, atau API server sendiri.
