document.addEventListener("DOMContentLoaded", () => {
  const titles = document.querySelectorAll(".main-content h1");

  const colors = [
    "#246783", // deep blue
    "#17475f", // dark blue
    "#a8d8ee", // soft blue
    "#f8bf72", // peach
    "#f4cbd0"  // pink
  ];

  titles.forEach((title) => {
    if (title.dataset.floatingTitle === "true") return;

    const text = title.textContent.trim();
    title.textContent = "";
    title.dataset.floatingTitle = "true";
    title.classList.add("floating-title");

    [...text].forEach((char, index) => {
      const span = document.createElement("span");

      span.textContent = char === " " ? "\u00A0" : char;
      span.className = "floating-letter";

      span.style.setProperty("--letter-color", colors[index % colors.length]);
      span.style.setProperty("--float-delay", `${index * -0.13}s`);
      span.style.setProperty("--float-distance", `${4 + (index % 4) * 2}px`);
      span.style.setProperty("--rotate-amount", `${index % 2 === 0 ? 2 : -2}deg`);

      title.appendChild(span);
    });
  });
});