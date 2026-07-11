# MetroMitra - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js v24+ 
- PostgreSQL 16 (already installed)
- npm v11+

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
File: `.env` (already created)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=metromitra
DB_USER=postgres
DB_PASS=postgres
JWT_SECRET=metromitra-dev-secret-2026
PORT=3000
GEMINI_API_KEY=          # Optional: Add your Gemini API key for AI audit
```

### Step 3: Start Development Server
```bash
npm run dev
```
Server will run on: http://localhost:3000

### Step 4: Login
Open http://localhost:3000 and login with:
- **Admin**: username `admin`, password `admin123`
- **Member**: username `1234567890`, password `123456`

---

## 📊 Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (Vite + Express) |
| `npm run build:all` | Build frontend + backend for production |
| `npm run start` | Run production build |
| `npm run lint` | Check TypeScript types |
| `npm run test` | Run test suite |
| `npm run test:watch` | Watch mode for tests |
| `npm run db:migrate` | Setup database schema & seed |
| `npm run db:seed` | Re-seed initial data |
| `npm run clean` | Remove build artifacts |

---

## 🗄️ Database

### Connection Details
- **Host**: localhost:5432
- **Database**: metromitra
- **User**: postgres
- **Password**: postgres

### Schema
34 tables covering:
- Members & administration
- Savings & loans
- Accounting (journal entries)
- Shop & inventory
- Venture investments
- Support tickets & announcements

### Seed Data
- 5 members with realistic data
- 3 loans (various states)
- 4 venture investments
- Sample transactions across all modules

---

## 🏗️ Project Structure

```
src/
├── components/          # React components (UI)
├── stores/             # Zustand stores (state + API)
├── lib/                # Utilities (API client)
└── __tests__/          # Unit tests

server/
├── routes/             # REST API endpoints (40+)
├── middleware.ts       # JWT authentication
├── db.ts               # Database connection
└── migrate.ts          # Schema initialization

db/
├── schema.sql          # Table definitions
└── seed.sql            # Initial data
```

---

## 🔐 Authentication

### Login Flow
1. POST `/api/auth/login` with username & password
2. Receive JWT token (valid 24 hours)
3. Include token in `Authorization: Bearer <token>` header
4. Token automatically managed by `authStore`

### User Roles
- **Admin**: Full system access
- **Operator**: Operational staff (approvals, transactions)
- **Member**: Limited to own data

---

## 📡 API Usage

### Example: Create Savings Transaction
```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Response: {"token":"eyJhb...", "user":{...}}

# 2. Create transaction
curl -X POST http://localhost:3000/api/data/simpanan-transaksi \
  -H "Authorization: Bearer eyJhb..." \
  -H "Content-Type: application/json" \
  -d '{
    "anggotaId":"m1",
    "anggotaNama":"Marmad Tuaian",
    "jenisSimpananId":"js3",
    "jenisNama":"Simpanan Sukarela",
    "tipe":"setor",
    "jumlah":500000,
    "keterangan":"Test transaction"
  }'
```

---

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Test Coverage
- User role validation
- Loan status workflows
- Financial calculations
- State management

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Check PostgreSQL is running
Get-Service | Where-Object {$_.Name -like "*postgres*"}
```

### Database connection failed
```bash
# Verify PostgreSQL credentials
$env:PGPASSWORD = "postgres"
psql -U postgres -d metromitra -c "SELECT 1"
```

### TypeScript errors
```bash
# Run type checker
npm run lint

# Build frontend only (for debugging)
npm run build
```

---

## 📈 Key Features

✅ **Member Management** - Add, edit, manage cooperative members  
✅ **Savings Accounts** - Track deposits in 4 account types  
✅ **Loan System** - Full lifecycle: application → approval → repayment  
✅ **Accounting** - Double-entry journal system (SAK ETAP compliant)  
✅ **Venture Capital** - Track equity investments & dividends  
✅ **Point of Sale** - Retail shop inventory & sales  
✅ **Digital Payments** - PPOB services & virtual accounts  
✅ **AI Audit** - Powered by Google Gemini  

---

## 📞 Support

**Issues or questions?**
- Check `REFACTORING_SUMMARY.md` for detailed architecture
- Review API endpoints in `server/routes/data.ts`
- Check database schema in `db/schema.sql`
- Run tests: `npm run test`

---

**Happy coding! 🎉**
