-- SLTMobitel IAU Complaint Portal Database Schema

CREATE DATABASE IF NOT EXISTS complaint_portal_slt;
USE complaint_portal_slt;

CREATE TABLE IF NOT EXISTS complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    crn VARCHAR(20) UNIQUE,
    submission_type VARCHAR(50),
    reporter_category VARCHAR(100),
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    complaint_category VARCHAR(100),
    description TEXT,
    date_reported DATE,
    location VARCHAR(255),
    frequency VARCHAR(50),
    subject_name VARCHAR(255),
    subject_role VARCHAR(255),
    organisation VARCHAR(255),
    senior_involved BOOLEAN DEFAULT FALSE,
    evidence VARCHAR(255),
    declaration BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'Pending Investigation',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
