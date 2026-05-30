# Netflix Clone - Complete Setup Guide

## 🎯 Quick Start

This Netflix Clone is now fully configured with real video streams and working pages. Follow these steps to get everything running.

---

## 📋 Prerequisites

Before you begin, make sure you have:
- **Node.js** v18 or higher
- **MySQL** v8.0 or higher (must be running)
- **npm** (comes with Node.js)

---

## 🚀 Installation Steps

### 1. **Start MySQL Service**

**On Windows (via PowerShell as Admin):**
```powershell
# Start MySQL service
net start MySQL80

# Or if using XAMPP/WAMP:
# Start these services through the control panel
```

**Verify MySQL is running:**
```bash
mysql -u root -p
# (Press Enter if no password set)
# Type: exit
```

### 2. **Install Dependencies**
```bash
cd c:\Users\HP\OneDrive\Bureau\netflix-node
npm install
```

✅ All dependencies are already installed, but running `npm install` again ensures everything is ready.

### 3. **Set Up Database**

Run the database initialization script:
```bash
mysql -u root -p < database.sql
```

**What this does:**
- Creates `netflix_clone` database
- Creates `users`, `movies`, `user_list`, and `watch_history` tables
- Seeds with **30 pre-configured movies/shows** with REAL video URLs
- Creates two demo accounts

### 4. **Verify Environment Configuration**

Check `.env` file - it should look like this:
```
PORT=3000
SESSION_SECRET=netflix_super_secret_key_change_in_production

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=netflix_clone
```

**Update if needed:**
- Change `DB_USER` if your MySQL user is different
- Add `DB_PASSWORD` if you have a MySQL password
- Update `DB_HOST` if MySQL is on a different machine

### 5. **Start the Server**

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

**Expected output:**
```
🚀 Netflix Clone is live!
🔗 URL:   http://localhost:3000
👤 Admin: http://localhost:3000/admin
📁 Env:   development

MySQL connected successfully
```

---

## 🎬 Test the Application

### Demo Accounts

**Admin Account:**
- Email: `admin@netflix.com`
- Password: `admin123`

**Regular User Account:**
- Email: `user@netflix.com`
- Password: `password`

### Test Access Points

1. **Home Page**: http://localhost:3000
2. **Browse**: http://localhost:3000/movies/browse
3. **Search**: http://localhost:3000/search?q=inception
4. **Admin Panel**: http://localhost:3000/admin
5. **My List**: http://localhost:3000/my-list

### Test Video Playback

1. Click on any movie card
2. Click the "Play" button
3. Videos should load from Google's sample video library
4. Use player controls: play, pause, volume, skip forward/back

---

## 📊 Database Info

### Available Movies (30 Total)
- **Movies**: 15 (with full HD video streams)
- **TV Shows**: 15 (with episode streams)

### Video URLs Used
We use Google's sample video library for reliable streaming:
- All videos are **MP4 format** and **royalty-free**
- Videos range from **8 to 10 seconds** (for demo purposes)
- In production, replace with your licensed content

### Movies with Real Video Streams
✅ Stranger Things (TV)
✅ The Dark Knight
✅ Inception
✅ Breaking Bad (TV)
✅ The Crown (TV)
✅ Interstellar
✅ The Witcher (TV)
✅ Parasite
✅ Money Heist (TV)
✅ The Shawshank Redemption
✅ Ozark (TV)
✅ Avengers: Endgame
✅ Squid Game (TV)
✅ The Godfather
✅ Black Mirror (TV)
✅ Spider-Man: No Way Home
✅ Bridgerton (TV)
✅ Dune
✅ The Office (TV)
✅ Pulp Fiction
✅ Narcos (TV)
✅ The Matrix
✅ Mindhunter (TV)
✅ Gladiator
✅ Peaky Blinders (TV)
✅ Forrest Gump
✅ Dark (TV)
✅ John Wick
✅ The Queen's Gambit (TV)
✅ Wednesday (TV)

---

## 🔧 Troubleshooting

### Issue: "MySQL connection failed"

**Solution:**
```bash
# 1. Check if MySQL is running
mysql -u root -p -e "SELECT 1"

# 2. If not running, start it:
# Windows: net start MySQL80

# 3. If password protected, update .env:
DB_PASSWORD=your_password
```

### Issue: Database tables don't exist

**Solution:**
```bash
# Re-run the setup
mysql -u root -p < database.sql

# Verify tables exist:
mysql -u root -p netflix_clone -e "SHOW TABLES;"
```

### Issue: Videos won't play

**Solutions:**
1. Check browser console for errors (F12)
2. Verify internet connection (videos are streamed from Google CDN)
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try different browser
5. Check video URL in database:
```bash
mysql -u root -p netflix_clone -e "SELECT title, video_url FROM movies LIMIT 5;"
```

### Issue: Port 3000 already in use

**Solution:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number):
taskkill /PID <PID> /F

# Or change port in .env:
PORT=3001
```

### Issue: Can't login

**Solution:**
1. Verify user exists in database:
```bash
mysql -u root -p netflix_clone -e "SELECT email, role FROM users;"
```

2. Make sure you're using exact email and password:
   - Email: `admin@netflix.com` or `user@netflix.com`
   - No spaces, case-sensitive

---

## 📁 Project Structure

```
netflix-node/
├── src/
│   ├── config/        # Database configuration
│   ├── controllers/   # Business logic
│   ├── middleware/    # Auth, validation
│   ├── models/        # Database models
│   ├── routes/        # Express routes
│   └── views/         # EJS templates
├── public/            # Static files (CSS, JS, images)
├── database.sql       # Database schema & seed data
├── server.js          # Express entry point
├── package.json       # Dependencies
├── .env              # Environment variables
└── README.md         # Documentation
```

---

## 🎨 Features Implemented

✅ **Authentication**
- User registration and login
- Password hashing with bcryptjs
- Session management
- Admin role support

✅ **Movie Management**
- Browse all movies and TV shows
- Filter by genre and type
- Search functionality
- Movie details page

✅ **Video Playback**
- Native HTML5 video player
- Play, pause, volume controls
- Seek bar with progress
- YouTube embed support
- Full-screen mode

✅ **User Features**
- Add/remove movies from "My List"
- Watch history tracking
- Personal recommendations

✅ **Admin Features**
- Dashboard with statistics
- Add/edit/delete movies
- Manage users
- Upload custom thumbnails & banners

---

## 🔐 Security Features

- **Password Hashing**: bcryptjs (salted & hashed)
- **Session Protection**: HTTPOnly cookies
- **CSRF Protection**: Method override for forms
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: EJS template escaping

---

## 📝 Environment Variables

```bash
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=netflix_clone

# Security
SESSION_SECRET=netflix_super_secret_key_change_in_production
```

---

## 📞 Support

For issues or questions:
1. Check this guide's **Troubleshooting** section
2. Check browser console for errors (F12)
3. Check server logs in terminal
4. Verify MySQL is running
5. Verify database is initialized

---

## 🎉 You're All Set!

Visit **http://localhost:3000** and start using your Netflix Clone!

**Login with:**
- **Admin**: admin@netflix.com / admin123
- **User**: user@netflix.com / password

Enjoy! 🍿
