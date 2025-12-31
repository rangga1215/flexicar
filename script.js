const mobileMenu = document.getElementById("mobile-menu");
const navLinks = document.querySelector(".nav-links");

// Fungsi Toggle Menu Mobile
mobileMenu.addEventListener("click", () => {
  navLinks.classList.toggle("active");

  // Animasi Hamburger (Opsional: mengubah garis menjadi X)
  mobileMenu.classList.toggle("is-active");
});

// Menutup menu saat salah satu link diklik
document.querySelectorAll(".nav-links li a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

// Efek Scroll Navbar (Opsional: menambah shadow saat discroll)
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
  } else {
    navbar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
  }
});
