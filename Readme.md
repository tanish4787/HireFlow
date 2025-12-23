# 🚀 HireFlow – One-Click Resume Outreach Platform (Backend)

HireFlow is a backend service that enables job seekers to **send their resume to multiple recruiters in one click**, with **duplicate prevention**, **role-based email templates**, and **secure authentication**.

Built with a **real-world production mindset**, HireFlow focuses on correctness, safety, scalability, and clean architecture.

---

## ✨ Core Features

### 🔐 Authentication

- Passwordless **Magic Link authentication**
- Secure JWT-based session handling
- Token expiry, reuse prevention, and rate limiting

### 📄 Resume Management

- Upload resumes (PDF only, max 2MB)
- Cloud storage (Cloudinary)
- Multiple resumes per user with labels
- List & delete resumes

### 👤 Recruiter Management

- Add recruiters with:
  - Name
  - Email
  - Company
  - Role
- User-scoped data (no cross-user access)

### ✉️ Email Templates

- Role-based editable email templates
- Dynamic variable rendering:
  - Recruiter name
  - Company
  - Role
  - Sender name
- Fallback default templates if none exist

### 📤 Resume Sending

- **Single send** (one recruiter)
- **Batch send** (up to 5 recruiters at once)
- Email attachments via cloud-hosted resume URLs
- Prevents duplicate sends using Send Logs

### 🛡️ Safety & Guards

- Prevents resending resume to the same recruiter
- Proper error handling with operational vs unexpected errors
- Clean HTTP status codes (400, 401, 404, 409, 500)

---

## 🧱 Tech Stack

| Layer         | Technology                      |
| ------------- | ------------------------------- |
| Runtime       | Node.js                         |
| Framework     | Express (ESM)                   |
| Database      | MongoDB (Atlas)                 |
| ODM           | Mongoose                        |
| Auth          | JWT + Magic Links               |
| File Upload   | Multer (memory storage)         |
| Cloud Storage | Cloudinary                      |
| Email         | Nodemailer (Gmail App Password) |
| Validation    | express-validator               |
| Environment   | dotenv                          |
| Dev Tools     | nodemon, Postman                |

---

## 🗂️ Project Structure

```
src/
├── app.js
├── server.js
├── configs/
│   ├── db.js
│   └── cloudinary.js
├── controllers/
│   ├── authControllers.js
│   ├── resumeControllers.js
│   ├── recruiterControllers.js
│   ├── emailControllers.js
│   └── templateControllers.js
├── models/
│   ├── User.model.js
│   ├── Resume.model.js
│   ├── Recruiter.model.js
│   ├── EmailTemplate.model.js
│   ├── MagicToken.model.js
│   └── SendLog.model.js
├── routes/
│   ├── auth.routes.js
│   ├── resume.routes.js
│   ├── recruiter.routes.js
│   ├── email.routes.js
│   └── template.routes.js
├── middlewares/
│   ├── auth.middleware.js
│   └── errorMiddleware.js
├── utils/
│   ├── ApiError.js
│   ├── asyncErrorHandler.js
│   ├── EmailService.js
│   ├── CloudStorageService.js
│   ├── RenderTemplate.js
│   └── generateMagicToken.js
└── .env
```

---

## 🔑 Environment Variables

Create a `.env` file in the root:

```env
PORT=8000

MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/HireFlow

JWT_SECRET=your_jwt_secret

BACKEND_URL=http://localhost:8000

EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password

CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
```

⚠️ Use **Gmail App Password**, not your normal Gmail password.

---

## 🏁 Getting Started

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Start the server

```bash
npm run dev
```

### 3️⃣ Health check

```
GET /health
```

Response:

```json
{ "status": "OK" }
```

---

## 🔐 Authentication Flow (Magic Link)

1. **Request login**

```
POST /api/auth/login
```

```json
{ "email": "user@example.com" }
```

2. Click the magic link received via email

3. **Verify token**

```
GET /api/auth/verify?token=xxxx
```

Response:

```json
{
  "success": true,
  "token": "<JWT>"
}
```

Use this JWT for all protected routes.

---

## 📄 Resume APIs

### Upload Resume

```
POST /api/resumes
Authorization: Bearer <JWT>
Content-Type: multipart/form-data
```

Fields:

- `file` (PDF)
- `label` (string)

---

### List Resumes

```
GET /api/resumes
Authorization: Bearer <JWT>
```

---

### Delete Resume

```
DELETE /api/resumes/:resumeId
Authorization: Bearer <JWT>
```

---

## 👤 Recruiter APIs

### Create Recruiter

```
POST /api/recruiters
Authorization: Bearer <JWT>
```

```json
{
  "name": "Amit",
  "email": "amit@company.com",
  "company": "ABC Corp",
  "role": "Backend Engineer"
}
```

---

### List Recruiters

```
GET /api/recruiters
Authorization: Bearer <JWT>
```

---

## ✉️ Email Template APIs

### Create / Update Template

```
POST /api/templates
Authorization: Bearer <JWT>
```

```json
{
  "role": "Backend Engineer",
  "subject": "Application for Backend Engineer",
  "body": "Hi {{recruiterName}},\n\nI came across the {{role}} role at {{company}}..."
}
```

---

## 📤 Resume Sending APIs

### Single Send

```
POST /api/send
Authorization: Bearer <JWT>
```

```json
{
  "recruiterId": "xxxx",
  "resumeId": "xxxx"
}
```

---

### Batch Send (Max 5)

```
POST /api/send/batch
Authorization: Bearer <JWT>
```

```json
{
  "resumeId": "xxxx",
  "recruiterIds": ["id1", "id2", "id3"]
}
```

Duplicate sends are automatically skipped or blocked.

---

##

```json
{
  "success": false,
  "message": "Resume already sent to this recruiter"
}
```



---

## 🧑‍💻 Author

**HireFlow (Tanish)**\
Built with a **production-first mindset** to solve a real problem faced by job seekers.

---

## 📜 License

MIT

