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

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
