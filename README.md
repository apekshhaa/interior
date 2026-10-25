# COLOUR TONE

COLOUR TONE is a React/Vite website for decorative wall textures, painting services, product samples, and customer site-visit bookings.

## Project layout

- [frontend](./frontend): React, TypeScript, Vite, and Tailwind user interface.
- [backend](./backend): Express, TypeScript, MongoDB/Mongoose API for authentication and bookings.

## Run locally

### Backend

```powershell
cd backend
Copy-Item .env.example .env
# Edit .env with a MongoDB Atlas URI and a random SESSION_SECRET of at least 32 characters.
npm install
npm run dev
```

The API runs on `http://localhost:4000` by default.

### Frontend

```powershell
cd frontend
Copy-Item .env.example .env.local
# Set VITE_API_URL=http://localhost:4000/api in .env.local
npm install
npm run dev
```

The UI runs on `http://localhost:3000`.

If sign-in shows “The booking service is unavailable” or the backend exits with a
`MongooseServerSelectionError`, the API could not connect to MongoDB Atlas. In Atlas, add the
current development machine's public IP under **Security → Network Access**, confirm the database
user and connection string in `backend/.env`, and restart the backend. Do not expose the
connection string in browser code or commit it.

## MongoDB Atlas setup

1. Create a free project and cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user under **Database Access**. Use a strong generated password.
3. Under **Network Access**, add only the IP addresses that need database access. For local development, add the current developer IP rather than opening access to `0.0.0.0/0`.
4. Select **Connect > Drivers**, copy the Node.js connection string, and put it in `backend/.env` as `MONGODB_URI`. URL-encode special characters in the username or password.
5. Keep `.env` files out of Git. The backend fails fast if required environment variables are missing.

## Backend API

All authenticated routes use an HTTP-only `colour_tone.sid` cookie.

- `GET /api/health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/bookings`
- `GET /api/bookings/my`
- `GET /api/bookings/:id`
- `PATCH /api/bookings/:id/cancel`
Private admin booking endpoints remain server-side only and are not linked from or exposed by
the customer-facing frontend. Public signup always creates `customer` users, and admin
authorization remains enforced by the backend.

Optional Gmail SMTP notifications can be enabled by setting `SMTP_HOST=smtp.gmail.com`,
`SMTP_PORT=587`, `SMTP_USER`, `SMTP_PASSWORD`, and `FOUNDER_EMAIL` in `backend/.env`.
`SMTP_PASSWORD` must be a Google App Password, not the normal Gmail password. After an enquiry
is saved, the configured founder receives a readable HTML/plain-text notification and a customer
acknowledgement is sent when the submitted email address is present. The acknowledgement explains
that the enquiry was received and that a consultation is not confirmed until a date and time are
agreed.

Email delivery is optional and independent of booking persistence. If SMTP is not configured,
no email is attempted. If SMTP fails, the saved enquiry still returns successfully and only a
generic notification failure is logged. Email state is claimed atomically per booking and
recipient to avoid duplicate sends from concurrent retries.

To configure Gmail locally:

1. Enable 2-Step Verification for the Gmail account.
2. In Google Account **Security**, open **App passwords**, create an app password, and copy it
   once.
3. Put that app password in `backend/.env` as `SMTP_PASSWORD`; do not use or share the normal
   Gmail password.
4. Set `SMTP_USER` to the sending Gmail address and `FOUNDER_EMAIL` to the recipient address.
5. Verify a test booking and the message in Gmail/provider logs. Compilation or mocked tests do
   not prove real delivery.

WhatsApp click-to-chat is a manual customer action, not an automated notification. Set
`VITE_WHATSAPP_NUMBER` in `frontend/.env` to the business number in international digits-only
format, without `+`, spaces, or hyphens. The confirmation screen and Contact page show a WhatsApp
button only when this value is valid. The link contains a URL-encoded summary of the actual
enquiry and the customer must review it and press **Send** in WhatsApp. Phone numbers, email
addresses, and authentication data are not placed in the message.

Founder SMS notifications use MSG91's official Flow API:
`POST https://control.msg91.com/api/v5/flow/`.
See the [official MSG91 Send SMS documentation](https://docs.msg91.com/sms/send-sms) for
API key, sender ID, Flow/template, and DLT registration setup.
Create and approve an Indian DLT template with five variables in MSG91, then configure
`MSG91_AUTH_KEY`, `MSG91_TEMPLATE_ID`, `MSG91_SENDER_ID`, and `FOUNDER_PHONE` in
`backend/.env`. `FOUNDER_PHONE` must be an Indian number, for example `919XXXXXXXXX`.
The template variables are sent as:

1. Booking reference
2. Customer name
3. Requested service
4. Property type
5. Preferred date, or `Flexible`

SMS is disabled when any of these variables is absent. The booking is saved before SMS is
attempted, and an SMS failure never changes the customer-facing booking success response.
Each booking has an atomic SMS notification state to avoid duplicate sends from concurrent
retries.

Example signup:

```powershell
Invoke-RestMethod -Method Post http://localhost:4000/api/auth/signup `
  -ContentType 'application/json' `
  -Body '{"name":"Test Customer","email":"test@example.com","phone":"+91 9000000000","password":"securePass1","confirmPassword":"securePass1"}'
```

## Tests and validation

```powershell
cd backend
npm test
npm run build

cd ..\frontend
npm run lint
npm run build
```

Backend tests use `mongodb-memory-server`; they do not modify Atlas or real customer records.