<script setup>
import { ref, computed } from "vue";

const activeTab = ref("todas");
const selectedBusiness = ref("");
const businessTypeQuery = ref("");
const selectedIndustry = ref("");

const businessTypes = [
  "Restaurantes",
  "Hoteles",
  "Café",
  "Barbería",
  "Salón de belleza",
  "Servicios automotrices",
  "Venta de autos",
  "Agencia inmobiliaria",
  "Gimnasio",
  "Farmacia",
  "Clínica dental",
  "Hospital",
  "Laboratorio",
  "Despacho de abogados",
  "Consultora",
  "Firma de contabilidad",
  "Firma de auditoría",
  "Supermercado",
  "Tienda",
  "Boutique de moda",
  "Ferretería",
  "Constructora",
  "Reparación de electrónicos",
  "Salón de eventos",
  "Planeación de eventos",
  "Estudio de Fotografía",
  "Agencia de viajes",
  "Veterinaria",
  "Imprenta",
  "Coworking",
  "Otro",
];

const industries = [
  { id: "alimentos", name: "Alimentos y hospitalidad", icon: "🍽️" },
  { id: "belleza", name: "Belleza y bienestar", icon: "💇" },
  { id: "salud", name: "Salud", icon: "🏥" },
  { id: "profesional", name: "Servicios profesionales", icon: "💼" },
  { id: "comercio", name: "Comercio y retail", icon: "🛍️" },
  { id: "industrial", name: "Industrial y construcción", icon: "🏗️" },
  { id: "eventos", name: "Eventos y creativos", icon: "🎉" },
  { id: "movilidad", name: "Movilidad y viajes", icon: "🚗" },
  { id: "mas", name: "Otros", icon: "✨" },
];

const businessIndustryMap = {
  Restaurantes: "alimentos",
  Hoteles: "alimentos",
  Café: "alimentos",
  Barbería: "belleza",
  "Salón de belleza": "belleza",
  Gimnasio: "belleza",
  Farmacia: "salud",
  "Clínica dental": "salud",
  Hospital: "salud",
  Laboratorio: "salud",
  Veterinaria: "salud",
  "Despacho de abogados": "profesional",
  Consultora: "profesional",
  "Firma de contabilidad": "profesional",
  "Firma de auditoría": "profesional",
  "Agencia inmobiliaria": "profesional",
  Coworking: "profesional",
  Supermercado: "comercio",
  Tienda: "comercio",
  "Boutique de moda": "comercio",
  Ferretería: "comercio",
  Imprenta: "comercio",
  "Servicios automotrices": "industrial",
  Constructora: "industrial",
  "Reparación de electrónicos": "industrial",
  "Venta de autos": "movilidad",
  "Agencia de viajes": "movilidad",
  "Salón de eventos": "eventos",
  "Planeación de eventos": "eventos",
  "Estudio de Fotografía": "eventos",
  Otro: "mas",
};

const allServices = [
  {
    name: "Reservaciones en línea",
    types: [
      "Restaurantes",
      "Hoteles",
      "Café",
      "Salón de eventos",
      "Coworking",
      "Otro",
    ],
  },
  { name: "Página web", types: businessTypes },
  { name: "Manejo de redes sociales", types: businessTypes },
  {
    name: "Venta en línea",
    types: [
      "Supermercado",
      "Tienda",
      "Boutique de moda",
      "Ferretería",
      "Farmacia",
      "Venta de autos",
      "Imprenta",
      "Otro",
    ],
  },
  {
    name: "e-commerce",
    types: [
      "Supermercado",
      "Tienda",
      "Boutique de moda",
      "Ferretería",
      "Farmacia",
      "Imprenta",
      "Otro",
    ],
  },
  { name: "Notificaciones", types: businessTypes },
  {
    name: "Gestión de clientes",
    types: [
      "Barbería",
      "Salón de belleza",
      "Servicios automotrices",
      "Venta de autos",
      "Agencia inmobiliaria",
      "Gimnasio",
      "Clínica dental",
      "Hospital",
      "Laboratorio",
      "Despacho de abogados",
      "Consultora",
      "Firma de contabilidad",
      "Firma de auditoría",
      "Constructora",
      "Planeación de eventos",
      "Estudio de Fotografía",
      "Agencia de viajes",
      "Veterinaria",
      "Coworking",
      "Otro",
    ],
  },
  {
    name: "Optimización en buscadores (Google, Firefox y Edge)",
    types: businessTypes,
  },
  { name: "Panel de administración", types: businessTypes },
  { name: "Conexión con WhatsApp", types: businessTypes },
  {
    name: "Citas en línea",
    types: [
      "Barbería",
      "Salón de belleza",
      "Clínica dental",
      "Hospital",
      "Laboratorio",
      "Despacho de abogados",
      "Consultora",
      "Servicios automotrices",
      "Estudio de Fotografía",
      "Veterinaria",
      "Agencia inmobiliaria",
      "Otro",
    ],
  },
  {
    name: "Recordatorios automáticos por WhatsApp y correo electrónico",
    types: [
      "Barbería",
      "Salón de belleza",
      "Clínica dental",
      "Hospital",
      "Laboratorio",
      "Despacho de abogados",
      "Consultora",
      "Gimnasio",
      "Veterinaria",
      "Otro",
    ],
  },
  {
    name: "Cotizaciones automáticas",
    types: [
      "Servicios automotrices",
      "Venta de autos",
      "Constructora",
      "Reparación de electrónicos",
      "Salón de eventos",
      "Planeación de eventos",
      "Imprenta",
      "Agencia de viajes",
      "Otro",
    ],
  },
  {
    name: "Seguimiento post-servicio",
    types: [
      "Servicios automotrices",
      "Clínica dental",
      "Hospital",
      "Veterinaria",
      "Reparación de electrónicos",
      "Venta de autos",
      "Agencia de viajes",
      "Otro",
    ],
  },
  {
    name: "Inventario automático",
    types: [
      "Supermercado",
      "Tienda",
      "Boutique de moda",
      "Ferretería",
      "Farmacia",
      "Restaurantes",
      "Café",
      "Imprenta",
      "Otro",
    ],
  },
  { name: "Facturación electrónica", types: businessTypes },
  { name: "Monitoreo de métricas de negocio", types: businessTypes },
];

