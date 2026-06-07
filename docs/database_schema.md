# KCET Predictor Database Schema

## Database

PostgreSQL 16

Database Name:

kcet_predictor

---

## Table: colleges

Stores unique colleges.

Columns:

* college_code (PK)
* college_name

Records:

229

---

## Table: cutoffs

Stores all category-wise cutoff ranks.

Columns:

* id (PK)
* college_code
* college_name
* branch_name
* category
* cutoff_rank
* counselling_year
* counselling_round

Records:

10,949

---

## Table: college_metadata

Stores filtering information.

Columns:

* college_code (PK)
* city
* district
* autonomous
* college_type
* university
* naac_grade
* nirf_rank
* website

Records:

229

---

## Supported Categories

1G
1K
1R
2AG
2AK
2AR
2BG
2BK
2BR
3AG
3AK
3AR
3BG
3BK
3BR
GM
GMK
GMP
GMR
NRI
OPN
OTH
SCG
SCK
SCR
STG
STK
STR

---

## Supported Filters

* Category
* Branch
* City
* District
* Autonomous
* College Type

---

## Data Statistics

Colleges: 229

Branches: 104

Categories: 28

Cutoff Records: 10,949

Metadata Records: 229

Status:

Verified

