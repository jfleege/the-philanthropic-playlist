document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("a[href]");

  links.forEach((link) => {
    const href = link.getAttribute("href");
    const url = new URL(link.href, window.location.href);

    const isSameSite = url.origin === window.location.origin;
    const isAnchor = href.startsWith("#");
    const opensNewTab = link.target === "_blank";
    const isMail = link.href.startsWith("mailto:");

    if (!isSameSite || isAnchor || opensNewTab || isMail) return;

    link.addEventListener("click", (event) => {
      event.preventDefault();

      document.body.classList.add("is-transitioning");

      setTimeout(() => {
        window.location.href = link.href;
      }, 700);
    });
  });
});
