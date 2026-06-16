<script setup lang="ts">
import { computed, ref } from "vue";

definePageMeta({
  middleware: "auth",
});

useSeoMeta({
  title: "Mi cuenta — Digity",
  robots: "noindex",
});

const { user, logout } = useAuth();

const displayName = computed<string>(
  () => user.value?.displayName?.trim() || "Cliente",
);
const email = computed<string>(() => user.value?.email ?? "");
const initial = computed<string>(() =>
  displayName.value.charAt(0).toUpperCase(),
);

const loggingOut = ref(false);

async function handleLogout(): Promise<void> {
  if (loggingOut.value) {
    return;
  }
  loggingOut.value = true;
  try {
    await logout();
    await navigateTo("/login");
  } finally {
    loggingOut.value = false;
  }
}
</script>

<template>
  <main class="account">
    <section class="account__card">
      <span class="account__avatar" aria-hidden="true">{{ initial }}</span>
      <h1 class="account__title">Hola, {{ displayName }}</h1>
      <p class="account__subtitle">Bienvenido a tu portal de cliente.</p>

      <dl class="account__details">
        <div class="account__row">
          <dt class="account__term">Nombre</dt>
          <dd class="account__value">{{ displayName }}</dd>
        </div>
        <div class="account__row">
          <dt class="account__term">Correo electrónico</dt>
          <dd class="account__value">{{ email }}</dd>
        </div>
      </dl>

      <button
        class="account__logout"
        type="button"
        :disabled="loggingOut"
        @click="handleLogout"
      >
        {{ loggingOut ? "Cerrando sesión..." : "Cerrar sesión" }}
      </button>
    </section>
  </main>
</template>

<style scoped>
.account {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: clamp(6rem, 12vh, 9rem) clamp(1rem, 4vw, 2rem) clamp(2rem, 6vh, 4rem);
  background: linear-gradient(
    160deg,
    var(--color-background-gradient-start),
    var(--color-background-gradient-end)
  );
}

.account__card {
  box-sizing: border-box;
  width: min(100%, 30rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0.75rem, 2vw, 1rem);
  background: #ffffff;
  padding: clamp(1.75rem, 5vw, 2.75rem);
  border-radius: clamp(0.75rem, 2vw, 1.25rem);
  border: 1px solid var(--color-border);
  box-shadow: 0 10px 30px var(--color-shadow);
  text-align: center;
}

.account__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(3.5rem, 12vw, 4.5rem);
  height: clamp(3.5rem, 12vw, 4.5rem);
  border-radius: 50%;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: clamp(1.5rem, 5vw, 2rem);
  font-weight: 700;
}

.account__title {
  margin: 0;
  font-size: clamp(1.4rem, 4vw, 1.85rem);
  font-weight: 700;
  color: var(--color-text-dark);
}

.account__subtitle {
  margin: 0 0 clamp(0.5rem, 2vw, 1rem);
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  color: var(--color-text-muted);
}

.account__details {
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.account__row {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: clamp(0.6rem, 2vw, 0.85rem) clamp(0.75rem, 2vw, 1rem);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  text-align: left;
}

.account__term {
  margin: 0;
  font-size: clamp(0.75rem, 1.6vw, 0.82rem);
  font-weight: 600;
  color: var(--color-text-muted);
}

.account__value {
  margin: 0;
  font-size: clamp(0.9rem, 2vw, 1rem);
  color: var(--color-text-dark);
  word-break: break-word;
}

.account__logout {
  margin-top: clamp(0.5rem, 2vw, 1rem);
  min-height: 44px;
  width: 100%;
  padding: 0.7rem 1.25rem;
  border: 1px solid var(--color-primary);
  border-radius: 0.5rem;
  background: transparent;
  color: var(--color-primary);
  font-family: inherit;
  font-size: clamp(0.9rem, 2vw, 1rem);
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    opacity 0.2s ease;
}

.account__logout:hover:not(:disabled) {
  background: var(--color-primary);
  color: var(--color-text-light);
}

.account__logout:focus-visible {
  outline: 2px solid var(--color-primary-dark);
  outline-offset: 2px;
}

.account__logout:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
