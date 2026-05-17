const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const complaintRoutes = require('./routes/complaintRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);


// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
