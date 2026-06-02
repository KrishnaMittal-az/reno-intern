import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import NoticeForm, { NoticeFormData } from "@/components/NoticeForm";

export default function NewNotice() {
  const router = useRouter();

  async function handleSubmit(data: NoticeFormData) {
    const res = await fetch("/api/notices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.errors?.join(", ") ?? "Failed to create notice");
    }
    router.push("/");
  }

  return (
    <>
      <Head>
        <title>Add Notice — Notice Board</title>
      </Head>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
            <Link href="/" className="text-gray-500 hover:text-gray-800 transition-colors text-sm">
              ← Back
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Add Notice</h1>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <NoticeForm onSubmit={handleSubmit} submitLabel="Create Notice" />
          </div>
        </main>
      </div>
    </>
  );
}
