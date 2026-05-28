<script setup lang="ts">
// import HeroSlider from "~/components/HeroSlider.vue";
import ChatbotSection from "~/components/ChatbotSection.vue";

const title = "Digity — Desarrollo Web y Marketing Digital en Morelia";
const description =
  "Agencia de desarrollo web y marketing digital en Morelia, Michoacán. Sitios web profesionales, tiendas en línea, SEO y estrategias de marketing para hacer crecer tu negocio.";

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: "website",
  ogUrl: "https://digity.com.mx",
  ogLocale: "es_MX",
  ogImage: "https://digity.com.mx/images/Morelia_background.jpg",
  ogImageAlt: "Vista de Morelia, Michoacán — sede de Digity",
  twitterCard: "summary_large_image",
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: "https://digity.com.mx/images/Morelia_background.jpg",
});

useHead({
  link: [{ rel: "canonical", href: "https://digity.com.mx" }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: "Digity",
        description,
        url: "https://digity.com.mx",
        telephone: "+52-443-133-2455",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Morelia",
          addressRegion: "Michoacán",
          addressCountry: "MX",
        },
        areaServed: { "@type": "Country", name: "México" },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Servicios digitales",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Desarrollo Web" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Tienda en línea" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "SEO y posicionamiento" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Marketing Digital" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Manejo de redes sociales" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Google Ads" } },
          ],
        },
      }),
    },
  ],
});
</script>

<template>
  <main class="page">
    <!-- <HeroSlider /> -->
    <section class="hero">
      <NuxtImg
        src="/images/Morelia_background.jpg"
        alt="Vista de Morelia, Michoacán"
        class="hero__bg"
      />
      <div class="hero__content">
        <h1 class="hero__title">Desarrollo Web y Marketing para tu compañía</h1>
        <ChatbotSection />
      </div>
    </section>
  </main>
</template>

<style scoped>
:root {
  color-scheme: light;
}

.page {
  min-height: 100dvh;
  background-color: #fafafa;
  color: var(--color-text-dark);
}

.hero {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  height: 100dvh;
  overflow-y: auto;
}

.hero__bg {
  grid-area: 1 / 1;
  align-self: stretch;
  min-height: 100dvh;
  width: 100%;
  object-fit: cover;
  filter: brightness(0.6);
}

.hero__content {
  box-sizing: border-box;
  grid-area: 1 / 1;
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: clamp(1.5rem, 3vw, 2.5rem);
  padding: clamp(4.5rem, 25dvh, 12rem) clamp(1rem, 4vw, 2rem) clamp(2rem, 5vw, 4rem);
}

.hero__title {
  color: var(--color-title-light);
  font-size: clamp(1.1rem, 3.5vw, 2rem);
  font-weight: 700;
  text-align: center;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
  margin: 0;
}
</style>
