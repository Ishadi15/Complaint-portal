const db = require("./config/db");

db.query("DESCRIBE complaints", (err, results) => {
    if (err) {
        console.log("Error describing table:", err.message);
    } else {
        console.log("Table 'complaints' structure:");
        console.table(results);
    }
    process.exit();
});
