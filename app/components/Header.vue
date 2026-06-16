<script setup lang="ts">
const { isAuthenticated } = useAuth();
</script>

<template>
  <header class="header">
    <div class="header-container">
      <nav class="header-flex" aria-label="Navegación principal">
        <div class="header-logo-wrapper">
          <NuxtLink to="/" class="header-logo">DIGITY</NuxtLink>
        </div>
        <div class="header-actions">
          <ClientOnly>
            <NuxtLink
              v-if="isAuthenticated"
              class="header-account"
              to="/account"
            >
              Mi cuenta
            </NuxtLink>
            <NuxtLink v-else class="header-account" to="/login">
              Iniciar sesión
            </NuxtLink>
            <template #fallback>
              <NuxtLink class="header-account" to="/login">
                Iniciar sesión
              </NuxtLink>
            </template>
          </ClientOnly>
          <a
            class="header-cta"
            href="https://calendar.app.google/FCze9HJAwEusva2W6"
            target="_blank"
            rel="noopener noreferrer"
          >
            Consulta gratis
          </a>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: color-mix(in srgb, var(--color-background) 80%, transparent);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
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
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.header-logo-wrapper {
  display: flex;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: clamp(0.6rem, 2vw, 1.25rem);
}

.header-account {
  white-space: nowrap;
  font-size: clamp(0.875rem, 0.8rem + 0.3vw, 1rem);
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.header-account:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

.header-account:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 2px;
}

.header-logo {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
  color: var(--color-primary);
  text-decoration: none;
}

.header-cta {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  padding: 0.55rem 1.25rem;
  font-size: clamp(0.875rem, 0.8rem + 0.3vw, 1rem);
  font-weight: 600;
  color: var(--color-text-light);
  background-color: var(--color-primary);
  border-radius: 0.5rem;
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.header-cta:hover {
  background-color: var(--color-primary-dark);
}

.header-cta:focus-visible {
  outline: 2px solid var(--color-primary-dark);
  outline-offset: 2px;
}
</style>
