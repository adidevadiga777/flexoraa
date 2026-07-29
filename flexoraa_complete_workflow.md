# 📘 FLEXORAA — Complete Frontend & Backend Workflow Guide

> **A Beginner-Friendly Reference for the Entire Codebase**
> _AI-Powered Portfolio Generator — Resume to Live Website_

---

## 📑 Table of Contents

| # | Section |
|---|---------|
| 1 | [What is Flexoraa?](#1-what-is-flexoraa) |
| 2 | [Tech Stack Overview](#2-tech-stack-overview) |
| 3 | [Project Folder Structure](#3-project-folder-structure) |
| 4 | [How the App Works — The Big Picture](#4-how-the-app-works--the-big-picture) |
| 5 | [Environment Variables (.env)](#5-environment-variables-env) |
| 6 | [Backend — Full Code Walkthrough](#6-backend--full-code-walkthrough) |
| 7 | [Frontend — Full Code Walkthrough](#7-frontend--full-code-walkthrough) |
| 8 | [Complete API Reference](#8-complete-api-reference) |
| 9 | [Data Flow Diagrams](#9-data-flow-diagrams) |
| 10 | [Database Schema](#10-database-schema) |
| 11 | [Authentication Flow — Detailed](#11-authentication-flow--detailed) |
| 12 | [Upload & AI Portfolio Generation — Detailed](#12-upload--ai-portfolio-generation--detailed) |
| 13 | [AI Chat Edit — Detailed](#13-ai-chat-edit--detailed) |
| 14 | [Payment & Publishing — Detailed](#14-payment--publishing--detailed) |
| 15 | [Beginner Concepts Explained](#15-beginner-concepts-explained) |

---

## 1. What is Flexoraa?

Flexoraa is a **full-stack web app** that lets users:

1. **Upload** their resume (PDF) + profile photo
2. **AI (Google Gemini)** reads the resume and generates a polished portfolio website
3. **Chat with AI** to edit the portfolio in real-time
4. **Pay ₹69 via Razorpay** to publish the portfolio as a live, shareable website

```
Resume PDF + Photo  →  AI processes  →  Beautiful Portfolio  →  Pay & Go Live  →  yourname.flexoraa.com
```

---

## 2. Tech Stack Overview

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** (via Vite) | UI framework — builds the user interface |
| **React Router v8** | Client-side routing (page navigation without reload) |
| **Tailwind CSS v4** | Utility-first CSS framework for styling |
| **Framer Motion** | Smooth animations and transitions |
| **Axios** | HTTP client for API calls |
| **Lucide React** | Icon library |
| **Three.js** | 3D animated backgrounds in portfolio templates |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | Server framework — handles all API requests |
| **MongoDB + Mongoose** | Database — stores users, portfolios, blacklisted tokens |
| **JWT (jsonwebtoken)** | Authentication tokens |
| **Passport.js** | Google OAuth login |
| **Bcrypt.js** | Password hashing (security) |
| **Multer** | File upload handling (resume + image) |
| **Google Gemini AI** | AI that reads resumes and generates portfolio content |
| **ImageKit** | Cloud image hosting for profile photos |
| **Redis (ioredis)** | Cache for blacklisted (logged-out) tokens |
| **Razorpay** | Payment gateway for ₹69 publish fee |
| **pdf-parse** | Extracts text from uploaded PDF resumes |

---

## 3. Project Folder Structure

```
flexoraa/
├── backend/
│   ├── server.js                        ← Entry point: starts server on port 3000
│   ├── .env                             ← Secret keys (never commit to git!)
│   ├── package.json                     ← Backend dependencies
│   └── src/
│       ├── app.js                       ← Express app setup + middleware + routes
│       ├── config/
│       │   ├── database.js              ← MongoDB connection
│       │   ├── cache.js                 ← Redis connection
│       │   ├── imagekit.js              ← ImageKit cloud image setup
│       │   └── passport.js              ← Google OAuth strategy
│       ├── models/
│       │   ├── user.model.js            ← User schema (username, email, password, googleId)
│       │   ├── blacklist.model.js       ← Blacklisted JWT tokens schema
│       │   └── Portfolio.js             ← Portfolio schema (the main data!)
│       ├── controllers/
│       │   ├── auth.controller.js       ← Register, Login, Logout, Google callback
│       │   ├── uploadController.js      ← Handles resume+image upload → AI generation
│       │   ├── portfolioController.js   ← CRUD operations on portfolios
│       │   └── paymentController.js     ← Razorpay create order + verify payment
│       ├── middlewares/
│       │   ├── auth.middleware.js        ← JWT token verification (protects routes)
│       │   └── multerConfig.js          ← File upload config (PDF + image validation)
│       ├── routes/
│       │   ├── auth.routes.js           ← /api/auth/* route definitions
│       │   ├── uploadRoutes.js          ← /api/upload route definition
│       │   ├── portfolioRoutes.js       ← /api/portfolio/* route definitions
│       │   └── paymentRoutes.js         ← /api/payment/* route definitions
│       ├── services/
│       │   ├── geminiService.js         ← All AI logic (extract resume, generate content, edit)
│       │   ├── imageService.js          ← Upload image to ImageKit CDN
│       │   └── resumeParser.js          ← Extract text from PDF buffer
│       └── utils/
│           └── generateSlug.js          ← Creates URL-friendly slug like "john-doe-x7k2m"
│
└── frontend/
    ├── index.html                       ← Root HTML file
    ├── vite.config.js                   ← Vite + React + Tailwind config
    ├── package.json                     ← Frontend dependencies
    └── src/
        ├── main.jsx                     ← React entry point
        ├── App.jsx                      ← Root component (AuthProvider + RouterProvider)
        ├── app.routes.jsx               ← All page routes defined here
        ├── index.css                    ← Global CSS
        ├── Home.jsx                     ← Main page (chat + preview split view)
        ├── pages/
        │   └── PortfolioPage.jsx        ← Public portfolio view page (/portfolio/:slug)
        ├── components/
        │   ├── Navbar.jsx               ← Top navigation bar
        │   ├── upload/
        │   │   └── UploadForm.jsx       ← Upload form component (standalone)
        │   └── portfolio/
        │       ├── Background3D.jsx     ← Three.js animated background
        │       ├── Hero.jsx             ← Hero section of portfolio
        │       ├── About.jsx            ← About section
        │       ├── Skills.jsx           ← Skills display
        │       ├── Projects.jsx         ← Projects showcase
        │       └── Card3D.jsx           ← 3D hover card effect
        ├── templates/
        │   ├── index.js                 ← Exports template map {TemplateOne, TemplateTwo}
        │   ├── TemplateOne.jsx          ← "Classic" dark theme template
        │   └── TemplateTwo.jsx          ← "Modern" cyber/neon theme template
        └── features/
            └── auth/
                ├── auth.context.jsx     ← React Context for global auth state
                ├── services/
                │   └── auth.api.js      ← API calls (register, login, getMe, logout)
                ├── hooks/
                │   └── useAuth.js       ← Custom hook to use auth context
                ├── components/
                │   └── Protected.jsx    ← Route guard (redirects to /login if not logged in)
                └── pages/
                    ├── Login.jsx        ← Login page with Google OAuth
                    └── Register.jsx     ← Registration page with Google OAuth
```

---

## 4. How the App Works — The Big Picture

```mermaid
flowchart TD
    A["👤 User visits Flexoraa"] --> B{"Logged in?"}
    B -->|No| C["Login / Register Page"]
    C -->|Email+Password| D["Backend creates JWT cookie"]
    C -->|Google OAuth| E["Passport.js → Google → JWT cookie"]
    D --> F["Redirected to Home /"]
    E --> F
    B -->|Yes| F

    F --> G["Home Page — Upload Area"]
    G --> H["User attaches Resume PDF + Photo"]
    H --> I["Selects Template: Classic or Modern"]
    I --> J["Clicks 'Generate'"]

    J --> K["Backend: Multer receives files"]
    K --> L["pdf-parse extracts text from PDF"]
    L --> M["Gemini AI Call 1: Extract structured data from resume"]
    M --> N["Gemini AI Call 2: Generate polished portfolio content"]
    N --> O["ImageKit: Upload profile photo to CDN"]
    O --> P["Save Portfolio to MongoDB"]
    P --> Q["Return portfolio JSON to frontend"]

    Q --> R["Screen splits: Chat left | Preview right"]
    R --> S{"User types edit instruction"}
    S --> T["Backend: Gemini AI Call 3: Edit portfolio content"]
    T --> U["Updated portfolio saved & returned"]
    U --> R

    R --> V["User clicks 'Pay ₹69 to Go Live'"]
    V --> W["Backend creates Razorpay order"]
    W --> X["Razorpay payment modal opens"]
    X --> Y["User pays ₹69"]
    Y --> Z["Backend verifies payment signature"]
    Z --> AA["Portfolio marked isPaid + isPublished"]
    AA --> AB["Live URL generated: /portfolio/john-doe-x7k2m"]
    AB --> AC["🎉 Portfolio is live! User can share the link"]
```

---

## 5. Environment Variables (.env)

The backend needs these in `backend/.env`:

```env
# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/flexoraa

# JWT Secret (any random strong string)
JWT_SECRET=your-super-secret-key-here

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# ImageKit (image CDN)
IMAGEKIT_PUBLIC_KEY=your-public-key
IMAGEKIT_PRIVATE_KEY=your-private-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id

# Redis (for token blacklisting)
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Razorpay (payment gateway)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

---

## 6. Backend — Full Code Walkthrough

### 6.1 Entry Point: `server.js`

```javascript
require('dotenv').config();        // Load .env variables into process.env
const app = require('./src/app');   // Import the Express app
const conectToDb = require('./src/config/database');
const { redis } = require('./src/config/cache');

conectToDb()                        // Connect to MongoDB
app.listen(3000, () => {            // Start server on port 3000
    console.log("server is running on port 3000")
})
```

> [!NOTE]
> **What happens here?**
> 1. `.env` file is loaded so we can use `process.env.MONGO_URI` etc.
> 2. MongoDB connection is established
> 3. Redis connection starts (from `cache.js`)
> 4. Express server starts listening on port 3000

---

### 6.2 App Setup: `src/app.js`

```javascript
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require("cors")

const app = express();
require('./config/passport');  // Initialize Google OAuth strategy

// ── MIDDLEWARE (runs on EVERY request) ──
app.use(express.json());            // Parse JSON request bodies
app.use(express.urlencoded({ extended: true }));  // Parse form data
app.use(cookieParser());            // Parse cookies from request headers
app.use(morgan('dev'));             // Log requests to console (GET /api/auth/login 200 15ms)
app.use(cors({
    origin: "http://localhost:5173",  // Allow frontend to make requests
    credentials: true                 // Allow cookies to be sent
}))

// ── ROUTES ──
app.use("/api/auth", authRoutes);       // /api/auth/register, /login, /logout, /google
app.use('/api', uploadRoutes);          // /api/upload
app.use('/api', portfolioRoutes);       // /api/portfolio/me, /portfolio/:id/edit, etc.
app.use('/api/payment', paymentRoutes); // /api/payment/create-order, /verify

module.exports = app;
```

> [!IMPORTANT]
> **Middleware Execution Order:**
> Every request passes through middleware in order: `json → urlencoded → cookieParser → morgan → cors → route handler`

---

### 6.3 Config Files

#### `config/database.js` — MongoDB Connection
```javascript
const mongoose = require('mongoose');

async function conectToDb() {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Successfully connected to MongoDB');
}
module.exports = conectToDb;
```

> **Beginner Tip:** Mongoose is an ODM (Object Data Modeling) library. It lets you define schemas (data shapes) and interact with MongoDB using JavaScript objects instead of raw database queries.

#### `config/cache.js` — Redis Connection
```javascript
const Redis = require("ioredis");

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
})
module.exports = { redis }
```

> **Why Redis?** When a user logs out, their JWT token is still valid (hasn't expired). We store it in Redis as "blacklisted" so it can't be reused. Redis is super fast for this lookup.

#### `config/imagekit.js` — ImageKit CDN
```javascript
const ImageKit = require('imagekit');
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});
module.exports = imagekit;
```

> **Why ImageKit?** Instead of storing images on our server, we upload to ImageKit CDN. It gives us a permanent URL like `https://ik.imagekit.io/xyz/photo.jpg` that loads fast worldwide.

#### `config/passport.js` — Google OAuth Strategy
```javascript
passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
        // 1. Check if user already exists by Google ID
        let user = await userModel.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        // 2. Check if email exists (maybe registered with password earlier)
        const email = profile.emails[0].value;
        user = await userModel.findOne({ email });
        if (user) {
            user.googleId = profile.id;  // Link Google to existing account
            await user.save();
            return done(null, user);
        }

        // 3. Create brand new user with unique username
        let baseUsername = email.split('@')[0];
        let uniqueUsername = baseUsername;
        let counter = 1;
        while (await userModel.findOne({ username: uniqueUsername })) {
            uniqueUsername = `${baseUsername}${counter++}`;
        }

        const newUser = await userModel.create({
            username: uniqueUsername,
            email: email,
            googleId: profile.id,
        });
        return done(null, newUser);
    })
);
```

> [!TIP]
> **Three scenarios handled:**
> 1. User logged in with Google before → found by `googleId` → return existing user
> 2. User registered with email/password before → found by `email` → link Google ID
> 3. Brand new user → create account with auto-generated username from email

---

### 6.4 Database Models (Schemas)

#### `models/user.model.js`
```javascript
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email:    { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: {
        type: String,
        select: false,              // Never returned in queries by default (security!)
        required: function() {
            return !this.googleId;  // Only required if NOT a Google user
        }
    },
    googleId: { type: String, unique: true, sparse: true }
}, { timestamps: true })            // Auto-adds createdAt, updatedAt
```

> **Key Design Decisions:**
> - `select: false` on password → prevents accidentally leaking passwords in API responses
> - `sparse: true` on googleId → allows multiple `null` values (normal users don't have googleId)
> - Password is conditionally required → Google users don't have passwords

#### `models/Portfolio.js`
```javascript
const portfolioSchema = new mongoose.Schema({
    userId:           { type: ObjectId, ref: 'User', required: true },
    slug:             { type: String, unique: true, sparse: true, default: null },
    structuredData:   { type: Object, required: true },    // Raw resume data from AI
    portfolioContent: { type: Object, required: true },    // Polished AI-generated content
    imageUrl:         { type: String, required: true },    // CDN link to profile photo
    selectedTemplate: { type: String, enum: ['TemplateOne', 'TemplateTwo'], default: 'TemplateOne' },
    isPaid:           { type: Boolean, default: false },
    paymentId:        { type: String, default: null },
    isPublished:      { type: Boolean, default: false },
    messages:         [{ role: String, text: String }],     // Chat history
    createdAt:        { type: Date, default: Date.now }
});
```

> [!IMPORTANT]
> **Two AI-generated JSON objects stored:**
> - `structuredData` — raw extracted info: `{ name, title, email, skills[], experience[], projects[], education[] }`
> - `portfolioContent` — polished content: `{ tagline, bio, topSkills[], polishedExperience[], polishedProjects[], themeColors }`

#### `models/blacklist.model.js`
```javascript
const blacklistSchema = new mongoose.Schema({
    token: { type: String, required: true }
}, { timestamps: true })
```

---

### 6.5 Middleware

#### `middlewares/auth.middleware.js` — JWT Verification
```javascript
async function authUser(req, res, next) {
    // 1. Get token from cookie OR Authorization header
    let token = req.cookies?.token;
    if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];  // "Bearer <token>"
    }

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // 2. Check if token is blacklisted (user logged out)
    const isBlacklisted = await redis.get(token);
    if (isBlacklisted) return res.status(401).json({ message: "invalid token" });

    // 3. Verify JWT signature and decode payload
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // { id, username } → available in all controllers!
        next();              // Continue to the actual route handler
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
```

> **Flow:** `Request → Check cookie/header → Check Redis blacklist → Verify JWT → Attach user to req → Next`

#### `middlewares/multerConfig.js` — File Upload Config
```javascript
const storage = multer.memoryStorage();  // Keep file as Buffer in RAM

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'resume' && file.mimetype !== 'application/pdf')
        return cb(new Error('Resume must be a PDF file'), false);
    if (file.fieldname === 'image' && !file.mimetype.startsWith('image/'))
        return cb(new Error('Profile photo must be an image file'), false);
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }  // 5MB max per file
});
```

> **Why memoryStorage?** Files are temporary — we immediately parse the PDF and upload the image to ImageKit. No need to save to disk.

---

### 6.6 Controllers (Business Logic)

#### `controllers/auth.controller.js`

**Register:**
```
User sends { username, email, password }
  → Check if email/username already exists
  → Hash password with bcrypt (10 salt rounds)
  → Create user in MongoDB
  → Create JWT token (expires in 3 days)
  → Set token as HTTP cookie
  → Return user info
```

**Login:**
```
User sends { email, password }
  → Find user by email (include password with .select("+password"))
  → Compare password with bcrypt
  → Create JWT token
  → Set token as cookie
  → Return user info
```

**Logout:**
```
Read token from cookie
  → Clear cookie
  → Store token in Redis with 1-hour expiry (blacklist it)
  → Return success
```

**Google Callback:**
```
Passport.js has already authenticated the Google user
  → Create JWT token from req.user
  → Set token as cookie
  → Redirect to frontend (http://localhost:5173/)
```

#### `controllers/uploadController.js`

```
1. Get resume file + image file from req.files
2. Get selectedTemplate from req.body
3. extractTextFromPDF(resumeFile.buffer)     → plain text from PDF
4. extractResumeData(resumeText)             → Gemini AI Call 1: JSON structured data
5. generatePortfolioContent(structuredData)  → Gemini AI Call 2: JSON polished content
6. uploadImageToImageKit(imageFile.buffer)   → CDN URL for the profile photo
7. generateSlug(name)                        → "john-doe-x7k2m"
8. Create Portfolio document in MongoDB
9. Return the portfolio to frontend
```

#### `controllers/portfolioController.js`

**getUserPortfolio:** Get logged-in user's most recent portfolio  
**editPortfolio:** Accept instruction text → Gemini AI Call 3 → update portfolio content  
**publishPortfolio:** Generate slug + mark `isPublished = true`  
**getPortfolioBySlug:** Public route — anyone can view a published portfolio  

**Edit Portfolio Logic in Detail:**
```
1. Receive { instruction } from user (e.g., "Change my tagline to 'Full Stack Ninja'")
2. Find portfolio by ID + verify ownership (userId === req.user.id)
3. Call Gemini AI to edit portfolioContent based on instruction
4. If instruction mentions "template two" → switch selectedTemplate
5. Append messages to chat history: { user: instruction, ai: "Updated!" }
6. Save and return updated portfolio
```

#### `controllers/paymentController.js`

**createOrder:**
```
1. Receive { portfolioId }
2. Check if already paid → return liveUrl
3. Create Razorpay order for ₹69 (6900 paise)
4. Return { orderId, amount, currency, keyId }
```

**verifyPayment:**
```
1. Receive { portfolioId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
2. Create HMAC SHA256 signature: sha256(order_id + "|" + payment_id, secret)
3. Compare with received signature → if mismatch, reject
4. Mark portfolio: isPaid=true, isPublished=true, set paymentId
5. Generate slug if needed
6. Return { portfolio, liveUrl }
```

---

### 6.7 Services (Core Business Logic)

#### `services/geminiService.js` — AI Brains 🧠

**Model Fallback System:**
```javascript
const CANDIDATE_MODELS = [
    'gemini-3.5-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-2.0-flash',
    'gemini-2.5-flash'
];
```
If one model hits rate limits (HTTP 429), it automatically tries the next one.

**Three AI Functions:**

| Function | Input | Output | Purpose |
|---|---|---|---|
| `extractResumeData()` | Raw resume text | `{ name, title, skills[], experience[], projects[], education[] }` | AI Call 1: Structured data extraction |
| `generatePortfolioContent()` | Structured data JSON | `{ tagline, bio, topSkills[], polishedExperience[], polishedProjects[], themeColors }` | AI Call 2: Polish into portfolio content |
| `editPortfolioContent()` | Current content + user instruction | Modified content JSON | AI Call 3: Apply user's edit instruction |

**JSON Cleaning:**
```javascript
const cleanJsonResponse = (text) => {
    return text
        .replace(/^```json\s*/i, '')  // Remove ```json
        .replace(/^```\s*/i, '')      // Remove ```
        .replace(/\s*```$/i, '')      // Remove closing ```
        .trim();
};
```
> AI sometimes wraps JSON in markdown code fences — this strips them.

#### `services/resumeParser.js`
```javascript
const extractTextFromPDF = async (fileBuffer) => {
    const parser = new PDFParse({ data: fileBuffer });
    const data = await parser.getText();
    return data.text;  // Plain text from the PDF
};
```

#### `services/imageService.js`
```javascript
const uploadImageToImageKit = async (fileBuffer, originalName) => {
    const result = await imagekit.upload({
        file: fileBuffer,
        fileName: originalName,
        folder: '/portfolio-ai-profiles'
    });
    return result.url;  // Permanent CDN URL
};
```

---

### 6.8 Routes Summary

#### Auth Routes (`/api/auth/`)
```
POST   /api/auth/register        → auth.controller.registerUser
POST   /api/auth/login            → auth.controller.loginUser
GET    /api/auth/get-me           → [authUser] → auth.controller.getMe
GET    /api/auth/logout           → [authUser] → auth.controller.logoutUser
GET    /api/auth/google           → Passport Google redirect
GET    /api/auth/google/callback  → Passport callback → auth.controller.googleCallback
```

#### Upload Route (`/api/`)
```
POST   /api/upload  → [authUser] → [multer: resume + image] → uploadController.handleUpload
```

#### Portfolio Routes (`/api/`)
```
GET    /api/portfolio/me          → [authUser] → portfolioController.getUserPortfolio
PATCH  /api/portfolio/:id/edit    → [authUser] → portfolioController.editPortfolio
POST   /api/portfolio/:id/publish → [authUser] → portfolioController.publishPortfolio
GET    /api/portfolio/:slug       → portfolioController.getPortfolioBySlug  (PUBLIC!)
```

#### Payment Routes (`/api/payment/`)
```
POST   /api/payment/create-order  → [authUser] → paymentController.createOrder
POST   /api/payment/verify        → [authUser] → paymentController.verifyPayment
```

---

## 7. Frontend — Full Code Walkthrough

### 7.1 Entry Point: `main.jsx`
```jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

### 7.2 Root Component: `App.jsx`
```jsx
function App() {
  return (
    <AuthProvider>          {/* Global auth state via React Context */}
      <RouterProvider router={router} />  {/* Client-side routing */}
    </AuthProvider>
  )
}
```

### 7.3 Routing: `app.routes.jsx`
```jsx
export const router = createBrowserRouter([
    { path: "/",               element: <Protected><Home /></Protected> },
    { path: "/register",       element: <Register /> },
    { path: "/login",          element: <Login /> },
    { path: "/me",             element: <Protected><Home /></Protected> },
    { path: "/portfolio/:slug", element: <PortfolioPage /> }  // PUBLIC
])
```

| Route | Protected? | Component | Description |
|---|---|---|---|
| `/` | ✅ Yes | Home | Main dashboard with chat + preview |
| `/register` | ❌ No | Register | Sign up page |
| `/login` | ❌ No | Login | Sign in page |
| `/me` | ✅ Yes | Home | Same as `/` |
| `/portfolio/:slug` | ❌ No | PortfolioPage | Public portfolio view |

---

### 7.4 Authentication System

#### Auth Context (`auth.context.jsx`)
```jsx
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // On app load → try to get current user from cookie
        const data = await getMe();
        setUser(data.user);
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
```

> **On every app load:** Frontend calls `GET /api/auth/get-me` with cookie → if valid, user is authenticated → `user` state is set.

#### Auth API Service (`auth.api.js`)
```javascript
const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true    // ← Critical! Sends cookies with every request
})

export async function registerUser({ email, password, username }) { ... }
export async function loginUser({ email, password }) { ... }
export async function getMe() { ... }
export async function logoutUser() { ... }
```

#### useAuth Hook (`useAuth.js`)
```javascript
export const useAuth = () => {
    const { user, setUser, loading, setLoading } = useContext(AuthContext);
    
    async function handleRegister(credentials) { ... }
    async function handleLogin(credentials) { ... }
    async function handleLogout() { ... }
    
    return { user, loading, handleRegister, handleLogin, handleLogout }
}
```

> **Why a custom hook?** Instead of repeating `useContext(AuthContext)` + API call logic everywhere, any component just does `const { user, handleLogin } = useAuth()`.

#### Protected Route (`Protected.jsx`)
```jsx
const Protected = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <h1>Loading...</h1>;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};
```

> **How it works:** Wraps protected pages. If not logged in → redirects to `/login`. If still checking → shows "Loading...".

---

### 7.5 Home Page — The Main UI (`Home.jsx`)

This is the most complex frontend file. Here's the full logic:

#### State Variables
```javascript
const [resume, setResume] = useState(null);           // Selected PDF file
const [image, setImage] = useState(null);             // Selected image file
const [template, setTemplate] = useState('TemplateOne'); // Chosen template
const [chatInput, setChatInput] = useState('');        // Current chat message
const [messages, setMessages] = useState([]);          // Chat history
const [portfolio, setPortfolio] = useState(null);      // The portfolio data (null = not generated)
const [loading, setLoading] = useState(false);         // Loading spinner
const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
const [isPublishing, setIsPublishing] = useState(false);
const [liveUrl, setLiveUrl] = useState(null);          // Published URL
const [copied, setCopied] = useState(false);           // "Copied!" feedback
```

#### Load Saved Portfolio on Mount
```javascript
useEffect(() => {
    // On page load → check if user already has a saved portfolio
    fetch('http://localhost:3000/api/portfolio/me', { credentials: 'include' })
    .then(data => {
        setPortfolio(data.portfolio);
        // If already published, show the live URL
        // If has chat history, restore it
    });
}, []);
```

#### handleSubmit — Two Modes
```
IF no portfolio exists yet:
    → Upload resume + image via FormData to POST /api/upload
    → Receive generated portfolio
    → Screen splits into Chat | Preview

IF portfolio already exists:
    → Send chat message to PATCH /api/portfolio/:id/edit
    → Receive updated portfolio
    → Preview updates in real-time
```

#### handleGoLive — Payment Flow
```
1. POST /api/payment/create-order → get Razorpay orderId
2. If already paid → show live URL immediately
3. Load Razorpay SDK script dynamically
4. Open Razorpay payment modal
5. On payment success:
   → POST /api/payment/verify → backend verifies signature
   → Portfolio is published → show live URL
```

#### UI Layout
```
┌──────────────────────────────────────────────────┐
│                    NAVBAR                         │
├────────────────────┬─────────────────────────────┤
│                    │                             │
│   CHAT PANEL       │   PREVIEW PANEL             │
│                    │                             │
│   - AI messages    │   - Template toolbar         │
│   - User messages  │   - Live preview             │
│   - Loading state  │   - Go Live / Copy Link      │
│                    │   - Fullscreen toggle         │
│   ──────────────   │                             │
│   📄 Resume        │                             │
│   🖼️ Photo         │                             │
│   [input] [Send]   │                             │
│                    │                             │
└────────────────────┴─────────────────────────────┘
```

- **Before generation:** Chat panel is 100% width with upload buttons
- **After generation:** Screen splits 50/50 with animated transition (Framer Motion)
- **Fullscreen preview:** Preview takes 100% width, chat hides

---

### 7.6 Portfolio Templates

#### Template Selection
```javascript
const SelectedTemplate = templates[portfolio.selectedTemplate] || templates.TemplateOne;
```

Both templates receive the same `portfolio` prop and render differently.

#### TemplateOne — "Classic" Dark Theme
- Floating glass navigation header
- Hero with profile photo, name, tagline
- About section with bio
- Skills section
- Projects section
- 3D animated background (Three.js)
- Color orbs based on AI-suggested `themeColors`

#### TemplateTwo — "Modern" Cyber/Neon Theme
- Cyber dock header with code-style navigation (`// 01. About`)
- Split hero: info column + portrait with neon glow
- Terminal-style stats bar
- Code-style section headers (`// ABOUT_ME`, `// TECHNICAL_SKILLS`)
- Experience timeline
- Projects with GitHub + Live Demo links
- Grayscale → color photo effect on hover

#### Portfolio Components
| Component | File | Purpose |
|---|---|---|
| Background3D | `components/portfolio/Background3D.jsx` | Three.js floating particles background |
| Hero | `components/portfolio/Hero.jsx` | Name + tagline + photo hero section |
| About | `components/portfolio/About.jsx` | Bio/about section |
| Skills | `components/portfolio/Skills.jsx` | Skills grid display |
| Projects | `components/portfolio/Projects.jsx` | Project cards with links |
| Card3D | `components/portfolio/Card3D.jsx` | 3D tilt hover effect for cards |

---

### 7.7 Public Portfolio Page (`PortfolioPage.jsx`)
```jsx
function PortfolioPage() {
    const { slug } = useParams();          // Get slug from URL
    const [portfolio, setPortfolio] = useState(null);

    useEffect(() => {
        // Fetch portfolio data by slug (PUBLIC - no auth needed)
        fetch(`http://localhost:3000/api/portfolio/${slug}`)
    }, [slug]);

    const SelectedTemplate = templates[portfolio.selectedTemplate];
    return <SelectedTemplate portfolio={portfolio} />;
}
```

> **No authentication needed!** Anyone with the link can view a published portfolio.

---

## 8. Complete API Reference

| Method | Endpoint | Auth? | Body | Response |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | `{ username, email, password }` | `{ message, user }` + cookie |
| `POST` | `/api/auth/login` | ❌ | `{ email, password }` | `{ message, user }` + cookie |
| `GET` | `/api/auth/get-me` | ✅ | — | `{ message, user }` |
| `GET` | `/api/auth/logout` | ✅ | — | `{ message }` + clear cookie |
| `GET` | `/api/auth/google` | ❌ | — | Redirect to Google |
| `GET` | `/api/auth/google/callback` | ❌ | — | JWT cookie + redirect to frontend |
| `POST` | `/api/upload` | ✅ | `FormData: resume, image, selectedTemplate` | `{ portfolio, portfolioId }` |
| `GET` | `/api/portfolio/me` | ✅ | — | `{ portfolio }` |
| `PATCH` | `/api/portfolio/:id/edit` | ✅ | `{ instruction }` | `{ portfolio }` |
| `POST` | `/api/portfolio/:id/publish` | ✅ | — | `{ portfolio, liveUrl }` |
| `GET` | `/api/portfolio/:slug` | ❌ | — | `{ portfolio }` |
| `POST` | `/api/payment/create-order` | ✅ | `{ portfolioId }` | `{ orderId, amount, currency, keyId }` |
| `POST` | `/api/payment/verify` | ✅ | `{ portfolioId, razorpay_order_id, razorpay_payment_id, razorpay_signature }` | `{ portfolio, liveUrl }` |

---

## 9. Data Flow Diagrams

### 9.1 Authentication Flow
```
┌──────────┐          ┌──────────┐          ┌──────────┐
│ Frontend │  POST    │ Backend  │  Query   │ MongoDB  │
│ (React)  │ ──────→  │ (Express)│ ──────→  │          │
│          │          │          │          │          │
│          │  ← ─ ─ ─ │          │  ← ─ ─ ─ │          │
│ Set user │  Cookie  │ JWT Sign │  User    │  Users   │
│ state    │  + JSON  │ + Cookie │  doc     │  collection│
└──────────┘          └──────────┘          └──────────┘
```

### 9.2 Portfolio Generation Flow
```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Frontend │     │ Multer   │     │ pdf-parse│     │ Gemini AI│     │ ImageKit │
│          │     │          │     │          │     │          │     │          │
│ FormData ├────→│ Parse    ├────→│ Extract  ├────→│ Call 1:  │     │          │
│ resume   │     │ files    │     │ PDF text │     │ Structure├─┐   │          │
│ image    │     │ to buffer│     │          │     │          │ │   │          │
│ template │     │          │     │          │     │ Call 2:  │ │   │ Upload   │
│          │     │          │     │          │     │ Polish   ├─┤   │ photo    │
│          │     │          │     │          │     │          │ │   │ → URL    │
│          │     │          │     │          │     │          │ │   │          │
│          │     │          │     │          │     │          │ │   │          │
│ ◄────────┤     │          │     │          │     │          │ │   │          │
│ Portfolio│     │          │     │          │     │          │ │   │          │
│ JSON     │     │          │     │          │     │          │ │   │          │
│          │     │          │     │          │     │          │ │   │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘ │   └──────────┘
                                                                 │
                                                    ┌────────────┤
                                                    │  MongoDB   │
                                                    │  Save      │
                                                    │  Portfolio  │
                                                    └────────────┘
```

### 9.3 Payment Flow
```
Frontend          Backend           Razorpay         MongoDB
   │                 │                 │                │
   │ create-order    │                 │                │
   │────────────────→│                 │                │
   │                 │ Create order    │                │
   │                 │────────────────→│                │
   │                 │ ◄──── orderId   │                │
   │ ◄── orderId     │                 │                │
   │                 │                 │                │
   │ Open Razorpay   │                 │                │
   │ Modal ─────────────────────────→  │                │
   │                 │                 │                │
   │ ◄── payment_id, signature ────── │                │
   │                 │                 │                │
   │ verify          │                 │                │
   │────────────────→│                 │                │
   │                 │ HMAC verify     │                │
   │                 │ isPaid = true   │                │
   │                 │────────────────────────────────→ │
   │                 │ ◄──────────── saved ──────────── │
   │ ◄── liveUrl     │                 │                │
   │                 │                 │                │
```

---

## 10. Database Schema

### Users Collection
```
{
    _id:        ObjectId("..."),
    username:   "john_doe",
    email:      "john@example.com",
    password:   "$2b$10$hash...",   // bcrypt hashed (hidden by default)
    googleId:   "1234567890",       // null for email/password users
    createdAt:  2026-07-28T...
    updatedAt:  2026-07-28T...
}
```

### Portfolios Collection
```
{
    _id:               ObjectId("..."),
    userId:            ObjectId("..."),     // Links to Users
    slug:              "john-doe-x7k2m",   // URL-friendly identifier
    structuredData: {
        name:     "John Doe",
        title:    "Full Stack Developer",
        email:    "john@example.com",
        phone:    "+91-9876543210",
        skills:   ["React", "Node.js", "MongoDB"],
        experience: [{ role, company, duration, description }],
        projects:   [{ name, description, link }],
        education:  [{ degree, institution, year }]
    },
    portfolioContent: {
        tagline:             "Building scalable web solutions",
        bio:                 "I'm a full-stack developer who...",
        topSkills:           ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
        polishedExperience:  [{ role, company, duration, achievementDescription }],
        polishedProjects:    [{ name, description, githubLink, liveLink }],
        themeColors: {
            primary:   "#6366f1",
            secondary: "#a855f7",
            accent:    "#f43f5e"
        }
    },
    imageUrl:          "https://ik.imagekit.io/xxx/photo.jpg",
    selectedTemplate:  "TemplateOne",
    isPaid:            true,
    paymentId:         "pay_AbCdEfGhIjKl",
    isPublished:       true,
    messages: [
        { role: "ai",   text: "Here's your portfolio!" },
        { role: "user", text: "Change tagline to 'Code Wizard'" },
        { role: "ai",   text: "Updated! Check the preview." }
    ],
    createdAt:         2026-07-28T...
}
```

### Blacklist Collection
```
{
    _id:       ObjectId("..."),
    token:     "eyJhbGciOiJIUzI1...",   // The blacklisted JWT
    createdAt: 2026-07-28T...
}
```

---

## 11. Authentication Flow — Detailed

### Email/Password Registration
```
1. User fills form: username + email + password
2. Frontend calls POST /api/auth/register
3. Backend checks: email/username already exists?
   └─ YES → Return 400 "User already registered"
   └─ NO  → Continue
4. Hash password: bcrypt.hash(password, 10) → "$2b$10$..."
5. Create user in MongoDB
6. Generate JWT: jwt.sign({ id, username }, secret, { expiresIn: "3d" })
7. Set cookie: res.cookie("token", token)
8. Return: { message: "User registered", user: { id, username, email } }
9. Frontend: setUser(data.user) → navigate to "/"
```

### Email/Password Login
```
1. User fills form: email + password
2. Frontend calls POST /api/auth/login
3. Backend finds user by email (with password: .select("+password"))
   └─ NOT FOUND → Return 400 "Invalid credentials"
4. Compare: bcrypt.compare(password, user.password)
   └─ MISMATCH → Return 400 "Invalid credentials"
5. Generate JWT → Set cookie → Return user info
```

### Google OAuth Login
```
1. User clicks "Continue with Google"
2. Browser navigates to: http://localhost:3000/api/auth/google
3. Express redirects to Google OAuth consent screen
4. User authorizes → Google redirects to callback URL
5. Passport.js GoogleStrategy executes:
   - Checks if googleId exists → return user
   - Checks if email exists → link googleId → return user
   - Creates new user → return user
6. googleCallback controller: JWT → cookie → redirect to frontend
7. Frontend's AuthContext.useEffect runs getMe() → user is now logged in
```

### Token Blacklisting (Logout)
```
1. User clicks Logout
2. Frontend calls GET /api/auth/logout
3. Backend reads token from cookie
4. Clears cookie: res.clearCookie("token")
5. Stores token in Redis: redis.set(token, timestamp, "EX", 3600)
   └─ Key: the token string
   └─ Value: current timestamp
   └─ Expires: 3600 seconds (1 hour)
6. Any future request with this token → auth middleware → redis.get(token) → "blacklisted!"
```

---

## 12. Upload & AI Portfolio Generation — Detailed

### Step-by-Step
```
STEP 1: FRONTEND — FormData construction
────────────────────────────────────────
const formData = new FormData();
formData.append('resume', resumeFile);    // PDF blob
formData.append('image', imageFile);       // Image blob
formData.append('selectedTemplate', 'TemplateOne');  // String

POST http://localhost:3000/api/upload
Headers: Cookie: token=eyJ... (automatic with credentials: 'include')

STEP 2: MULTER — File parsing
────────────────────────────
upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'image', maxCount: 1 }
])
→ req.files['resume'][0].buffer  (PDF as Buffer)
→ req.files['image'][0].buffer   (Image as Buffer)

STEP 3: PDF PARSING
────────────────────
const resumeText = await extractTextFromPDF(resumeFile.buffer);
→ "John Doe\nFull Stack Developer\nSkills: React, Node.js..."

STEP 4: GEMINI AI — CALL 1 (Extract structured data)
─────────────────────────────────────────────────────
Prompt: "Extract this resume text into JSON..."
Input:  Raw resume text
Output: {
    name: "John Doe",
    title: "Full Stack Developer",
    skills: ["React", "Node.js", "MongoDB"],
    experience: [...],
    projects: [...],
    education: [...]
}

STEP 5: GEMINI AI — CALL 2 (Generate polished content)
──────────────────────────────────────────────────────
Prompt: "Generate polished portfolio content..."
Input:  Structured data from Step 4
Output: {
    tagline: "Engineering scalable solutions for the modern web",
    bio: "I'm a passionate full-stack developer...",
    topSkills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
    polishedExperience: [{...achievementDescription...}],
    polishedProjects: [{...githubLink, liveLink...}],
    themeColors: { primary: "#6366f1", secondary: "#a855f7", accent: "#f43f5e" }
}

STEP 6: IMAGEKIT — Upload profile photo
────────────────────────────────────────
const imageUrl = await uploadImageToImageKit(buffer, "photo.jpg");
→ "https://ik.imagekit.io/xxx/portfolio-ai-profiles/photo.jpg"

STEP 7: SLUG GENERATION
────────────────────────
generateSlug("John Doe")
→ "john-doe" + random suffix → "john-doe-x7k2m"

STEP 8: SAVE TO MONGODB
────────────────────────
new Portfolio({
    userId, slug, structuredData, portfolioContent,
    imageUrl, selectedTemplate
}).save()

STEP 9: RETURN TO FRONTEND
───────────────────────────
{ portfolio: {...}, portfolioId: "..." }
→ Frontend: setPortfolio(data.portfolio)
→ Screen splits: Chat | Preview
```

---

## 13. AI Chat Edit — Detailed

```
USER: "Make my tagline say 'Code Ninja building the future'"

FRONTEND:
    1. Add message to chat: { role: 'user', text: "Make my tagline..." }
    2. PATCH /api/portfolio/:id/edit  body: { instruction: "Make my tagline..." }

BACKEND:
    1. Find portfolio by ID + verify ownership
    2. Get current portfolioContent JSON

    3. GEMINI AI — CALL 3 (Edit content):
       Prompt: "Here's the current portfolio JSON... The user wants: 'Make my tagline...'
                Modify ONLY what's asked. Return full JSON."
       
       AI returns updated JSON with tagline changed:
       { tagline: "Code Ninja building the future", ...everything else unchanged }

    4. Check if instruction mentions "template two" → switch template
    5. Append to messages array:
       - { role: "user", text: "Make my tagline..." }
       - { role: "ai",   text: "Updated! Check the preview." }
    6. Save to MongoDB
    7. Return updated portfolio

FRONTEND:
    1. setPortfolio(data.portfolio)
    2. Preview re-renders with new tagline
    3. Chat shows the new messages
```

---

## 14. Payment & Publishing — Detailed

```
USER CLICKS: "Pay ₹69 to Go Live"

STEP 1: CREATE ORDER
    Frontend → POST /api/payment/create-order { portfolioId }
    Backend  → Check if already paid (return liveUrl if so)
    Backend  → razorpay.orders.create({ amount: 6900, currency: 'INR' })
    Return   → { orderId: "order_xxx", amount: 6900, currency: "INR", keyId: "rzp_test_xxx" }

STEP 2: LOAD RAZORPAY SDK
    Frontend dynamically loads: https://checkout.razorpay.com/v1/checkout.js

STEP 3: OPEN PAYMENT MODAL
    new window.Razorpay({
        key: keyId,
        amount: 6900,
        order_id: orderId,
        name: 'Flexoraa',
        description: 'Publish Portfolio Website (₹69)',
        handler: function(response) { /* STEP 4 */ }
    }).open()

STEP 4: VERIFY PAYMENT
    User pays → Razorpay returns: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
    Frontend → POST /api/payment/verify { portfolioId, ...razorpay_response }
    
    Backend verification:
        expected = HMAC-SHA256(order_id + "|" + payment_id, RAZORPAY_SECRET)
        if (expected !== received_signature) → REJECT "Invalid signature"
        
    Backend updates:
        portfolio.isPaid = true
        portfolio.paymentId = razorpay_payment_id
        portfolio.isPublished = true
        portfolio.slug = generateSlug(name)  // if not already set
        portfolio.save()
    
    Return → { portfolio, liveUrl: "http://localhost:5173/portfolio/john-doe-x7k2m" }

STEP 5: SHOW LIVE URL
    Frontend: setLiveUrl(liveUrl)
    UI shows: "Open Live" button + "Copy Link" button
    Anyone can now visit /portfolio/john-doe-x7k2m — NO LOGIN REQUIRED
```

---

## 15. Beginner Concepts Explained

### What is JWT?
**JSON Web Token** — A secure string that proves who you are.
```
Header.Payload.Signature
eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEyMyIsInVzZXJuYW1lIjoiam9obiJ9.signature
```
- **Header:** Algorithm used (HS256)
- **Payload:** Your data `{ id: "123", username: "john" }`
- **Signature:** Encrypted with server's secret key — can't be faked!

### What is Middleware?
Code that runs **BETWEEN** the request and the response:
```
Request → [Middleware 1] → [Middleware 2] → [Route Handler] → Response
```
Example: `authUser` middleware checks JWT before allowing access to protected routes.

### What is REST API?
A way to organize server endpoints:
- **GET** = Read data
- **POST** = Create data
- **PATCH** = Update data
- **DELETE** = Remove data

### What is CORS?
**Cross-Origin Resource Sharing** — Security feature. Frontend (port 5173) and Backend (port 3000) are different "origins." CORS config allows them to communicate.

### What is bcrypt?
Turns passwords into unreadable hashes:
```
"mypassword123" → "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
```
Even if database is hacked, actual passwords can't be recovered.

### What is Redis?
Super-fast in-memory database (like a dictionary). Used here to quickly check if a JWT token has been blacklisted (logged out). Regular MongoDB queries would be too slow for this.

### What is a Slug?
A URL-friendly identifier:
```
"John Doe" → "john-doe-x7k2m"
```
Used in the portfolio URL: `/portfolio/john-doe-x7k2m`

### What is FormData?
A browser API for sending files + data together in a single HTTP request. Unlike JSON, it can carry binary files (PDFs, images).

### What is React Context?
A way to share state (like `user`) across ALL components without passing props manually through every level:
```
AuthProvider (user state lives here)
  └─ App
      └─ Navbar (useAuth() → gets user)
      └─ Home (useAuth() → gets user)
      └─ Protected (useAuth() → checks user)
```

### What is a CDN?
**Content Delivery Network** — Stores your files on servers worldwide so they load fast for everyone. ImageKit is the CDN used for profile photos.

---

> [!TIP]
> **How to Run This Project Locally:**
> ```bash
> # Terminal 1 — Backend
> cd backend
> npm install
> npm run dev          # Starts on http://localhost:3000
>
> # Terminal 2 — Frontend
> cd frontend
> npm install
> npm run dev          # Starts on http://localhost:5173
> ```
> Make sure MongoDB, Redis are running and `.env` is configured!

---

> [!NOTE]
> **This document covers the COMPLETE Flexoraa codebase** — every file, every function, every data flow. Use the table of contents to jump to specific sections. As a beginner, start with Section 4 (Big Picture) and Section 15 (Concepts), then explore the detailed sections.

---

*Generated for the Flexoraa project — July 2026*
