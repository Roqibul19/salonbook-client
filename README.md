# SalonBook — Client

**SalonBook** is a salon appointment booking platform. Customers can explore salon services, view service details, request appointments online and pay for confirmed appointments with Stripe. The salon admin creates and manages services, reviews appointment requests, confirms or cancels them, manages customers and monitors payments.

This is the **Next.js** front end. It also runs **Better Auth** (email/password + Google login) and issues the JWTs that the Express server verifies.

## 🔗 Links

| | |
|---|---|
| Live Website | _Coming soon_ |
| Client Repository | https://github.com/Roqibul19/salonbook-client |
| Server Repository | https://github.com/Roqibul19/salonbook-server |

## ✨ Important Features

### For everyone
- Salon-themed **Home page** — banner, featured services from the database, "How it works" section and service categories.
- **Browse Services** — search by name, filter by category and sort by price. Filters stay in the URL, so a page reload keeps them.
- Fully **responsive** on mobile, tablet and desktop.

### Authentication
- **Better Auth** with email/password and **Google login**.
- Sign up with profile image (**upload to ImgBB** or image URL) and password rules (6+ characters, one uppercase, one lowercase) checked on both client and server.
- Admin accounts can **not** be created from public sign up — the role is assigned securely from the server.
- Role-based redirect after login, and the navbar updates immediately after login/logout.
- **Blocked users** cannot sign in or use protected features.

### Customer
- Protected **Service Details** page with an appointment form — date picker, predefined time slots (already booked slots are disabled) and an optional message.
- **Customer Dashboard** — overview statistics, My Appointments (view details, cancel pending requests, pay for confirmed appointments), payment history and My Profile.
- **Stripe Checkout** payment with Payment Success and Payment Cancel pages. Payment status changes to *Paid* only after a verified Stripe webhook.

### Admin
- **Admin Dashboard** — overview statistics and quick actions.
- **Manage Services** — add, update, delete and activate/deactivate services with image upload.
- **Manage Appointments** — filter by status, view details, confirm or cancel.
- **Manage Users** — view customer details, block and unblock.
- **Transactions** — read-only list of Stripe payments with total revenue.

### Quality
- Users cannot open another role's dashboard by changing the URL (checked on the server).
- Loading skeletons, toast notifications (no `alert()`), confirmation dialogs, status badges, a custom 404 page and an error page.

## 🛠️ Technology Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Better Auth (MongoDB adapter, JWT plugin, Google OAuth)
- MongoDB
- Stripe Checkout
- ImgBB (image hosting)
- Sonner (toasts), Lucide (icons)

## 🔐 Required Environment Variables

Create a `.env.local` file in the project root. **Names only — never commit real values.**

```
BETTER_AUTH_SECRET
BETTER_AUTH_URL
MONGODB_URI
DB_NAME
NEXT_PUBLIC_API_URL
IMGBB_API_KEY
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

| Variable | Description |
|---|---|
| `BETTER_AUTH_SECRET` | Random secret used by Better Auth |
| `BETTER_AUTH_URL` | URL of this client app (e.g. http://localhost:3000) |
| `MONGODB_URI` | MongoDB connection string (same database as the server) |
| `DB_NAME` | Database name |
| `NEXT_PUBLIC_API_URL` | URL of the Express server (e.g. http://localhost:5000) |
| `IMGBB_API_KEY` | ImgBB API key (used only on the server side) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

For Google login, add `http://localhost:3000/api/auth/callback/google` (and the same path on your live domain) as an authorized redirect URI in Google Cloud Console.

## ⚙️ Installation

```bash
git clone https://github.com/Roqibul19/salonbook-client.git
cd salonbook-client
npm install
```

Then create the `.env.local` file with the variables above.

## ▶️ How to Run Locally

1. Start the server first (see the [server repository](https://github.com/Roqibul19/salonbook-server)).
2. Run the client:

```bash
npm run dev
```

3. Open http://localhost:3000

For a production build:

```bash
npm run build
npm start
```

### Getting an admin account

Sign up normally, then run this from the **server** project:

```bash
npm run make-admin -- your-email@example.com
```

Sign in again and you will be taken to the Admin Dashboard.

### Test payment

Use Stripe test card `4242 4242 4242 4242` with any future expiry date and any CVC.
