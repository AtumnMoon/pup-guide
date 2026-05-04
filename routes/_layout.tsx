import { define } from "@/utils.ts";

export default define.layout(({ Component }) => {
  return (
    <div class="layout">
      <header class="navbar px-16 gap-4 bg-base-100 shadow-sm">
        <div class="flex-none">
          <img src="/logo.svg" alt="PUP Logo" class="h-10 w-auto" />
        </div>
        <div class="flex-1">
          <a href="/" class="text-xl font-bold" aria-label="PUP Guide — Home">
            PUP Guide
          </a>
        </div>
        <nav class="flex-none">
          <ul class="menu menu-vertical lg:menu-horizontal">
            <li>
              <a href="/" class="btn btn-ghost">Home</a>
            </li>
            <li>
              <a href="" class="btn btn-ghost">Guides</a>
            </li>
            <li>
              <a href="" class="btn btn-ghost">Help & Feedback</a>
            </li>
            <li>
              <a href="" class="btn btn-ghost">FAQ</a>
            </li>
            <li>
              <a href="" class="btn btn-ghost">About</a>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Component />
      </main>
      <footer class="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()}{" "}
            - All right reserved by BSIT 1-3 of PUP Santa Rosa
          </p>
        </aside>
      </footer>
    </div>
  );
});
