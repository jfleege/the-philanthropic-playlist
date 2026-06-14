const debounce = (func, timeout = 300) => {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  /*
    Smooth scroll
  */
  if (typeof Lenis !== "undefined" && typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    const lenis = new Lenis({
      lerp: 0.07
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  /*
    Text reveal on scroll
  */
  const setTextRevealAnimations = () => {
    if (typeof SplitType === "undefined" || typeof gsap === "undefined") return;

    document.querySelectorAll(".text-reveal").forEach((text) => {
      if (text.dataset.revealed === "true") return;
      text.dataset.revealed = "true";

      const splitText = new SplitType(text, {
        types: "lines"
      });

      splitText.lines.forEach((line) => {
        const lineWrapper = document.createElement("div");
        lineWrapper.classList.add("line-wrapper");

        line.parentNode.insertBefore(lineWrapper, line);
        lineWrapper.appendChild(line);
      });

      gsap.set(splitText.lines, {
        y: "110%"
      });

      gsap.to(splitText.lines, {
        y: 0,
        ease: "power2.out",
        duration: 0.9,
        stagger: 0.12,
        scrollTrigger: {
          trigger: text,
          start: "top 85%",
          toggleActions: "play none none reset"
        }
      });
    });
  };

  setTextRevealAnimations();

  /*
    Mission statement rotator
  */
  const initMissionRotator = () => {
    if (typeof gsap === "undefined") return;

    const rotator = document.querySelector(".mission-rotator");
    if (!rotator) return;

    const lines = gsap.utils.toArray(".mission-line");
    if (!lines.length) return;

    let currentIndex = 0;

    gsap.set(lines, {
      autoAlpha: 0,
      y: 26,
      scale: 0.98
    });

    gsap.set(lines[0], {
      autoAlpha: 1,
      y: 0,
      scale: 1
    });

    const showNextLine = () => {
      const currentLine = lines[currentIndex];
      const nextIndex = (currentIndex + 1) % lines.length;
      const nextLine = lines[nextIndex];

      const timeline = gsap.timeline();

      timeline.to(currentLine, {
        autoAlpha: 0,
        y: -24,
        scale: 0.98,
        duration: 0.55,
        ease: "power2.inOut"
      });

      timeline.fromTo(
        nextLine,
        {
          autoAlpha: 0,
          y: 28,
          scale: 0.98
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power2.out"
        },
        "-=0.15"
      );

      currentIndex = nextIndex;
    };

    setInterval(showNextLine, 3600);
  };

  initMissionRotator();

  /*
    Handle resize
  */
  if (typeof ResizeObserver !== "undefined") {
    const resizeObserver = new ResizeObserver(
      debounce(() => {
        ScrollTrigger.refresh();
      }, 500)
    );

    resizeObserver.observe(document.body);
  }

  /*
  About page connected path animation
*/
const initAboutConnector = () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  const aboutFlow = document.querySelector(".about-flow");
  if (!aboutFlow) return;

  const blocks = Array.from(aboutFlow.querySelectorAll(".about-block"));
  if (blocks.length < 2) return;

  let svg = aboutFlow.querySelector(".about-connector-svg");

  if (!svg) {
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("about-connector-svg");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.classList.add("about-connector-path");

    svg.appendChild(path);
    aboutFlow.prepend(svg);
  }

  const path = svg.querySelector(".about-connector-path");

  const buildPath = () => {
    const flowRect = aboutFlow.getBoundingClientRect();

    const points = blocks.map((block, index) => {
      const rect = block.getBoundingClientRect();

      const isLeft = block.classList.contains("align-left");

      const x = isLeft
        ? rect.right - flowRect.left - 80
        : rect.left - flowRect.left + 80;

      const y = rect.top - flowRect.top + rect.height / 2;

      return { x, y };
    });

   let d = `M ${points[0].x} ${points[0].y}`;

for (let i = 1; i < points.length; i++) {
  const previous = points[i - 1];
  const current = points[i];

  const dx = current.x - previous.x;
  const dy = current.y - previous.y;

  const direction = dx >= 0 ? 1 : -1;

  /* Wider horizontal swing = smoother S-curve */
  const horizontalSwing = Math.max(140, Math.min(260, Math.abs(dx) * 0.55));
  const verticalBend = Math.max(90, Math.min(180, Math.abs(dy) * 0.28));

  const controlOneX = previous.x + direction * horizontalSwing;
  const controlOneY = previous.y + verticalBend;

  const controlTwoX = current.x - direction * horizontalSwing;
  const controlTwoY = current.y - verticalBend;

  d += ` C ${controlOneX} ${controlOneY}, ${controlTwoX} ${controlTwoY}, ${current.x} ${current.y}`;
}

path.setAttribute("d", d);

    svg.querySelectorAll(".about-connector-dot").forEach((dot) => dot.remove());

    points.forEach((point) => {
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.classList.add("about-connector-dot");
      dot.setAttribute("cx", point.x);
      dot.setAttribute("cy", point.y);
      dot.setAttribute("r", "7");
      svg.appendChild(dot);
    });

    const pathLength = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength
    });

    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.vars && trigger.vars.id === "about-connector") {
        trigger.kill();
      }
    });

    gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        id: "about-connector",
        trigger: aboutFlow,
        start: "top 70%",
        end: "bottom 65%",
        scrub: 1
      }
    });

    blocks.forEach((block) => {
      ScrollTrigger.create({
        trigger: block,
        start: "top 65%",
        end: "bottom 45%",
        toggleClass: {
          targets: block,
          className: "is-connected"
        }
      });
    });
  };

  buildPath();

  window.addEventListener(
    "resize",
    debounce(() => {
      buildPath();
      ScrollTrigger.refresh();
    }, 300)
  );

const highlightViewedAboutBlock = () => {
  const flows = document.querySelectorAll(".about-flow:not(.team-flow)");

  flows.forEach((flow) => {
    const blocks = Array.from(flow.querySelectorAll(".about-block"));
    if (!blocks.length) return;

    const updateActiveBlock = () => {
      let mostVisibleBlock = blocks[0];
      let mostVisibleAmount = 0;

      blocks.forEach((block) => {
        const rect = block.getBoundingClientRect();

        const visibleTop = Math.max(rect.top, 0);
        const visibleBottom = Math.min(rect.bottom, window.innerHeight);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);

        const visibleRatio = visibleHeight / rect.height;

        if (visibleRatio > mostVisibleAmount) {
          mostVisibleAmount = visibleRatio;
          mostVisibleBlock = block;
        }
      });

      blocks.forEach((block) => {
        block.classList.toggle("is-viewing", block === mostVisibleBlock);
      });
    };

    updateActiveBlock();

    window.addEventListener("scroll", updateActiveBlock, { passive: true });
    window.addEventListener("resize", updateActiveBlock);
  });
};

highlightViewedAboutBlock();
};

initAboutConnector();
});