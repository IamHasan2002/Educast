# Pitch Forecast Backend (Flask + MongoDB)

This is a complete Flask REST API for managing pitch data, forecasting insights, and reviews, built around your provided dataset.

## Quick start

1. **Install deps**
```
python -m venv .venv && source .venv/bin/activate  # on Windows: .venv\Scripts\activate
pip install -r requirements.txt
```
2. **Configure**
```
cp .env.example .env
# edit MONGO_URI and JWT_SECRET as needed
```
3. **Import sample data**
```
python scripts/import_data.py
```
4. **Run API**
```
./run.sh  # or: flask --app app:create_app run --debug --port 5001
```

## Endpoints (summary)
- `GET /api/health`
- `POST /api/auth/register` -> `{token}`
- `POST /api/auth/login` -> `{token}`
- `GET /api/users/me` (Bearer token)

**Pitches**
- `GET /api/pitches` with filters: `ground,status,env,type,min_price,max_price,has_bowling_machine(true|false),q,page,limit,sort,dir`
- `POST /api/pitches` (auth) body: full pitch document
- `GET /api/pitches/{id}`
- `PATCH /api/pitches/{id}` (auth)
- `DELETE /api/pitches/{id}` (auth)

**Reviews (sub-documents)**
- `POST /api/pitches/{id}/reviews` body `{reviewer,rating,comment}`
- `PATCH /api/pitches/{id}/reviews/{review_id}`
- `DELETE /api/pitches/{id}/reviews/{review_id}`

**Analytics**
- `GET /api/pitches/analytics/avg-price-by-ground`
- `GET /api/pitches/analytics/top-rated`

## Testing with Postman
Import `postman/PitchAPI.postman_collection.json`.
Set an environment variable `baseUrl` (default `http://localhost:5001`) and `jwt` after login.

## Export database for submission
```
mongoexport --uri="$MONGO_URI" -c pitches --out export/pitches.json
mongoexport --uri="$MONGO_URI" -c users --out export/users.json
```
