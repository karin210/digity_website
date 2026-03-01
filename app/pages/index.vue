<script setup>
import { ref, computed } from "vue";

const activeTab = ref("todas");
const selectedBusiness = ref("");
const businessTypeQuery = ref("");

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

const filteredBusinessTypes = computed(() => {
  const query = businessTypeQuery.value.trim().toLowerCase();

  if (!query) return businessTypes;

  return businessTypes.filter((biz) => biz.toLowerCase().includes(query));
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
            <p class="filter__hint">También puedes filtrar por industria:</p>
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

          <ul class="services-list" role="list">
            <li
              v-for="service in displayedServices"
              :key="service"
              class="service-item"
            >
              <span class="service-icon">✨</span>
              <span class="service-name">{{ service }}</span>
            </li>
            <li
              v-if="displayedServices.length === 0"
              class="service-item service-item--empty"
            >
              Por favor, selecciona un tipo de negocio.
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
  min-height: 100vh;
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
  margin-top: 2.5rem;
  width: 100%;
  max-width: 800px;
  background: #ffffff;
  padding: clamp(1.25rem, 5vw, 2rem);
  border-radius: clamp(0.75rem, 3vw, 1rem);
  box-shadow: 0 10px 30px var(--color-shadow);
}

.solutions__title {
  margin: 0 0 1.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-dark);
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid var(--color-background-gradient-start);
  padding-bottom: 0.5rem;
}

.tab {
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0.5rem 1rem;
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
  padding: 1.25rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  animation: fadeIn 0.3s ease-in-out;
}

.filter__label {
  display: block;
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-primary-dark);
  text-align: left;
}

.filter-search {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 0.65rem 0.75rem;
  font-size: 0.95rem;
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
  font-size: 0.85rem;
  color: var(--color-text-muted);
  text-align: left;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.filter-btn {
  background: #ffffff;
  border: 1px solid var(--color-border);
  color: var(--color-text-dark);
  padding: 0.4rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
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
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 200px), 1fr));
  gap: 1rem;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: var(--color-text-dark);
  background: var(--color-background);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  animation: fadeIn 0.3s ease-in-out;
}

.service-item--empty {
  grid-column: 1 / -1;
  color: var(--color-text-muted);
  background: transparent;
  border: none;
  justify-content: center;
  font-style: italic;
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

@media (max-width: 640px) {
  .hero__actions {
    flex-direction: column;
    width: 100%;
    gap: 1rem;
  }

  .button {
    width: 100%;
  }
}
</style>
