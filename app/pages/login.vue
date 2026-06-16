<script setup lang="ts">
import AuthForm from "~/components/auth/AuthForm.vue";

definePageMeta({
  middleware: "guest",
});

useSeoMeta({
  title: "Iniciar sesión — Digity",
  description:
    "Accede a tu portal de cliente de Digity para gestionar tus proyectos y servicios.",
  robots: "noindex",
});
</script>

<template>
  <main>
    <AuthForm mode="login" />
  </main>
</template>
