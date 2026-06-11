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

    const lines = title.innerText
      .trim()
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    title.textContent = "";
    title.dataset.floatingTitle = "true";
    title.classList.add("floating-title");

    let letterIndex = 0;

    lines.forEach((lineText) => {
      const line = document.createElement("span");
      line.className = "floating-title-line";

      const words = lineText.split(" ");

      words.forEach((wordText) => {
        const word = document.createElement("span");
        word.className = "floating-word";

        [...wordText].forEach((char) => {
          const letter = document.createElement("span");

          letter.textContent = char;
          letter.className = "floating-letter";

          letter.style.setProperty("--letter-color", colors[letterIndex % colors.length]);
          letter.style.setProperty("--float-delay", `${letterIndex * -0.11}s`);
          letter.style.setProperty("--float-distance", `${4 + (letterIndex % 4) * 2}px`);
          letter.style.setProperty("--rotate-amount", `${letterIndex % 2 === 0 ? 2 : -2}deg`);

          word.appendChild(letter);
          letterIndex++;
        });

        line.appendChild(word);
      });

      title.appendChild(line);
    });
  });
});