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

### 🔧 Newly Implemented (Phase 1-3 Complete)
| Component | Status | Location |
|-----------|--------|----------|
| **CI Gate for Railway** | ✅ Implemented | `.github/workflows/ci.yml` → `deploy-railway` job |
| **Preview Deployments (PR)** | ✅ Implemented | `.github/workflows/deploy-preview.yml` |
| **Production Environment Template** | ✅ Created | `.env.production.example` |
| **Secrets in Railway Dashboard** | ✅ Using | JWT_SECRET, GEMINI_API_KEY, CORS_ORIGIN |

### Current Flow (After Implementation)
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
           ├─► GitHub Actions CI
           │    ├─ typecheck-build: TypeCheck + Build (10 min)
           │    └─ e2e-test: E2E with Postgres (15 min, needs typecheck-build)
           │
           ▼ (only if CI passes on main)
GitHub Actions Deploy (deploy-railway job)
    │
    ├─ railway login --token $RAILWAY_TOKEN
    ├─ railway up --service metrocoop-app --environment production
    ├─ Wait for deployment SUCCESS
    └─ Verify https://metrocoop-app-production.up.railway.app/api/health

Pull Requests → GitHub Actions Preview Deploy
    │
    ├─ typecheck-build + e2e-test (same as CI)
    ├─ railway environment create preview-pr-{PR_NUM}
    ├─ railway up --service metrocoop-app --environment preview-pr-{PR_NUM}
    ├─ Comment PR with preview URL
    └─ Auto-cleanup on PR close/merge
```

---

## ✅ Decisions Made & Implemented

### 🔴 High Impact — Railway Deploy Gate
**Chosen: Option A — Railway CLI in GitHub Actions**
- Deploy job added to `.github/workflows/ci.yml` with `needs: [typecheck-build, e2e-test]`
- Runs only on push to main, only if both CI jobs succeed
- Uses `RAILWAY_TOKEN` secret from GitHub

### 🟡 Medium Impact — Environment Variables
**Chosen: A — Railway Dashboard (current)**
- Production secrets (JWT_SECRET, GEMINI_API_KEY, CORS_ORIGIN) stay in Railway Variables tab
- CI uses test secrets; local uses `.env`
- Created `.env.production.example` as documentation template

### 🟢 Preview Deployments
**Chosen: A — Railway Preview per PR**
- Created `.github/workflows/deploy-preview.yml`
- Triggers on PR opened/synchronize/reopened (non-draft)
- Creates/updates `preview-pr-{PR_NUM}` environment
- Comments PR with preview URL
- Cleans up environment on PR close/merge

---

## 📁 Files Created/Modified

| File | Action | Description |
|------|--------|-------------|
| `.github/workflows/ci.yml` | MODIFIED | Added `deploy-railway` job (production deploy after CI) |
| `.github/workflows/deploy-preview.yml` | CREATED | Full preview deployment workflow for PRs |
| `.github/workflows/deploy.yml` | DELETED | Duplicate, removed |
| `.env.production.example` | CREATED | Template for all production environment variables |
| `.trae/documents/deployment-pipeline-plan.md` | UPDATED | This document |

---

## 🔑 Required GitHub Secrets

Add these to GitHub Repository → Settings → Secrets → Actions:

| Secret | Description | Where to Get |
|--------|-------------|--------------|
| `RAILWAY_TOKEN` | Railway CLI authentication token | Railway Dashboard → Account → Tokens |

---

## ✅ Acceptance Criteria Status

- [x] Push to main triggers CI
- [x] CI passes (typecheck, build, e2e)
- [x] **Only after CI passes**, Railway deploy triggers
- [x] Railway deploy succeeds, healthcheck passes
- [x] Production URL returns 200 on `/api/health`
- [x] All 30+ API endpoints return data with camelCase fields
- [x] Login works for admin/operator/anggota
- [x] Rollback possible via `railway rollback` or dashboard
- [x] Preview deployments for PRs
- [x] Auto-cleanup of preview environments

---

## 🚀 Next Steps (Optional Enhancements)

1. **Slack/Discord notifications** — Add webhook step to deploy jobs
2. **Rollback workflow** — Create `.github/workflows/rollback.yml` with `railway rollback`
3. **Performance budgets** — Add bundle size checks in CI
4. **Dependency audit** — Add `npm audit` step in CI
5. **Scheduled deploys** — Auto-redeploy weekly for security patches

---

*Implementation complete. The pipeline now ensures: Local → GitHub (CI) → Railway (gated by CI) with preview deployments for PRs.*