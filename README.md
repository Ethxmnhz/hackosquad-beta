# HackoSquad CTF Platform

A modern Capture The Flag (CTF) platform built with React, TypeScript, and Express.

## Features

- 🔐 **User Authentication**
  - Email/Password registration and login
  - JWT-based authentication
  - Role-based access control (User/Admin)

- 🎯 **Challenge System**
  - Multiple challenge categories (Web, Crypto, Forensics, etc.)
  - Difficulty levels (Easy, Medium, Hard, Insane)
  - Flag submission and validation
  - Points-based scoring system
  - Hint system for challenges

- 👥 **Community Features**
  - Real-time chat channels
  - Category-based discussions
  - User profiles with achievements
  - Public and private channels

- 🏆 **Gamification**
  - Global leaderboard
  - Achievement badges
  - Progress tracking
  - Points system

- 🛠️ **Creator Zone**
  - Challenge creation interface
  - Challenge management
  - Markdown support for descriptions
  - File upload support

- 👨‍💼 **Admin Panel**
  - Challenge approval system
  - User management
  - Platform statistics
  - Content moderation

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router
- Lucide Icons
- React Hot Toast
- Vite

### Backend
- Node.js
- Express
- PostgreSQL
- JWT Authentication
- bcrypt
- CORS

## Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Git

## Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/hackosquad.git
cd hackosquad
```

2. **Set up the database**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE hackosquad;

# Import schema
\i server/db/schema.sql
```

3. **Configure environment variables**

Frontend (.env):
```bash
cd project
cp .env.example .env
# Edit .env with your configuration
```

Backend (.env):
```bash
cd server
cp .env.example .env
# Edit .env with your configuration
```

4. **Install dependencies**

Frontend:
```bash
cd project
npm install
```

Backend:
```bash
cd server
npm install
```

5. **Start the servers**

Frontend:
```bash
cd project
npm run dev
```

Backend:
```bash
cd server
npm start
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Project Structure

```
hackosquad/
├── project/                 # Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts
│   │   ├── lib/           # Utilities and helpers
│   │   ├── pages/         # Page components
│   │   └── services/      # API services
│   └── ...
└── server/                 # Backend
    ├── db/                # Database schemas
    └── index.js          # Express server
```

## Key Components

1. **Authentication System**
   - JWT-based auth flow
   - Protected routes
   - Role-based access

2. **Challenge System**
   - Dynamic challenge loading
   - Flag submission
   - Points calculation
   - Progress tracking

3. **Community System**
   - Real-time chat
   - Channel management
   - User interactions

4. **Creator Zone**
   - Challenge creation form
   - Challenge management
   - Content moderation

5. **Admin Panel**
   - Challenge approval workflow
   - User management
   - Platform oversight

## Deployment

### Frontend Deployment (Vercel)

1. Create a [Vercel](https://vercel.com) account
2. Navigate to frontend directory:
```bash
cd project
```

3. Deploy with Vercel CLI:
```bash
vercel

# Answer the CLI prompts:
? Set up and deploy? [Y/n] y
? Which scope should contain your project? [your-username]'s projects
? Link to existing project? [Y/n] n
? What's your project's name? [project-name]
? In which directory is your code located? ./

# Vercel will then:
# 1. Create the project
# 2. Deploy your code
# 3. Provide you with deployment URLs
```

4. Configure environment variables:
   - Go to Vercel Dashboard > Your Project > Settings > Environment Variables
   - Add all variables from your `.env` file

5. Your frontend will be deployed at: `https://[project-name].vercel.app`

### Backend Deployment (Render)

1. Create a [Render](https://render.com) account (free tier)
2. Create a new Web Service with these settings:
   - Name: `hackosquad-beta`
   - Region: `Oregon (US West)`
   - Root Directory: `server`d`
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Health Check Path: `/healthz``NODE_VERSION=18.x`
   - Environment Variables:type
     ```
     NODE_VERSION=18.x:
     NODE_ENV=production   - Go to "New+" > "PostgreSQL"
     ```

3. Set up PostgreSQL on Render:al Database URL"
   - Go to "New+" > "PostgreSQL"
   - Choose free tier Render:
   - Create database   - Go to your Web Service
   - Copy the "External Database URL"
e copied PostgreSQL URL
4. Configure environment variables on Render:
   - Go to your Web Service
   - Add all variables from your `.env` file
   - Set DATABASE_URL to the copied PostgreSQL URLion string from Render dashboard

### Database Setup on Render
```bash
1. Get your database connection string from Render dashboard/db/schema.sql

2. Import schema to Render PostgreSQL:
```bash Update Frontend API URL
psql your_render_postgres_url < server/db/schema.sql
```

1. Update the API URL in frontend `.env`:
```
VITE_API_URL=https://your-render-app.onrender.com/api
```

2. Redeploy frontend:
```bash
cd project
vercel --prod
```

### Free Hosting Limits

- Vercel (Frontend)
  - Unlimited static site deployments
  - Automatic HTTPS
  - Continuous deployment from Git

- Render (Backend + Database)
  - Free tier includes:
  - 750 hours of running time per month
  - Automatic HTTPS
  - 400GB egress bandwidth
  - PostgreSQL: 1GB storage, auto-backup
  - Spins down after 15 minutes of inactivity
  - Wakes up automatically on request

Your application will be available at:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.onrender.com`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
