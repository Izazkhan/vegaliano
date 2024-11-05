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

  function numberWithinRange(number, min, max) {
    return Math.min(Math.max(number, min), max);
  }

  function setTweenNodes(emblaApi) {
    tweenNodes = emblaApi.slideNodes();
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
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress);
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress);
              }
            }
          });
        }

        const tweenValue = 1.2 - Math.abs(diffToTarget * tweenFactor);
        const scale = numberWithinRange(tweenValue, 0.8, 1.2).toString();
        const tweenNode = tweenNodes[slideIndex];
        const currentTransform = tweenNode.style.transform || "";
        tweenNode.style.transform = updateScaleOnly(currentTransform, scale);
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
