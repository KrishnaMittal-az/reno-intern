import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import NoticeCard from "@/components/NoticeCard";

interface Notice {
  id: number;
  title: string;
  body: string;
  category: string;
  priority: string;
  publishDate: string;
  imageUrl: string | null;
}

export default function Home() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchNotices() {
    try {
      const res = await fetch("/api/notices");
      if (!res.ok) throw new Error("Failed to load notices");
      setNotices(await res.json());
    } catch {
      setError("Could not load notices. Please refresh.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchNotices(); }, []);

  function handleDeleted(id: number) {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <>
      <Head>
        <title>Notice Board</title>
        <meta name="description" content="Institutional notice board" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Notice Board</h1>
            <Link
              href="/notices/new"
              className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Add Notice
            </Link>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {loading && (
            <div className="text-center py-20 text-gray-500">Loading notices…</div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && notices.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 mb-4">No notices yet.</p>
              <Link
                href="/notices/new"
                className="text-indigo-600 hover:underline font-medium"
              >
                Post the first notice →
              </Link>
            </div>
          )}

          {!loading && notices.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {notices.map((notice) => (
                <NoticeCard
                  key={notice.id}
                  notice={notice}
                  onDeleted={handleDeleted}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
