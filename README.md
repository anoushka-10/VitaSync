# 🌸 VitaSync (The Girl Coded AI Tracker)

A premium, full-stack AI Fitness and Wellness Tracker tailored for holistic health. VitaSync integrates real-time metabolic tracking, personalized nutrition goals, and cycle-syncing insights into a beautifully designed, mobile-responsive "Soft Wellness" interface.

## ✨ Features
- **Dynamic Dashboard**: Real-time visualization of targeted protein, calorie deficit, and weight goals.
- **Hormonal Cycle Syncing**: Visual phase tracking (Menstrual, Follicular, Ovulatory, Luteal) to align nutrition and workouts.
- **AI-Powered Logging**: Log meals using natural language. The AI estimates macros and calories automatically.
- **High-Fidelity UI**: Premium glassmorphism aesthetics with dynamic charts and responsive design.
- **Secure Authentication**: Google OAuth2 integration and JWT session management.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, React Router, Recharts, Lucide Icons.
- **Backend**: Java, Spring Boot, Spring Security, Spring Data JPA.
- **Database**: PostgreSQL
- **AI Integration**: Groq API (Llama-3 model for food estimation and insights)

## 🚀 Environment Variables (Deployment Secrets)

To deploy this application, you must configure the following Environment Variables (or GitHub Secrets if using GitHub Actions / CI/CD). **Never hardcode these into your source code.**

### Backend Secrets
- `DB_URL`: The JDBC connection string to your PostgreSQL database (e.g., `jdbc:postgresql://your-db-host.com:5432/aitracker`)
- `DB_USERNAME`: Your database username
- `DB_PASSWORD`: Your database password
- `GOOGLE_CLIENT_ID`: Google OAuth2 Client ID (from Google Cloud Console)
- `GOOGLE_CLIENT_SECRET`: Google OAuth2 Client Secret
- `GOOGLE_REDIRECT_URI`: The authorized redirect URI for OAuth (e.g., `https://your-domain.com/login/oauth2/code/google` for production)
- `GROQ_API_KEY`: Your API key for the Groq AI service.

### Frontend Secrets (for `.env`)
- `VITE_API_URL`: The base URL for your deployed Spring Boot backend (e.g., `https://api.yourdomain.com`). Used by Axios to route API requests.

## 💻 Local Development

1. **Clone the repository**: `git clone https://github.com/anoushka-10/VitaSync.git`
2. **Setup PostgreSQL**: Create a local database named `aitracker`.
3. **Configure Backend Application Properties**: 
   Provide the required secrets in your local environment or create an `application-dev.properties`.
4. **Run Backend**: `mvn spring-boot:run`
5. **Run Frontend**: 
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 💖 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
