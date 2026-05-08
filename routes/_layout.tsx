import { define } from "@/utils.ts";
import ThemeToggle from "@/islands/ThemeToggle.tsx";

export default define.layout(({ Component, url }) => {
  const path = url.pathname;

  const navLink = (href: string, label: string, match?: string) => {
    const isActive = match ? path.startsWith(match) : path === href;
    return (
      <li>
        <a href={href} class={`text-base ${isActive ? "active" : ""}`}>
          {label}
        </a>
      </li>
    );
  };

  return (
    <div class="flex flex-col min-h-screen">
      <header class="navbar bg-base-100 shadow-sm px-8">
        <div class="flex-1">
          <a
            href="/"
            aria-label="PUP Guide — Home"
            class="flex items-center gap-2"
          >
            <img src="/logo.svg" class="h-10 w-auto" alt="" />
            <span class="font-bold text-lg hidden sm:block">PUP Guide</span>
          </a>
        </div>
        <nav>
          <ul class="menu menu-horizontal gap-1">
            {navLink("/", "Home")}
            {navLink("/articles", "Guides", "/articles")}
            {navLink("/submissions", "Help & Feedback", "/submissions")}
            {navLink("/faq", "FAQ", "/faq")}
            {navLink("/about", "About")}
          </ul>
        </nav>
        <div class="ml-2">
          <ThemeToggle />
        </div>
      </header>

      <main class="flex-1">
        <Component />
      </main>

      <footer class="footer footer-horizontal bg-neutral text-neutral-content p-8">
        <aside class="flex items-center gap-4">
          <img src="/logo.svg" class="h-16 w-auto opacity-80" alt="" />
          <p class="text-sm leading-relaxed">
            Polytechnic University of the Philippines<br />
            Santa Rosa Campus<br />
            <span class="opacity-60">
              Copyright &copy; 2026 — All rights reserved
            </span>
          </p>
        </aside>
        <nav>
          <h6 class="footer-title">Social</h6>
          <div class="flex gap-4">
            <a
              href="#"
              aria-label="Facebook"
              class="hover:opacity-75 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="YouTube"
              class="hover:opacity-75 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </a>
          </div>
        </nav>
      </footer>
    </div>
  );
});
