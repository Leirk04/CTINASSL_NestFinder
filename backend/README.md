## Villa Backend (MERN API)

**Tech stack**
- **Node + Express** API
- **MongoDB + Mongoose** for data
- **JWT** for auth
- **Helmet, CORS, express-rate-limit** for security

### Setup
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in `backend` (same folder as `server.js`) with:
   ```bash
   MONGO_URI=mongodb://127.0.0.1:27017/villa
   JWT_SECRET=super-strong-secret-change-me
   PORT=5000
   ```
3. Run MongoDB locally (or point `MONGO_URI` to your cluster).

4. Start the server:
   ```bash
   npm run dev
   ```

### API Overview
- `POST /api/auth/register` – register, returns JWT.
- `POST /api/auth/login` – login, returns JWT.
- `POST /api/visits` – create a villa visit (auth required, `Authorization: Bearer <token>`).
- `GET /api/visits` – list visits for logged-in user.

### Security / OWASP Notes
- **Rate limiting** on all routes + stricter on `/api/auth/*`.
- **Helmet** sets secure HTTP headers.
- **Passwords** are **bcrypt-hashed**, no plaintext storage.
- **JWT** uses `sub` claim for user id and 2h expiry by default.
- Inputs are validated server-side (required fields, basic email regex, date parsing).

For an OWASP-style penetration test, focus on:
- **Authentication**: brute-force protection (rate limiting), lockout policies you may add, verify JWT invalidation on expiry.
- **Access control**: ensure `/api/visits` cannot be accessed without a valid JWT, and users can only see their own visits.
- **Input validation**: try to bypass validation with malformed JSON, long strings, or invalid dates.
- **Transport security**: when deployed, terminate over **HTTPS** and set secure cookies/headers at the reverse proxy.
- **Error handling**: confirm API does not leak stack traces or sensitive details in responses.


