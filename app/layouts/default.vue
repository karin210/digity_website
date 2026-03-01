<template>
  <div class="layout">
    <Header />
    <slot />
  </div>
</template>

<script setup>
import Header from '~/components/Header.vue'
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
