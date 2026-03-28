// ---- AOS Init ----
AOS.init({ duration: 700, once: true, offset: 60 });

// ---- Navbar scroll ----
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-link-custom");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);

  // Active link on scroll
  const sections = document.querySelectorAll("section[id]");
  let current = "";
  sections.forEach((sec) => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === "#" + current,
    );
  });

  // Scroll-to-top button
  scrollTopBtn.classList.toggle("show", window.scrollY > 300);
});

// ---- Scroll to top ----
const scrollTopBtn = document.getElementById("scrollTop");
scrollTopBtn.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }),
);

// ---- GLightbox (galería) ----
GLightbox({ selector: ".glightbox", touchNavigation: true, loop: true });

// ---- Formulario de contacto ----
document.getElementById("btnEnviar").addEventListener("click", () => {
  const nombre = document.getElementById("inp-nombre").value.trim();
  const correo = document.getElementById("inp-correo").value.trim();
  const mensaje = document.getElementById("inp-mensaje").value.trim();

  if (!nombre || !correo || !mensaje) {
    alert(
      "Por favor completa los campos requeridos: Nombre, Correo y Mensaje.",
    );
    return;
  }
  if (!/\S+@\S+\.\S+/.test(correo)) {
    alert("Por favor ingresa un correo electrónico válido.");
    return;
  }

  // Simular envío y mostrar toast
  document.getElementById("inp-nombre").value = "";
  document.getElementById("inp-correo").value = "";
  document.getElementById("inp-asunto").value = "";
  document.getElementById("inp-mensaje").value = "";

  const toast = document.getElementById("toast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4000);
});

// ---- Navbar mobile: cerrar al hacer click en enlace ----
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const menu = document.getElementById("navMenu");
    if (menu.classList.contains("show")) {
      bootstrap.Collapse.getInstance(menu)?.hide();
    }
  });
});
