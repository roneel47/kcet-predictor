# KCET Predictor - Prediction Logic

## Objective

Given:

* Student KCET Rank
* Reservation Category
* Preferred Branches
* Optional Filters

Determine the probability of admission into a college and classify results based on official KEA cutoff data.

---

## Inputs

### Mandatory

* KCET Rank
* Reservation Category

### Optional

* Preferred Branches
* City
* District
* College Type
* Autonomous Filter

---

## Category Handling

The selected reservation category must always be used.

Example:

Student:

* Rank = 5000
* Category = 3BG

The system must compare only against:

* 3BG cutoff values

The system must never compare against:

* GM
* 1G
* 2AG
* SCG
* STG
* Any other category

If cutoff data for the selected category is unavailable for a particular college and branch, that record should be excluded from prediction results.

---

## Cutoff Selection

The system compares the student's rank against:

* Same reservation category
* Same branch
* Same college

using official KEA Round 3 cutoff data.

Example:

Student:

* Rank = 5000
* Category = 3BG

College:

* R. V. College of Engineering
* Computer Science and Engineering
* 3BG Cutoff = 910

Comparison:

5000 vs 910

---

## Recommendation Levels

### Guaranteed

Student rank is significantly better than cutoff.

Formula:

rank <= cutoff × 0.80

Example:

Cutoff = 10000

Rank = 7000

Result = Guaranteed

---

### Safe

Student rank is comfortably within cutoff.

Formula:

rank > cutoff × 0.80

AND

rank <= cutoff × 0.95

Example:

Cutoff = 10000

Rank = 9000

Result = Safe

---

### Reach

Student rank is close to cutoff.

Formula:

rank > cutoff × 0.95

AND

rank <= cutoff × 1.10

Example:

Cutoff = 10000

Rank = 10500

Result = Reach

---

### Dream

Student rank is worse than cutoff but still reasonably close.

Formula:

rank > cutoff × 1.10

AND

rank <= cutoff × 1.50

Example:

Cutoff = 10000

Rank = 13000

Result = Dream

---

### Not Eligible

Student rank is significantly worse than cutoff.

Formula:

rank > cutoff × 1.50

Example:

Cutoff = 10000

Rank = 18000

Result = Not Eligible

Not Eligible records should not be shown in default prediction results.

An optional toggle may be provided in future versions to display them.

---

## Sorting

Results should be sorted by:

1. Recommendation Level
2. Cutoff Rank
3. College Name

Order:

1. Guaranteed
2. Safe
3. Reach
4. Dream

Not Eligible records should be excluded by default.

---

## Branch Matching

### Exact Branch Matching

Example:

Computer Science and Engineering

returns:

* Computer Science and Engineering

---

### Branch Group Matching

The system should support grouped branch searches.

Example:

User selects:

Computer Science

The system should return related branches such as:

* Computer Science and Engineering
* Computer Science and Engineering (Artificial Intelligence)
* Computer Science and Engineering (Artificial Intelligence and Machine Learning)
* Computer Science and Engineering (Data Science)
* Computer Science and Engineering (Cyber Security)
* Computer Science and Engineering (Internet of Things)
* Computer Science and Business Systems
* Computer Science and Technology

Example:

User selects:

Electronics

The system may return:

* Electronics and Communication Engineering
* Electronics and Computer Engineering
* Electronics Engineering
* Electronics and Instrumentation Engineering

Branch groups should be configurable and expandable.

---

## Filters

Supported filters:

* Reservation Category
* Branch
* Branch Group
* City
* District
* College Type
* Autonomous Status

All filters are optional except Reservation Category.

---

## Results Page

Each result should display:

* College Name
* College Code
* Branch Name
* Category Used
* Student Rank
* Historical Cutoff Rank
* Recommendation Level
* City
* District
* College Type
* Autonomous Status

---

## Data Source

Official KEA UGCET 2025 Round 3 Cutoff Database

Dataset Statistics:

* 229 Colleges
* 104 Branches
* 28 Reservation Categories
* 10,949 Cutoff Records

Metadata Statistics:

* 229 College Metadata Records

Status:

Validated and Verified

---

## Future Enhancements

### Version 2

* Multi-year cutoff analysis
* Round-wise prediction
* AI college counselor
* College comparison
* Branch trend analysis

### Version 3

* COMEDK Predictor
* PGCET Predictor
* NEET Counseling Predictor
* Historical trend forecasting

---

## Business Rule Freeze

The following rules are considered frozen and must not be modified by AI-generated code:

* Use only official KEA cutoff data.
* Always compare against the selected reservation category.
* Do not compare across categories.
* Use the recommendation thresholds defined in this document.
* Exclude Not Eligible results by default.
* Preserve original cutoff values without modification.
* Use Round 3 cutoff data as the prediction baseline.
* Database schema must not be altered without explicit approval.
* Prediction logic must not be altered without explicit approval.

