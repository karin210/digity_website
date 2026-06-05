<script setup lang="ts">
import { computed, ref } from "vue";

/** Maximum messages a visitor can send per browser session. */
const MAX_MESSAGES_PER_SESSION = 10;
/** Maximum length of a single message (kept in sync with the server). */
const MAX_MESSAGE_LENGTH = 500;

const chatMessage = ref("");
const chatReply = ref("");
const chatServices = ref<string[]>([]);
const chatLoading = ref(false);
const messageCount = ref(0);

const limitReached = computed(
  () => messageCount.value >= MAX_MESSAGES_PER_SESSION,
);

async function sendChatMessage(): Promise<void> {
  if (!chatMessage.value.trim() || chatLoading.value || limitReached.value) {
    return;
  }

  chatLoading.value = true;
  chatReply.value = "";
  chatServices.value = [];

  try {
    const response = await $fetch<{ reply: string; services: string[] }>(
      "/api/chat/chat",
      {
        method: "POST",
        body: { message: chatMessage.value },
      },
    );
    chatReply.value = response.reply;
    chatServices.value = response.services;
    messageCount.value += 1;
  } catch (error: unknown) {
    const statusCode =
      typeof error === "object" && error !== null && "statusCode" in error
        ? (error as { statusCode: number }).statusCode
        : undefined;

    if (statusCode === 429) {
      chatReply.value =
        "Has enviado demasiados mensajes en poco tiempo. Por favor, espera unos minutos antes de intentar de nuevo.";
      messageCount.value = MAX_MESSAGES_PER_SESSION;
    } else {
      chatReply.value =
        "Ocurrió un error al procesar tu mensaje. Por favor, intenta de nuevo.";
    }
  } finally {
    chatLoading.value = false;
  }
}
</script>

<template>
  <section class="chatbot-section">
    <div class="chatbot">
      <h3 class="chatbot__title">Cuéntanos sobre tu negocio</h3>
      <p class="chatbot__subtitle">
        Describe tu negocio y te recomendaremos los servicios ideales para ti.
      </p>

      <div class="chatbot__input-row">
        <input
          v-model="chatMessage"
          class="chatbot__input"
          type="text"
          placeholder="Ejemplo: Tengo una barbería en Monterrey..."
          :maxlength="MAX_MESSAGE_LENGTH"
          :disabled="chatLoading || limitReached"
        />
        <button
          class="chatbot__send-btn"
          :disabled="chatLoading || limitReached || !chatMessage.trim()"
          @click="sendChatMessage"
        >
          {{ chatLoading ? "..." : "Enviar" }}
        </button>
      </div>

      <p v-if="limitReached" class="chatbot__limit-notice" role="status">
        Has alcanzado el límite de mensajes de esta sesión. Si necesitas más
        ayuda, escríbenos directamente y con gusto te atendemos.
      </p>

      <div v-if="chatReply" class="chatbot__response">
        <p class="chatbot__reply">{{ chatReply }}</p>
        <template v-if="chatServices.length > 0">
          <p class="chatbot__services-title">Servicios recomendados para ti:</p>
          <ul class="chatbot__services-list" role="list">
            <li
              v-for="service in chatServices"
              :key="service"
              class="chatbot__service-item"
            >
              <span>{{ service }}</span>
            </li>
          </ul>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.chatbot-section {
  display: flex;
  justify-content: center;
  width: 100%;
}

.chatbot {
  width: 85vw;
  max-width: min(85vw, 1000px);
  background: #ffffffed;
  padding: clamp(1rem, 4vw, 2rem);
  border-radius: clamp(0.65rem, 2vw, 1rem);
  box-shadow: 0 10px 30px var(--color-shadow);
}

.chatbot__title {
  margin: 0 0 0.4rem;
  font-size: clamp(1.05rem, 2.4vw, 1.25rem);
  font-weight: 700;
  text-align: center;
}

.chatbot__subtitle {
  margin: 0 0 clamp(1rem, 2.5vw, 1.5rem);
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  color: var(--color-text-muted);
  text-align: center;
}

.chatbot__input-row {
  display: flex;
  gap: 0.6rem;
}

.chatbot__input {
  flex: 1;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: clamp(0.6rem, 1.8vw, 0.7rem) clamp(0.65rem, 2vw, 0.8rem);
  font-size: clamp(0.9rem, 2vw, 0.95rem);
  color: var(--color-text-dark);
  background: #fafafa;
  transition: border-color 0.2s ease;
}

.chatbot__input:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 1px;
}

.chatbot__input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.chatbot__send-btn {
  min-height: 44px;
  padding: 0.6rem 1.25rem;
  border-radius: 0.5rem;
  border: none;
  background: var(--color-primary);
  color: #ffffff;
  font-weight: 600;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    opacity 0.2s ease;
  white-space: nowrap;
}

.chatbot__send-btn:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.chatbot__send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chatbot__limit-notice {
  margin: clamp(0.75rem, 2vw, 1rem) 0 0;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  color: var(--color-text-muted);
  text-align: center;
}

.chatbot__response {
  margin-top: clamp(1rem, 2.5vw, 1.5rem);
  animation: fadeIn 0.3s ease-in-out;
}

.chatbot__reply {
  margin: 0 0 clamp(0.75rem, 2vw, 1rem);
  font-size: clamp(0.9rem, 2vw, 1rem);
  color: var(--color-text-dark);
  line-height: 1.6;
}

.chatbot__services-title {
  margin: 0 0 0.6rem;
  font-size: clamp(0.9rem, 2vw, 1rem);
  font-weight: 700;
  color: var(--color-text-dark);
}

.chatbot__services-list {
  box-sizing: border-box;
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr));
  gap: clamp(0.7rem, 2vw, 1rem);
}

.chatbot__service-item {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(0.88rem, 2vw, 0.97rem);
  font-weight: 600;
  color: var(--color-text-dark);
  background: var(--color-background);
  padding: clamp(0.55rem, 1.6vw, 0.7rem) clamp(0.75rem, 2vw, 0.9rem);
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-primary);
  box-shadow: 0 2px 8px var(--color-shadow);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .chatbot__input-row {
    flex-direction: column;
  }

  .chatbot__send-btn {
    width: 100%;
  }

  .chatbot__services-list {
    grid-template-columns: 1fr;
  }
}
</style>
