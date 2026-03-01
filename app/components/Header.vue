<template>
  <header class="header">
    <div class="header-container">
      <div class="header-flex">
        <div class="header-logo-wrapper">
          <a href="/" class="header-logo">Digity</a>
        </div>
        <nav class="header-nav-desktop">
          <a href="#servicios" class="header-nav-link">Servicios</a>
          <a href="#contacto" class="header-nav-link">Contacto</a>
        </nav>
        <div class="header-mobile-toggle">
          <!-- Mobile menu button -->
          <button @click="toggleMenu" class="header-menu-btn">
            <span class="sr-only">Abrir menú</span>
            <!-- Icon for menu -->
            <svg
              class="header-menu-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <!-- Mobile menu -->
    <div v-if="isMenuOpen" class="header-mobile-menu">
      <div class="header-mobile-content">
        <a href="#servicios" class="header-mobile-link">Servicios</a>
        <a href="#contacto" class="header-mobile-link">Contacto</a>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<style scoped>
.header {
  background-color: #ffffff;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.header-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .header-container {
    padding: 0 1.5rem;
  }
}

@media (min-width: 1024px) {
  .header-container {
    padding: 0 2rem;
  }
}

.header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.header-logo-wrapper {
  display: flex;
  align-items: center;
}

.header-logo {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
  color: var(--color-primary);
  text-decoration: none;
}

.header-nav-desktop {
  display: none;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .header-nav-desktop {
    display: flex;
  }
}

.header-nav-link {
  color: #374151;
  text-decoration: none;
}

.header-nav-link:hover {
  color: var(--color-primary);
}

.header-mobile-toggle {
  display: block;
}

@media (min-width: 768px) {
  .header-mobile-toggle {
    display: none;
  }
}

.header-menu-btn {
  color: #374151;
  background: none;
  border: none;
  cursor: pointer;
}

.header-menu-btn:hover {
  color: var(--color-primary);
}

.header-menu-icon {
  height: 1.5rem;
  width: 1.5rem;
}

.header-mobile-menu {
  display: block;
}

@media (min-width: 768px) {
  .header-mobile-menu {
    display: none;
  }
}

.header-mobile-content {
  padding: 0.5rem 0.5rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

@media (min-width: 640px) {
  .header-mobile-content {
    padding: 0.5rem 0.75rem 0.75rem;
  }
}

.header-mobile-link {
  display: block;
  padding: 0.5rem 0.75rem;
  color: #374151;
  text-decoration: none;
}

.header-mobile-link:hover {
  color: var(--color-primary);
}
</style>
