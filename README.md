# Blog Hut 🛖

A modern, full-stack blogging platform built with Next.js, Supabase, and Tailwind CSS. Blog Hut offers a premium reading and writing experience with dynamic layouts, a rich text editor, and robust authentication.

## ✨ Features

- **Authentication**: Secure user signup, login, and session management using Supabase Auth.
- **Rich Text Editor**: Write and format blogs beautifully using the integrated Tiptap editor.
- **Image Management**: Integrated image cropping (`react-image-crop`) and cloud hosting (Cloudinary) for blog cover images.
- **Dynamic Layouts**: Premium "Featured" and "Grid" layouts for browsing blogs, complete with robust pagination.
- **Responsive Design**: Fully responsive UI tailored for mobile, tablet, and desktop viewing.
- **Server Actions**: Leveraging Next.js Server Actions for fast, secure data mutations without exposing APIs.

---

## 🛠️ Modules & Tools Used

### Core
- **[Next.js (App Router)](https://nextjs.org/)**: React framework for server-side rendering and static site generation.
- **[React](https://react.dev/)**: Frontend library for building user interfaces.
- **[TypeScript](https://www.typescriptlang.org/)**: Strongly typed programming language that builds on JavaScript.

### Backend & Database
- **[Supabase](https://supabase.com/)**: Open-source Firebase alternative providing a Postgres database, Authentication, and Edge Functions.
- **`@supabase/ssr`**: Supabase Auth helpers for Next.js App Router to manage sessions securely across server and client.

### Styling & UI
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for rapid UI development.
- **`@tailwindcss/typography`**: Plugin providing a set of `prose` classes for beautifully formatting rich text content.
- **[react-hot-toast](https://react-hot-toast.com/)**: Smoking hot React notifications.

### Editor & Media
- **[Tiptap](https://tiptap.dev/)**: Headless wrapper around ProseMirror for the rich text editor.
- **[react-image-crop](https://github.com/DominicTobias/react-image-crop)**: A responsive image cropping tool for React.
- **[Cloudinary](https://cloudinary.com/)**: Cloud-based image and video management services.

---

## 🏗️ How the App Works

1. **Routing**: The app uses the Next.js App Router (`src/app`). It has protected routes (like `/profile`) and public routes (like `/explore`, `/login`).
2. **Data Fetching**: Blogs are fetched dynamically on the server and client using Supabase. The `Home` and `Explore` pages utilize robust pagination and dynamic layout switching (featured layouts vs standard grids) based on the current page state.
3. **Authentication Flow**: User sessions are handled via cookies using `@supabase/ssr`. Authentication checks happen in server components and server actions (`actions.ts`).
4. **Blog Creation**: When a user creates a blog, the cover image is cropped on the frontend, uploaded directly to Cloudinary, and the resulting URL along with the Tiptap HTML content is saved to the Supabase Postgres database.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- npm, yarn, pnpm, or bun

### 1. Clone the repository

```bash
git clone https://github.com/your-username/blog-hut.git
cd blog-hut
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables (.env)

Create a `.env` file in the root of your project. You will need to fill in your Supabase and Cloudinary credentials. 

```env
# --- Supabase ---
# These are exposed to the browser
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# --- Cloudinary ---
# Required for uploading blog cover images
NEXT_PUBLIC_CLOUDINARY_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_UPLOAD_PRESET=your_cloudinary_upload_preset
```
*(Note: Do not commit your actual `.env` file to version control. The `.env` file is included in `.gitignore` by default).*

### 4. Supabase Setup

To get the database running, you need to set up your Supabase project:
1. Create a new project on [Supabase](https://supabase.com/).
2. Navigate to **Authentication** > **Providers** and ensure **Email** is enabled.
3. Go to the **SQL Editor** and create the necessary tables. You will need at least a `blogs` table. Example schema for `blogs`:

```sql
CREATE TABLE public.blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    category TEXT,
    tags TEXT[],
    status TEXT DEFAULT 'draft',
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    views INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published blogs
CREATE POLICY "Public blogs are viewable by everyone." ON public.blogs
    FOR SELECT USING (status = 'published');

-- Allow authenticated users to insert their own blogs
CREATE POLICY "Users can insert their own blogs." ON public.blogs
    FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Allow users to update their own blogs
CREATE POLICY "Users can update own blogs." ON public.blogs
    FOR UPDATE USING (auth.uid() = author_id);

-- Allow users to delete their own blogs
CREATE POLICY "Users can delete own blogs." ON public.blogs
    FOR DELETE USING (auth.uid() = author_id);
```

### 5. Run the Development Server

Start the app locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running.
