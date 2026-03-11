# 🐰 Talking Rabbitt

> **Conversational Business Intelligence** — Talk to your business data.

![Talking Rabbitt - Cyberpunk AI Dashboard](./public/demo-placeholder.png)

Talking Rabbitt is a modern, futuristic AI product MVP that allows users to upload a dataset (CSV) and ask questions about it in natural language. The system analyzes the data on the fly and returns insights and dynamic visualizations (Bar, Line, Pie charts).

Built with a **Cyberpunk AI Dashboard** aesthetic, it features:
- **Neon Accents** (Cyan, Purple, Electric Blue)
- **Glassmorphism Components**
- **Dynamic Animations** (Framer Motion)
- **Real-time Charting** (Recharts)

---

## 🚀 Tech Stack

- **Frontend & Backend Workflow**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4, custom Cyberpunk utility classes
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Data Parsing**: PapaParse
- **Visualization**: Recharts
- **AI Engine**: Google Gemini API (`gemini-2.5-flash`) via `@google/genai`

---

## 🛠 Project Structure

Because this MVP uses modern Next.js methodologies, both the frontend and backend are housed within the same application:

\`\`\`
talking-rabbitt/
│
├─ app/
│   ├─ page.tsx               # Main Dashboard UI
│   ├─ layout.tsx             # Root Layout (Top Navigation)
│   ├─ globals.css            # Global Styles & Cyberpunk Theme
│   └─ api/analyze/route.ts   # Backend API Endpoint (Proxy to Gemini)
│
├─ components/
│   ├─ UploadPanel.tsx        # Drag & Drop Dataset Upload
│   ├─ DatasetPreview.tsx     # Tabular Data Preview
│   ├─ ChatPanel.tsx          # AI Conversation Interface
│   └─ ChartPanel.tsx         # Real-time Data Visualization
│
├─ lib/
│   ├─ dataAnalyzer.ts        # Fast, functional data aggregation and filtering
│   ├─ gemini.ts              # AI prompting and parsing logic
│   └─ utils.ts               # Tailwind class merging utility
│
└─ ...
\`\`\`

---

## 🏁 Getting Started Locally

### Prerequisites
- Node.js 18.x or later
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### 1. Install Dependencies
Navigate into the project directory and install packages:
\`\`\`bash
cd talking-rabbitt
npm install
\`\`\`

### 2. Configure Environment Variables
Create a \`.env.local\` file in the root directory and add your Gemini API Key:
\`\`\`env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
\`\`\`

### 3. Run the Development Server
Start the Next.js local server:
\`\`\`bash
npm run dev
\`\`\`
Visit `http://localhost:3000` in your browser.

---

## 🌐 Deployment Instructions

This project is optimized for deployment on [Vercel](https://vercel.com/).

1. Push your code to a GitHub repository.
2. Log into Vercel and click **Add New > Project**.
3. Import your GitHub repository.
4. Expand the **Environment Variables** section and add \`NEXT_PUBLIC_GEMINI_API_KEY\` with your actual key.
5. Click **Deploy**.

Alternatively, you can build and start the server manually for custom hosting:
\`\`\`bash
npm run build
npm run start
\`\`\`

---

## 🧠 How It Works

1. **Upload Dataset**: The user uploads a CSV file via `react-dropzone`. `PapaParse` reads the file quickly and generates a data preview.
2. **Conversation**: The user types a natural language question (e.g., "Which region generated the highest revenue?").
3. **AI Interpretation**: The backend (`lib/gemini.ts`) analyzes the question and dataset headers to output a structured JSON execution plan (filters, aggregations, chart type).
4. **Data Aggregation**: `lib/dataAnalyzer.ts` strictly takes the execution plan and functionally groups, filters, and sorts the dataset.
5. **Visualization**: The resulting aggregated data is rendered immediately in `components/ChartPanel.tsx`.
