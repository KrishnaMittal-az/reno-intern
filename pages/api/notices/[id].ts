import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { Category, Priority } from "@/generated/prisma/enums";

const VALID_CATEGORIES = Object.values(Category);
const VALID_PRIORITIES = Object.values(Priority);

function validate(body: Record<string, unknown>) {
  const errors: string[] = [];
  if (!body.title || String(body.title).trim() === "")
    errors.push("title is required");
  if (!body.body || String(body.body).trim() === "")
    errors.push("body is required");
  if (!body.category || !VALID_CATEGORIES.includes(body.category as Category))
    errors.push(`category must be one of: ${VALID_CATEGORIES.join(", ")}`);
  if (!body.priority || !VALID_PRIORITIES.includes(body.priority as Priority))
    errors.push(`priority must be one of: ${VALID_PRIORITIES.join(", ")}`);
  if (!body.publishDate || isNaN(new Date(String(body.publishDate)).getTime()))
    errors.push("publishDate must be a valid date");
  return errors;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = parseInt(String(req.query.id));
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

  if (req.method === "GET") {
    const notice = await prisma.notice.findUnique({ where: { id } });
    if (!notice) return res.status(404).json({ error: "Not found" });
    return res.status(200).json(notice);
  }

  if (req.method === "PUT") {
    const errors = validate(req.body);
    if (errors.length > 0) return res.status(400).json({ errors });

    const existing = await prisma.notice.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });

    const notice = await prisma.notice.update({
      where: { id },
      data: {
        title: String(req.body.title).trim(),
        body: String(req.body.body).trim(),
        category: req.body.category as Category,
        priority: req.body.priority as Priority,
        publishDate: new Date(String(req.body.publishDate)),
        imageUrl: req.body.imageUrl ? String(req.body.imageUrl).trim() : null,
      },
    });
    return res.status(200).json(notice);
  }

  if (req.method === "DELETE") {
    const existing = await prisma.notice.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });

    await prisma.notice.delete({ where: { id } });
    return res.status(204).end();
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ error: "Method not allowed" });
}
