/**
 * Protects routes that require an authenticated client. Waits for Firebase to
 * resolve the initial auth state, then redirects guests to the login page.
 */
export default defineNuxtRouteMiddleware(() => {
  // Auth state only exists on the client; the plugin is `.client`-only.
  if (import.meta.server) {
    return;
  }

  const { user, authReady } = useAuth();

  const ensureRedirect = (): ReturnType<typeof navigateTo> | undefined => {
    if (!user.value) {
      return navigateTo("/login");
    }
    return undefined;
  };

  if (authReady.value) {
    return ensureRedirect();
  }

  // Initial auth state not resolved yet — wait for the first resolution.
  return new Promise<ReturnType<typeof navigateTo> | undefined>((resolve) => {
    const unwatch = watch(authReady, (ready) => {
      if (ready) {
        unwatch();
        resolve(ensureRedirect());
      }
    });
  });
});
