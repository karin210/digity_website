/**
 * Keeps already-authenticated clients away from the login/register pages by
 * redirecting them to their account. Waits for the initial auth state first.
 */
export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) {
    return;
  }

  const { user, authReady } = useAuth();

  const ensureRedirect = (): ReturnType<typeof navigateTo> | undefined => {
    if (user.value) {
      return navigateTo("/account");
    }
    return undefined;
  };

  if (authReady.value) {
    return ensureRedirect();
  }

  return new Promise<ReturnType<typeof navigateTo> | undefined>((resolve) => {
    const unwatch = watch(authReady, (ready) => {
      if (ready) {
        unwatch();
        resolve(ensureRedirect());
      }
    });
  });
});
