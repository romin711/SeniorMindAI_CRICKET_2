#!/bin/bash
set -e

echo "Deploying SeniorMind AI Backend to Google Cloud Run..."

PROJECT_ID="${PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}"
REGION="${REGION:-us-central1}"
BACKEND_SERVICE="${BACKEND_SERVICE:-seniormind-backend}"
FRONTEND_SERVICE="${FRONTEND_SERVICE:-seniormind-frontend}"
GEMINI_MODEL="${GEMINI_MODEL:-gemini-2.5-flash}"

if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "(unset)" ]; then
  echo "Error: GCP project is not set. Run: gcloud config set project YOUR_PROJECT_ID"
  exit 1
fi

echo "Using PROJECT_ID=$PROJECT_ID REGION=$REGION GEMINI_MODEL=$GEMINI_MODEL"

cd backend

# Build and Push using Google Cloud Build
echo "Submitting backend build to Cloud Build..."
gcloud builds submit --project "$PROJECT_ID" --tag "gcr.io/$PROJECT_ID/seniormind-backend"

echo "Deploying backend to Cloud Run..."
gcloud run deploy "$BACKEND_SERVICE" \
  --project "$PROJECT_ID" \
  --image "gcr.io/$PROJECT_ID/seniormind-backend" \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --update-env-vars "GEMINI_MODEL=$GEMINI_MODEL" \
  --port 3001

export BACKEND_URL=$(gcloud run services describe "$BACKEND_SERVICE" --project "$PROJECT_ID" --platform managed --region "$REGION" --format 'value(status.url)')
echo "Backend deployed at: $BACKEND_URL"

echo "Deploying SeniorMind AI Frontend to Google Cloud Run..."
cd ../frontend

echo "Submitting frontend build to Cloud Build..."
# We use Cloud Build and pass the API URL as a build arg so the React app builds it into static HTML
gcloud builds submit --project "$PROJECT_ID" --config cloudbuild.yaml --substitutions="_REACT_APP_API_BASE_URL=$BACKEND_URL"

echo "Deploying frontend to Cloud Run..."
gcloud run deploy "$FRONTEND_SERVICE" \
  --project "$PROJECT_ID" \
  --image "gcr.io/$PROJECT_ID/seniormind-frontend" \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --port 8080

export FRONTEND_URL=$(gcloud run services describe "$FRONTEND_SERVICE" --project "$PROJECT_ID" --platform managed --region "$REGION" --format 'value(status.url)')
echo "Frontend deployed at: $FRONTEND_URL"

echo "Deployment complete! Access your app at $FRONTEND_URL"
