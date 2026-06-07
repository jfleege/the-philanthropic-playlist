const { useEffect, useRef } = React;

function BlobBackground() {
  const blobsRef = useRef([]);

  useEffect(() => {
    let animationFrame;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const makeBlobs = () => [
      {
        x: -80,
        y: -60,
        size: 390,
        width: 390,
        height: 330,
        color: "#a8d8ee",
        speed: 0.00045,
        offset: 0,
        mouseStrength: 0.018
      },
      {
        x: window.innerWidth * 0.72,
        y: 35,
        width: 300,
        height: 250,
        color: "#f8bf72",
        speed: 0.0006,
        offset: 2,
        mouseStrength: -0.014
      },
      {
        x: window.innerWidth * 0.78,
        y: window.innerHeight * 0.62,
        width: 360,
        height: 310,
        color: "#f4cbd0",
        speed: 0.0005,
        offset: 4,
        mouseStrength: 0.012
      },
      {
        x: 60,
        y: window.innerHeight * 0.72,
        width: 300,
        height: 260,
        color: "#f8bf72",
        speed: 0.00055,
        offset: 6,
        mouseStrength: -0.01
      },
      {
        x: window.innerWidth * 0.35,
        y: window.innerHeight * 0.08,
        width: 260,
        height: 220,
        color: "#f4cbd0",
        speed: 0.0005,
        offset: 8,
        mouseStrength: 0.01
      },
      {
        x: window.innerWidth * 0.46,
        y: window.innerHeight * 0.76,
        width: 330,
        height: 270,
        color: "#a8d8ee",
        speed: 0.00042,
        offset: 10,
        mouseStrength: -0.012
      },
      {
        x: window.innerWidth * 0.88,
        y: window.innerHeight * 0.28,
        width: 220,
        height: 190,
        color: "#a8d8ee",
        speed: 0.00065,
        offset: 12,
        mouseStrength: 0.014
      },
      {
        x: window.innerWidth * 0.18,
        y: window.innerHeight * 0.38,
        width: 230,
        height: 200,
        color: "#f4cbd0",
        speed: 0.00058,
        offset: 14,
        mouseStrength: -0.009
      }
    ];

    let blobs = makeBlobs();

    const handleMouseMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleResize = () => {
      blobs = makeBlobs();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const animate = (time) => {
      blobsRef.current.forEach((blobEl, index) => {
        if (!blobEl) return;

        const blob = blobs[index];

        const waveX = Math.sin(time * blob.speed + blob.offset) * 34;
        const waveY = Math.cos(time * blob.speed * 1.25 + blob.offset) * 30;
        const rotate = Math.sin(time * blob.speed * 0.8 + blob.offset) * 16;
        const scale = 1 + Math.sin(time * blob.speed * 1.4 + blob.offset) * 0.045;

        const mouseOffsetX = (mouseX - window.innerWidth / 2) * blob.mouseStrength;
        const mouseOffsetY = (mouseY - window.innerHeight / 2) * blob.mouseStrength;

        const radiusA = 48 + Math.sin(time * blob.speed + blob.offset) * 12;
        const radiusB = 52 + Math.cos(time * blob.speed * 1.1 + blob.offset) * 13;
        const radiusC = 60 + Math.sin(time * blob.speed * 1.2 + blob.offset) * 11;
        const radiusD = 40 + Math.cos(time * blob.speed * 0.9 + blob.offset) * 10;

        blobEl.style.width = `${blob.width}px`;
        blobEl.style.height = `${blob.height}px`;
        blobEl.style.background = blob.color;

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
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return React.createElement(
    "div",
    { className: "react-blob-layer", "aria-hidden": "true" },
    Array.from({ length: 8 }).map((_, index) =>
      React.createElement("div", {
        key: index,
        ref: (el) => (blobsRef.current[index] = el),
        className: "react-blob"
      })
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById("blob-background"));
root.render(React.createElement(BlobBackground));