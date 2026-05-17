import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api/complaints' });

// Step 1: Reporter
export const saveReporter = (data) => API.post('/reporter', data);

// Step 2: Complaint
export const saveComplaint = (data) => API.post('/complaint', data);

// Step 3: Subject
export const saveSubject = (data) => API.post('/subject', data);

// Step 4: Evidence (file upload)
export const saveEvidence = (data) => API.post('/evidence', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// Step 5: Declaration
export const saveDeclaration = (data) => API.post('/declaration', data);

// Step 6: Finalize complaint (generate CRN)
export const finalizeComplaint = (data) => API.post('/finalize', data);
