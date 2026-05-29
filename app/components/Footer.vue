<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <p class="footer-phone">
        <span class="footer-contact">Contacto: </span>
        <a href="tel:4431332455" class="footer-phone-link">443 133 2455</a>
      </p>

      <button class="email-btn" type="button" @click="openModal">
        Enviar email a hola@digity.com.mx
      </button>

      <p class="footer-copy">
        &copy; {{ year }} Digity. Todos los derechos reservados.
      </p>
    </div>

    <dialog
      ref="dialogEl"
      class="email-dialog"
      aria-labelledby="dialog-title"
      @close="resetForm"
    >
      <form class="email-form" @submit.prevent="submitEmail">
        <h2 id="dialog-title" class="dialog-title">Enviar mensaje a Digity</h2>

        <div class="field-group">
          <label for="email-asunto" class="field-label">Asunto</label>
          <input
            id="email-asunto"
            v-model="form.asunto"
            class="field-input"
            type="text"
            placeholder="Ej. Consulta sobre sitio web con funcionalidad de citas en línea"
            maxlength="150"
            required
            :disabled="emailStatus === 'loading'"
          />
        </div>

        <div class="field-group">
          <label for="email-mensaje" class="field-label">Mensaje</label>
          <textarea
            id="email-mensaje"
            v-model="form.mensaje"
            class="field-input field-textarea"
            placeholder="Escribe tu mensaje aquí..."
            rows="5"
            maxlength="2000"
            required
            :disabled="emailStatus === 'loading'"
          />
        </div>

        <p v-if="emailStatus === 'error'" role="alert" class="status-error">
          {{ errorMessage }}
        </p>
        <p v-if="emailStatus === 'success'" role="email" class="status-success">
          ¡Mensaje enviado con éxito! Te responderemos pronto.
        </p>

        <div class="dialog-actions">
          <button
            v-if="emailStatus !== 'success'"
            type="button"
            class="btn-cancel"
            :disabled="emailStatus === 'loading'"
            @click="closeModal"
          >
            Cancelar
          </button>
          <button
            v-if="emailStatus !== 'success'"
            type="submit"
            class="btn-send"
            :disabled="emailStatus === 'loading'"
          >
            {{ emailStatus === "loading" ? "Enviando…" : "Enviar" }}
          </button>
          <button
            v-if="emailStatus === 'success'"
            type="button"
            class="btn-send"
            @click="closeModal"
          >
            Cerrar
          </button>
        </div>
      </form>
    </dialog>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();

const dialogEl = ref<HTMLDialogElement | null>(null);
const form = reactive({ asunto: "", mensaje: "" });
const emailStatus = ref<"idle" | "loading" | "success" | "error">("idle");
const errorMessage = ref("");

function openModal(): void {
  emailStatus.value = "idle";
  dialogEl.value?.showModal();
}

function closeModal(): void {
  dialogEl.value?.close();
}

function resetForm(): void {
  form.asunto = "";
  form.mensaje = "";
  emailStatus.value = "idle";
  errorMessage.value = "";
}

async function submitEmail(): Promise<void> {
  emailStatus.value = "loading";
  errorMessage.value = "";

  try {
    await $fetch("/api/email/send", {
      method: "POST",
      body: { asunto: form.asunto, mensaje: form.mensaje },
    });
    emailStatus.value = "success";
  } catch (err: unknown) {
    emailStatus.value = "error";
    const fetchErr = err as { data?: { statusMessage?: string } };
    errorMessage.value =
      fetchErr.data?.statusMessage ??
      "Error al enviar el mensaje. Inténtalo de nuevo.";
  }
}
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

/* ── Email trigger button ── */
.email-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  padding: 0.45em 1.1em;
  font-size: clamp(0.78rem, 1.2vw, 0.9rem);
  font-weight: 600;
  color: var(--color-primary);
  background: transparent;
  border: 1.5px solid var(--color-primary);
  border-radius: 6px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.email-btn:hover,
.email-btn:focus-visible {
  background: var(--color-primary);
  color: var(--color-text-light);
  outline: 2px solid var(--color-primary-dark);
  outline-offset: 2px;
}

/* ── Dialog ── */
.email-dialog {
  box-sizing: border-box;
  width: min(94vw, 30rem);
  padding: 0;
  border: none;
  border-radius: 12px;
  box-shadow: 0 8px 32px var(--color-shadow);
  background: var(--color-background-gradient-end);
}

.email-dialog::backdrop {
  background: rgba(13, 20, 40, 0.55);
  backdrop-filter: blur(4px);
}

.email-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  padding: clamp(1.25rem, 4vw, 2rem);
}

.dialog-title {
  margin: 0;
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-weight: 700;
  color: var(--color-primary);
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field-label {
  font-size: clamp(0.8rem, 1.3vw, 0.9rem);
  font-weight: 600;
  color: var(--color-text-dark);
}

.field-input {
  box-sizing: border-box;
  width: 100%;
  padding: 0.55em 0.8em;
  font-size: clamp(0.85rem, 1.4vw, 1rem);
  font-family: inherit;
  color: var(--color-text-dark);
  background: var(--color-background);
  border: 1.5px solid var(--color-border);
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s ease;
  resize: none;
}

.field-input:focus {
  border-color: var(--color-primary);
}

.field-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.field-textarea {
  line-height: 1.5;
  min-height: 8rem;
}

.status-error {
  margin: 0;
  font-size: clamp(0.78rem, 1.2vw, 0.875rem);
  color: #c0392b;
  background: #fdf0ef;
  border: 1px solid #e8b4b0;
  border-radius: 6px;
  padding: 0.5em 0.75em;
}

.status-success {
  margin: 0;
  font-size: clamp(0.78rem, 1.2vw, 0.875rem);
  color: #1a6b3c;
  background: #edfaf4;
  border: 1px solid #a3d9bc;
  border-radius: 6px;
  padding: 0.5em 0.75em;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.btn-cancel {
  padding: 0.5em 1.1em;
  font-size: clamp(0.82rem, 1.3vw, 0.925rem);
  font-weight: 600;
  font-family: inherit;
  color: var(--color-text-muted);
  background: transparent;
  border: 1.5px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    color 0.2s ease;
}

.btn-cancel:hover:not(:disabled),
.btn-cancel:focus-visible {
  border-color: var(--color-primary);
  color: var(--color-primary);
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.btn-send {
  padding: 0.5em 1.4em;
  font-size: clamp(0.82rem, 1.3vw, 0.925rem);
  font-weight: 600;
  font-family: inherit;
  color: var(--color-text-light);
  background: var(--color-primary);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-send:hover:not(:disabled),
.btn-send:focus-visible {
  background: var(--color-primary-dark);
  outline: 2px solid var(--color-primary-dark);
  outline-offset: 2px;
}

.btn-send:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
