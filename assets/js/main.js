document.addEventListener("DOMContentLoaded", () => {
  const navCollapse = document.getElementById("mainNav");
  const navToggler = document.querySelector(".navbar-toggler");
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link, .project-chips a");
  const copyButtons = document.querySelectorAll("[data-copy-email]");

  const closeNavMenu = () => {
    if (!navCollapse || !navCollapse.classList.contains("show")) {
      return;
    }

    if (window.bootstrap && bootstrap.Collapse) {
      bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
    } else {
      navCollapse.classList.remove("show");
    }

    if (navToggler) {
      navToggler.setAttribute("aria-expanded", "false");
    }
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeNavMenu();
    });
  });

  document.addEventListener("pointerdown", (event) => {
    if (
      !navCollapse ||
      !navCollapse.classList.contains("show") ||
      event.target.closest("#siteNavbar")
    ) {
      return;
    }

    closeNavMenu();
  });

  copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const email = button.getAttribute("data-copy-email");
      const label = button.querySelector("[data-copy-label]");

      if (!email) {
        return;
      }

      const copied = await copyText(email);
      const buttonMessage = copied ? "Email copied" : "Copy email";

      if (label) {
        label.textContent = buttonMessage;
        window.clearTimeout(button.copyResetTimer);
        button.copyResetTimer = window.setTimeout(() => {
          label.textContent = label.dataset.originalLabel || "Copy email";
        }, 1800);
      }

      button.classList.add("copied");
      window.clearTimeout(button.copyClassTimer);
      button.copyClassTimer = window.setTimeout(() => button.classList.remove("copied"), 1800);
    });

    const label = button.querySelector("[data-copy-label]");

    if (label) {
      label.dataset.originalLabel = label.textContent;
    }
  });
});

async function copyText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (_error) {
      return fallbackCopyText(value);
    }
  }

  return fallbackCopyText(value);
}

function fallbackCopyText(value) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.className = "clipboard-fallback";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } catch (_error) {
    return false;
  } finally {
    textarea.remove();
  }
}
