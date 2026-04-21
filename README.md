Intelligent Query Name Classifier API
A rule-based demographic intelligence API built for Insighta Labs. This is a simple backend API that processes names and returns a classification result based on custom logic. It is built using Node.js, Express, and a PostgreSQL database hosted on Railway.It enables filtering, sorting, pagination, and natural language querying of user profiles stored in a PostgreSQL database. It makes use of external API to get the chracteristics

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

When a record is trying to be created with an existing name. 
Response:
{
  "status": "success",
  "message": "Profile already exists"
}

2. Get Single Profile
 GET /api/profiles/{id}

Success Response (200):
{
  "status": "success",
  "data": {
    "id": "019dafe5-c90c-770c-85f8-1f5c23371d64",
    "name": "David Compaoré",
    "gender": "male",
    "gender_probability": 0.77,
    "age": 65,
    "age_group": "senior",
    "country_id": "NG",
    "country_name": "Nigeria",
    "country_probability": 0.15,
    "created_at": "2026-04-21T11:56:05.260Z"
  }
}


3. Get All Profiles
GET /api/profiles
Supports filtering, sorting, and pagination in a single request.
Supported filters:

gender
age_group
country_id
min_age
max_age
min_gender_probability
min_country_probability
Sorting: sort_by → age | created_at | gender_probability Order: order → asc | desc
Pagination: page (default: 1), limit (default: 10, max: 50)

Example:
/api/profiles?gender=male&country_id=NG&min_age=25&sort_by=age&order=desc&page=1&limit=10
Success Response (200):
{
  "status": "success",
  "page": 1,
  "limit": 10,
  "total": 2026,
  "data": [
    {
      "id": "b3f9c1e2-7d4a-4c91-9c2a-1f0a8e5b6d12",
      "name": "emmanuel",
      "gender": "male",
      "gender_probability": 0.99,
      "age": 34,
      "age_group": "adult",
      "country_id": "NG",
      "country_name": "Nigeria",
      "country_probability": 0.85,
      "created_at": "2026-04-01T12:00:00Z
    }
  ]
}

4. Natural Language Query (Core Feature)
GET /api/profiles/search

Example:
/api/profiles/search?q=young males from nigeria

Example mappings:
"young males"                        →  gender=male + min_age=16 + max_age=24
"females above 30"                   →  gender=female + min_age=30
"people from angola"                 →  country_id=AO
"adult males from kenya"             →  gender=male + age_group=adult + country_id=KE
"male and female teenagers above 17" →  age_group=teenager + min_age=17
"males in africa"                    ->  gender=male + continentMap.Africa

5. Delete Profile 
DELETE /api/profiles/{id}
Returns 204 No Content on success.


Error responses:
All error follow this format
{
  "status": "error",
  "message": "Error description"
}

Queries that can't be interpreted return:
{
  "status": "error", 
  "message": "Unable to interpret query"
}

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
- pg (node-postgres)
- JavaScript (ES6)
- UUID v7
- dotenv
- Nodemon (development)

📊 Database Schema

Table: profiles

Field                           	Type	                                               Description
id	                              UUID v7	                                             Primary key
name	                            VARCHAR (unique)	                                     Full name
gender	                          VARCHAR	                                              male / female
gender_probability	               FLOAT	                                             confidence score
age	                               INT	                                                 exact age
age_group	                         VARCHAR	                                          child / teenager / adult / senior
country_id	                      VARCHAR(2)	                                          ISO country code
country_name	                     VARCHAR	                                              full country name
country_probability	               FLOAT	                                                confidence score
created_at	                       TIMESTAMP	                                              auto-generated


Setup Instructions
1. Clone the repo : git clone https://github.com/your-username/name-classifier.git
                     cd name-classifier

2. Install dependencies : npm install

3. Create environment variables : Create a `.env` file and add DATABASE_URL=your_railway_database_url

4. Run the server : npm run dev                Server runs on: http://localhost:3000
   
5. Database Seeding-To populate the database with 2026 profiles: run node scripts/seedProfile.js 

Deployment
1. Push project to GitHub
2. Connect repo to Railway
3. Add environment variables
4. Deploy
5. Use the generated live URL for testing


