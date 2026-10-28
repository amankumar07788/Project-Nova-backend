import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmail(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const result =
        mode === "login"
          ? await signInWithEmailAndPassword(auth, email, password)
          : await createUserWithEmailAndPassword(
              auth,
              email,
              password
            );

      onLogin(result.user);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setMessage("");
    setLoading(true);

    try {
      const result = await signInWithPopup(
        auth,
        googleProvider
      );
      onLogin(result.user);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>
          Project<span>Nova</span>
        </h1>

        <h2>
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>

        <p>Sign in to explore and share projects.</p>

        <form onSubmit={handleEmail}>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            minLength={6}
            required
          />

          <button type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Login with Email"
                : "Create Account"}
          </button>
        </form>

        <div className="login-divider">OR</div>

        <button
          type="button"
          className="google-login"
          onClick={handleGoogle}
          disabled={loading}
        >
          Continue with Google
        </button>

        <button
          type="button"
          className="switch-mode"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setMessage("");
          }}
        >
          {mode === "login"
            ? "New here? Create an account"
            : "Already registered? Login"}
        </button>

        {message && (
          <p className="login-message" role="alert">
            {message}
          </p>
        )}
      </section>
    </main>
  );
}