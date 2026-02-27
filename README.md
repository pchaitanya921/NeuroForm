# 🧠 NeuroForm

**Forms that think, adapt, and decide for you.**

NeuroForm is an AI-native form and survey platform that dynamically builds forms based on your goals, automatically adapts to user responses in real-time, and generates actionable business intelligence from the collected data. 

Built with **Next.js**, **Node.js/Express**, **MongoDB**, and powered by **Groq AI (Llama 3)**.

---

## ✨ Key Features

- **🤖 AI Form Architect**: Describe your goal (e.g., "I need a customer feedback survey for my new app"), and NeuroForm's AI instantly builds a complete, optimized questionnaire.
- **🔄 Adaptive Question Flow**: The form intelligently adjusts upcoming questions based on the user's previous answers to extract maximum insight without survey fatigue.
- **📊 AI Insight Engine**: Instantly generates sentiment analysis, extracts key themes, identifies user pain points, and provides actionable business recommendations from raw response data.
- **💬 Conversational Queries**: Ask the AI direct questions about your data (e.g., *"What do users love most about our pricing?"*).
- **🌗 Stunning UI/UX**: Built with modern, glassmorphic design principles, featuring seamless light/dark mode transitions and interactive dashboard states.

---

## 🛠️ Tech Stack

**Frontend**
- Next.js 14+ (App Router)
- React 19
- Tailwind CSS v4
- Lucide React (Icons)
- Recharts (Analytics visualization)

**Backend**
- Node.js & Express
- MongoDB (Mongoose)
- Groq AI API (Llama-3.3-70b-versatile)
- JSON Web Tokens (JWT) for Authentication
- bcryptjs for password hashing

---

## 🚀 Local Development Setup

### Prisma Pre-requisites
Ensure you have **Node.js** (v18+) and **MongoDB** installed locally or access to a MongoDB Atlas cluster. You will also need a free API key from [Groq](https://console.groq.com/keys).

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/neuroform  # Or your MongoDB Atlas URL
JWT_SECRET=your_super_secret_jwt_key
GROK_API_KEY=your_groq_api_key_here
```

Start the backend server:
```bash
npm run dev
```
*The backend will run on `http://localhost:5000`*

### 2. Frontend Setup

```bash
cd frontend
npm install
```

*(Optional)* If your backend is running on a different port/URL, you can create a `.env.local` file in the `frontend/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the Next.js development server:
```bash
npm run dev
```
*The frontend will run on `http://localhost:3000`*

---

## 📦 Production Deployment

### Backend (Render / Heroku)
1. Provide the `backend` folder as the root directory to your hosting provider.
2. Set the Environment Variables (`MONGODB_URI`, `JWT_SECRET`, `GROK_API_KEY`, etc.) in the dashboard.
3. Start command: `npm start`

### Frontend (Vercel / Netlify)
1. Provide the `frontend` folder as the root directory.
2. Set `NEXT_PUBLIC_API_URL` to your live backend domain (e.g., `https://my-backend.onrender.com`).
3. Build command: `npm run build`
4. Deploy the `.next` output.

---

## 📄 License
This project is proprietary and confidential.