import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import ConfirmDialog from "./ConfirmDialog";

interface Notice {
  id: number;
  title: string;
  body: string;
  category: string;
  priority: string;
  publishDate: string;
  imageUrl: string | null;
}

interface Props {
  notice: Notice;
  onDeleted: (id: number) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Exam: "bg-blue-100 text-blue-700",
  Event: "bg-green-100 text-green-700",
  General: "bg-gray-100 text-gray-700",
};

export default function NoticeCard({ notice, onDeleted }: Props) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch(`/api/notices/${notice.id}`, { method: "DELETE" });
    if (res.ok) {
      onDeleted(notice.id);
    } else {
      alert("Failed to delete notice.");
      setDeleting(false);
    }
    setConfirmOpen(false);
  }

  const date = new Date(notice.publishDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        {notice.imageUrl && (
          <div className="relative h-40 w-full">
            <Image
              src={notice.imageUrl}
              alt={notice.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {notice.priority === "Urgent" && (
              <span className="bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
                Urgent
              </span>
            )}
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[notice.category] ?? "bg-gray-100 text-gray-700"}`}>
              {notice.category}
            </span>
            <span className="text-xs text-gray-500 ml-auto">{date}</span>
          </div>

          <h2 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">{notice.title}</h2>
          <p className="text-sm text-gray-600 line-clamp-3 flex-1">{notice.body}</p>

          <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={() => router.push(`/notices/${notice.id}/edit`)}
              className="flex-1 text-sm text-indigo-600 border border-indigo-200 rounded-lg py-1.5 hover:bg-indigo-50 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => setConfirmOpen(true)}
              disabled={deleting}
              className="flex-1 text-sm text-red-600 border border-red-200 rounded-lg py-1.5 hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        message={`Delete "${notice.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
