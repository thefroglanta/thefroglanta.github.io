const bookingForm = document.querySelector(".booking-card");
const bookingNote = document.querySelector("[data-booking-note]");
const heroSlides = [...document.querySelectorAll(".hero-slide")];
const heroDots = [...document.querySelectorAll(".hero-dots span")];
const foodGallery = document.querySelector(".food-gallery");
const foodSlides = foodGallery ? [...foodGallery.querySelectorAll("figure")] : [];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (heroSlides.length > 1 && !prefersReducedMotion) {
  let activeHeroSlide = 0;

  window.setInterval(() => {
    heroSlides[activeHeroSlide].classList.remove("active");
    heroDots[activeHeroSlide]?.classList.remove("active");

    activeHeroSlide = (activeHeroSlide + 1) % heroSlides.length;

    heroSlides[activeHeroSlide].classList.add("active");
    heroDots[activeHeroSlide]?.classList.add("active");
  }, 4800);
}

if (foodGallery && foodSlides.length > 1 && !prefersReducedMotion) {
  let activeFoodSlide = 0;
  let foodGalleryPaused = false;

  const pauseFoodGallery = () => {
    foodGalleryPaused = true;
  };

  const resumeFoodGallery = () => {
    foodGalleryPaused = false;
  };

  foodGallery.addEventListener("mouseenter", pauseFoodGallery);
  foodGallery.addEventListener("mouseleave", resumeFoodGallery);
  foodGallery.addEventListener("touchstart", pauseFoodGallery, { passive: true });
  foodGallery.addEventListener("touchend", resumeFoodGallery);

  window.setInterval(() => {
    if (foodGalleryPaused) return;

    activeFoodSlide = (activeFoodSlide + 1) % foodSlides.length;
    foodGallery.scrollTo({
      left: foodSlides[activeFoodSlide].offsetLeft - foodSlides[0].offsetLeft,
      behavior: "smooth",
    });
  }, 3200);
}

if (bookingForm && bookingNote) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(bookingForm);
    const name = formData.get("name");
    const date = formData.get("date");
    const guests = formData.get("guests");
    const message = formData.get("message") || "No special note";

    bookingNote.textContent =
      `Booking message: Hi, my name is ${name}. I would like to book a table on ${date} for ${guests}. Note: ${message}.`;
  });
}
