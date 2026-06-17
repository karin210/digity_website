<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
  /** Whether this form registers a new account or logs in an existing one. */
  mode: "login" | "register";
}>();

const { register, login, loginWithGoogle, isAuthenticated } = useAuth();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const loading = ref(false);

const emailInput = ref<HTMLInputElement | null>(null);
const emailError = ref("");

/**
 * Validates the email field on focus out using the input's native
 * constraint validation, surfacing an on-brand Spanish message. An empty
 * field is left untouched so the user is not nagged before typing.
 */
function validateEmail(): void {
  const input = emailInput.value;
  if (!input || email.value === "") {
    emailError.value = "";
    return;
  }
  emailError.value = input.validity.typeMismatch
    ? "Ingresa un correo electrónico válido."
    : "";
}

const isRegister = computed<boolean>(() => props.mode === "register");

/** Mirrors the `type="email"` + `minlength="6"` input constraints. */
const isEmailValid = computed<boolean>(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value),
);
const isPasswordValid = computed<boolean>(() => password.value.length >= 6);

/**
 * Whether every required field for the current mode holds valid data. Drives
 * both the submit button's disabled state and a guard in `handleSubmit`, so no
 * request is ever sent with incomplete or malformed input.
 */
const isFormValid = computed<boolean>(() => {
  if (!isEmailValid.value || !isPasswordValid.value) {
    return false;
  }
  if (isRegister.value) {
    return name.value.trim() !== "" && confirmPassword.value === password.value;
  }
  return true;
});

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
  if (loading.value || !isFormValid.value) {
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

async function handleGoogle(): Promise<void> {
  if (loading.value) {
    return;
  }
  errorMessage.value = "";

  loading.value = true;
  try {
    await loginWithGoogle();
    if (isAuthenticated.value) {
      await navigateTo("/account");
    }
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
          ref="emailInput"
          v-model="email"
          class="auth__input"
          :class="{ 'auth__input--invalid': emailError }"
          type="email"
          autocomplete="email"
          placeholder="tucorreo@ejemplo.com"
          required
          :disabled="loading"
          :aria-invalid="emailError ? 'true' : undefined"
          :aria-describedby="emailError ? 'auth-email-error' : undefined"
          @blur="validateEmail"
          @input="emailError = ''"
        />
        <p
          v-if="emailError"
          id="auth-email-error"
          class="auth__field-error"
          role="alert"
        >
          {{ emailError }}
        </p>
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

      <button
        class="auth__submit"
        type="submit"
        :disabled="loading || !isFormValid"
      >
        {{ loading ? "Procesando..." : submitLabel }}
      </button>

      <div class="auth__divider" role="separator" aria-hidden="true">
        <span class="auth__divider-text">o</span>
      </div>

      <button
        class="auth__google"
        type="button"
        :disabled="loading"
        @click="handleGoogle"
      >
        <svg
          class="auth__google-icon"
          viewBox="0 0 18 18"
          width="18"
          height="18"
          aria-hidden="true"
        >
          <path
            fill="#4285F4"
            d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
          />
          <path
            fill="#34A853"
            d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
          />
          <path
            fill="#FBBC05"
            d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
          />
          <path
            fill="#EA4335"
            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
          />
        </svg>
        Continuar con Google
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

.auth__input--invalid {
  border-color: #b42318;
  background: #fef3f2;
}

.auth__input--invalid:focus {
  outline-color: #b42318;
}

.auth__field-error {
  margin: 0;
  font-size: clamp(0.78rem, 1.6vw, 0.85rem);
  color: #b42318;
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

.auth__divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.25rem 0;
  color: var(--color-text-muted);
}

.auth__divider::before,
.auth__divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.auth__divider-text {
  font-size: clamp(0.78rem, 1.6vw, 0.85rem);
  text-transform: lowercase;
}

.auth__google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  min-height: 44px;
  padding: 0.7rem 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  background: #ffffff;
  color: var(--color-text-dark);
  font-family: inherit;
  font-size: clamp(0.9rem, 2vw, 1rem);
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    opacity 0.2s ease;
}

.auth__google:hover:not(:disabled) {
  background: var(--color-background);
  border-color: var(--color-secondary);
}

.auth__google:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.auth__google:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth__google-icon {
  flex-shrink: 0;
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
