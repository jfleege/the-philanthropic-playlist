document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("a[href]");

  links.forEach((link) => {
    const url = new URL(link.href, window.location.href);

    const isSameSite = url.origin === window.location.origin;
    const isAnchor = link.getAttribute("href").startsWith("#");
    const opensNewTab = link.target === "_blank";
    const isEmail = link.href.startsWith("mailto:");

    if (!isSameSite || isAnchor || opensNewTab || isEmail) return;

    link.addEventListener("click", (event) => {
      event.preventDefault();

      document.body.classList.add("is-transitioning");

      setTimeout(() => {
        window.location.href = link.href;
      }, 650);
    });
  });
});