<script setup lang="ts">
import { ref, computed, watch } from "vue";
import HeroSlider from "~/components/HeroSlider.vue";
import {
  businessTypes,
  industries,
  businessIndustryMap,
  allServices,
} from "../../utils/servicesData";

const chatMessage = ref("");
const chatReply = ref("");
const chatServices = ref<string[]>([]);
const chatLoading = ref(false);

async function sendChatMessage() {
  if (!chatMessage.value.trim() || chatLoading.value) return;

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
  } catch {
    chatReply.value =
      "Ocurrió un error al procesar tu mensaje. Por favor, intenta de nuevo.";
  } finally {
    chatLoading.value = false;
  }
}
</script>

<template>
  <main class="page">
    <HeroSlider />
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
            :disabled="chatLoading"
          />
          <button
            class="chatbot__send-btn"
            :disabled="chatLoading || !chatMessage.trim()"
            @click="sendChatMessage"
          >
            {{ chatLoading ? "..." : "Enviar" }}
          </button>
        </div>

        <div v-if="chatReply" class="chatbot__response">
          <p class="chatbot__reply">{{ chatReply }}</p>
          <template v-if="chatServices.length > 0">
            <p class="chatbot__services-title">
              Servicios recomendados para ti:
            </p>
            <ul class="chatbot__services-list" role="list">
              <li
                v-for="service in chatServices"
                :key="service"
                class="chatbot__service-item"
              >
                <span class="service-icon">✨</span>
                <span>{{ service }}</span>
              </li>
            </ul>
          </template>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
:root {
  color-scheme: light;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.page {
  min-height: 100dvh;
  background-color: #fafafa;
  color: var(--color-text-dark);
}

.hero {
  width: 100%;
  padding: clamp(2rem, 5vw, 6rem) clamp(1rem, 4vw, 2rem);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.hero__content {
  width: min(100%, 1200px);
  display: grid;
  gap: 1.5rem;
  justify-items: center;
}

.hero__eyebrow {
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #262c2a;
  font-size: clamp(1.125rem, 2.5vw, 1.25rem);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0.72rem 1.1rem;
  border-radius: 0.65rem;
  border: 2px solid transparent;
  text-decoration: none;
  font-weight: 600;
  line-height: 1.2;
  transition:
    transform 0.15s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.button:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

.button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px var(--color-shadow);
}

.button--primary {
  background: var(--color-primary);
  color: var(--color-text-light);
  box-shadow: 0 8px 22px var(--color-shadow);
}

.button--primary:hover {
  background: var(--color-primary-dark);
}

.solutions {
  margin: 0 auto;
  margin-top: clamp(1.25rem, 4vw, 2.5rem);
  width: 85vw;
  max-width: min(85vw, 1000px);
  background: #ffffff;
  padding: clamp(1rem, 4vw, 2rem);
  border-radius: clamp(0.65rem, 2vw, 1rem);
  box-shadow: 0 10px 30px var(--color-shadow);
}

.solutions__title {
  margin: 0 0 clamp(1rem, 2.5vw, 1.5rem);
  font-size: clamp(1.05rem, 2.4vw, 1.25rem);
  font-weight: 700;
  text-align: center;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(0.5rem, 2vw, 1rem);
  margin-bottom: clamp(1rem, 2.5vw, 1.5rem);
  border-bottom: 2px solid var(--color-background-gradient-start);
  padding-bottom: 0.5rem;
}

.tab {
  background: none;
  border: none;
  font-size: clamp(0.9rem, 2.2vw, 1rem);
  font-weight: 600;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: clamp(0.45rem, 1.5vw, 0.6rem) clamp(0.75rem, 2.4vw, 1rem);
  position: relative;
  transition: color 0.2s ease;
}

.tab:hover {
  color: var(--color-primary);
}

.tab--active {
  color: var(--color-primary);
}

.tab--active::after {
  content: "";
  position: absolute;
  bottom: -0.65rem;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--color-primary);
  border-radius: 2px;
}

.filter-box {
  background-color: var(--color-primary-light);
  padding: clamp(0.9rem, 3vw, 1.25rem);
  border-radius: clamp(0.45rem, 1.8vw, 0.5rem);
  margin-bottom: clamp(1rem, 2.8vw, 1.5rem);
  animation: fadeIn 0.3s ease-in-out;
}

.filter__label {
  display: block;
  margin: 0 0 0.5rem;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  font-weight: 600;
  color: var(--color-primary-dark);
  text-align: left;
}

.filter-search {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: clamp(0.6rem, 1.8vw, 0.7rem) clamp(0.65rem, 2vw, 0.8rem);
  font-size: clamp(0.9rem, 2vw, 0.95rem);
  margin-bottom: 0.5rem;
  color: var(--color-text-dark);
  background: #ffffff;
}

.filter-search:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 1px;
}

