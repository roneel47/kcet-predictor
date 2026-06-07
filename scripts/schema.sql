-- KCET Predictor Database Schema
-- PostgreSQL 16
-- Database: kcet_predictor

CREATE DATABASE kcet_predictor;
\c kcet_predictor;

-- Colleges table
CREATE TABLE IF NOT EXISTS colleges (
  college_code VARCHAR(10) PRIMARY KEY,
  college_name TEXT NOT NULL
);

-- College metadata table
CREATE TABLE IF NOT EXISTS college_metadata (
  college_code   VARCHAR(10) PRIMARY KEY REFERENCES colleges(college_code),
  city           TEXT,
  district       TEXT,
  autonomous     BOOLEAN DEFAULT FALSE,
  college_type   TEXT,
  university     TEXT,
  naac_grade     TEXT,
  nirf_rank      NUMERIC,
  website        TEXT
);

-- Cutoffs table
CREATE TABLE IF NOT EXISTS cutoffs (
  id                 SERIAL PRIMARY KEY,
  college_code       VARCHAR(10) REFERENCES colleges(college_code),
  college_name       TEXT NOT NULL,
  branch_name        TEXT NOT NULL,
  category           TEXT NOT NULL,
  cutoff_rank        NUMERIC NOT NULL,
  counselling_year   INTEGER NOT NULL DEFAULT 2025,
  counselling_round  INTEGER NOT NULL DEFAULT 3
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cutoffs_category      ON cutoffs(category);
CREATE INDEX IF NOT EXISTS idx_cutoffs_branch        ON cutoffs(branch_name);
CREATE INDEX IF NOT EXISTS idx_cutoffs_college_code  ON cutoffs(college_code);
CREATE INDEX IF NOT EXISTS idx_cutoffs_rank          ON cutoffs(cutoff_rank);
CREATE INDEX IF NOT EXISTS idx_metadata_city         ON college_metadata(city);
CREATE INDEX IF NOT EXISTS idx_metadata_district     ON college_metadata(district);
CREATE INDEX IF NOT EXISTS idx_metadata_type         ON college_metadata(college_type);
CREATE INDEX IF NOT EXISTS idx_metadata_autonomous   ON college_metadata(autonomous);
