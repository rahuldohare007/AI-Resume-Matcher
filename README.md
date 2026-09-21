# 🧠 AI Resume & Job Description Matcher  

An **AI-driven web application** that intelligently evaluates how well a candidate’s resume matches a given job description using **semantic similarity** powered by **Natural Language Processing (NLP)**.  

This project integrates the **Next.js full-stack framework** (handling both frontend & backend) with a **FastAPI-based NLP microservice** that leverages **Sentence-BERT (SBERT)** to compute similarity scores between candidate profiles and job postings.  

It’s designed to help recruiters quickly identify the best candidates and allow job seekers to understand how well their resumes align with job roles — making the recruitment process faster, fairer, and data-driven.  

---

## 🚀 Key Highlights  

- ⚡ **Full-Stack Next.js Application:** A unified web app where frontend and backend APIs are managed in one framework.  
- 🧠 **AI-Powered Matching:** Uses Sentence-BERT embeddings to measure how similar a resume is to a job description in terms of context, skills, and experience.  
- 📄 **Resume Text Extraction:** Automatically extracts text from PDF or DOCX resumes using Python libraries like `PyMuPDF` and `python-docx`.  
- 🔍 **Semantic Scoring:** Computes cosine similarity between embeddings of resumes and job descriptions to generate match percentages.  
- 📊 **Recruiter Dashboard:** Displays ranked candidate-job match scores for better hiring insights.  
- 💾 **Cloud Integration:** Supports cloud storage (AWS S3 / Cloudinary) for resume uploads.  
- 🔐 **Authentication (Optional):** JWT-based login for recruiters and applicants.  

---

## 🧩 Core Architecture  

          ┌────────────────────────────┐
          │         Next.js App        │
          │  • Resume Upload Page       │
          │  • Job Description Input    │
          │  • Match Dashboard          │
          │  • API Routes (Backend)     │
          └──────────────┬─────────────┘
                         │
                         ▼
          ┌────────────────────────────┐
          │     FastAPI NLP Service    │
          │  • Sentence-BERT Model      │
          │  • Resume Parsing           │
          │  • Similarity Scoring       │
          └──────────────┬─────────────┘
                         │
                         ▼
          ┌────────────────────────────┐
          │        MongoDB Atlas        │
          │  • Users / Resumes / Jobs    │
          │  • Embeddings / Scores       │
          └────────────────────────────┘

---

## 🧠 How It Works  

1. **Resume Upload:**  
   The user uploads a resume file (PDF/DOCX). The system extracts text using Python libraries.  

2. **Job Description Input:**  
   Recruiters or users paste or upload a job description.  

3. **Embedding Generation:**  
   Both texts (resume & job) are encoded using **Sentence-BERT**, generating high-dimensional vectors that capture semantic meaning.  

4. **Similarity Calculation:**  
   Cosine similarity between vectors determines the **match score** (0–100%).  

5. **Ranking & Display:**  
   Results are displayed in a modern Next.js dashboard, highlighting top matches with visualization and filters.  

---

## 💻 Example Output  

| Candidate | Job Title | Match Score |
|------------|------------|--------------|
| Rahul D. | Machine Learning Engineer | 89.7% |
| Ritika O. | Data Analyst | 77.3% |
| Shruti S. | Backend Developer | 71.5% |

---

## 🧾 Tech Stack Overview  

| Component | Technology |
|------------|-------------|
| **Frontend & Backend** | Next.js 15, TypeScript, TailwindCSS, Framer Motion |
| **Database** | MongoDB Atlas |
| **NLP Microservice** | Python, FastAPI, Sentence-BERT |
| **Resume Parsing** | PyMuPDF, python-docx |
| **Deployment** | Vercel (Next.js App), Render/Railway (NLP API), Hugging Face Spaces (Model Hosting) |

---

## 📚 Use Cases  

- 🔹 **Recruiters:** Automatically rank resumes for faster shortlisting.  
- 🔹 **Job Seekers:** Check how well your resume matches specific roles.  
- 🔹 **Career Platforms:** Integrate AI-based resume matching for smarter recommendations.  

---

## ⭐️ Star This Repository  

If you found **AI Resume & Job Description Matcher** useful or interesting, please consider giving it a **⭐️** — it really motivates me to keep building open-source AI tools and sharing more with the community! 🙌  

---

> 💡 *“Build. Learn. Share. Repeat. Growth happens when you create in public — let’s keep coding smarter together!”*  

### — ✨ *Rahul Dohare*  
