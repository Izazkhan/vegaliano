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

  // Return the functions as part of an object to access them outside this file
  return {
    addTogglePrevNextBtnsActive: addTogglePrevNextBtnsActive,
    addPrevNextBtnsClickHandlers: addPrevNextBtnsClickHandlers,
  };
})();
