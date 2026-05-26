<template>
  <header class="header">
    <div class="header-container">
      <div class="header-flex">
        <div class="header-logo-wrapper">
          <a href="/" class="header-logo">DIGITY</a>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: #f6f6f6c2;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.header-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .header-container {
    padding: 0 1.5rem;
  }
}

@media (min-width: 1024px) {
  .header-container {
    padding: 0 2rem;
  }
}

.header-flex {
  display: flex;
  align-items: center;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.header-logo-wrapper {
  display: flex;
  align-items: center;
}

.header-logo {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
  color: var(--color-primary);
  text-decoration: none;
}
</style>
