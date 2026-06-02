# Notice Board

A full-stack Notice Board built with **Next.js (Pages Router)**, **Prisma**, and **PostgreSQL** (Neon). Supports creating, reading, updating, and deleting notices. Urgent notices are always sorted to the top via a server-side Prisma `orderBy` query.

**Live demo:** _add your Vercel URL here_

---

## How to run locally

### Prerequisites
- Node.js 18+
- A free [Neon](https://neon.tech) PostgreSQL database (or any PostgreSQL instance)

### Steps

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd notice-board

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env and set your DATABASE_URL:
# DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"

# 4. Run database migrations and generate Prisma client
npx prisma migrate dev --name init

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## One thing I would improve with more time

I would replace the image URL text field with **actual file upload** — letting users pick a file from their device and storing it via a service like Cloudinary (free tier). The current implementation accepts a URL string, which works but isn't as user-friendly as a native file picker.

---

## Where and how AI was used

**Claude Code (claude.ai/code)** was used as a development assistant throughout this project:

- Scaffolded the project structure and directory layout
- Generated the Prisma schema with the correct enums (`Category`, `Priority`) and model fields
- Wrote the boilerplate for API route handlers (`pages/api/notices/index.ts`, `pages/api/notices/[id].ts`) including HTTP method routing, server-side validation, and correct status codes
- Suggested using `orderBy: [{ priority: "desc" }, { createdAt: "desc" }]` to sort Urgent notices first at the database level (not in the browser)
- Helped write the responsive Tailwind layout for `NoticeCard` and the form components

All generated code was reviewed, understood, and adjusted before committing. The architecture decisions (Pages Router, Prisma singleton pattern, `getServerSideProps` for the edit page) were chosen and verified manually.


## Live URL

https://reno-intern.vercel.app/
