// embla-utils.js
var EmblaUtils = (function () {
  function addTogglePrevNextBtnsActive(emblaApi, prevBtn, nextBtn) {
    const togglePrevNextBtnsState = () => {
      if (emblaApi.canScrollPrev()) prevBtn.removeAttribute("disabled");
      else prevBtn.setAttribute("disabled", "disabled");

      if (emblaApi.canScrollNext()) nextBtn.removeAttribute("disabled");
      else nextBtn.setAttribute("disabled", "disabled");
    };

    emblaApi
      .on("select", togglePrevNextBtnsState)
      .on("init", togglePrevNextBtnsState)
      .on("reInit", togglePrevNextBtnsState);

    return () => {
      prevBtn.removeAttribute("disabled");
      nextBtn.removeAttribute("disabled");
    };
  }

  function addDotBtnsAndClickHandlers(emblaApi, dotsNode) {
    let dotNodes = [];

    const addDotBtnsWithClickHandlers = () => {
      dotsNode.innerHTML = emblaApi
        .scrollSnapList()
        .map(
          () =>
            `<button type="button" class="w-3 h-3 embla__dot rounded-full" aria-current="true" aria-label="Slide 1" data-carousel-slide-to="0"></button>`
        )
        .join("");

      const scrollTo = (index) => {
        emblaApi.scrollTo(index);
      };

      dotNodes = Array.from(dotsNode.querySelectorAll(".embla__dot"));
      dotNodes.forEach((dotNode, index) => {
        dotNode.addEventListener("click", () => scrollTo(index), false);
      });
    };

    const toggleDotBtnsActive = () => {
      const previous = emblaApi.previousScrollSnap();
      const selected = emblaApi.selectedScrollSnap();
      dotNodes[previous].classList.remove("embla__dot--selected");
      dotNodes[selected].classList.add("embla__dot--selected");
    };

    emblaApi
      .on("init", addDotBtnsWithClickHandlers)
      .on("reInit", addDotBtnsWithClickHandlers)
      .on("init", toggleDotBtnsActive)
      .on("reInit", toggleDotBtnsActive)
      .on("select", toggleDotBtnsActive);

    return () => {
      dotsNode.innerHTML = "";
    };
  }

  function addPrevNextBtnsClickHandlers(emblaApi, prevBtn, nextBtn) {
    const scrollPrev = () => emblaApi.scrollPrev();
    const scrollNext = () => emblaApi.scrollNext();

    prevBtn.addEventListener("click", scrollPrev, false);
    nextBtn.addEventListener("click", scrollNext, false);

    const removeTogglePrevNextBtnsActive = addTogglePrevNextBtnsActive(
      emblaApi,
      prevBtn,
      nextBtn
    );

    return () => {
      removeTogglePrevNextBtnsActive();
      prevBtn.removeEventListener("click", scrollPrev, false);
      nextBtn.removeEventListener("click", scrollNext, false);
    };
  }

  const TWEEN_FACTOR_BASE = 0.52;
  let tweenFactor = 0;
  let tweenNodes = [];

  function setTweenNodes(emblaApi) {
    tweenNodes = emblaApi.slideNodes().map((slideNode) => {
      // return slideNode
      return slideNode.querySelector('.__slide');
    })
  }

  function setTweenFactor(emblaApi) {
    tweenFactor = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }

  function tweenScale(emblaApi, eventName) {
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    const slidesInView = emblaApi.slidesInView();
    const isScrollEvent = eventName === "scroll";

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      const slidesInSnap = engine.slideRegistry[snapIndex];
      let slideCount = slidesInSnap.length;
      const wrapThreshold = slidesInSnap.length / 2;

      slidesInSnap.forEach((slideIndex) => {
        const tweenNode = tweenNodes[slideIndex];

        const snapPoint = emblaApi.scrollSnapList()[slideIndex];
        let slideProgress = snapPoint - scrollProgress;

        // Only apply wrapping if the slide is beyond the wrap threshold
        // This will prevent slides from abruptly jumping for small scrolls
        if (slideProgress < -wrapThreshold) {
          slideProgress += slideCount;
        } else if (slideProgress > wrapThreshold) {
          slideProgress -= slideCount;
        }

        // Apply scale and opacity based on adjusted slide progress
        const scaleFactor = Math.max(1 - Math.abs(slideProgress) * 1.2, 0.6);
        const currentTransform = tweenNode.style.transform || "";
        const paddingFactor = 100 * (1 - scaleFactor) - 5;
        tweenNode.style.transform = updateScaleOnly(currentTransform, scaleFactor);
        tweenNode.style.paddingTop = Math.round(paddingFactor) + 'px';
      });
    });
  }

  // Helper function to update only the scale in the transform string
  function updateScaleOnly(transformString, scaleFactor) {
    if (transformString.includes("scale(")) {
      return transformString.replace(
        /scale\([^\)]+\)/,
        `scale(${scaleFactor})`
      );
    } else {
      return `${transformString} scale(${scaleFactor})`;
    }
  }

  function setupTweenScale(emblaApi) {
    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenScale(emblaApi);

    emblaApi
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", tweenScale)
      .on("scroll", tweenScale)
      .on("slideFocus", tweenScale);

    return () => {
      tweenNodes.forEach((slide) => slide.removeAttribute("style"));
    };
  }

  // Return the functions as part of an object to access them outside this file
  return {
    addTogglePrevNextBtnsActive: addTogglePrevNextBtnsActive,
    addPrevNextBtnsClickHandlers: addPrevNextBtnsClickHandlers,
    addDotBtnsAndClickHandlers: addDotBtnsAndClickHandlers,
    setupTweenScale: setupTweenScale,
  };
})();
