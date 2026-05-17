# Netflix Clone — Node.js + Express + MySQL

A complete full-stack Netflix clone using a clean MVC architecture.

## Stack
- Node.js + Express 4
- EJS (server-rendered templates)
- MySQL2 (connection pool)
- bcryptjs, express-session, connect-flash, multer

## Quick Start

### 1. Install dependencies
npm install

### 2. Create the database
mysql -u root -p < database.sql

### 3. Configure .env
PORT=3000
SESSION_SECRET=your_secret_here
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=netflix_clone

### 4. Run
npm start        # production
npm run dev      # development with nodemon

Open: http://localhost:3000

## Default Accounts
- Admin: admin@netflix.com / admin123
- User:  user@netflix.com  / password

## Features
- Register / Login / Logout with bcrypt passwords
- Hero banner with featured title
- Row sliders: Trending, New, Top Rated, By Genre
- Movie modal on hover with full details
- Video player: native HTML5 + YouTube embed
- Keyboard shortcuts: Space/K, arrows, M, F
- My List (add/remove, persisted in DB)
- Live search
- Browse by genre and type
- Watch history auto-logged
- Admin panel: dashboard, CRUD movies, manage users
- Image upload with multer
- Flash messages, toast notifications
- Responsive mobile design

## Route Map
GET  /                     Home
GET  /search               Search results
GET  /my-list              My List
POST /list/add             Add to list (JSON)
POST /list/remove          Remove from list (JSON)
GET  /auth/login           Login page
POST /auth/login           Process login
GET  /auth/register        Register page
POST /auth/register        Process registration
POST /auth/logout          Logout
GET  /movies/browse        Browse all / filter
GET  /movies/:id           Movie detail
GET  /movies/:id/watch     Video player
GET  /admin                Dashboard
GET  /admin/movies         Movies list
GET  /admin/movies/create  Add movie form
POST /admin/movies         Store movie
GET  /admin/movies/:id/edit  Edit form
POST /admin/movies/:id     Update movie
POST /admin/movies/:id/delete  Delete
GET  /admin/users          Users list
POST /admin/users/:id/delete   Delete user

## Database Tables
users         — id, name, email, password, plan, role, created_at
movies        — id, title, description, genre, release_year, duration,
                rating, thumbnail, banner, video_url, cast_members,
                director, type, featured, created_at
user_list     — user_id, movie_id, added_at
watch_history — user_id, movie_id, watched_at
