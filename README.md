# 🎓 Student Resource Hub

The **Student Resource Hub** is a full-stack platform that allows students to upload, manage, and access learning resources like PDFs, code files, images, and useful links. With features like tagging, filtering, bookmarking, and secure login, this platform is designed to foster academic collaboration and resource sharing among learners.

---

## 🚀 Features

- 🧾 Upload files or links with title, description, categories & tags
- 📁 Supports PDFs, text/code, images, and external links
- 🔎 Filtered resource listing with category & tag chips
- 📑 PDF Preview with custom PDF worker handling
- 🔒 JWT Authentication (stored in cookies)
- 📌 Bookmark resources (visible only when logged in)
- 📋 Dashboard view with user-specific uploads
- 🖱️ Copy-to-clipboard for quick link access
- 🖼️ Responsive, animated UI with hover effects and smooth transitions
- 🧠 Duplicate title prevention, file size/type checks, category/tag limits
- 📤 Upload limit: Max file size 5 MB, 1–3 tags & categories per resource

---

## 🎯 Goal

To provide a collaborative platform where students can share valuable educational materials, access organized content, and maintain a personalized dashboard for managing their learning resources.

---

## 🛠️ Tech Stack

### 🔷 Frontend (Next.js + TypeScript)
- **Framework:** Next.js 15.1.8 with React 19
- **Styling:** Tailwind CSS, `tailwindcss-animate`, Framer Motion
- **PDF Viewer:** `react-pdf`, `pdfjs-dist`
- **Code Preview:** `react-syntax-highlighter`
- **Icons:** `react-icons`
- **Routing:** Dynamic routing for individual resource pages
- **Auth Handling:** JWT stored in cookies
- **Package Manager:** npm

### 🔶 Backend (Flask)
- **Framework:** Flask with modular structure (Blueprints)
- **Database:** MongoDB via `pymongo`
- **Auth:** JWT-based login & signup
- **File Uploads:** Stored and served from `/uploads` directory
- **CORS:** Configured for cross-origin frontend communication

---

## 📦 Folder Structure (Simplified)


---

## 🔐 Authentication

- JWT is issued at login and stored as an HTTP-only cookie.
- Users must **sign up manually** before logging in.
- Bookmarks, dashboard, and resource uploads are **only available to authenticated users**.

---

## 🧪 Getting Started (Local Setup)

### ⚙️ Backend (Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py

cd frontend
npm install
npm run dev

#Nextjs #TypeScript #TailwindCSS #MongoDB #Flask #FullStack #JWTAuth #PDFViewer #StudentPlatform

📌 Future Enhancements
🛡️ Admin dashboard for resource moderation

📚 Support for more file types (e.g., PPT, DOCX, videos)

🔍 Improved search system with AI recommendations

📊 Analytics for uploaded/downloaded resources

🙌 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.