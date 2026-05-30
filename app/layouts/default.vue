<template>
  <div class="layout">
    <Header />
    <PromoBanner />

    <slot />
    <Footer />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
