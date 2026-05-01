import { useState } from "preact/hooks";

interface Props {
  articleId: number;
}

export default function CommentForm({ articleId }: Props) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/articles/${articleId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: body.trim() }),
      });
      if (res.ok) {
        globalThis.location.reload();
      } else {
        const data = await res.json();
        setError(data.error ?? "Failed to post comment.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} class="space-y-3">
      <p class="text-sm font-medium text-base-content/70">Leave a comment</p>
      {error && (
        <div class="alert alert-error py-2 text-sm">
          <span>{error}</span>
        </div>
      )}
      <textarea
        class="textarea textarea-bordered w-full resize-none focus:textarea-primary"
        rows={3}
        placeholder="Write your comment..."
        value={body}
        onInput={(e) => setBody((e.target as HTMLTextAreaElement).value)}
        required
      />
      <div class="flex justify-end">
        <button
          type="submit"
          class="btn btn-primary btn-sm"
          disabled={loading || !body.trim()}
        >
          {loading
            ? <span class="loading loading-spinner loading-xs" />
            : "Post Comment"}
        </button>
      </div>
    </form>
  );
}
