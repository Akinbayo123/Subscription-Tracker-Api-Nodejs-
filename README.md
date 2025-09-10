<div align="center">

  <div>
    <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white" alt="node.js" />
    <img src="https://img.shields.io/badge/express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="express.js" />
    <img src="https://img.shields.io/badge/-MongoDB-13aa52?style=for-the-badge&logo=mongodb&logoColor=white" alt="mongodb" />
  </div>

  <h2 align="center">📦 Subscription Tracker API</h2>
  <p>A production-ready API to manage users, subscriptions, and admin dashboards.<br>
   Built with <b>Node.js, Express, MongoDB, Arcjet</b>, and <b>Upstash</b>.</p>
</div>

---

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)  
2. ⚙️ [Tech Stack](#tech-stack)  
3. 🔋 [Features](#features)  
4. 🤸 [Quick Start](#quick-start)  
5. 🕸️ [Code Snippet](#snippets)  
6. 🔗 [Resources](#resources)  
7. 🚀 [More](#more)  

---

## <a name="introduction">🤖 Introduction</a>

The **Subscription Tracker API** helps you manage recurring subscriptions, authenticate users, send reminders, and provide an admin dashboard for oversight.  

- Secure with **JWT Authentication** & **Role-Based Access (User/Admin)**  
- Automate reminders using **Upstash QStash**  
- Protect endpoints with **Arcjet (rate limiting & bot protection)**  
- Structured with scalability & best practices in mind  

Perfect as a base for SaaS apps, dashboards, or learning advanced **backend architecture**.  

---

## <a name="tech-stack">⚙️ Tech Stack</a>

- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (Mongoose ODM)  
- **Auth**: JWT, Bcrypt  
- **Scheduling & Messaging**: Upstash QStash  
- **Security**: Arcjet  
- **Utils**: Nodemailer, Day.js  

---

## <a name="features">🔋 Features</a>

👉 **JWT Authentication** – Signup, Signin, Signout, Profile update  
👉 **User Roles** – Separate **User** and **Admin** permissions  
👉 **Subscriptions** – Create, update, cancel, upcoming renewal tracking  
👉 **Pagination & Sorting** – For large datasets  
👉 **Global Error Handling** – Cleaner error responses  
👉 **Email Notifications** – Reminder emails via Upstash workflows  
👉 **Rate Limiting & Bot Protection** – Secured by Arcjet  

---

## <a name="quick-start">🤸 Quick Start</a>

### ✅ Prerequisites  
- [Git](https://git-scm.com/)  
- [Node.js](https://nodejs.org/)  
- [npm](https://www.npmjs.com/)  
- [MongoDB Atlas](https://www.mongodb.com/) account  


## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/Akinbayo123/Subscription-Tracker-Api-Nodejs-.git
cd Subscription-Tracker-Api
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env.local` in the root of your project and add the following content:

```env
# PORT
PORT=3000
SERVER_URL="http://localhost:3000"

# ENVIRONMENT
NODE_ENV=development

# DATABASE
DB_URI=

# JWT AUTH
JWT_SECRET=
JWT_EXPIRES_IN="1d"

# ARCJET
ARCJET_KEY=
ARCJET_ENV="development"

# UPSTASH
QSTASH_URL=http://127.0.0.1:8080
QSTASH_TOKEN=

# NODEMAILER
EMAIL_PASSWORD=
```

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser or any HTTP client to test the project.

## <a name="snippets">🕸️ Snippets</a>

<details>
<summary><code>Dummy JSON Data</code></summary>

```json
{
  "name": "Javascript Mastery Elite Membership",
  "price": 139.00,
  "currency": "USD",
  "frequency": "monthly",
  "category": "Entertainment",
  "startDate": "2025-01-20T00:00:00.000Z",
  "paymentMethod": "Credit Card"
}
```

</details>