const shouldShowBusinessTypes = computed(() => {
  const hasQuery = businessTypeQuery.value.trim().length > 0;
  const hasIndustry = selectedIndustry.value.trim().length > 0;
  return hasQuery || hasIndustry;
});

const filteredBusinessTypes = computed(() => {
  const query = businessTypeQuery.value.trim().toLowerCase();

  return businessTypes.filter((biz) => {
    const matchesQuery = !query || biz.toLowerCase().includes(query);
    const matchesIndustry =
      !selectedIndustry.value ||
      businessIndustryMap[biz] === selectedIndustry.value;

    return matchesQuery && matchesIndustry;
  });
});

const displayedServices = computed(() => {
  if (activeTab.value === "todas") {
    return allServices.map((s) => s.name);
  } else {
    if (!selectedBusiness.value) return [];
    return allServices
      .filter((s) => s.types.includes(selectedBusiness.value))
      .map((s) => s.name);
  }
});
</script>

<template>
  <main class="page">
    <section class="hero">
      <div class="hero__content">
        <p class="hero__eyebrow">Software y marketing para tu empresa</p>

        <h1 class="hero__brand">Digity</h1>

        <div
          class="hero__actions"
          role="group"
          aria-label="Acciones principales"
        >
          <a class="button button--primary" href="#contacto"> Contactar </a>
        </div>

        <div class="solutions" aria-label="Nuestras soluciones">
          <h3 class="solutions__title">Descubre nuestras soluciones</h3>

          <div class="tabs" role="tablist">
            <button
              id="tab-para-mi"
              role="tab"
              :aria-selected="activeTab === 'para_mi'"
              :class="['tab', { 'tab--active': activeTab === 'para_mi' }]"
              @click="activeTab = 'para_mi'"
            >
              Para mí
            </button>
            <button
              id="tab-todas"
              role="tab"
              :aria-selected="activeTab === 'todas'"
              :class="['tab', { 'tab--active': activeTab === 'todas' }]"
              @click="activeTab = 'todas'"
            >
              Todas
            </button>
          </div>

          <div
            v-if="activeTab === 'para_mi'"
            class="filter-box"
            role="tabpanel"
            aria-labelledby="tab-para-mi"
          >
            <label class="filter__label" for="business-type-search"
              >¿Qué tipo de negocio tienes?</label
            >
            <input
              id="business-type-search"
              v-model="businessTypeQuery"
              class="filter-search"
              type="text"
              placeholder="Ejemplo: Restaurante, Barbería o Clínica dental"
            />
            <p class="filter__hint">
              También puedes buscar tu tipo de negocio por industria
            </p>
            <div
              class="industry-filter"
              role="list"
              aria-label="Filtrar por industria"
            >
              <button
                v-for="industry in industries"
                :key="industry.id"
                :class="[
                  'industry-chip',
                  { 'industry-chip--active': selectedIndustry === industry.id },
                ]"
                @click="selectedIndustry = industry.id"
              >
                <span class="industry-chip__icon">{{ industry.icon }}</span>
                <span class="industry-chip__label">{{ industry.name }}</span>
              </button>
            </div>

            <p v-if="!shouldShowBusinessTypes" class="filter__empty">
              Escribe en el buscador o selecciona una industria para ver tipos
              de negocio.
            </p>

            <div v-else>
              <p class="filter__subheading">Selecciona un tipo de negocio</p>

              <div class="filter-options">
                <button
                  v-for="biz in filteredBusinessTypes"
                  :key="biz"
                  :class="[
                    'filter-btn',
                    { 'filter-btn--active': selectedBusiness === biz },
                  ]"
                  @click="selectedBusiness = biz"
                >
                  {{ biz }}
                </button>
              </div>
            </div>
          </div>

          <ul class="services-list" role="list">
            <li
              v-for="service in displayedServices"
              :key="service"
              class="service-item"
            >
              <span class="service-icon">✨</span>
              <span class="service-name">{{ service }}</span>
            </li>
          </ul>
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

.hero__brand {
  margin: 0;
  color: var(--color-title-light);
  font-size: clamp(2rem, 8vw, 4rem);
  font-weight: 700;
  letter-spacing: 0.05em;
  text-shadow:
    1.5px 0px var(--color-primary),
    0px 1.5px var(--color-primary),
    -1.5px 0px var(--color-primary),
    0px -1.5px var(--color-primary);
  text-transform: uppercase;
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
  color: var(--color-primary);
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
  margin-top: clamp(1.25rem, 4vw, 2.5rem);
  width: 85vw;
  max-width: min(85vw, 860px);
  background: #ffffff;
  padding: clamp(1rem, 4vw, 2rem);
  border-radius: clamp(0.65rem, 2vw, 1rem);
  box-shadow: 0 10px 30px var(--color-shadow);
}

.solutions__title {
  margin: 0 0 clamp(1rem, 2.5vw, 1.5rem);
  font-size: clamp(1.05rem, 2.4vw, 1.25rem);
  font-weight: 700;
  color: var(--color-text-dark);
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
</style>
