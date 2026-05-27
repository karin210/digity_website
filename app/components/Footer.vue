<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <p class="footer-phone">
        <span class="footer-contact">Contacto: </span>
        <a href="tel:4431332455" class="footer-phone-link">443 133 2455</a>
      </p>
      <p class="footer-copy">
        &copy; {{ year }} Digity. Todos los derechos reservados.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<style scoped>
.site-footer {
  box-sizing: border-box;
  width: 100%;
  background: rgba(41, 65, 135, 0.12);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid rgba(197, 206, 232, 0.4);
}

.footer-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: clamp(0.5rem, 2vw, 1.5rem);
  padding: clamp(0.75rem, 2vw, 1.25rem) clamp(1rem, 5vw, 3rem);
}

.footer-contact {
  margin: 0;
  font-size: clamp(0.85rem, 1.4vw, 1rem);
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: 0.03em;
}

.footer-phone {
  margin: 0;
  color: var(--color-text-muted);
}

.footer-phone-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.footer-phone-link:hover,
.footer-phone-link:focus-visible {
  color: var(--color-primary-dark);
  text-decoration: underline;
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 2px;
}

.footer-copy {
  margin: 0;
  font-size: clamp(0.75rem, 1.2vw, 0.875rem);
  color: var(--color-text-muted);
}
</style>
