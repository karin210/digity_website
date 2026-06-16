import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, onAuthStateChanged, type Auth, type User } from "firebase/auth";

/**
 * Initializes the Firebase client SDK once on the browser and keeps the
 * current user in shared state so composables and middleware can react to
 * authentication changes.
 */
export default defineNuxtPlugin(() => {
  const {
    public: { firebase },
  } = useRuntimeConfig();

  const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebase);
  const auth: Auth = getAuth(app);

  const user = useState<User | null>("firebase-user", () => null);
  const authReady = useState<boolean>("firebase-auth-ready", () => false);

  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
    authReady.value = true;
  });

  return {
    provide: { auth },
  };
});
