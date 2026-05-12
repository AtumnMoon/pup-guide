import { define } from "@/utils.ts";

function BuildingIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="1.5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
      />
    </svg>
  );
}

function LightBulbIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="1.5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="1.5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
      />
    </svg>
  );
}

function ChatBubbleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="1.5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
      />
    </svg>
  );
}

function AcademicCapIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-8 w-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="1.5"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
      />
    </svg>
  );
}

const features = [
  {
    Icon: LightBulbIcon,
    title: "Student Guides",
    description:
      "Curated, markdown-rendered articles written and maintained by editors and admins — covering everything a PUPian at Sta. Rosa needs to know.",
  },
  {
    Icon: ChatBubbleIcon,
    title: "Help & Feedback",
    description:
      "Submit a problem, request, or question directly to campus administrators. Post anonymously if you prefer — your identity stays private.",
  },
  {
    Icon: UsersIcon,
    title: "Community-Driven",
    description:
      "Comment on articles and submissions to share insights, experiences, and answers with your fellow students.",
  },
  {
    Icon: BuildingIcon,
    title: "Built for PUP Sta. Rosa",
    description:
      "Every detail is tailored to the needs of students, faculty, and staff of the Polytechnic University of the Philippines — Sta. Rosa Campus.",
  },
];

export default define.page(() => {
  return (
    <div class="max-w-3xl mx-auto px-4 py-12 space-y-16">
      <section class="text-center space-y-4">
        <div class="flex justify-center mb-4">
          <span class="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary p-4">
            <AcademicCapIcon />
          </span>
        </div>
        <h1 class="text-4xl font-bold tracking-tight">About PUP Guide</h1>
        <p class="text-base-content/70 text-lg max-w-xl mx-auto leading-relaxed">
          A student-built guide platform designed to help every PUPian at Sta.
          Rosa find the information they need — and the voice to be heard.
        </p>
      </section>

      <section class="space-y-4">
        <h2 class="text-2xl font-semibold">Why We Built This</h2>
        <div class="prose prose-sm max-w-none text-base-content/80 leading-relaxed space-y-3">
          <p>
            Navigating campus life as a new student can be overwhelming. From
            enrollment procedures and scholarship applications to understanding
            campus policies — critical information is often scattered, outdated,
            or hard to find. Students frequently rely on word-of-mouth, informal
            group chats, or guesswork just to get straightforward answers.
          </p>
          <p>
            PUP Guide was created to fix that. Our goal is to give every student
            at PUP Sta. Rosa a single, reliable place to find guides written by
            people who actually know the campus — and a direct channel to raise
            concerns or ask questions without barriers.
          </p>
          <p>
            This platform was developed as a school project by students, for
            students. We believe the best tools are built by the people who use
            them.
          </p>
        </div>
      </section>

      <section class="space-y-6">
        <h2 class="text-2xl font-semibold">What You Can Do Here</h2>
        <div class="grid sm:grid-cols-2 gap-4">
          {features.map(({ Icon, title, description }) => (
            <div
              key={title}
              class="card card-border bg-base-100 p-5 flex flex-col gap-3"
            >
              <span class="text-primary">
                <Icon />
              </span>
              <div>
                <h3 class="font-semibold text-base mb-1">{title}</h3>
                <p class="text-sm text-base-content/70 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="text-2xl font-semibold">About PUP Sta. Rosa</h2>
        <div class="prose prose-sm max-w-none text-base-content/80 leading-relaxed space-y-3">
          <p>
            The{" "}
            <strong>
              Polytechnic University of the Philippines — Sta. Rosa Campus
            </strong>{" "}
            is one of the satellite campuses of PUP, the largest state
            university in the Philippines. Located in Santa Rosa City, Laguna,
            the campus serves thousands of students pursuing quality tertiary
            education in technology, engineering, business, and the arts.
          </p>
          <p>
            PUP's mandate is to provide higher technological and professional
            education and training — accessible to all, especially those from
            marginalized communities. The Sta. Rosa Campus carries that mission
            forward in one of the fastest-growing cities in the country.
          </p>
        </div>
        <a
          href="https://www.pup.edu.ph"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-outline btn-sm mt-2"
        >
          Visit the Official PUP Website
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
        </a>
      </section>

      <section class="rounded-2xl bg-base-200 p-8 text-center space-y-3">
        <h2 class="text-xl font-semibold">Have a question or concern?</h2>
        <p class="text-base-content/70 text-sm max-w-sm mx-auto">
          Use our Help &amp; Feedback channel to submit a question, flag a
          problem, or request something new. We read everything.
        </p>
        <a href="/submissions" class="btn btn-primary btn-sm">
          Go to Help &amp; Feedback
        </a>
      </section>
    </div>
  );
});
