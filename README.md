# 🚖 City Yatra — Cab Booking Website

A production-ready cab booking website with a modern UI, full Node.js + Express backend, MongoDB database, and Nodemailer email notifications.

---

## 📁 Project Structure

```
city-yatra/
├── public/                  ← Static frontend files (served by Express)
│   ├── index.html           ← Main HTML (all sections)
│   ├── css/
│   │   └── style.css        ← Complete stylesheet
│   └── js/
│       └── main.js          ← Frontend JavaScript
│
├── config/
│   ├── db.js                ← MongoDB connection
│   └── mailer.js            ← Nodemailer transporter
│
├── models/
│   └── Booking.js           ← Mongoose schema
│
├── controllers/
│   └── bookingController.js ← Business logic + email sending
│
├── routes/
│   └── bookingRoutes.js     ← API routes with validation
│
├── server.js                ← Express entry point
├── package.json
├── .env.example             ← Environment variable template
└── .gitignore
```

---

## ⚙️ Setup Instructions

### Step 1 — Prerequisites

Install these if you don't have them:
- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/try/download/community) (local) OR use [MongoDB Atlas](https://www.mongodb.com/atlas) (free cloud)

### Step 2 — Clone / Download

```bash
# If using git
git clone <your-repo-url>
cd city-yatra

# Or just extract the zip and open the folder
```

### Step 3 — Install Dependencies

```bash
npm install
```

### Step 4 — Configure Environment Variables

```bash
# Copy the template
cp .env.example .env

# Now edit .env with your actual values:
nano .env        # Linux/Mac
notepad .env     # Windows
```

Fill in your `.env`:

```env
PORT=3000
NODE_ENV=development

# MongoDB (choose one):
MONGO_URI=mongodb://localhost:27017/cityyatra          # Local MongoDB
# MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/cityyatra  # Atlas

# Email (Gmail example):
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password    # NOT your Gmail password
EMAIL_FROM=City Yatra <your_gmail@gmail.com>
ADMIN_EMAIL=admin@cityyatra.com

BUSINESS_PHONE=+91-9876543210
BUSINESS_NAME=City Yatra
ADMIN_KEY=cityyatra2024
```

> **Gmail App Password**: Go to Google Account → Security → 2-Step Verification → App Passwords → Generate one for "Mail"

### Step 5 — Run the App

```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

Open **http://localhost:3000** in your browser. That's it! 🎉

---

## 🌐 API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| `POST` | `/api/book` | Submit a new booking |
| `GET` | `/api/bookings?adminKey=cityyatra2024` | Get all bookings (admin) |
| `GET` | `/api/bookings/:id` | Get a single booking by ID |
| `GET` | `/api/health` | Health check |

### Test the API with curl:
```bash
curl -X POST http://localhost:3000/api/book \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Rahul Sharma",
    "phone": "9876543210",
    "pickupLocation": "Delhi",
    "dropLocation": "Agra",
    "date": "2024-12-25",
    "vehicleType": "Innova",
    "tripType": "one-way",
    "message": "Need child seat"
  }'
```

---

## 🚀 Deployment

### Option A — Render.com (Recommended, Free)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Set:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add all `.env` variables in the "Environment" tab
6. Deploy ✅

### Option B — Railway.app

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add a MongoDB plugin (or use Atlas URI)
4. Add environment variables
5. Deploy ✅

### Option C — VPS (DigitalOcean / AWS)

```bash
# On your server
git clone <repo>
cd city-yatra
npm install
cp .env.example .env
nano .env  # Fill in values

# Install PM2 for process management
npm install -g pm2
pm2 start server.js --name city-yatra
pm2 save
pm2 startup
```

Then configure Nginx as a reverse proxy pointing to port 3000.

### Option D — Shared Hosting (cPanel with Node.js support)

1. Upload all files via FTP
2. In cPanel → Node.js App → Create
3. Set app root and start file as `server.js`
4. Set environment variables in cPanel
5. Click "Run NPM Install" → Start

---

## 🛠️ Customization Guide

### Change Business Info
Update these in:
- `public/index.html` — Phone number, address, email (search for `+91 98765 43210`)
- `.env` — `BUSINESS_PHONE`, `ADMIN_EMAIL`

### Add More Vehicle Types
1. In `models/Booking.js` — add to the `enum` array
2. In `public/index.html` — add `<option>` in the vehicle select
3. In `routes/bookingRoutes.js` — add to the `isIn([...])` array

### Change Colors / Branding
Edit `public/css/style.css` — top `:root` block:
```css
:root {
  --orange: #FF6B35;        /* Primary color */
  --charcoal: #1a1a2e;      /* Dark background */
  /* ... */
}
```

### Enable Customer Confirmation Email
In `controllers/bookingController.js`, add an `email` field to the booking form and model, then uncomment:
```js
// await transporter.sendMail(customerMailOptions);
```

---

## 📋 Admin Panel

View all bookings:
```
http://localhost:3000/api/bookings?adminKey=cityyatra2024
```
Change `ADMIN_KEY` in `.env` for security.

---

## 🔒 Security Checklist (Before Going Live)

- [ ] Change `ADMIN_KEY` in `.env` to something strong
- [ ] Use MongoDB Atlas with IP whitelist instead of local MongoDB
- [ ] Enable HTTPS (SSL certificate via Let's Encrypt)
- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Remove test phone numbers and replace with real business contacts
- [ ] Update Google Maps embed with your actual office location

---

## 📞 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JS (no framework needed)
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Email**: Nodemailer
- **Fonts**: Syne + DM Sans (Google Fonts)
- **Icons**: Font Awesome 6

---

Made with ❤️ for City Yatra
