const express = require('express');
const router = express.Router();
const {
    saveReporter,
    saveComplaint,
    saveSubject,
    uploadMiddleware,
    saveEvidence,
    saveDeclaration,
    finalizeComplaint,
    getComplaintStatus
} = require('../controllers/complaintController');

// Step 1: Reporter
router.post('/reporter', saveReporter);

// Step 2: Complaint
router.post('/complaint', saveComplaint);

// Step 3: Subject
router.post('/subject', saveSubject);

// Step 4: Evidence (with file upload middleware)
router.post('/evidence', uploadMiddleware, saveEvidence);

// Step 5: Declaration
router.post('/declaration', saveDeclaration);

// Step 6: Finalize complaint
router.post('/finalize', finalizeComplaint);

// Track complaint status
router.get('/track/:crn', getComplaintStatus);

module.exports = router;
