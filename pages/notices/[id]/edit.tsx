import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import NoticeForm, { NoticeFormData } from "@/components/NoticeForm";

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
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = parseInt(String(context.params?.id));
  if (isNaN(id)) return { notFound: true };

  const notice = await prisma.notice.findUnique({ where: { id } });
  if (!notice) return { notFound: true };

  return {
    props: {
      notice: {
        ...notice,
        publishDate: notice.publishDate.toISOString().split("T")[0],
      },
    },
  };
};

export default function EditNotice({ notice }: Props) {
  const router = useRouter();

  const initialValues: NoticeFormData = {
    title: notice.title,
    body: notice.body,
    category: notice.category,
    priority: notice.priority,
    publishDate: notice.publishDate,
    imageUrl: notice.imageUrl ?? "",
  };

  async function handleSubmit(data: NoticeFormData) {
    const res = await fetch(`/api/notices/${notice.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.errors?.join(", ") ?? "Failed to update notice");
    }
    router.push("/");
  }

  return (
    <>
      <Head>
        <title>Edit Notice — Notice Board</title>
      </Head>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
            <Link href="/" className="text-gray-500 hover:text-gray-800 transition-colors text-sm">
              ← Back
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Edit Notice</h1>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <NoticeForm
              initialValues={initialValues}
              onSubmit={handleSubmit}
              submitLabel="Save Changes"
            />
          </div>
        </main>
      </div>
    </>
  );
}
