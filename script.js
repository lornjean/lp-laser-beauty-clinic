const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const form = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");
const beautyListModal = document.querySelector("[data-beauty-list-modal]");
const beautyListForms = document.querySelectorAll("[data-beauty-list-form]");
const beautyListCloseButtons = document.querySelectorAll("[data-beauty-list-close]");

const beautyListStorage = {
  dismissed: "lpBeautyListDismissed",
  subscribed: "lpBeautyListSubscribed",
  sessionClosed: "lpBeautyListClosedThisVisit"
};

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  header.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    nav.classList.remove("is-open");
    header.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const subject = encodeURIComponent(`Website enquiry: ${data.get("treatment")}`);
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nTreatment: ${data.get("treatment")}\n\nMessage:\n${data.get("message")}`
    );

    formStatus.textContent = "Opening your email app with the enquiry ready to send.";
    window.location.href = `mailto:lorna@lplaserbeautyclinic.com?subject=${subject}&body=${body}`;
  });
}

const shouldShowBeautyList = () => {
  return beautyListModal
    && !localStorage.getItem(beautyListStorage.dismissed)
    && !localStorage.getItem(beautyListStorage.subscribed)
    && !sessionStorage.getItem(beautyListStorage.sessionClosed);
};

const closeBeautyList = (remember = true) => {
  if (!beautyListModal) {
    return;
  }

  beautyListModal.setAttribute("hidden", "");

  if (remember) {
    sessionStorage.setItem(beautyListStorage.sessionClosed, "true");
    localStorage.setItem(beautyListStorage.dismissed, "true");
  }
};

const openBeautyList = () => {
  if (shouldShowBeautyList()) {
    beautyListModal.removeAttribute("hidden");
  }
};

if (beautyListModal) {
  window.setTimeout(openBeautyList, 10000);
}

beautyListCloseButtons.forEach((button) => {
  button.addEventListener("click", () => closeBeautyList(true));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && beautyListModal && !beautyListModal.hasAttribute("hidden")) {
    closeBeautyList(true);
  }
});

beautyListForms.forEach((beautyListForm) => {
  beautyListForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(beautyListForm);
    const subject = encodeURIComponent("LP Beauty List sign-up");
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nMobile: ${data.get("mobile") || "Not provided"}\n\nThis person has asked to join the LP Beauty List.`
    );

    localStorage.setItem(beautyListStorage.subscribed, "true");
    localStorage.removeItem(beautyListStorage.dismissed);

    const status = beautyListForm.querySelector("[data-beauty-list-status]");
    if (status) {
      status.textContent = "Opening your email app with the LP Beauty List sign-up ready to send.";
    }

    beautyListForm.reset();
    window.location.href = `mailto:lorna@lplaserbeautyclinic.com?subject=${subject}&body=${body}`;

    if (beautyListModal && beautyListModal.contains(beautyListForm)) {
      window.setTimeout(() => closeBeautyList(false), 1400);
    }
  });
});

// Open retained detail anchors when following Prices or a historical deep link.
const revealMenuAnchor = () => {
  const id = decodeURIComponent(window.location.hash.slice(1));
  const target = id && document.getElementById(id);
  if (!target) return;
  let node = target;
  while (node) {
    if (node.tagName === "DETAILS") node.open = true;
    node = node.parentElement;
  }
  requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
};
if (window.location.hash) revealMenuAnchor();
window.addEventListener("hashchange", revealMenuAnchor);
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    document.querySelectorAll("[data-treatment-nav][open]").forEach(menu => { menu.open = false; menu.querySelector("summary").focus(); });
  }
});
document.addEventListener("click", event => {
  const anchor = event.target.closest("a[href]");
  if (anchor) {
    const destination = new URL(anchor.href, window.location.href);
    if (destination.origin === window.location.origin && destination.pathname === window.location.pathname && destination.hash && destination.hash === window.location.hash) revealMenuAnchor();
  }
  document.querySelectorAll("[data-treatment-nav][open]").forEach(menu => {
    if (!menu.contains(event.target) || event.target.closest("a")) menu.open = false;
  });
});
