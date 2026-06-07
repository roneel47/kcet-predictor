# KCET Predictor API Specification

## Base URL

/api

---

# 1. Predict Colleges

Endpoint

POST /api/predict

Purpose

Return eligible colleges based on:

* KCET Rank
* Reservation Category
* Branch Preferences
* Filters

Request

```json
{
  "rank": 12500,
  "category": "3BG",
  "branches": [
    "COMPUTER SCIENCE AND ENGINEERING",
    "INFORMATION SCIENCE AND ENGINEERING"
  ],
  "city": ["Bengaluru"],
  "college_type": ["Private"],
  "autonomous": true
}
```

Response

```json
{
  "success": true,
  "count": 25,
  "results": [
    {
      "college_code": "E005",
      "college_name": "R. V. College of Engineering",
      "branch_name": "COMPUTER SCIENCE AND ENGINEERING",
      "category": "3BG",
      "cutoff_rank": 910,
      "student_rank": 12500,
      "prediction": "Dream",
      "city": "Bengaluru",
      "autonomous": true
    }
  ]
}
```

---

# 2. Get Branch List

Endpoint

GET /api/branches

Purpose

Return all available branches.

Response

```json
[
  "COMPUTER SCIENCE AND ENGINEERING",
  "INFORMATION SCIENCE AND ENGINEERING",
  "ELECTRONICS AND COMMUNICATION ENGINEERING"
]
```

---

# 3. Get Cities

Endpoint

GET /api/cities

Purpose

Return available cities.

Response

```json
[
  "Bengaluru",
  "Mysuru",
  "Mangaluru"
]
```

---

# 4. Search Colleges

Endpoint

GET /api/colleges

Query Parameters

* city
* district
* autonomous
* college_type

Example

/api/colleges?city=Bengaluru

Response

```json
[
  {
    "college_code": "E005",
    "college_name": "R. V. College of Engineering",
    "city": "Bengaluru",
    "autonomous": true,
    "college_type": "Private"
  }
]
```

---

# 5. College Profile

Endpoint

GET /api/college/{college_code}

Example

/api/college/E005

Response

```json
{
  "college_code": "E005",
  "college_name": "R. V. College of Engineering",
  "city": "Bengaluru",
  "district": "Bengaluru Urban",
  "autonomous": true,
  "college_type": "Private",
  "branches": [
    {
      "branch_name": "COMPUTER SCIENCE AND ENGINEERING"
    }
  ]
}
```

---

# 6. Health Check

Endpoint

GET /api/health

Response

```json
{
  "status": "ok"
}
```
