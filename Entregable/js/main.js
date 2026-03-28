AOS.init({
  duration: 700,
  once: true,
  offset: 80,
});

window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  const btnTop = document.getElementById("btnTop");
  if (btnTop) {
    btnTop.style.display = window.scrollY > 300 ? "block" : "none";
  }
});

// ===========================
// BOTÓN VOLVER ARRIBA
// ===========================

const btnTop = document.createElement("button");
btnTop.id = "btnTop";
btnTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
btnTop.title = "Volver arriba";
btnTop.style.display = "none";
document.body.appendChild(btnTop);

btnTop.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function animarContador(elemento) {
  const target = parseInt(elemento.getAttribute("data-target"));
  const duracion = 1500;
  const paso = target / (duracion / 16);
  let actual = 0;

  const intervalo = setInterval(function () {
    actual += paso;
    if (actual >= target) {
      actual = target;
      clearInterval(intervalo);
    }
    elemento.textContent = Math.floor(actual);
  }, 16);
}

const observador = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const contadores = entry.target.querySelectorAll(".stat-number");
        contadores.forEach(function (counter) {
          animarContador(counter);
        });
        observador.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 },
);

const seccionResultados = document.getElementById("resultados");
if (seccionResultados) {
  observador.observe(seccionResultados);
}

// ===========================
// FORMULARIO DE CONTACTO
// ===========================
function enviarFormulario() {
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();
  const alerta = document.getElementById("form-alerta");

  if (!nombre || !correo || !mensaje) {
    alerta.className = "alert alert-danger";
    alerta.textContent = "Por favor completa todos los campos antes de enviar.";
    alerta.classList.remove("d-none");
    return;
  }

  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexCorreo.test(correo)) {
    alerta.className = "alert alert-warning";
    alerta.textContent = "Por favor ingresa un correo electrónico válido.";
    alerta.classList.remove("d-none");
    return;
  }

  alerta.className = "alert alert-success";
  alerta.textContent =
    "¡Mensaje enviado exitosamente! Te responderemos pronto.";
  alerta.classList.remove("d-none");

  document.getElementById("nombre").value = "";
  document.getElementById("correo").value = "";
  document.getElementById("mensaje").value = "";

  setTimeout(function () {
    alerta.classList.add("d-none");
  }, 4000);
}

lightbox.option({
  resizeDuration: 200,
  wrapAround: true,
  albumLabel: "Imagen %1 de %2",
  fadeDuration: 300,
});

const navLinks = document.querySelectorAll(".nav-link");
const navCollapse = document.getElementById("navMenu");

navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    if (navCollapse.classList.contains("show")) {
      const bsCollapse = new bootstrap.Collapse(navCollapse);
      bsCollapse.hide();
    }
  });
});

const secciones = document.querySelectorAll("section[id]");
const enlacesNav = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", function () {
  let posActual = window.scrollY + 120;

  secciones.forEach(function (seccion) {
    const inicio = seccion.offsetTop;
    const fin = inicio + seccion.offsetHeight;
    const id = seccion.getAttribute("id");

    if (posActual >= inicio && posActual < fin) {
      enlacesNav.forEach(function (enlace) {
        enlace.classList.remove("active");
        if (enlace.getAttribute("href") === "#" + id) {
          enlace.classList.add("active");
        }
      });
    }
  });
});
