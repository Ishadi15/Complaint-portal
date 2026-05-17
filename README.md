# SLTMobitel IAU Secure Reporting Portal

An enterprise-grade, secure, and confidential reporting gateway for the SLTMobitel Internal Affairs Unit (IAU). This portal allows whistleblowers to report misconduct, fraud, or bribery through an encrypted and optionally anonymous channel.

## Project Structure

```text
slt-iau-portal/
├── frontend/              # React app (UI/UX)
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # All form components
│   │   ├── pages/         # Page containers
│   │   ├── services/      # Axios API calls
│   │   ├── App.js         # Root component
│   │   └── ...
│   └── package.json
│
├── backend/               # Node.js + Express API
│   ├── config/            # DB connection configurations
│   ├── controllers/       # Business logic / Route handlers
│   ├── routes/            # API endpoints mapping
│   ├── models/            # Database query abstractions
│   ├── server.js          # Entry point
│   └── package.json
│
├── database/              # SQL scripts
│   └── schema.sql         # Database initialization
│
└── README.md              # Documentation
```

## Explanation of Each Folder

### Frontend (React UI/UX)
*   **`frontend`**: Root of the React application handling the multi-step form UI.
*   **`components`**: Contains each individual step of the form (Reporter, Complaint, Subject, Evidence, Declaration, Confirmation).
*   **`pages`**: Contains the `Portal` container that controls step navigation and global state.
*   **`services`**: Contains `api.js` which houses centralized Axios functions to call backend routes.

### Backend (Node.js + Express API)
*   **`backend`**: Root of the Node.js + Express REST API.
*   **`config`**: Handles the MySQL database connection setup (`db.js`).
*   **`controllers`**: Contains logic functions (`complaintController.js`) that handle incoming requests and business rules.
*   **`routes`**: Defines the API endpoints (`complaintRoutes.js`) and maps them to controllers.
*   **`models`**: SQL queries are separated here (`complaintModel.js`) to maintain clean, reusable code.

### Database & Documentation
*   **`database`**: Stores the SQL schema (`schema.sql`) for the `complaints` table.
*   **`README.md`**: Main project documentation.

## Features

- **End-to-End Encryption**: Secure data transmission.
- **Anonymous Reporting**: Optional identity protection.
- **Dynamic Multi-step Form**: Intuitive reporting workflow.
- **Real-time Tracking**: Track investigation status via CRN.

## Getting Started

### Prerequisites
- Node.js (v16+)
- MySQL Database

### Installation

1. **Clone the repository**
2. **Setup Database**: Execute `database/schema.sql` in your MySQL environment.
3. **Backend Setup**:
   - `cd backend`
   - `npm install`
   - Configure `.env` (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME).
   - `npm start`
4. **Frontend Setup**:
   - `cd frontend`
   - `npm install`
   - `npm start`

## Security
This application is designed for secure environments. All submissions are stored with audit trails and restricted access.
