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
});