Name Classifier API
This is a simple backend API that processes names and returns a classification result based on custom logic. It is built using Node.js, Express, and a PostgreSQL database hosted on Railway. It makes use of external API to get the chracteristics

Base Url : https://name-classifier-production-102e.up.railway.app/

Endpoints
1. Create Profile
 POST /api/profiles

Request body:
{ "name": "ella" }

Success Response (201 Created):
{
  "status": "success",
  "data": {
    "id": "b3f9c1e2-7d4a-4c91-9c2a-1f0a8e5b6d12",
    "name": "ella",
    "gender": "female",
    "gender_probability": 0.99,
    "sample_size": 1234, //count from Genderize API
    "age": 46,
    "age_group": "adult",
    "country_id": "DRC",
    "country_probability": 0.85,
    "created_at": "2026-04-01T12:00:00Z"
  }
}

When a reord is trying to be created with an existing name. 
Response:
{
  "status": "success",
  "message": "Profile already exists",
  "data": { ...existing profile... }
}

2. Get Single Profile
 GET /api/profiles/{id}

Success Response (200):
{
  "status": "success",
  "data": {
    "id": "b3f9c1e2-7d4a-4c91-9c2a-1f0a8e5b6d12",
    "name": "emmanuel",
    "gender": "male",
    "gender_probability": 0.99,
    "sample_size": 1234,
    "age": 25,
    "age_group": "adult",
    "country_id": "NG",
    "country_probability": 0.85,
    "created_at": "2026-04-01T12:00:00Z"
  }
}
3. Get All Profiles 
GET /api/profiles
Optional query parameters: gender, country_id, age_group Query parameter values are case-insensitive (e.g. gender=Male and gender=male are treated the same) Example: /api/profiles?gender=male&country_id=NG
Success Response (200):
{
  "status": "success",
  "count": 2,
  "data": [
    {
      "id": "id-1",
      "name": "emmanuel",
      "gender": "male",
      "age": 25,
      "age_group": "adult",
      "country_id": "NG"
    },
    {
      "id": "id-2",
      "name": "sarah",
      "gender": "female",
      "age": 28,
     "age_group": "adult",
      "country_id": "US"
    }
  ]
}
4. Delete Profile 
DELETE /api/profiles/{id}
Returns 204 No Content on success.

Error Responses
All errors follow this structure:
{ "status": "error", "message": "<error message>" }
400 Bad Request: Missing or empty name

422 Unprocessable Entity: Invalid type404 Not Found: Profile not found

500/502: Upstream or server failure

Edge cases:
502 error format:
{ "status": "error", "message": "${externalApi} returned an invalid response" }
Error Handling (External APIs)
{ "status": "502", "message": "${externalApi} returned an invalid response" }
externalApi = Genderize | Agify | Nationalize

Features
- REST API built with Express
- Name classification logic
- PostgreSQL database integration
- Environment variable support
- Error handling for invalid requests
- Tested with Postman
- Ready for deployment on Railway

Tech Stack
- Node.js
- Express.js
- PostgreSQL (Railway)
- JavaScript (ES6)
- Nodemon (development)


Setup Instructions
1. Clone the repo : git clone https://github.com/your-username/name-classifier.git
                     cd name-classifier

2. Install dependencies : npm install

3. Create environment variables : Create a `.env` file and add: PORT=5000, DATABASE_URL=your_railway_database_url

4. Run the server : npm run dev                Server runs on: http://localhost:3000

Deployment
1. Push project to GitHub
2. Connect repo to Railway
3. Add environment variables
4. Deploy
5. Use the generated live URL for testing

