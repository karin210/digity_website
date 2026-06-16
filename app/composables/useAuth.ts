import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type Auth,
  type User,
} from "firebase/auth";
import type { Ref } from "vue";

interface UseAuth {
  /** The currently signed-in user, or `null` when signed out. */
  user: Ref<User | null>;
  /** Becomes `true` once Firebase has resolved the initial auth state. */
  authReady: Ref<boolean>;
  /** Whether a user is currently signed in. */
  isAuthenticated: Ref<boolean>;
  register: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

/** Maps Firebase auth error codes to friendly Spanish messages. */
function authErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "";

  switch (code) {
    case "auth/email-already-in-use":
      return "Ya existe una cuenta con este correo electrónico.";
    case "auth/invalid-email":
      return "El correo electrónico no es válido.";
    case "auth/weak-password":
      return "La contraseña debe tener al menos 6 caracteres.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Correo electrónico o contraseña incorrectos.";
    case "auth/operation-not-allowed":
    case "auth/admin-restricted-operation":
      return "El registro con correo y contraseña no está habilitado. Contacta al administrador.";
    case "auth/too-many-requests":
      return "Demasiados intentos. Por favor, espera unos minutos e intenta de nuevo.";
    case "auth/network-request-failed":
      return "Error de conexión. Revisa tu internet e intenta de nuevo.";
    default:
      return "Ocurrió un error. Por favor, intenta de nuevo.";
  }
}

/** Provides reactive auth state and email/password auth actions. */
export function useAuth(): UseAuth {
  const { $auth } = useNuxtApp();
  const auth = $auth as Auth;

  const user = useState<User | null>("firebase-user", () => null);
  const authReady = useState<boolean>("firebase-auth-ready", () => false);
  const isAuthenticated = computed<boolean>(() => user.value !== null);

  async function register(
    email: string,
    password: string,
    name: string,
  ): Promise<void> {
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      if (name.trim()) {
        await updateProfile(credential.user, { displayName: name.trim() });
      }
    } catch (error: unknown) {
      throw new Error(authErrorMessage(error));
    }
  }

  async function login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      throw new Error(authErrorMessage(error));
    }
  }

  async function logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: unknown) {
      throw new Error(authErrorMessage(error));
    }
  }

  return { user, authReady, isAuthenticated, register, login, logout };
}
