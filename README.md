
## 1. Project Setup

### **a. Prerequisites**

* Node.js (Recommended: **v18+**)
* MongoDB (Local or Atlas)
* API Keys (Email SMTP – Gmail/Outlook)
* npm (v9+)

### **b. Installation Steps**

#### **Backend**

```
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```
PORT=5000
MONGO_URI=your_mongo_connection_uri
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```

Run backend:

```
npm run dev
```

---

#### **Frontend**

```
cd frontend
npm install
npm run dev
```

---

### **c. Email Sending / Receiving Configuration**

#### **Email Sending (SMTP)**

Project uses **Nodemailer**.

Update `.env`:

```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

For Gmail:
Enable → Google Account → Security → App Passwords (Required)

#### **Email Receiving**

Supports:

* IMAP Listener (automatic incoming email reading)
* Manual file upload fallback (PDF, DOCX, XLSX)

---

### **d. Running Locally**

1. Start backend:

```
cd backend
npm run dev
```

2. Start frontend:

```
cd frontend
npm run dev
```

3. Open browser:
   **[http://localhost:5173](http://localhost:5173)**

---

### **e. Seed Data**

(Optional)

Run:

```
node seed.js
```

This initializes sample vendors and procurement entries.

---

## 2. Tech Stack

### **Frontend**

* React
* Axios
* TailwindCSS / Custom CSS
* React Router

### **Backend**

* Node.js
* Express
* Nodemailer
* Mailparser / IMAP
* JWT (optional)

### **Database**

* MongoDB + Mongoose

### **AI Tools**

 Gemini for parsing variations

### **Key Libraries**

* express
* mongoose
* multer
* nodemailer
* mailparser
* pdf-parse
* dotenv

---

## 3. API Documentation

### **Base URL**

```
http://localhost:5000/api
```

---

### **POST /procurement/create**

Creates a new procurement request.

#### Request Body

```json
{
  "title": "Laptop Purchase",
  "description": "Dell laptops for HR team",
  "deadline": "2025-01-15"
}
```

#### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

---

### **POST /email/upload**

Upload vendor proposal (email text or file).

Form-data:

* `file`
* `vendorId`

#### Response

```json
{
  "message": "Parsed successfully",
  "score": 89
}
```

---

### **GET /vendor/:id/score**

Returns AI-calculated vendor score.

#### Example

```json
{
  "vendor": "ABC Traders",
  "score": 92,
  "reason": "Competitive pricing and fast delivery"
}
```

---

## 4. Decisions & Assumptions

### **Design Decisions**

* MongoDB for flexible email and attachment storage
* Hybrid scoring: rule-based + AI refinement
* Email parser supports PDF / DOCX / TXT
* Minimal, simple procurement workflow

### **Assumptions**

* Vendor emails follow some semi-consistent structure
* Email attachments contain pricing/info clearly
* AI scoring may require manual overrides
* SMTP credentials provided by admin

---

## 5. AI Tools Usage

### **Tools Used**

* ChatGPT
* GitHub Copilot
* Cursor / Claude (optional)

### **How They Helped**

* Boilerplate backend/React code
* Debugging IMAP + Nodemailer
* Designing scoring logic
* UI layout referencing

### **Notable Prompts**

* Extract pricing + delivery from unstructured email
* Build procurement dashboard UI
* Score vendor proposals using rules

### **Learnings**

* AI speeds up development
* Hybrid (rules + AI) is more accurate
* Email parsing needs multiple fallback layers

---

