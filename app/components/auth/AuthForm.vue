<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
  /** Whether this form registers a new account or logs in an existing one. */
  mode: "login" | "register";
}>();

const { register, login } = useAuth();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const loading = ref(false);

const isRegister = computed<boolean>(() => props.mode === "register");

const heading = computed<string>(() =>
  isRegister.value ? "Crea tu cuenta" : "Inicia sesión",
);
const subtitle = computed<string>(() =>
  isRegister.value
    ? "Regístrate para acceder a tu portal de cliente."
    : "Bienvenido de nuevo. Ingresa a tu cuenta.",
);
const submitLabel = computed<string>(() =>
  isRegister.value ? "Crear cuenta" : "Entrar",
);

async function handleSubmit(): Promise<void> {
  if (loading.value) {
    return;
  }
  errorMessage.value = "";

  if (isRegister.value && password.value !== confirmPassword.value) {
    errorMessage.value = "Las contraseñas no coinciden.";
    return;
  }

  loading.value = true;
  try {
    if (isRegister.value) {
      await register(email.value, password.value, name.value);
    } else {
      await login(email.value, password.value);
    }
    await navigateTo("/account");
  } catch (error: unknown) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : "Ocurrió un error. Por favor, intenta de nuevo.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="auth">
    <form class="auth__card" novalidate @submit.prevent="handleSubmit">
      <h1 class="auth__title">{{ heading }}</h1>
      <p class="auth__subtitle">{{ subtitle }}</p>

      <div v-if="isRegister" class="auth__field">
        <label class="auth__label" for="auth-name">Nombre</label>
        <input
          id="auth-name"
          v-model="name"
          class="auth__input"
          type="text"
          autocomplete="name"
          placeholder="Tu nombre"
          required
          :disabled="loading"
        />
      </div>

      <div class="auth__field">
        <label class="auth__label" for="auth-email">Correo electrónico</label>
        <input
          id="auth-email"
          v-model="email"
          class="auth__input"
          type="email"
          autocomplete="email"
          placeholder="tucorreo@ejemplo.com"
          required
          :disabled="loading"
        />
      </div>

      <div class="auth__field">
        <label class="auth__label" for="auth-password">Contraseña</label>
        <input
          id="auth-password"
          v-model="password"
          class="auth__input"
          type="password"
          :autocomplete="isRegister ? 'new-password' : 'current-password'"
          placeholder="••••••••"
          required
          minlength="6"
          :disabled="loading"
        />
      </div>

      <div v-if="isRegister" class="auth__field">
        <label class="auth__label" for="auth-confirm">
          Confirmar contraseña
        </label>
        <input
          id="auth-confirm"
          v-model="confirmPassword"
          class="auth__input"
          type="password"
          autocomplete="new-password"
          placeholder="••••••••"
          required
          minlength="6"
          :disabled="loading"
        />
      </div>

      <p v-if="errorMessage" class="auth__error" role="alert">
        {{ errorMessage }}
      </p>

      <button class="auth__submit" type="submit" :disabled="loading">
        {{ loading ? "Procesando..." : submitLabel }}
      </button>

      <p class="auth__switch">
        <template v-if="isRegister">
          ¿Ya tienes una cuenta?
          <NuxtLink class="auth__link" to="/login">Inicia sesión</NuxtLink>
        </template>
        <template v-else>
          ¿No tienes una cuenta?
          <NuxtLink class="auth__link" to="/register">Regístrate</NuxtLink>
        </template>
      </p>
    </form>
  </section>
</template>

<style scoped>
.auth {
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

.auth__card {
  box-sizing: border-box;
  width: min(100%, 28rem);
  display: flex;
  flex-direction: column;
  gap: clamp(0.75rem, 2vw, 1rem);
  background: #ffffff;
  padding: clamp(1.5rem, 5vw, 2.5rem);
  border-radius: clamp(0.75rem, 2vw, 1.25rem);
  border: 1px solid var(--color-border);
  box-shadow: 0 10px 30px var(--color-shadow);
}

.auth__title {
  margin: 0;
  font-size: clamp(1.4rem, 4vw, 1.85rem);
  font-weight: 700;
  color: var(--color-text-dark);
  text-align: center;
}

.auth__subtitle {
  margin: 0 0 clamp(0.5rem, 2vw, 1rem);
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  color: var(--color-text-muted);
  text-align: center;
}

.auth__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.auth__label {
  font-size: clamp(0.8rem, 1.8vw, 0.9rem);
  font-weight: 600;
  color: var(--color-text-dark);
}

.auth__input {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: clamp(0.6rem, 1.8vw, 0.75rem) clamp(0.65rem, 2vw, 0.85rem);
  font-size: clamp(0.9rem, 2vw, 0.95rem);
  font-family: inherit;
  color: var(--color-text-dark);
  background: #fafafa;
  transition: border-color 0.2s ease;
}

.auth__input:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 1px;
}

.auth__input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth__error {
  margin: 0;
  font-size: clamp(0.82rem, 1.8vw, 0.9rem);
  color: #b42318;
  background: #fef3f2;
  border: 1px solid #fecdca;
  border-radius: 0.5rem;
  padding: 0.6rem 0.8rem;
}

.auth__submit {
  margin-top: 0.25rem;
  min-height: 44px;
  padding: 0.7rem 1.25rem;
  border: none;
  border-radius: 0.5rem;
  background: var(--color-primary);
  color: var(--color-text-light);
  font-family: inherit;
  font-size: clamp(0.9rem, 2vw, 1rem);
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    opacity 0.2s ease;
}

.auth__submit:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.auth__submit:focus-visible {
  outline: 2px solid var(--color-primary-dark);
  outline-offset: 2px;
}

.auth__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth__switch {
  margin: 0;
  font-size: clamp(0.82rem, 1.8vw, 0.9rem);
  color: var(--color-text-muted);
  text-align: center;
}

.auth__link {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
}

.auth__link:hover {
  text-decoration: underline;
}

.auth__link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 2px;
}
</style>
