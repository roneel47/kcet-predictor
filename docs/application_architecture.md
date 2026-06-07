# KCET Predictor Application Architecture

## Overview

KCET Predictor is a full-stack web application that helps students identify eligible colleges using official KEA cutoff data.

---

# Technology Stack

## Frontend

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS
* shadcn/ui

---

## Backend

* Next.js Route Handlers
* TypeScript

---

## Database

* PostgreSQL 16

---

## ORM

* Prisma

---

## Hosting

### Option 1

Frontend:

* Vercel

Database:

* Neon PostgreSQL

### Option 2

Self Hosted

Frontend:

* Docker

Database:

* PostgreSQL

Reverse Proxy:

* Cloudflare Tunnel

---

# Authentication

Version 1

No authentication required.

Public application.

---

# Pages

## Home Page

Purpose:

Collect:

* KCET Rank
* Category
* Branch Preferences
* Filters

---

## Results Page

Displays:

* College Name
* Branch
* Cutoff
* Prediction
* City
* College Type

---

## College Search Page

Allows:

* Search Colleges
* Filter Colleges

---

## College Profile Page

Displays:

* College Details
* Available Branches
* Cutoff Information

---

# Prediction Engine

Input:

* Rank
* Category

Process:

* Query cutoffs table
* Compare rank with cutoff
* Generate recommendation

Output:

* Guaranteed
* Safe
* Reach
* Dream

---

# Filtering

Supported Filters:

* Branch
* City
* District
* Autonomous
* College Type

---

# Performance Goals

Prediction API:

< 2 seconds

Search API:

< 1 second

---

# Future Versions

## V2

* Historical Trends
* Round Comparison
* College Comparison

## V3

* COMEDK Predictor
* NEET Predictor
* PGCET Predictor

---

# Database Tables

* colleges
* cutoffs
* college_metadata

---

# Code Quality

Requirements:

* TypeScript Strict Mode
* ESLint
* Responsive Design
* Mobile First
* Reusable Components
* Clean Architecture

---

# Deliverables

* Production Ready Application
* Fully Typed Code
* Prisma Integration
* PostgreSQL Integration
* Responsive UI
* API Documentation
