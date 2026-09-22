# Enso

> A secure emergency document vault — critical family documents, protected day to day, accessible to trusted contacts when it truly matters.

![Status](https://img.shields.io/badge/status-in%20development-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## Overview

Enso lets you securely store critical documents — IDs, insurance policies, medical records, property papers, wills — in one encrypted vault, and designate **trusted contacts** who can gain scoped access to specific documents in a genuine emergency, without you losing control of your data day to day.

It's built around three ideas:
- **Security first** — encryption at rest, 2FA, full access audit trail
- **Controlled emergency access** — a dead-man's-switch / grace-period mechanism, not a free-for-all
- **Document intelligence** — OCR auto-categorization and expiry tracking, not just dumb file storage

---

## Features

-  Encrypted document upload and storage, organized by category
-  Google OAuth + email/password authentication with TOTP 2FA
-  Trusted-contact invites with per-contact document scoping
-  Emergency access via check-in based dead-man's switch or contact-initiated request with owner grace period
-  Full access audit log — who viewed what, and when
-  OCR-based auto-categorization and expiry-date extraction on upload
-  Automated reminders for expiring documents and check-ins

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Storage | Cloudinary / AWS S3 |
| Auth | Passport.js (Google OAuth2), JWT, TOTP |
| OCR / ML | Tesseract / fine-tuned classifier |
| Notifications | Nodemailer, Twilio (optional) |
| Deployment | Vercel / Render, MongoDB Atlas |

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas URI)
- Cloudinary account (or S3 bucket)

### Installation

```bash
# Clone the repo
git clone https://github.com/anmolkumar875511/Enso.git
cd Enso

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Environment Variables

Create a `.env` file in `/server` with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Run locally

```bash
# Start backend
cd server
npm run dev

# Start frontend (in a new terminal)
cd client
npm run dev
```

The app should now be running at `http://localhost:5173` (frontend) with the API at `http://localhost:5000`.

---

## Project Structure

```
enso/
├── client/          # React frontend
│  └── src/
│       ├── components/
│       ├── pages/
│       └── App.jsx
├── server/           # Express backend
│  └── src/
│       ├── models/
│       ├── routes/
│       ├── controllers/
│       ├── middleware/
│       └── index.js
└── README.md
```

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Author

Built by **Anmol Kumar** — [GitHub](https://github.com/anmolkumar875511) · [LinkedIn](https://www.linkedin.com/in/anmolkumar8755/)
