import { useState } from "preact/hooks";

export default function SubmissionForm() {
  const [type, setType] = useState<"article" | "faq">("article");
  const [body, setBody] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          body: body.trim(),
          anonymous: anonymous ? 1 : 0,
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setBody("");
        setAnonymous(false);
      } else {
        const data = await res.json();
        setError(data.error ?? "Submission failed.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div class="text-center py-10 space-y-3">
        <div class="text-4xl">✅</div>
        <h3 class="font-['DM_Serif_Display'] text-xl text-primary">
          Submitted!
        </h3>
        <p class="text-base-content/60 text-sm">
          Your request has been sent to the team.
        </p>
        <button class="btn btn-ghost btn-sm" onClick={() => setSuccess(false)}>
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} class="space-y-5">
      {error && (
        <div class="alert alert-error py-3 text-sm">
          <span>{error}</span>
        </div>
      )}
      <div class="form-control gap-2">
        <label class="label py-0">
          <span class="label-text font-medium text-sm">Type</span>
        </label>
        <div class="flex gap-4">
          {(["article", "faq"] as const).map((t) => (
            <label key={t} class="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                class="radio radio-primary radio-sm"
                checked={type === t}
                onChange={() =>
                  setType(t)}
              />
              <span class="text-sm">
                {t === "faq" ? "FAQ Suggestion" : "Article Idea"}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div class="form-control gap-1">
        <label class="label py-0">
          <span class="label-text font-medium text-sm">Message</span>
        </label>
        <textarea
          class="textarea textarea-bordered w-full resize-none focus:textarea-primary"
          rows={5}
          placeholder={type === "article"
            ? "Describe the article you'd like to see..."
            : "What question should we add to the FAQ?"}
          value={body}
          onInput={(e) => setBody((e.target as HTMLTextAreaElement).value)}
          required
        />
      </div>
      <div class="flex items-center justify-between">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            class="checkbox checkbox-primary checkbox-sm"
            checked={anonymous}
            onChange={(e) =>
              setAnonymous((e.target as HTMLInputElement).checked)}
          />
          <span class="text-sm text-base-content/70">Submit anonymously</span>
        </label>
        <button
          type="submit"
          class="btn btn-primary"
          disabled={loading || !body.trim()}
        >
          {loading
            ? <span class="loading loading-spinner loading-sm" />
            : "Submit"}
        </button>
      </div>
    </form>
  );
}
