// Master Business Automations — Interactive Glass UI Behavior

const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const toast = document.getElementById("toast");
const yearNow = document.getElementById("yearNow");
const inquiryForm = document.getElementById("inquiryForm");
const formNote = document.getElementById("formNote");

if (yearNow) {
  yearNow.textContent = new Date().getFullYear();
}

// Theme persistence (Apple Light Glass / Dark Glass)
const savedTheme = localStorage.getItem("mba-theme");
if (savedTheme === "dark") {
  root.setAttribute("data-theme", "dark");
}

themeToggle?.addEventListener("click", () => {
  const isDark = root.getAttribute("data-theme") === "dark";
  const nextTheme = isDark ? "light" : "dark";
  if (nextTheme === "dark") {
    root.setAttribute("data-theme", "dark");
  } else {
    root.removeAttribute("data-theme");
  }
  localStorage.setItem("mba-theme", nextTheme);
});

// Mobile menu toggle
menuToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

// Floating glass toast helper
let toastTimer;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2400);
}

// Copy GSTIN / Office Address
document.querySelectorAll("[data-copy-target]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const targetId = btn.getAttribute("data-copy-target");
    const targetEl = targetId ? document.getElementById(targetId) : null;
    if (!targetEl) return;

    const text = targetEl.innerText.replace(/\s+/g, " ").trim();
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard");
    } catch {
      showToast("Copy unavailable in this browser");
    }
  });
});

// Static-friendly inquiry summary copier
inquiryForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("nameInput")?.value.trim();
  const company = document.getElementById("companyInput")?.value.trim();
  const message = document.getElementById("messageInput")?.value.trim();

  if (!name || !message) return;

  const summary = [
    "Inquiry for Master Business Automations",
    `Name: ${name}`,
    company ? `Business: ${company}` : null,
    `Requirement: ${message}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await navigator.clipboard.writeText(summary);
    formNote.textContent = "Inquiry summary copied to your clipboard. Share it directly with our team.";
    showToast("Inquiry summary copied");
  } catch {
    formNote.textContent = "Inquiry prepared. Please copy your message above to share with our team.";
  }
});

// Scroll reveal animation
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  reveals.forEach((el) => observer.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-visible"));
}