.filter__hint {
  margin: 0 0 0.75rem;
  font-size: clamp(0.8rem, 1.8vw, 0.88rem);
  color: var(--color-text-muted);
  text-align: left;
}

.industry-filter {
  display: flex;
  gap: clamp(0.35rem, 1.5vw, 0.55rem);
  overflow-x: auto;
  padding-bottom: 0.25rem;
  margin-bottom: 0.9rem;
  scrollbar-width: thin;
  -webkit-overflow-scrolling: touch;
}

.industry-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid var(--color-border);
  background: #ffffff;
  color: var(--color-text-dark);
  border-radius: 999px;
  padding: clamp(0.4rem, 1.4vw, 0.5rem) clamp(0.65rem, 2vw, 0.8rem);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: clamp(0.76rem, 1.8vw, 0.84rem);
  min-height: 38px;
}

.industry-chip:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.industry-chip--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #ffffff;
}

.industry-chip__icon {
  font-size: 0.95rem;
  line-height: 1;
}

.industry-chip__label {
  line-height: 1;
}

.filter__empty {
  margin: 0 0 clamp(0.6rem, 2vw, 0.85rem);
  font-size: clamp(0.82rem, 1.9vw, 0.9rem);
  color: var(--color-text-muted);
  text-align: left;
}

.filter__subheading {
  margin: 0 0 clamp(0.5rem, 1.8vw, 0.75rem);
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  font-weight: 600;
  color: var(--color-primary-dark);
  text-align: left;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(0.4rem, 1.5vw, 0.6rem);
}

.filter-btn {
  background: #ffffff;
  border: 1px solid var(--color-border);
  color: var(--color-text-dark);
  padding: clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.8rem, 2.5vw, 1rem);
  border-radius: 2rem;
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 38px;
}

.filter-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.filter-btn--active {
  background: var(--color-primary);
  color: #ffffff;
  border-color: var(--color-primary);
}

.filter-btn--active:hover {
  color: #ffffff;
}

.services__title {
  margin: 0 0 clamp(0.6rem, 2vw, 0.9rem);
  font-size: clamp(1rem, 2.4vw, 1.15rem);
  font-weight: 700;
  color: var(--color-text-dark);
  text-align: left;
}

.services-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr));
  gap: clamp(0.7rem, 2vw, 1rem);
}

.service-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(0.9rem, 2vw, 1rem);
  color: var(--color-text-dark);
  background: var(--color-background);
  padding: clamp(0.65rem, 1.8vw, 0.8rem) clamp(0.8rem, 2.2vw, 1rem);
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  animation: fadeIn 0.3s ease-in-out;
}

.service-icon {
  font-size: 1.2rem;
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

.text-blue {
  color: var(--color-primary);
}

@media (max-width: 900px) {
  .hero__content {
    width: min(100%, 900px);
    gap: clamp(1rem, 3vw, 1.4rem);
  }

  .industry-chip__label {
    max-width: 22ch;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media (max-width: 640px) {
  .hero {
    padding: clamp(1rem, 5vw, 1.5rem) clamp(0.8rem, 4vw, 1rem);
  }

  .hero__actions {
    flex-direction: column;
    width: 100%;
    gap: 0.75rem;
  }

  .button {
    width: 100%;
  }

  .tabs {
    gap: 0.4rem;
  }

  .tab {
    flex: 1 1 auto;
  }

  .industry-filter {
    margin-inline: -0.2rem;
    padding-inline: 0.2rem;
  }
}

@media (max-width: 420px) {
  .solutions {
    padding: 0.85rem;
    border-radius: 0.6rem;
  }

  .filter-box {
    padding: 0.75rem;
  }

  .services-list {
    grid-template-columns: 1fr;
  }

  .service-item {
    min-height: 42px;
  }
}

.chatbot-section {
  display: flex;
  justify-content: center;
  padding: clamp(1.5rem, 4vw, 3rem) clamp(1rem, 4vw, 2rem);
}

.chatbot {
  width: 85vw;
  max-width: min(85vw, 1000px);
  background: #ffffff;
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
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr));
  gap: clamp(0.7rem, 2vw, 1rem);
}

.chatbot__service-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(0.88rem, 2vw, 0.97rem);
  color: var(--color-text-dark);
  background: var(--color-background);
  padding: clamp(0.55rem, 1.6vw, 0.7rem) clamp(0.75rem, 2vw, 0.9rem);
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
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
