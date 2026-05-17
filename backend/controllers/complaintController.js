const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// File upload setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // create uploads folder in backend
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
exports.uploadMiddleware = upload.single('evidence');

// Step 1: Reporter
exports.saveReporter = (req, res) => {
    const { submission_type, reporter_category, full_name, email, phone } = req.body;
    const sql = "INSERT INTO complaints (submission_type, reporter_category, full_name, email, phone) VALUES (?,?,?,?,?)";
    db.query(sql, [submission_type, reporter_category, full_name, email, phone], (err, result) => {
        if (err) {
            console.error("DB Error (saveReporter):", err.message);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true, id: result.insertId });
    });
};

// Step 2: Complaint
exports.saveComplaint = (req, res) => {
    const { complaint_category, description, date_reported, location, frequency } = req.body;
    const sql = "UPDATE complaints SET complaint_category=?, description=?, date_reported=?, location=?, frequency=? WHERE id=?";
    db.query(sql, [complaint_category, description, date_reported, location, frequency, req.body.id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true });
    });
};

// Step 3: Subject
exports.saveSubject = (req, res) => {
    const { subject_name, subject_role, organisation, senior_involved } = req.body;
    const sql = "UPDATE complaints SET subject_name=?, subject_role=?, organisation=?, senior_involved=? WHERE id=?";
    db.query(sql, [subject_name, subject_role, organisation, senior_involved, req.body.id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true });
    });
};

// Step 4: Evidence
exports.saveEvidence = (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const sql = "UPDATE complaints SET evidence=? WHERE id=?";
    db.query(sql, [req.file.filename, req.body.id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true });
    });
};

// Step 5: Declaration
exports.saveDeclaration = (req, res) => {
    const { declaration } = req.body;
    const sql = "UPDATE complaints SET declaration=? WHERE id=?";
    db.query(sql, [declaration, req.body.id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true });
    });
};

// Step 6: Finalize complaint (generate CRN)
function generateCRN() {
    const year = new Date().getFullYear();
    const num = String(Math.floor(Math.random() * 999999)).padStart(6, '0');
    return `IAU-${year}-${num}`;
}

exports.finalizeComplaint = (req, res) => {
    const crn = generateCRN();
    const sql = "UPDATE complaints SET crn=? WHERE id=?";
    db.query(sql, [crn, req.body.id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true, crn });
    });
};

// Track complaint
exports.getComplaintStatus = (req, res) => {
    const { crn } = req.params;
    const sql = "SELECT * FROM complaints WHERE crn = ?";
    db.query(sql, [crn], (err, results) => {
        if (err) {
            console.error("DB Error (getComplaintStatus):", err.message);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Complaint not found' });
        }
        res.json({ success: true, complaint: results[0] });
    });
};

