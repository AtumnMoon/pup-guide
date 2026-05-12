import { useState } from "preact/hooks";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        globalThis.location.href = "/";
      } else {
        const data = await res.json();
        setError(data.error ?? "Login failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} class="space-y-4">
      <div role="alert" aria-live="polite" aria-atomic="true">
        {error && (
          <div class="alert alert-error py-3 text-sm gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>

      <div class="form-control gap-1">
        <label for="login-email" class="label py-0">
          <span class="label-text font-medium text-sm">Email</span>
        </label>
        <input
          id="login-email"
          type="email"
          placeholder="you@example.com"
          class="input input-bordered w-full"
          value={email}
          onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
          required
          autocomplete="email"
        />
      </div>

      <div class="form-control gap-1">
        <label for="login-password" class="label py-0">
          <span class="label-text font-medium text-sm">Password</span>
        </label>
        <input
          id="login-password"
          type="password"
          placeholder="••••••••"
          class="input input-bordered w-full"
          value={password}
          onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
          required
          autocomplete="current-password"
        />
      </div>

      <button
        type="submit"
        class="btn btn-primary w-full mt-2"
        disabled={loading}
        aria-busy={loading}
      >
        {loading
          ? (
            <span
              class="loading loading-spinner loading-sm"
              aria-hidden="true"
            />
          )
          : "Sign In"}
      </button>
    </form>
  );
}
