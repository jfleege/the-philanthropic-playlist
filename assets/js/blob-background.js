const { useEffect, useRef } = React;

function BlobBackground() {
  const blobsRef = useRef([]);

  useEffect(() => {
    let animationFrame;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const blobs = [
      {
        x: -120,
        y: -80,
        size: 420,
        color: "#a8d8ee",
        speed: 0.00045,
        offset: 0,
        mouseStrength: 0.018
      },
      {
        x: window.innerWidth - 160,
        y: 40,
        size: 310,
        color: "#f8bf72",
        speed: 0.0006,
        offset: 2,
        mouseStrength: -0.014
      },
      {
        x: window.innerWidth - 190,
        y: window.innerHeight - 210,
        size: 360,
        color: "#f4cbd0",
        speed: 0.0005,
        offset: 4,
        mouseStrength: 0.012
      },
      {
        x: 70,
        y: window.innerHeight - 180,
        size: 300,
        color: "#f8bf72",
        speed: 0.00055,
        offset: 6,
        mouseStrength: -0.01
      }
    ];

    const handleMouseMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = (time) => {
      blobsRef.current.forEach((blobEl, index) => {
        if (!blobEl) return;

        const blob = blobs[index];

        const waveX = Math.sin(time * blob.speed + blob.offset) * 32;
        const waveY = Math.cos(time * blob.speed * 1.25 + blob.offset) * 28;
        const rotate = Math.sin(time * blob.speed * 0.8 + blob.offset) * 16;
        const scale = 1 + Math.sin(time * blob.speed * 1.4 + blob.offset) * 0.045;

        const mouseOffsetX = (mouseX - window.innerWidth / 2) * blob.mouseStrength;
        const mouseOffsetY = (mouseY - window.innerHeight / 2) * blob.mouseStrength;

        const radiusA = 48 + Math.sin(time * blob.speed + blob.offset) * 12;
        const radiusB = 52 + Math.cos(time * blob.speed * 1.1 + blob.offset) * 13;
        const radiusC = 60 + Math.sin(time * blob.speed * 1.2 + blob.offset) * 11;
        const radiusD = 40 + Math.cos(time * blob.speed * 0.9 + blob.offset) * 10;

        blobEl.style.transform = `
          translate3d(${blob.x + waveX + mouseOffsetX}px, ${blob.y + waveY + mouseOffsetY}px, 0)
          rotate(${rotate}deg)
          scale(${scale})
        `;

        blobEl.style.borderRadius = `
          ${radiusA}% ${100 - radiusA}% ${radiusB}% ${100 - radiusB}% /
          ${radiusC}% ${radiusD}% ${100 - radiusD}% ${100 - radiusC}%
        `;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return React.createElement(
    "div",
    { className: "react-blob-layer", "aria-hidden": "true" },
    [0, 1, 2, 3].map((_, index) =>
      React.createElement("div", {
        key: index,
        ref: (el) => (blobsRef.current[index] = el),
        className: `react-blob react-blob-${index + 1}`
      })
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById("blob-background"));
root.render(React.createElement(BlobBackground));