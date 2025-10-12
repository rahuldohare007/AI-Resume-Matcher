# nlp_service/main.py
from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
import numpy as np

app = FastAPI(title="AI Resume Matcher NLP Service")

# Load pre-trained Sentence-BERT model
model = SentenceTransformer('all-MiniLM-L6-v2')

class MatchRequest(BaseModel):
    resumeText: str
    jobDescription: str

class MatchResponse(BaseModel):
    matchScore: float

@app.post("/match", response_model=MatchResponse)
def compute_match(data: MatchRequest):
    resume_text = data.resumeText
    job_text = data.jobDescription

    # Encode texts into embeddings
    embeddings_resume = model.encode(resume_text, convert_to_tensor=True)
    embeddings_job = model.encode(job_text, convert_to_tensor=True)

    # Compute cosine similarity
    similarity = util.cos_sim(embeddings_resume, embeddings_job).item()

    # Convert to percentage
    match_score = round(similarity * 100, 2)

    return {"matchScore": match_score}

