import { useEffect, useState } from "preact/hooks";

const LIGHT = "silk";
const DARK = "abyss";

function getStoredTheme(): string {
  const match = document.cookie.match(/(?:^|;\s*)theme=([^;]+)/);
  return match ? match[1] : LIGHT;
}

function storeTheme(theme: string) {
  document.cookie = `theme=${theme}; path=/; max-age=${60 * 60 * 24 * 365}`;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>(LIGHT);

  // Restore persisted theme on mount
  useEffect(() => {
    const stored = getStoredTheme();
    setTheme(stored);
    document.documentElement.dataset.theme = stored;
  }, []);

  function toggle() {
    const next = theme === LIGHT ? DARK : LIGHT;
    setTheme(next);
    document.documentElement.dataset.theme = next;
    storeTheme(next);
  }

  const isDark = theme === DARK;

  return (
    <button
      type="button"
      onClick={toggle}
      class="btn btn-ghost btn-sm btn-circle"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark
        ? (
          // Sun icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z"
            />
          </svg>
        )
        : (
          // Moon icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            />
          </svg>
        )}
    </button>
  );
}
