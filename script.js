const bookingForm = document.querySelector(".booking-card");
const bookingNote = document.querySelector("[data-booking-note]");
const heroSlides = [...document.querySelectorAll(".hero-slide")];
const heroDots = [...document.querySelectorAll(".hero-dots span")];
const foodGallery = document.querySelector(".food-gallery");
const foodSlides = foodGallery ? [...foodGallery.querySelectorAll("figure")] : [];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const cleanInput = (value, maxLength) =>
  String(value || "")
    .replace(/[\u0000-\u001f\u007f<>]/g, "")
    .trim()
    .slice(0, maxLength);

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
  const submitButton = bookingForm.querySelector('button[type="submit"]');
  let startedAt = Date.now();
  let sending = false;
  let nextSubmissionAt = 0;

  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending) return;
    if (Date.now() < nextSubmissionAt) {
      bookingNote.textContent = "Please wait a minute before sending another request.";
      return;
    }

    if (!bookingForm.reportValidity()) {
      bookingNote.textContent = "Please complete every field before sending.";
      return;
    }

    const endpoint = bookingForm.dataset.bookingEndpoint;
    const rawFormData = new FormData(bookingForm);
    if (String(rawFormData.get("website") || "").trim()) {
      bookingNote.textContent = "Unable to send. Please call 084 443 2138 for assistance.";
      return;
    }
    if (Date.now() - startedAt < 3000) {
      bookingNote.textContent = "Please review your details and try again in a few seconds.";
      return;
    }
    const guests = Number(rawFormData.get("guests"));

    if (!Number.isInteger(guests) || guests < 1 || guests > 10) {
      bookingNote.textContent = "Please enter a guest number from 1 to 10.";
      return;
    }

    const formData = new FormData();
    formData.set("name", cleanInput(rawFormData.get("name"), 80));
    formData.set("contact", cleanInput(rawFormData.get("contact"), 120));
    formData.set("date", cleanInput(rawFormData.get("date"), 10));
    formData.set("guests", String(guests));
    formData.set("message", cleanInput(rawFormData.get("message"), 500));
    if (["name", "contact", "date", "message"].some((key) => !formData.get(key))) {
      bookingNote.textContent = "Please complete every field with valid details.";
      return;
    }
    formData.set("website", "");
    formData.set("startedAt", String(startedAt));

    if (!endpoint) {
      bookingNote.textContent = "Booking notifications are not connected yet. Please call 084 443 2138.";
      return;
    }

    bookingNote.textContent = "Sending your booking request...";
    sending = true;
    submitButton.disabled = true;
    bookingForm.setAttribute("aria-busy", "true");

    try {
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        // Apps Script parses URL-encoded fields consistently; multipart is rejected.
        body: new URLSearchParams(formData),
      });

      // An opaque response does not confirm acceptance by Apps Script.
      nextSubmissionAt = Date.now() + 60000;
      startedAt = Date.now();
      bookingNote.textContent = "Request sent for processing; delivery is not yet confirmed. Please wait for the restaurant to confirm, or call 084 443 2138.";
    } catch (error) {
      bookingNote.textContent = "Sorry, the message could not be sent. Please call 084 443 2138.";
    } finally {
      sending = false;
      submitButton.disabled = false;
      bookingForm.removeAttribute("aria-busy");
    }
  });
}
