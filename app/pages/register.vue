<script setup lang="ts">
import AuthForm from "~/components/auth/AuthForm.vue";

definePageMeta({
  middleware: "guest",
});

useSeoMeta({
  title: "Crear cuenta — Digity",
  description:
    "Crea tu cuenta de cliente en Digity para acceder a tu portal y dar seguimiento a tus proyectos.",
  robots: "noindex",
});
</script>

<template>
  <main>
    <AuthForm mode="register" />
  </main>
</template>
