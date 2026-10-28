# Smart Civic Complaint AI Microservice 🏛️🤖

A high-performance Python FastAPI microservice providing machine learning capabilities for the **Smart Civic Complaint System** (Gwalior Municipal Corporation).

The microservice automates three core civic governance tasks:
1. **Automated Category Classification**: Routes complaints to the appropriate department using TF-IDF feature extraction and Logistic Regression.
2. **Urgency & Priority Analysis**: Detects hazardous situations (live wires, deep craters near schools, open manholes) to compute priority levels (`Low`, `Medium`, `High`) and severity ratings (`Low`, `Medium`, `High`, `Critical`).
3. **Duplicate Detection**: Computes TF-IDF cosine similarity across historical civic tickets to identify duplicate submissions and prevent redundant work orders.

---

## 📋 Taxonomy & Constants

### Complaint Categories (8)
- `Road Damage`: Potholes, broken dividers, cave-ins, road erosion, speed breaker issues.
- `Garbage`: Overflowing bins, uncollected waste, illegal debris dumping, dead animal carcass.
- `Streetlight`: Fused lamps, dark streets, broken poles, dangling fixtures, timer issues.
- `Water`: Pipeline bursts, contaminated tap water, low pressure, water tanker delays.
- `Drainage`: Overflowing gutters/nalas, missing manhole covers, storm drain waterlogging.
- `Traffic`: Signal malfunctioning, illegal parking, missing signage, dangerous turns.
- `Environment`: Illegal tree cutting, leaf/plastic burning, noise pollution, park maintenance.
- `Other`: Stray cattle, dog menace, locked public toilets, unauthorized encroachments.

### Priority Levels
- `Low`: Suggestions, cosmetic requests, minor maintenance.
- `Medium`: General complaints, standard civic inconvenience.
- `High`: Safety risks, public infrastructure breakdown, urgent action required.

### Severity Levels
- `Low` | `Medium` | `High` | `Critical` (immediate risk to human life or public safety)

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Virtual environment tool (`venv` or `conda`)

### 1. Installation
Navigate to the `ai-service` directory:
```bash
cd ai-service
python -m venv venv

# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default settings:
```env
HOST=0.0.0.0
PORT=8000
MODEL_PATH=./models
BACKEND_URL=http://localhost:5000/api
DEBUG=true
```

### 3. Model Training
Train and evaluate the classification model using the standalone training script:
```bash
python train.py
```
This evaluates the pipeline via stratified 80/20 train/test split, prints classification metrics, and persists `complaint_classifier.joblib` and `duplicate_corpus.joblib` to `./models`.

### 4. Running the Microservice
Start the FastAPI application using Uvicorn:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*Note: If no serialized model exists on disk, the service will automatically train and persist an initial model upon startup.*

Interactive API documentation will be available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc UI: `http://localhost:8000/redoc`

---

## 🐳 Docker Deployment

Build and run using Docker:
```bash
# Build Docker image
docker build -t smart-civic-ai-service .

# Run Docker container
docker run -d -p 8000:8000 --name civic-ai-service smart-civic-ai-service
```

---

## 📡 API Endpoints

### 1. Health Check
- **Endpoint**: `GET /health`
- **Response**:
```json
{
  "status": "healthy",
  "service": "Smart Civic Complaint AI Service",
  "version": "1.0.0",
  "model_loaded": true,
  "training_samples": 240
}
```

---

### 2. Classify Complaint
Analyzes complaint text to determine category, priority, severity, and urgency score.

