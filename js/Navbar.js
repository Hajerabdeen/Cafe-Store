// Navbar logic
document.addEventListener("DOMContentLoaded", function () {
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");
  const navLinks = document.querySelectorAll(".nav-link");

  navbarToggler.addEventListener("click", function () {
    navbarCollapse.classList.toggle("active");
  });

  function closeNavbar() {
    navbarCollapse.classList.remove("active");
  }
  function setActiveLink() {
    navLinks.forEach((link) => link.classList.remove("active"));
    this.classList.add("active");
    closeNavbar();
  }
  navLinks.forEach((link) => link.addEventListener("click", setActiveLink));
  navLinks.forEach((link) => {
    if (link.href === window.location.href) {
      link.classList.add("active");
    }
  });
});
