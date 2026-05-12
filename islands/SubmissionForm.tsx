import { useState } from "preact/hooks";

type SubmissionType = "problem" | "request" | "question";

const TYPE_LABELS: Record<SubmissionType, string> = {
  problem: "Problem",
  request: "Request",
  question: "Question",
};

const TYPE_PLACEHOLDERS: Record<SubmissionType, string> = {
  problem: "Describe the problem you're experiencing...",
  request: "Describe what you'd like us to add or change...",
  question: "What would you like to know?",
};

export default function SubmissionForm() {
  const [type, setType] = useState<SubmissionType>("problem");
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
        <div class="text-4xl" aria-hidden="true">✅</div>
        <h3 class="text-xl text-primary">Submitted!</h3>
        <p class="text-base-content/60 text-sm">
          Your submission has been sent to the team.
        </p>
        <button class="btn btn-ghost btn-sm" onClick={() => setSuccess(false)}>
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} class="space-y-5">
      <div role="alert" aria-live="polite" aria-atomic="true">
        {error && (
          <div class="alert alert-error py-3 text-sm">
            <span>{error}</span>
          </div>
        )}
      </div>

      <fieldset class="form-control gap-2">
        <legend class="label py-0">
          <span class="label-text font-medium text-sm">Type</span>
        </legend>
        <div class="flex gap-4">
          {(["problem", "request", "question"] as const).map((t) => (
            <label key={t} class="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                class="radio radio-primary radio-sm"
                checked={type === t}
                onChange={() =>
                  setType(t)}
              />
              <span class="text-sm">{TYPE_LABELS[t]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div class="form-control gap-1">
        <label for="submission-body" class="label py-0">
          <span class="label-text font-medium text-sm">Message</span>
        </label>
        <textarea
          id="submission-body"
          class="textarea textarea-bordered w-full resize-none focus:textarea-primary"
          rows={5}
          placeholder={TYPE_PLACEHOLDERS[type]}
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
          aria-busy={loading}
        >
          {loading
            ? (
              <span
                class="loading loading-spinner loading-sm"
                aria-hidden="true"
              />
            )
            : "Submit"}
        </button>
      </div>
    </form>
  );
}
