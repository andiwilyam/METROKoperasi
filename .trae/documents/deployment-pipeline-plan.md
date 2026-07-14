# MetroCoop Deployment Pipeline Plan

## Current State Analysis

### ✅ Already Implemented
| Component | Status | Location |
|-----------|--------|----------|
| **Local Development** | ✅ Working | `npm run dev` (tsx server.ts) |
| **Local Build** | ✅ Working | `npm run build:railway` (Vite + esbuild) |
| **Database Migration** | ✅ Working | `npm run db:migrate` + `npm run db:seed` |
| **GitHub Actions CI** | ✅ Working | `.github/workflows/ci.yml` |
| **TypeCheck + Build Job** | ✅ Working | Runs on push/PR to main |
| **E2E Tests (Playwright)** | ✅ Working | With Postgres service, runs after build |
| **Dockerfile for Railway** | ✅ Working | Multi-stage build, healthcheck-first startup |
| **Railway Config** | ✅ Working | `railway.toml` with Dockerfile, healthcheck, restart policy |
| **Auto-deploy Railway** | ✅ Working | Connected to GitHub main branch |

### Current Flow
```
Local Development
    │
    ├─ npm run dev                    # Dev server (port 3000, Vite HMR)
    ├─ npm run build:railway          # Production build (Vite + esbuild)
    ├─ npm run db:migrate             # Apply schema.sql
    └─ npm run db:seed                # Apply seed.sql
           │
           ▼
Git Push → GitHub (main branch)
           │
           ├─► GitHub Actions CI (parallel)
           │    ├─ typecheck-build: TypeCheck + Build (10 min)
           │    └─ e2e-test: E2E with Postgres (15 min, needs typecheck-build)
           │
           ▼
Railway Auto-deploy (parallel, independent)
    │
    ├─ Build: Dockerfile → npm install → build:railway → start.sh
    ├─ Deploy: healthcheck /api/health → restart policy ON_FAILURE
    └─ Runtime: start.sh (debug server → real server → background DB migrate)
```

### ⚠️ Gaps / Risks
1. **CI and Railway run in parallel** — Railway may deploy broken code if CI fails
2. **No deployment gate** — Railway doesn't wait for CI success
3. **Environment drift** — Local `.env` vs GitHub Actions env vs Railway variables
4. **No promotion strategy** — No staging/preview environments
5. **No rollback automation** — Manual via Railway dashboard

---

## Proposed Improvements (Incremental)

### Phase 1: CI Gate for Railway (Immediate)
Add GitHub Actions deploy job that triggers Railway deploy **only after CI passes**.

**Option A: Railway CLI in GitHub Actions** (recommended)
```yaml
deploy-railway:
  needs: [typecheck-build, e2e-test]
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Deploy to Railway
      run: |
        npm install -g @railway/cli
        railway login --token ${{ secrets.RAILWAY_TOKEN }}
        railway up --service metrocoop-app
      env:
        RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

**Option B: Railway GitHub App** (simpler, native)
- Install Railway GitHub App → auto-deploys on push
- Configure "Wait for CI" in Railway dashboard

### Phase 2: Environment Parity (Short-term)
| Environment | DB | JWT_SECRET | CORS_ORIGIN | NODE_ENV |
|-------------|----|------------|-------------|----------|
| Local | Local PG / Docker | `.env` (dev) | `http://localhost:3000` | development |
| GitHub Actions | Service PG (CI) | `test-secret` | `http://localhost:3000` | production |
| Railway | Railway PG | **Secret** | **Railway domain** | production |

**Action**: Create `.env.production.example` with all required vars documented.

### Phase 3: Preview Deployments (Medium-term)
- GitHub Actions: Deploy PRs to Railway preview environments
- Use Railway's `railway environment create` + `railway up --environment preview-pr-123`

---

## Decision Required

### 🔴 High Impact — Choose One

**How should Railway deploy be gated by CI?**

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A. Railway CLI in GitHub Actions** | Add deploy job to `.github/workflows/ci.yml` that runs `railway up` after CI passes | Full control, visible in Actions, can use artifacts | Need RAILWAY_TOKEN secret, extra CI time |
| **B. Railway GitHub App (native)** | Install Railway GitHub App, configure "Deploy on CI success" in Railway dashboard | Native, no extra CI config, Railway manages it | Less visible in Actions, Railway UI dependency |
| **C. Current (parallel)** | Keep as-is: Railway auto-deploys on push, CI runs independently | Simple, fast feedback | Risk of broken deploy |

**Recommendation**: **Option A** — explicit, auditable, uses existing CI artifacts.

---

### 🟡 Medium Impact — Confirm

**Environment Variables Strategy**

| Question | Options |
|----------|---------|
| Where to store production secrets? | A) Railway dashboard (current) B) GitHub Environments + Secrets C) 1Password/External secret manager |
| Should local `.env` be committed? | A) No (current — `.env` in gitignore) B) Yes, `.env.example` committed with placeholders |
| Preview environments for PRs? | A) Yes, Railway preview per PR B) No, only main branch |

---

### 🟢 Low Impact — Nice to Have

- Add `deploy-preview` job for PRs
- Add Slack/Discord notification on deploy success/failure
- Add rollback workflow (`railway rollback`)

---

## Next Steps

Once decisions are made:
1. Update `.github/workflows/ci.yml` with deploy job (if Option A)
2. Add required secrets to GitHub (RAILWAY_TOKEN, etc.)
3. Document env var parity in `.env.production.example`
4. Test full flow: local → push → CI → Railway deploy
5. Optional: Add preview deployment for PRs

---

## Files to Modify (if Option A chosen)

| File | Change |
|------|--------|
| `.github/workflows/ci.yml` | Add `deploy-railway` job with `needs: [typecheck-build, e2e-test]` |
| GitHub repo settings | Add `RAILWAY_TOKEN` secret (Project → Settings → Secrets → Actions) |
| `railway.toml` | Optional: remove auto-deploy trigger, rely on CLI |

---

## Acceptance Criteria (Definition of Done)

- [ ] Push to main triggers CI
- [ ] CI passes (typecheck, build, e2e)
- [ ] **Only after CI passes**, Railway deploy triggers
- [ ] Railway deploy succeeds, healthcheck passes
- [ ] Production URL returns 200 on `/api/health`
- [ ] All 30+ API endpoints return data with camelCase fields
- [ ] Login works for admin/as admin/operator/anggota
- [ ] Rollback possible via `railway rollback` or dashboard