- **Endpoint**: `POST /classify` (also mounted at `POST /api/classify`)
- **Request Body**:
```json
{
  "text": "Deep pothole in the middle of Thatipur main road causing two-wheeler accidents",
  "complaint_id": "CMP-1024"
}
```
- **Response**:
```json
{
  "category": "Road Damage",
  "confidence": 0.9421,
  "priority": "High",
  "severity": "High",
  "urgency_score": 0.6000,
  "all_categories": {
    "Road Damage": 0.9421,
    "Traffic": 0.0215,
    "Drainage": 0.0123,
    "Streetlight": 0.0081,
    "Garbage": 0.0054,
    "Water": 0.0049,
    "Environment": 0.0032,
    "Other": 0.0025
  },
  "keywords_found": [
    "accident",
    "pothole"
  ],
  "complaint_id": "CMP-1024"
}
```

---

### 3. Analyze Priority & Urgency
Evaluates urgency indicators and sensitive locations (schools, hospitals, children).

- **Endpoint**: `POST /analyze-priority` (also mounted at `POST /api/analyze-priority`)
- **Request Body**:
```json
{
  "text": "Live electrical wire broken and touching stagnant rainwater near primary school gate"
}
```
- **Response**:
```json
{
  "priority": "High",
  "severity": "Critical",
  "urgency_score": 1.0,
  "keywords_found": [
    "children",
    "live wire",
    "school",
    "stagnant"
  ]
}
```

---

### 4. Detect Duplicate Complaints
Checks submitted complaint against indexed tickets using TF-IDF cosine similarity.

- **Endpoint**: `POST /detect-duplicates` (also mounted at `POST /api/detect-duplicates`)
- **Request Body**:
```json
{
  "text": "Huge pothole on Thatipur main road causing severe traffic jam",
  "category": "Road Damage",
  "area": "Thatipur",
  "threshold": 0.50,
  "top_k": 3
}
```
- **Response**:
```json
{
  "duplicates": [
    {
      "complaint_id": "CMP-1031",
      "similarity_score": 0.8124,
      "text_preview": "Deep potholes and broken asphalt on Thatipur Crossing causing heavy traffic jam",
      "category": "Road Damage",
      "area": "Thatipur"
    },
    {
      "complaint_id": "CMP-1024",
      "similarity_score": 0.6842,
      "text_preview": "Large pothole on main road near Thatipur Crossing causing frequent two wheeler skids and accidents",
      "category": "Road Damage",
      "area": "Thatipur"
    }
  ],
  "is_likely_duplicate": true,
  "highest_similarity": 0.8124
}
```

---

### 5. Index Complaint
Adds a new civic complaint to the duplicate detector index dynamically.

- **Endpoint**: `POST /index-complaint`
- **Request Body**:
```json
{
  "id": "CMP-1055",
  "text": "Broken transformer sparking near Morar vegetable market",
  "category": "Streetlight",
  "area": "Morar"
}
```

---

### 6. Model Metadata
- **Endpoint**: `GET /model-info` (also mounted at `GET /api/model-info`)
- **Response**:
```json
{
  "model_name": "TF-IDF + LogisticRegression Multi-Class Classifier",
  "categories": ["Road Damage", "Garbage", "Streetlight", "Water", "Drainage", "Traffic", "Environment", "Other"],
  "priorities": ["Low", "Medium", "High"],
  "severities": ["Low", "Medium", "High", "Critical"],
  "training_samples": 240,
  "pipeline": "TfidfVectorizer(ngram=(1,2), sublinear_tf=True) -> LogisticRegression(C=1.5)",
  "is_trained": true,
  "model_path": "./models/complaint_classifier.joblib"
}
```

---

## 🏛️ Integration with Node.js Express Backend
The Express backend (`/backend`) communicates with this microservice via HTTP requests:
```javascript
// Example helper in backend/src/services/aiService.js
import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export const classifyComplaintAI = async (text, complaintId = null) => {
  try {
    const res = await axios.post(`${AI_SERVICE_URL}/classify`, {
      text,
      complaint_id: complaintId
    });
    return res.data;
  } catch (error) {
    console.error('AI classification failed, falling back to rule-based logic:', error.message);
    return null;
  }
};
```

---

## 🛡️ License
Part of the Smart Civic Complaint & Grievance Redressal System.
