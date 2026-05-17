const db = require("../config/db");

const Complaint = {
    create: (data, callback) => {
        const sql = `
            INSERT INTO complaints 
            (crn, submissionType, name, email, category, description, subjectName, role, organization) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            data.crn, data.submissionType, data.name, data.email, 
            data.category, data.description, data.subjectName, 
            data.role, data.organization
        ];
        db.query(sql, values, callback);
    },

    findByCRN: (crn, callback) => {
        const sql = "SELECT * FROM complaints WHERE crn = ?";
        db.query(sql, [crn], callback);
    }
};

module.exports = Complaint;
