# KCET Predictor Application Specification

## Overview

KCET Predictor is a web-based platform that helps students predict college admission possibilities based on official KEA cutoff data.

The platform should provide personalized recommendations using rank, category, branch preferences, and location filters.

---

# User Roles

## Student

Default user role.

Can:

* Predict colleges
* Search colleges
* Filter results
* Compare colleges
* Export results

---

# Inputs

## Mandatory Inputs

### KCET Rank

Example:

14526

Validation:

* Positive integer
* Required

---

### Reservation Category

Examples:

* GM
* 1G
* 2AG
* 2BG
* 3BG
* SCG
* STG

Data source:

Database category list

Validation:

Required

---

## Optional Inputs

### Preferred Branches

Examples:

* Computer Science and Engineering
* Information Science and Engineering
* AIML
* Data Science
* Cyber Security

Multiple selections allowed.

---

### Preferred Cities

Examples:

* Bangalore
* Mysore
* Mangalore
* Hubli
* Belagavi

Multiple selections allowed.

---

### College Type

Options:

* Government
* Private
* Both

---

### Autonomous Filter

Options:

* Yes
* No
* Both

---

# Prediction Engine

The system compares student rank against historical cutoff ranks.

For every eligible college and branch:

Calculate:

Student Rank vs Cutoff Rank

---

# Recommendation Categories

## Guaranteed

Student rank significantly better than cutoff.

---

## Safe

Student rank comfortably within cutoff.

---

## Reach

Student rank close to cutoff.

---

## Dream

Student rank worse than cutoff but still potentially achievable in future rounds.

---

# Results Page

Each result card should display:

* College Name
* Branch Name
* Category Used
* Cutoff Rank
* Student Rank
* Recommendation Level

---

# Search Features

Users should be able to search:

* Colleges
* Branches
* Cities

---

# College Profile Page

Display:

* College Name
* Location
* Type
* Autonomous Status
* Available Branches
* Historical Cutoffs

---

# Export Features

Supported formats:

* Excel
* CSV
* PDF

---

# Mobile Support

The application must be fully responsive.

Support:

* Desktop
* Tablet
* Mobile

---

# Performance Requirements

Target response time:

Less than 2 seconds

For:

* Predictions
* Searches
* Filters

---

# Future Features

Version 2:

* AI Counselor
* College Comparison
* Round Prediction
* Historical Trend Analysis

Version 3:

* COMEDK
* PGCET
* NEET Counseling Data
