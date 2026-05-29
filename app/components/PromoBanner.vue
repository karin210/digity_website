<template>
  <aside class="promo" aria-label="Promoción por tiempo limitado">
    <p class="promo__message">
      <span class="promo__percent">30%</span>
      <span class="promo__detail">de descuento en todos nuestros servicios</span>
    </p>
    <span class="promo__sep" aria-hidden="true">·</span>
    <span class="promo__deadline">Hasta el 1 de julio</span>
  </aside>
</template>

<script setup lang="ts"></script>

<style scoped>
/* Full-width secondary header, fixed directly below the main header (~4rem tall). */
.promo {
  box-sizing: border-box;
  position: fixed;
  top: 4rem;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 9;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem 0.85rem;
  padding: clamp(0.45rem, 1.5vw, 0.7rem) clamp(1rem, 4vw, 2rem);
  text-align: center;
  color: var(--color-text-light);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--color-primary) 92%, transparent),
    color-mix(in srgb, var(--color-primary-dark) 95%, transparent)
  );
  border-bottom: 1px solid color-mix(in srgb, var(--color-text-light) 25%, transparent);
  box-shadow: 0 0.25rem 1rem color-mix(in srgb, var(--color-text-dark) 30%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: promo-in 0.6s ease both;
}

@keyframes promo-in {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.promo__message {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem;
  margin: 0;
}

.promo__percent {
  font-size: clamp(1rem, 1.5vw, 1.3rem);
  font-weight: 800;
  line-height: 1;
}

.promo__detail {
  font-size: clamp(0.72rem, 1vw, 0.88rem);
  font-weight: 500;
}

.promo__sep {
  color: var(--color-primary-light);
  opacity: 0.7;
}

.promo__deadline {
  font-size: clamp(0.68rem, 0.95vw, 0.8rem);
  font-weight: 600;
  color: var(--color-primary-light);
}

@media (max-width: 600px) {
  .promo__sep {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .promo {
    animation: none;
  }
}
</style>
