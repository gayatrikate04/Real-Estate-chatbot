# Real Estate Intelligence  
A full-stack real estate analysis system built using **Next.js** on the frontend and **Django + Pandas** on the backend.  
The application analyzes locality-based real estate data from an Excel file and returns:

- A natural-language summary  
- Price and demand trend charts  
- A filtered data table  
- CSV export  
- Support for comparison and growth queries  

This project was developed as part of an internship assignment.

---

## Live Demo  
(Replace these links after deployment)

**Frontend (Vercel):**  
**Backend (Render):**  

---

## Features

### Frontend
- Built with **Next.js 13 App Router**
- Clean and modern UI with a subtle pastel, glass-style theme
- Central query bar with a custom send button
- Summary card with copy support
- Line chart (using Recharts) for price and demand trends
- Filtered table with CSV download
- Fully responsive layout
- Axios-based API integration

### Backend
- Built with **Django**
- Parses an Excel dataset using **Pandas**
- Supports free-text queries such as:
  - Analyze Wakad
  - Compare Aundh and Wakad demand trends
  - Show price growth for Akurdi over the last 3 years
- Returns structured JSON with summary, chart data and table rows
- CORS enabled for frontend integration
- Production ready with Gunicorn + Whitenoise

---

## Project Structure

RealEstateChatbot/
│
├── backend/
│ ├── api/
│ ├── data/ # Contains realestate.xlsx
│ ├── realestate/
│ ├── manage.py
│ └── requirements.txt
│
└── frontend/
├── app/
│ ├── components/
│ ├── lib/
│ ├── globals.css
│ ├── layout.js
│ └── page.js
├── public/
├── package.json
└── .env.local


---

# Running the Project Locally

## 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/RealEstateChatbot.git
cd RealEstateChatbot

## Backend Setup (Django)

cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000

Backend runs at:

http://127.0.0.1:8000


Place your dataset at:

backend/data/realestate.xlsx

Frontend Setup (Next.js)
cd ../frontend
npm install
npm run dev


Frontend runs at:

http://localhost:3000


Create .env.local:

NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api

Deployment Guide
Deploy Backend on Render

Push code to GitHub

Go to Render → New Web Service

Select repository

Set Root Directory to backend/

Build Command:

pip install -r requirements.txt && python manage.py migrate


Start Command:

gunicorn realestate.wsgi


Environment variables:

DJANGO_SECRET_KEY=your-secret-key
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app


Copy deployed backend URL.

Deploy Frontend on Vercel

Import repository into Vercel

Set Project Root to frontend/

Add environment variable:

NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api


Deploy

Add your Vercel domain to backend CORS settings:

CORS_ALLOWED_ORIGINS=https://your-project.vercel.app


Redeploy backend.

Sample Queries

You can test the system using:

Analyze Wakad
Analyze Aundh
Compare Wakad and Aundh demand trends
Compare Ambegaon Budruk and Aundh price trends
Show price growth for Akurdi over the last 3 years

Demo Video Outline

For the internship submission, a 1–2 minute video can include:

Opening the deployed frontend

Entering a sample query (“Analyze Wakad”)

Viewing the summary

Scrolling to the price & demand chart

Viewing the filtered dataset

Exporting the CSV

Showing backend deployment

Showing GitHub repository

Future Improvements

AI-generated summaries using OpenAI

Predictive price insights using machine learning

User accounts and saved history

Support for multiple datasets and cities

Author

Gayatri Kate
Project created for internship assignment evaluation.


---

If you'd like, I can also generate:

- A **formal corporate version**  
- A **student-focused personal version**  
- A **short version suitable for Vercel's project page**

Just tell me!