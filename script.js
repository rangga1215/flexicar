/* =========================================
   BAGIAN 1: NAVIGASI & UI (Kode dari Anda)
   ========================================= */

const mobileMenu = document.getElementById("mobile-menu");
const navLinks = document.querySelector(".nav-links");

// Fungsi Toggle Menu Mobile
if (mobileMenu) {
  mobileMenu.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    // Animasi Hamburger (Opsional: mengubah garis menjadi X jika ada CSS terkait)
    mobileMenu.classList.toggle("is-active");
  });
}

// Menutup menu saat salah satu link diklik
document.querySelectorAll(".nav-links li a").forEach((link) => {
  link.addEventListener("click", () => {
    if (navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");
      if (mobileMenu) mobileMenu.classList.remove("is-active");
    }
  });
});

// Efek Scroll Navbar (menambah shadow saat discroll)
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
    } else {
      navbar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    }
  }
});

/* =========================================
   BAGIAN 2: LOGIKA KERANJANG BELANJA & CHECKOUT
   ========================================= */

// 1. Inisialisasi Array untuk menyimpan item
let cart = [];

// --- Fungsi Toggle Modal (Buka/Tutup) ---
function toggleCartModal() {
  const modal = document.getElementById("cartModalOverlay");
  // Cek apakah modal sedang terbuka berdasarkan computed style
  const isCurrentOpen = window.getComputedStyle(modal).display === "flex";

  if (isCurrentOpen) {
    modal.style.display = "none"; // Tutup
  } else {
    modal.style.display = "flex"; // Buka
    renderCartItems(); // Render ulang tampilan saat dibuka
  }
}

// Event Listener: Tutup modal jika area gelap di luar kotak diklik
const modalOverlay = document.getElementById("cartModalOverlay");
if (modalOverlay) {
  modalOverlay.addEventListener("click", function (e) {
    if (e.target === this) {
      toggleCartModal();
    }
  });
}

// --- Fungsi Utama: Menambah Item ke Keranjang ---
// Dipanggil dari HTML: onclick="addToCart('Nama Mobil', Harga)"
function addToCart(carName, carPrice) {
  const newItem = {
    id: Date.now(), // Membuat ID unik berdasarkan waktu
    name: carName,
    price: carPrice,
  };

  cart.push(newItem);

  updateCartCounter(); // Update angka di ikon

  // Opsional: Render ulang jika modal sedang terbuka
  const modal = document.getElementById("cartModalOverlay");
  if (window.getComputedStyle(modal).display === "flex") {
    renderCartItems();
  }

  // Notifikasi sederhana
  alert(`"${carName}" berhasil ditambahkan ke keranjang!`);
}

// --- Fungsi Hapus Item dari Keranjang ---
function removeFromCart(itemId) {
  // Filter array cart, hanya sisakan item yang ID-nya TIDAK sama dengan yang dihapus
  cart = cart.filter((item) => item.id !== itemId);

  updateCartCounter();
  renderCartItems();
}

// --- Fungsi Update Counter di Ikon Melayang ---
function updateCartCounter() {
  const countElement = document.getElementById("cartCount");
  if (countElement) {
    countElement.textContent = cart.length;
  }
}

// --- Fungsi Render (Menampilkan) Daftar Item di Modal ---
function renderCartItems() {
  const cartListContainer = document.getElementById("cartItemsList");
  const totalAmountElement = document.getElementById("cartTotalAmount");

  // Safety check agar tidak error jika elemen belum dimuat
  if (!cartListContainer || !totalAmountElement) return;

  // Bersihkan tampilan lama
  cartListContainer.innerHTML = "";

  if (cart.length === 0) {
    cartListContainer.innerHTML =
      '<p class="empty-cart-msg">Keranjang masih kosong.</p>';
    totalAmountElement.textContent = "Rp 0";
    return;
  }

  let totalDailyPrice = 0;

  // Loop melalui setiap item di array cart
  cart.forEach((item) => {
    totalDailyPrice += item.price;

    const itemElement = document.createElement("div");
    itemElement.classList.add("cart-item");
    // Menggunakan template literals (backticks `) untuk HTML string
    itemElement.innerHTML = `
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>Rp ${item.price.toLocaleString("id-ID")}</p>
            </div>
            <div class="btn-remove-item" onclick="removeFromCart(${
              item.id
            })" title="Hapus Item">
                <i class="fas fa-trash-alt"></i>
            </div>
        `;
    cartListContainer.appendChild(itemElement);
  });

  // Update total harga
  totalAmountElement.textContent =
    "Rp " + totalDailyPrice.toLocaleString("id-ID");
}

// --- FUNGSI CHECKOUT KE WHATSAPP ---
function checkoutWA() {
  // 1. Validasi Keranjang Kosong
  if (cart.length === 0) {
    alert("Keranjang Anda kosong! Silakan pilih mobil terlebih dahulu.");
    return;
  }

  // 2. Ambil data dari form di modal (sesuai ID di HTML terakhir)
  const nama = document.getElementById("co-nama").value;
  const wa = document.getElementById("co-wa").value;
  const tglMulai = document.getElementById("co-tgl-mulai").value;
  const tglSelesai = document.getElementById("co-tgl-selesai").value;

  // 3. Validasi Form (Wajib diisi)
  if (!nama || !wa || !tglMulai || !tglSelesai) {
    alert("Mohon lengkapi data Nama, WhatsApp, dan Tanggal Sewa.");
    return;
  }

  // 4. Susun Daftar Item untuk Pesan WA
  let itemListString = "";
  let totalDaily = 0;
  cart.forEach((item, index) => {
    // %0a digunakan untuk membuat baris baru di URL WhatsApp
    itemListString += `${index + 1}. ${
      item.name
    } - Rp ${item.price.toLocaleString("id-ID")}/hari%0a`;
    totalDaily += item.price;
  });

  // 5. KONFIGURASI NOMOR ADMIN
  // GANTI DENGAN NOMOR WA ANDA (Format internasional tanpa '+')
  const NOMOR_WA_ADMIN = "6281273298780";

  // 6. Susun Pesan Akhir
  const pesan =
    `Halo Admin FlexiCar, saya ingin memesan:%0a%0a` +
    `👤 *DATA PEMESAN*%0a` +
    `Nama: ${nama}%0a` +
    `No WA: ${wa}%0a` +
    `Tanggal: ${tglMulai} s/d ${tglSelesai}%0a%0a` +
    `🚗 *DETAIL UNIT*%0a` +
    `${itemListString}%0a` +
    `💰 *Total Estimasi (Harian):* Rp ${totalDaily.toLocaleString(
      "id-ID"
    )}%0a%0a` +
    `Mohon info ketersediaan dan rekening pembayaran. Terima kasih.`;

  // 7. Buka Link WhatsApp di tab baru
  // encodeURIComponent memastikan karakter khusus di pesan aman untuk URL
  const urlWA = `https://wa.me/${NOMOR_WA_ADMIN}?text=${pesan}`;
  window.open(urlWA, "_blank");

  // Opsional: Tutup modal setelah klik tombol pesan
  toggleCartModal();
}
