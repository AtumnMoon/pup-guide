import { define } from "@/utils.ts";
import ThemeToggle from "@/islands/ThemeToggle.tsx";

export default define.layout(({ Component, url, state }) => {
  const path = url.pathname;
  const user = state.user;

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
      <header class="navbar bg-base-100 shadow-sm px-4 sm:px-8">
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

        <nav aria-label="Main navigation">
          <ul class="menu menu-horizontal gap-1 hidden md:flex">
            {navLink("/", "Home")}
            {navLink("/articles", "Guides", "/articles")}
            {navLink("/submissions", "Help & Feedback", "/submissions")}
            {navLink("/faq", "FAQ", "/faq")}
            {navLink("/about", "About")}
          </ul>
        </nav>

        <div class="flex items-center gap-1 ml-2">
          <ThemeToggle />

          {user
            ? (
              <div class="dropdown dropdown-end">
                <button
                  type="button"
                  tabIndex={0}
                  class="btn btn-ghost btn-sm gap-2"
                  aria-label={`Signed in as ${user.username}. Open account menu.`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.5"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                  <span class="hidden sm:inline text-sm font-medium max-w-[10rem] truncate">
                    {user.username}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 opacity-60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>
                <ul
                  tabIndex={0}
                  class="dropdown-content menu menu-sm bg-base-100 rounded-box shadow-md border border-base-200 z-50 mt-2 w-48 p-1"
                >
                  {(user.role === "admin" || user.role === "editor") && (
                    <li>
                      <a href="/admin" class="gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="1.5"
                          aria-hidden="true"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                        Admin Panel
                      </a>
                    </li>
                  )}
                  <li>
                    <form method="POST" action="/logout">
                      <button
                        type="submit"
                        class="gap-2 w-full text-left text-error"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="1.5"
                          aria-hidden="true"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                          />
                        </svg>
                        Sign Out
                      </button>
                    </form>
                  </li>
                </ul>
              </div>
            )
            : (
              <a href="/login" class="btn btn-primary btn-sm">
                Sign In
              </a>
            )}

          {/* Mobile nav menu */}
          <div class="dropdown dropdown-end md:hidden">
            <button
              type="button"
              tabIndex={0}
              class="btn btn-ghost btn-sm btn-circle"
              aria-label="Open navigation menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
            <ul
              tabIndex={0}
              class="dropdown-content menu menu-sm bg-base-100 rounded-box shadow-md border border-base-200 z-50 mt-2 w-52 p-1"
            >
              {navLink("/", "Home")}
              {navLink("/articles", "Guides", "/articles")}
              {navLink("/submissions", "Help & Feedback", "/submissions")}
              {navLink("/faq", "FAQ", "/faq")}
              {navLink("/about", "About")}
            </ul>
          </div>
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
        <nav aria-label="Social links">
          <h6 class="footer-title">Social</h6>
          <div class="flex gap-4">
            <a
              href="#"
              aria-label="PUP Sta. Rosa on Facebook"
              class="hover:opacity-75 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="PUP Sta. Rosa on YouTube"
              class="hover:opacity-75 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
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
