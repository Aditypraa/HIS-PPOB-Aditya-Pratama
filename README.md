<div align="center">

# 🌟 HIS PPOB - Aditya Pratama 🌟

![Shield.io Badge](https://img.shields.io/badge/Dibuat%20dengan-React-61DBFB?style=for-the-badge&logo=react)
![Shield.io Badge](https://img.shields.io/badge/Status-Selesai-success?style=for-the-badge)

<p>
Aplikasi Payment Point Online Bank (PPOB) modern yang dibangun dengan React.js yang memungkinkan pengguna mengelola profil, top up saldo, melakukan pembayaran untuk berbagai layanan, dan melihat riwayat transaksi.
</p>

![HIS PPOB Banner](https://github.com/user-attachments/assets/594912d0-6df2-496d-9cc8-4838e9163f87)

</div>

## 📋 Fitur Utama

<div align="center">
<table>
  <tr>
    <td align="center">
      <img src="https://img.icons8.com/color/48/000000/user-credentials.png" alt="Authentication"/><br/>
      <b>Autentikasi Pengguna</b>
    </td>
    <td align="center">
      <img src="https://img.icons8.com/color/48/000000/dashboard-layout.png" alt="Dashboard"/><br/>
      <b>Dashboard</b>
    </td>
    <td align="center">
      <img src="https://img.icons8.com/color/48/000000/gender-neutral-user.png" alt="Profile"/><br/>
      <b>Manajemen Profil</b>
    </td>
    <td align="center">
      <img src="https://img.icons8.com/color/48/000000/money-transfer.png" alt="Financial"/><br/>
      <b>Fungsi Keuangan</b>
    </td>
  </tr>
</table>
</div>

### 🔐 Autentikasi Pengguna

- **Registrasi** dengan validasi formulir yang komprehensif
- **Login** dengan manajemen sesi untuk pengalaman yang aman

### 📊 Dashboard

- Tampilan data profil pengguna yang informatif
- Informasi saldo terkini yang selalu diperbarui
- Daftar layanan yang tersedia untuk pembayaran
- Slider banner interaktif untuk promosi

### 👤 Manajemen Profil

- Lihat informasi profil lengkap
- Perbarui data profil dengan mudah
- Upload foto profil (maksimal 100kb)

### 💰 Fungsi Keuangan

- Top up saldo (minimal Rp 10.000, maksimal Rp 1.000.000)
- Pembayaran berbagai layanan dengan cepat
- Riwayat transaksi dengan pagination untuk penelusuran mudah

## 🛠️ Teknologi yang Digunakan

<div align="center">
<table>
  <tr>
    <td align="center"><img src="https://img.icons8.com/plasticine/48/000000/react.png" alt="React.js"/><br/>React 19</td>
    <td align="center"><img src="https://img.icons8.com/color/48/000000/typescript.png" alt="TypeScript"/><br/>TypeScript</td>
    <td align="center"><img src="https://img.icons8.com/color/48/000000/tailwindcss.png" alt="Styling"/><br/>Tailwind CSS</td>
    <td align="center"><img src="https://img.icons8.com/color/48/000000/api-settings.png" alt="HTTP Client"/><br/>Axios</td>
  </tr>
  <tr>
    <td align="center"><img src="https://img.icons8.com/color/48/000000/roads.png" alt="React Router"/><br/>React Router</td>
    <td align="center"><img src="https://img.icons8.com/color/48/000000/vite.png" alt="Vite"/><br/>Vite</td>
    <td align="center"><img src="https://img.icons8.com/color/48/000000/feather.png" alt="Icons"/><br/>Lucide React</td>
    <td align="center"><img src="https://img.icons8.com/color/48/000000/code.png" alt="Code"/><br/>ESLint</td>
  </tr>
</table>
</div>

## 📱 Tangkapan Layar

<div align="center">
  <img src="https://github.com/user-attachments/assets/34f2e021-7e82-4a53-89f2-0f2ddb689e8d" width="45%" alt="Login Screen" style="margin: 5px;"/>
  <img src="https://github.com/user-attachments/assets/49b08177-d31f-467b-997c-9e0794fa1e40" width="45%" alt="Register Screen" style="margin: 5px;"/>

  <img src="https://github.com/user-attachments/assets/4b7d7884-65aa-4550-a3ba-070123c95a7e" width="45%" alt="Home Screen" style="margin: 5px;"/>
  <img src="https://github.com/user-attachments/assets/cf85f702-1a4d-4709-9660-372298f562f7" width="45%" alt="Payment Screen" style="margin: 5px;"/>

  <img src="https://github.com/user-attachments/assets/181822a1-7625-470c-a297-12d91c5a23c8" width="45%" alt="Top Up Screen" style="margin: 5px;"/>
  <img src="https://github.com/user-attachments/assets/3748fff0-6e37-4f9a-b026-1544198f0426" width="45%" alt="Transaction Screen" style="margin: 5px;"/>

  <img src="https://github.com/user-attachments/assets/36519ea5-6174-44df-9fba-60ea01a3bcfd" width="45%" alt="Profile Screen" style="margin: 5px;"/>
</div>

## 🚀 Cara Memulai

### Prasyarat

- Node.js (v14.0.0 atau lebih baru)
- npm atau yarn

### Instalasi

<div class="code-section" style="background-color: #f7f7f7; border-radius: 10px; padding: 15px;">

1. Clone repositori:

```bash
git clone https://github.com/Aditypraa/HIS-PPOB-Aditya-Pratama.git
```

2. Masuk ke direktori proyek:

```bash
cd HIS-PPOB-Aditya-Pratama
```

3. Instal dependensi:

```bash
npm install
# atau
yarn install
```

4. Jalankan server pengembangan:

```bash
npm start
# atau
yarn start
```

5. Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi di browser Anda.
</div>

## 🔗 Referensi API

Aplikasi ini menggunakan endpoint API berikut:

<div class="api-section" style="background-color: #f0f7ff; border-left: 4px solid #3498db; padding: 15px;">

### 🔐 Autentikasi

- `/registration` - Registrasi pengguna baru
- `/login` - Login pengguna

### 👤 Profil Pengguna

- `/profile` - Mendapatkan data profil pengguna
- `/profile/update` - Memperbarui profil pengguna
- `/profile/image` - Memperbarui foto profil

### 💸 Keuangan

- `/balance` - Mendapatkan saldo terkini
- `/topup` - Top up akun
- `/transaction` - Melakukan pembayaran
- `/history` - Mendapatkan riwayat transaksi

### 🛍️ Layanan

- `/services` - Mendapatkan layanan yang tersedia
- `/banner` - Mendapatkan banner promosi
</div>

Untuk dokumentasi API yang lebih detail, kunjungi: [https://api-doc-tht.nutech-integrasi.com](https://api-doc-tht.nutech-integrasi.com)

## 📝 Detail Implementasi

<div class="implementation-section" style="background-color: #f9f9f9; border-radius: 10px; padding: 15px;">

### ✅ Registrasi

- Semua field divalidasi sebelum pengiriman
- Notifikasi sukses/error registrasi ditampilkan berdasarkan respons API

### 🔑 Login

- Manajemen sesi diimplementasikan untuk menyimpan token autentikasi
- Pengalihan ke dashboard setelah login berhasil

### 🏠 Dashboard

- Menampilkan nama pengguna dari endpoint `/profile`
- Menunjukkan saldo dari endpoint `/balance`
- Daftar layanan dari endpoint `/services`
- Menampilkan slider banner dari endpoint `/banner`

### 💹 Top Up

- Memvalidasi jumlah antara Rp 10.000 dan Rp 1.000.000
- Tombol submit dinonaktifkan sampai jumlah yang valid dimasukkan

### 💳 Pembayaran

- Total jumlah pembayaran diambil dari endpoint `/services`
- Menampilkan konfirmasi transaksi yang berhasil

### 📊 Riwayat Transaksi

- Awalnya menampilkan 5 transaksi
- Tombol "Lihat Lainnya" memuat transaksi tambahan menggunakan pagination offset

### 👤 Manajemen Profil

- Foto profil default ditampilkan sampai pengguna mengunggah foto sendiri
- Ukuran upload gambar dibatasi hingga 100kb
- Toggle antara mode lihat dan edit untuk data profil
</div>

## ✨ Kriteria Penilaian

Proyek ini memenuhi kriteria penilaian berikut:

<div class="criteria-section" style="background-color: #eaffea; border-left: 4px solid #2ecc71; padding: 15px;">

1. ✅ Implementasi UI sesuai dengan mockup yang disediakan
2. ✅ Validasi formulir diimplementasikan pada semua field input
3. ✅ Respons API ditangani dengan umpan balik yang sesuai
4. ✅ Organisasi kode yang bersih, terstruktur, dan mudah dipelihara
</div>

## 👤 Penulis

<div align="center" class="author-section" style="background-color: #f5f5f5; border-radius: 10px; padding: 20px; margin-top: 20px;">
  <img src="https://avatars.githubusercontent.com/Aditypraa" width="100px" style="border-radius: 50%;" alt="Author"/>
  <h3>Aditya Pratama</h3>
  <p>Frontend Developer</p>
  
  <div>
    <a href="https://github.com/Aditypraa"><img src="https://img.icons8.com/fluent/48/000000/github.png" width="30px"/></a>
    <a href="https://www.linkedin.com/in/your-linkedin"><img src="https://img.icons8.com/color/48/000000/linkedin.png" width="30px"/></a>
    <a href="https://your-portfolio.com"><img src="https://img.icons8.com/color/48/000000/domain.png" width="30px"/></a>
  </div>
</div>

## 📄 Lisensi

<div class="license-section" style="background-color: #fff9e6; border-left: 4px solid #f39c12; padding: 15px;">

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

</div>

---

<div align="center">
  <p>© 2025 Aditya Pratama</p>
</div>
