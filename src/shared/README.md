# Komponen Bersama

## Gambaran Umum

Direktori `shared` berisi komponen UI yang dapat digunakan kembali yang digunakan di berbagai fitur aplikasi. Komponen-komponen ini, seperti bilah navigasi dan footer, memiliki struktur MVP (Model-View-Presenter) sendiri, memastikan mereka mandiri dan mudah dipelihara. Pendekatan ini mendorong penggunaan kembali kode dan pengalaman pengguna yang konsisten di seluruh aplikasi.

## Model

### `NavbarModel.js`

`NavbarModel` bertanggung jawab untuk mengelola data dan status untuk bilah navigasi aplikasi.

- **Tanggung Jawab**:
    - Menyimpan nama merek aplikasi.
    - Mendefinisikan tautan navigasi yang harus ditampilkan di bilah navigasi, termasuk teks dan URL tujuannya.
    - Menyediakan nama merek yang dibagi menjadi dua bagian (`Aurea` dan `Voice`) untuk tujuan penataan gaya.

### `FooterModel.js`

`FooterModel` mengelola konten dan data untuk footer aplikasi.

- **Tanggung Jawab**:
    - Menyimpan nama merek aplikasi dan deskripsi singkat.
    - Mendefinisikan berbagai bagian tautan di footer, seperti tautan internal, tautan komunitas, dan sumber daya.
    - Menghasilkan teks hak cipta, secara otomatis memperbarui tahun.
    - Menyimpan elemen teks latar belakang (`AUREAVOICE`) yang digunakan untuk penataan gaya dekoratif di footer.

## Presenter

### `NavbarPresenter.js`

`NavbarPresenter` bertindak sebagai pengontrol untuk bilah navigasi.

- **Tanggung Jawab**:
    - Menginisialisasi `NavbarView` dengan data dari `NavbarModel`.
    - Mengelola siklus hidup bilah navigasi, termasuk memasang dan melepasnya dari DOM.
    - Memastikan bahwa bilah navigasi dirender dengan benar dan datanya mutakhir.

### `FooterPresenter.js`

`FooterPresenter` adalah pengontrol untuk footer aplikasi.

- **Tanggung Jawab**:
    - Menginisialisasi `FooterView` dengan data dari `FooterModel`.
    - Mengelola pemasangan dan pelepasan footer.
    - Menyediakan metode untuk memperbarui konten footer secara dinamis, seperti mengubah nama merek atau deskripsi.

## Cuplikan Kode Penting

`NavbarView.js` berisi bagian kode sederhana namun penting yang meningkatkan pengalaman pengguna dengan membuat bilah navigasi interaktif dan responsif terhadap pengguliran pengguna.

```javascript
// src/shared/views/NavbarView.js

bindScrollEvent() {
  const navContainer = this.element.querySelector('.nav-container');
  const dashboardNav = this.element;
  if (!navContainer || !dashboardNav) return;

  this.scrollHandler = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 50) {
      navContainer.classList.add('scrolled');
      dashboardNav.classList.add('scrolled');
    } else {
      navContainer.classList.remove('scrolled');
      dashboardNav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', this.scrollHandler);
}
```

Cuplikan ini signifikan karena menunjukkan:
- **Penataan Gaya Dinamis**: Ini menambah atau menghapus kelas `scrolled` ke bilah navigasi berdasarkan posisi gulir pengguna. Ini memungkinkan CSS untuk menerapkan gaya yang berbeda ketika bilah navigasi berada di bagian atas halaman dibandingkan ketika digulir ke bawah (misalnya, mengubah latar belakang dari transparan menjadi padat).
- **Penanganan Acara yang Efisien**: Penanganan gulir hanya terikat sekali ketika bilah navigasi dipasang dan dilepas dengan benar ketika dilepas, mencegah kebocoran memori.
- **Pengalaman Pengguna yang Ditingkatkan**: Fitur kecil ini memberikan nuansa yang halus dan profesional pada aplikasi, karena bilah navigasi dengan anggun mengubah penampilannya saat pengguna berinteraksi dengan halaman.

### `NavbarView.js`

`NavbarView` bertanggung jawab untuk merender HTML untuk bilah navigasi.

- **Tanggung Jawab**:
    - Membuat struktur HTML untuk bilah navigasi, termasuk logo dan tombol navigasi.
    - Mengikat pendengar acara gulir ke jendela untuk menambahkan kelas `scrolled` ke bilah navigasi ketika pengguna menggulir ke bawah, memungkinkan penataan gaya dinamis (misalnya, transisi latar belakang transparan-ke-padat).
    - Menangani klik pada tautan navigasi, mendelegasikan tindakan navigasi ke perilaku default browser untuk perubahan rute.

### `FooterView.js`

`FooterView` merender HTML untuk footer aplikasi.

- **Tanggung Jawab**:
    - Membuat struktur HTML lengkap untuk footer, termasuk informasi merek, kolom tautan, dan pemberitahuan hak cipta.
    - Menyediakan metode untuk memperbarui bagian tertentu dari konten footer, seperti nama merek atau deskripsi, tanpa perlu merender ulang seluruh komponen.