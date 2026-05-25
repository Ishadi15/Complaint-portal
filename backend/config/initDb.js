const db = require('./db');

const initDb = () => {
  return new Promise((resolve, reject) => {
    // 1. Create complaints table
    const createComplaintsTable = `
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
      )
    `;

    // 2. Create admins table
    const createAdminsTable = `
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    db.query(createComplaintsTable, (err) => {
      if (err) {
        console.error("Error creating complaints table:", err.message);
        return reject(err);
      }
      console.log("Complaints table verified/created ✅");

      db.query(createAdminsTable, (err) => {
        if (err) {
          console.error("Error creating admins table:", err.message);
          return reject(err);
        }
        console.log("Admins table verified/created ✅");

        // 3. Seed default admin if table is empty
        db.query("SELECT COUNT(*) as count FROM admins", (err, results) => {
          if (err) {
            console.error("Error checking admins count:", err.message);
            return reject(err);
          }

          if (results[0].count === 0) {
            const seedAdmin = "INSERT INTO admins (username, password) VALUES (?, ?)";
            db.query(seedAdmin, ['dilsha', 'admin'], (err) => {
              if (err) {
                console.error("Error seeding default admin:", err.message);
                return reject(err);
              }
              console.log("Default admin 'dilsha' seeded successfully ✅");
              resolve();
            });
          } else {
            console.log("Admins table already seeded ✅");
            resolve();
          }
        });
      });
    });
  });
};

module.exports = initDb;
