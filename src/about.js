const revealElements = document.querySelectorAll(
  ".about-story, .about-values, .about-location, .site-footer"
);

revealElements.forEach((element) => {
  element.classList.add("reveal");
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
  }
);

revealElements.forEach((element) => {
  observer.observe(element);
});

// BACK TO TOP

const backToTop = document.querySelector("#backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// SCROLL PROGRESS

const scrollProgress = document.querySelector("#scrollProgress");

window.addEventListener("scroll", () => {
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress =
    scrollableHeight > 0
      ? (window.scrollY / scrollableHeight) * 100
      : 0;

  scrollProgress.style.width = `${progress}%`;
});