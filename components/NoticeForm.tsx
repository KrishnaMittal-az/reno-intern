import { useState, FormEvent } from "react";

export interface NoticeFormData {
  title: string;
  body: string;
  category: string;
  priority: string;
  publishDate: string;
  imageUrl: string;
}

interface Props {
  initialValues?: Partial<NoticeFormData>;
  onSubmit: (data: NoticeFormData) => Promise<void>;
  submitLabel: string;
}

const defaultValues: NoticeFormData = {
  title: "",
  body: "",
  category: "General",
  priority: "Normal",
  publishDate: "",
  imageUrl: "",
};

export default function NoticeForm({ initialValues, onSubmit, submitLabel }: Props) {
  const [form, setForm] = useState<NoticeFormData>({ ...defaultValues, ...initialValues });
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function update(field: keyof NoticeFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const clientErrors: string[] = [];
    if (!form.title.trim()) clientErrors.push("Title is required");
    if (!form.body.trim()) clientErrors.push("Body is required");
    if (!form.publishDate || isNaN(new Date(form.publishDate).getTime()))
      clientErrors.push("A valid publish date is required");
    if (clientErrors.length > 0) {
      setErrors(clientErrors);
      return;
    }
    setErrors([]);
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setErrors([msg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
            {errors.map((e) => <li key={e}>{e}</li>)}
          </ul>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Notice title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Body *</label>
        <textarea
          rows={5}
          value={form.body}
          onChange={(e) => update("body", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Notice content..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Exam">Exam</option>
            <option value="Event">Event</option>
            <option value="General">General</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={form.priority}
            onChange={(e) => update("priority", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Normal">Normal</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date *</label>
        <input
          type="date"
          value={form.publishDate}
          onChange={(e) => update("publishDate", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URL <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="url"
          value={form.imageUrl}
          onChange={(e) => update("imageUrl", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
      >
        {loading ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
