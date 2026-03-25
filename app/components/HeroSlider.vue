<template>
  <section
    class="hero-slider"
    aria-roledescription="carousel"
    aria-label="Hero Image Slider"
  >
    <div class="slider-container">
      <div
        v-for="(slide, index) in slides"
        :id="`slide-${index + 1}`"
        :key="index"
        :class="['slide', { active: currentSlide === index }]"
        role="group"
        :aria-roledescription="`slide ${index + 1} of ${slides.length}`"
        :aria-label="slide.alt"
      >
        <NuxtImg :src="slide.src" :alt="slide.alt" class="slide-image" />
        <div class="slide-content">
          <h2 class="slide-text">{{ slide.text }}</h2>
        </div>
      </div>

      <button
        class="nav-button prev"
        aria-label="Previous slide"
        @click="prevSlide"
      >
        &#10094;
      </button>
      <button
        class="nav-button next"
        aria-label="Next slide"
        @click="nextSlide"
      >
        &#10095;
      </button>

      <div class="dots-container">
        <span
          v-for="(slide, index) in slides"
          :key="index"
          :class="['dot', { active: currentSlide === index }]"
          :aria-label="`Go to slide ${index + 1}`"
          @click="goToSlide(index)"
        ></span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const slides = [
  {
    src: "/images/find-you-anywhere-slide.jpg",
    text: "Permite a las personas encontrarte",
    alt: "Mujer usando el teléfono",
  },
  {
    src: "/images/data-analisys-slide.jpg",
    text: "Visualiza tu negocio desde tus dispositivos",
    alt: "Persona utilizando una laptop, mostrando gráficos de análisis",
  },
  {
    src: "/images/automation-slide.jpg",
    text: "Automatiza tus Procesos",
    alt: "Persona utilizando una tablet para pagar en el supermercado",
  },
  {
    src: "/images/enhance-user-experience-slide.jpg",
    text: "Da una increíble experiencia a tus clientes",
    alt: "Persona utilizando su teléfono mientras espera",
  },
];

const currentSlide = ref(0);
let slideInterval;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
};

const goToSlide = (index) => {
  currentSlide.value = index;
};

const startAutoplay = () => {
  slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
};

const stopAutoplay = () => {
  clearInterval(slideInterval);
};

onMounted(() => {
  startAutoplay();
});

onUnmounted(() => {
  stopAutoplay();
});
</script>

<style scoped>
.hero-slider {
  position: relative;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  max-height: 80vh; /* Limit height for hero section */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-background); /* Fallback background */
}

.slider-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
}

.slide.active {
  opacity: 1;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures the image covers the area */
  filter: brightness(0.6); /* Darken image for better text contrast */
}

#slide-1 .slide-image {
  object-position: 81% 50%;
}

#slide-3 .slide-image {
  object-position: 71% 50%;
}

#slide-4 .slide-image {
  object-position: 36% 50%;
}

.slide-content {
  position: absolute;
  color: var(--color-title-light); /* Using light text color for contrast */
  text-align: center;
  padding: 1rem;
  max-width: 80%;
  z-index: 10;
}

.slide-text {
  font-size: clamp(1.8rem, 5vw, 3.5rem);
  font-weight: 700;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
  margin: 0;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 1rem 0.8rem;
  cursor: pointer;
  z-index: 20;
  font-size: 1.5rem;
  border-radius: 0.3rem;
  transition: background-color 0.3s ease;
}

.nav-button:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.nav-button.prev {
  left: 1rem;
}

.nav-button.next {
  right: 1rem;
}

.dots-container {
  position: absolute;
  bottom: 1rem;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  z-index: 20;
}

.dot {
  width: 10px;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
}

.dot.active {
  background-color: var(--color-primary); /* Use primary color for active dot */
  transform: scale(1.2);
}

/* Fluid responsiveness */
@media (max-width: 768px) {
  .slide-text {
    font-size: clamp(1.5rem, 6vw, 2.5rem);
  }
  .nav-button {
    padding: 0.7rem 0.5rem;
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .slide-text {
    font-size: clamp(1.2rem, 7vw, 2rem);
  }
  .nav-button {
    padding: 0.5rem 0.3rem;
    font-size: 1rem;
  }
  .nav-button.prev {
    left: 0.5rem;
  }
  .nav-button.next {
    right: 0.5rem;
  }
  .dots-container {
    bottom: 0.5rem;
    gap: 0.3rem;
  }
  .dot {
    width: 8px;
    height: 8px;
  }
}
</style>
