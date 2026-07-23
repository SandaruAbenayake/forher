# Best Friend Date

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Open the local URL Vite prints (normally `http://localhost:5173`). Email is optional: leave `.env` values blank to skip EmailJS while testing.

## Optional EmailJS

Fill the four `VITE_EMAILJS_*` / `VITE_RECIPIENT_EMAIL` values in `.env` to enable confirmation email. Leave them blank to run the frontend locally without email sending.
