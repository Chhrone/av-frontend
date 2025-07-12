# Gaya

## Cuplikan Kode Penting

File `color-global.css` adalah landasan identitas visual aplikasi. Dengan mendefinisikan seluruh palet warna sebagai properti kustom CSS, ini memungkinkan tema yang mudah dan memastikan konsistensi di semua komponen.

```css
/* src/styles/color-global.css */

:root {
  /* Primary Brand Colors */
  --color-primary: #0d9488; /* Teal tone for more vibrancy */
  --color-primary-dark: #0f766e; /* Darker teal */
  --color-primary-light: #f0fdfa; /* Light teal background */
  --color-primary-gradient: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
  
  /* Secondary/Accent Colors */
  --color-secondary: #b91c1c; /* Stronger red for clarity and contrast */

  /* ... other color variables ... */

  /* Text Colors */
  --color-text-main: #1e293b;
  --color-text-secondary: #64748b;
  --color-text-accent: #0d9488;
}
```

Cuplikan ini sangat penting karena menunjukkan:
- **Tema Terpusat**: Semua warna didefinisikan di satu tempat, membuatnya mudah untuk memperbarui tampilan dan nuansa aplikasi. Mengubah satu variabel di sini akan menyebarkan perubahan ke seluruh aplikasi.
- **Penamaan Semantik**: Variabel diberi nama secara semantik (misalnya, `--color-primary`, `--color-text-main`), yang membuat kode lebih mudah dibaca dan dipahami.
- **Dapat Digunakan Kembali**: Variabel-variabel ini dapat dengan mudah digunakan kembali di file CSS lainnya, memastikan bahwa skema warna diterapkan secara konsisten di mana-mana.
- **Pemeliharaan**: Pendekatan ini secara signifikan meningkatkan pemeliharaan basis kode. Alih-alih mencari dan mengganti kode hex di beberapa file, pengembang cukup memperbarui file tema pusat.

Direktori `styles` berisi file CSS global yang mendefinisikan tampilan visual aplikasi. Penataan gaya diatur ke dalam file terpisah berdasarkan kepentingannya, seperti warna, tata letak, dan animasi. Pendekatan modular ini membuat CSS lebih mudah dikelola dan dipelihara.

Aplikasi ini menggunakan palet warna kustom yang didefinisikan dalam `color-global.css` dan estetika desain modern yang bersih dengan fokus pada pengalaman pengguna. Gaya dirancang agar responsif, memastikan bahwa aplikasi terlihat bagus di berbagai perangkat, dari ponsel hingga monitor desktop.

### `animations.css`

File ini berisi semua animasi keyframe yang digunakan di seluruh aplikasi.

- **Tujuan**: Untuk mendefinisikan animasi yang dapat digunakan kembali untuk indikator pemuatan, status perekaman, dan elemen UI dinamis lainnya.
- **Animasi Utama**:
    - `recording-pulse`: Animasi berdenyut yang digunakan untuk menunjukkan bahwa perekaman sedang berlangsung.
    - `loading-spin`: Animasi berputar sederhana untuk status pemuatan.

### `base.css`

File ini mengatur gaya dasar untuk seluruh aplikasi.

- **Tujuan**: Untuk membangun fondasi yang konsisten untuk tipografi, warna latar belakang, dan gaya global lainnya.
- **Cara kerjanya**:
    - Ini mengimpor font `Inter` dari Google Fonts, yang digunakan sebagai font utama untuk aplikasi.
    - Ini mencakup reset CSS untuk memastikan rendering yang konsisten di berbagai browser.
    - Ini mendefinisikan gaya default untuk elemen `body`, termasuk warna latar belakang dan warna teks.
    - Ini juga mencakup gaya bilah gulir kustom agar sesuai dengan tema aplikasi.

### `color-global.css`

File ini mendefinisikan palet warna global untuk aplikasi menggunakan properti kustom CSS (variabel).

- **Tujuan**: Untuk menyediakan satu sumber kebenaran untuk semua warna yang digunakan dalam aplikasi, membuatnya mudah untuk mempertahankan skema warna yang konsisten.
- **Cara kerjanya**: Ini mendefinisikan serangkaian variabel CSS untuk warna primer, sekunder, latar belakang, teks, dan lainnya. Variabel-variabel ini kemudian digunakan di seluruh file CSS lainnya.

### `components.css`

File ini dimaksudkan untuk menampung gaya untuk komponen global, non-fitur-spesifik. Dalam struktur saat ini, sebagian besar kosong karena sebagian besar gaya komponen didefinisikan dalam file CSS fitur masing-masing.

### `footer.css`

File ini berisi semua gaya untuk komponen footer bersama aplikasi.

- **Tujuan**: Untuk mendefinisikan tata letak, tipografi, dan perilaku responsif footer.
- **Cara kerjanya**: Ini menggunakan kombinasi Flexbox dan CSS Grid untuk membuat tata letak responsif yang beradaptasi dengan berbagai ukuran layar. Ini juga mencakup gaya untuk teks footer, tautan, dan teks latar belakang dekoratif.

### `layout.css`

File ini dimaksudkan untuk gaya tata letak global yang tidak spesifik untuk fitur apa pun. Mirip dengan `components.css`, saat ini minimal karena sebagian besar gaya tata letak ditangani dalam CSS khusus fitur.

### `responsive.css`

File ini dimaksudkan untuk gaya responsif global. Saat ini minimal, dengan sebagian besar desain responsif ditangani dalam file CSS untuk setiap fitur dan komponen bersama.

### `transitions.css`

File ini mengelola transisi tampilan aplikasi.

- **Tujuan**: Untuk memberikan transisi animasi yang mulus antara tampilan yang berbeda, meningkatkan pengalaman pengguna.
- **Cara kerjanya**: 
    - Ini mengaktifkan View Transition API asli browser untuk navigasi SPA (Single Page Application) yang mulus.
    - Ini menyediakan animasi memudar sederhana sebagai cadangan untuk browser yang tidak mendukung View Transition API, memastikan pengalaman yang konsisten, meskipun lebih sederhana, untuk semua pengguna.