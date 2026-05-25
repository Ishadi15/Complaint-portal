const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// File upload setup - use Cloudinary for serverless deployment
const storage = process.env.CLOUDINARY_CLOUD_NAME
    ? new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req, file) => {
            return {
                folder: 'complaint-portal/evidence',
                resource_type: 'auto', // Allows non-image files like PDFs and Docs
                upload_preset: 'vik3kv2t', // Explicitly using the Unsigned preset from Cloudinary dashboard
                max_file_size: 5242880 // 5MB limit
            };
        }
    })
    : multer.memoryStorage(); // Fallback to memory storage if Cloudinary is not configured

// Configure Multer validation rules
const upload = multer({
    storage: storage,
    limits: { fileSize: 5242880 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg', 'image/png', 'image/jpg',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`File type not allowed: ${file.mimetype}`));
        }
    }
});

// Middleware to handle single file upload error catch
exports.uploadMiddleware = (req, res, next) => {
    upload.single('evidence')(req, res, (err) => {
        if (err) {
            console.error("Multer upload error:", err.message);
            return res.status(400).json({ error: 'File upload error: ' + err.message });
        }
        next();
    });
};

// Step 1: Save Reporter details (Updated SQL Column Names)
exports.saveReporter = (req, res) => {
    const {
        submission_type,
        reporter_category,
        full_name,
        employee_id,
        division,
        designation,
        email,
        phone,
        preferred_contact
    } = req.body;

    const isAnonymous = submission_type === 'Anonymous';

    // Named submissions require full_name and email
    if (!submission_type) {
        return res.status(400).json({ error: 'Submission type is required' });
    }
    if (!isAnonymous && (!full_name || !email)) {
        return res.status(400).json({ error: 'Full name and email are required for Named submissions' });
    }

    // For Anonymous, strip personal fields server-side as a safety measure
    const safeName = isAnonymous ? null : full_name;
    const safeEmail = isAnonymous ? null : email;
    const safePhone = isAnonymous ? null : (phone || null);
    const safeEmpId = isAnonymous ? null : (employee_id || null);
    const safePreferred = isAnonymous ? null : (preferred_contact || null);

    // ✅ SQL Query එක Database Columns වලට ගැලපෙන විදිහට නිවැරදි කර ඇත.
    const sql = `INSERT INTO complaints
        (submission_type, reporter_category, name, employee_id, department, designation, email, telephone, preferred_contact_method)
        VALUES (?,?,?,?,?,?,?,?,?)`;

    db.query(sql, [
        submission_type,
        reporter_category || null,
        safeName,                  // Maps to 'name' column
        safeEmpId,                 // Maps to 'employee_id' column
        division || null,          // Maps to 'department' column
        designation || null,       // Maps to 'designation' column
        safeEmail,                 // Maps to 'email' column
        safePhone,                 // Maps to 'telephone' column
        safePreferred              // Maps to 'preferred_contact_method' column
    ], (err, result) => {
        if (err) {
            console.error("DB Error (saveReporter):", err.message);
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }
        res.json({ success: true, id: result.insertId });
    });
};


// Step 2: Save Complaint description details
exports.saveComplaint = (req, res) => {
    const { complaint_category, description, date_reported, location, frequency } = req.body;
    const sql = "UPDATE complaints SET complaint_category=?, description=?, date_reported=?, location=?, frequency=? WHERE id=?";
    db.query(sql, [complaint_category, description, date_reported, location, frequency, req.body.id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true });
    });
};

// Step 3: Save Subject/Offender details
exports.saveSubject = (req, res) => {
    const { subject_name, subject_role, organisation, senior_involved } = req.body;
    const sql = "UPDATE complaints SET subject_name=?, subject_role=?, organisation=?, senior_involved=? WHERE id=?";
    db.query(sql, [subject_name, subject_role, organisation, senior_involved, req.body.id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true });
    });
};

// Step 4: Save Uploaded Evidence attachment reference
exports.saveEvidence = (req, res) => {
    if (!req.file) {
        console.error("No file received in request");
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // Store either Cloudinary URL or filename depending on storage type
        const fileReference = req.file.secure_url || req.file.path || req.file.filename;

        if (!fileReference) {
            console.error("No file reference available:", req.file);
            return res.status(400).json({ error: 'File upload failed - no file reference' });
        }

        const sql = "UPDATE complaints SET evidence=? WHERE id=?";
        db.query(sql, [fileReference, req.body.id], (err, result) => {
            if (err) {
                console.error("DB Error (saveEvidence):", err.message);
                return res.status(500).json({ error: 'Database error: ' + err.message });
            }
            res.json({ success: true, fileUrl: fileReference });
        });
    } catch (error) {
        console.error("Error in saveEvidence:", error.message);
        res.status(500).json({ error: 'Error processing file: ' + error.message });
    }
};

// Step 5: Save Legal Declaration acceptance
exports.saveDeclaration = (req, res) => {
    const { declaration } = req.body;
    const sql = "UPDATE complaints SET declaration=? WHERE id=?";
    db.query(sql, [declaration, req.body.id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ success: true });
    });
};

// Step 6: Finalize complaint and generate Complaint Reference Number (CRN)
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

// Track existing complaint status by CRN
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