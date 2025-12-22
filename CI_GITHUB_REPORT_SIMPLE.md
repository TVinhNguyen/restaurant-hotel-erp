# 📊 GitHub CI Pipeline - Báo Cáo Tổng Quan

**Ngày tạo:** December 23, 2025  
**Repository:** TVinhNguyen/restaurant-hotel-erp  
**File config:** `.github/workflows/ci.yml`

---

## 🎯 Mục đích CI Pipeline

```
Code Push/PR → GitHub Actions → Auto Build → Auto Test → Report Result
     ↓                              ↓
Trên main/dev            Tự động kiểm tra chất lượng
                         Phát hiện lỗi sớm
```

**Tóm lại:** Mỗi khi push code lên `main` hoặc `dev` (hoặc mở PR), GitHub tự động:
- ✅ Build code
- ✅ Chạy test
- ✅ Kiểm tra lint
- ✅ Report kết quả

---

## 🏗️ Kiến trúc Pipeline

### Trigger (Kích hoạt)

```
Event:
  ├─ push → branch main/dev
  ├─ push → branch feature/* (vào main/dev)
  └─ pull_request → tới main/dev
  
→ Tự động chạy CI Pipeline
```

### Jobs (Công việc song song)

```
┌─────────────────────────────────────────────────────┐
│              GitHub Actions CI Pipeline             │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Job 1: Backend        Job 2: Frontend   Job 3: Admin
│  (NestJS)             (Next.js)          (Next.js)
│  ├─ Setup Node v20    ├─ Setup Node v20 ├─ Setup Node v20
│  ├─ Install deps      ├─ Install deps   ├─ Install deps
│  ├─ Lint code         ├─ Lint code      ├─ Lint code
│  ├─ Build             ├─ Build          ├─ Build
│  └─ Run Tests         └─ (No tests)     └─ (No tests)
│                                                      │
│  Environment:         Environment:     Environment: │
│  ├─ PostgreSQL 16     (No DB/service)  (No DB/service)
│  └─ Redis 7                                          │
│                                                      │
└─────────────────────────────────────────────────────┘
     ↓                  ↓                   ↓
  ~5 min            ~3 min              ~3 min
  
Total: ~7-11 min (chạy song song)
```

---

## 📋 Chi tiết từng Job

### Job 1: Backend (NestJS)

**Mục đích:** Kiểm tra API server có build & test được không

**Các bước:**

```
1. CHECKOUT CODE
   → Clone repository

2. SETUP NODE.JS v20
   → Cài đặt Node.js
   → Setup npm cache

3. INSTALL DEPENDENCIES
   → npm ci (install from package-lock.json)

4. LINT CODE
   → npm run lint
   → Kiểm tra cú pháp, code style
   → ❌ FAIL nếu có lỗi ESLint

5. BUILD PROJECT
   → npm run build
   → Biên dịch TypeScript → JavaScript
   → ❌ FAIL nếu compile error

6. RUN TESTS
   → npm test -- --ci --watchAll=false
   → Chạy jest tests
   → ❌ FAIL nếu test fail
```

**Services:** PostgreSQL + Redis (tự động chạy)

```
PostgreSQL:
├─ Image: postgres:16
├─ Port: 5432
├─ Health check: pg_isready (mỗi 10s)
└─ Auto cleanup sau test

Redis:
├─ Image: redis:7
├─ Port: 6379
├─ Health check: redis-cli ping
└─ Auto cleanup
```

**Thời gian:** ~3-5 phút (setup DB + tests)

---

### Job 2: Frontend (Next.js)

**Mục đích:** Kiểm tra Customer Frontend có build được không

**Các bước:**

```
1. CHECKOUT CODE → Clone repo

2. SETUP NODE.JS v20 → Cài Node

3. INSTALL DEPENDENCIES → npm ci

4. REBUILD TAILWIND → npm rebuild @tailwindcss/oxide
   → Vì Next.js + Tailwind CSS cần compile

5. LINT CODE → npm run lint
   → ❌ FAIL nếu lỗi

6. BUILD PROJECT → npm run build
   → Build static assets cho Next.js
   → ❌ FAIL nếu error
```

**Services:** Không cần (không có DB/API)

**Thời gian:** ~2-3 phút

---

### Job 3: Admin Panel (Next.js + NextAuth)

**Mục đích:** Kiểm tra Admin Dashboard có build được không

**Các bước:**

```
1. CHECKOUT CODE

2. SETUP NODE.JS v20

3. INSTALL DEPENDENCIES

4. LINT CODE → npm run lint

5. BUILD PROJECT → npm run build
   → Build next.js + NextAuth
```

**Services:** Không cần

**Thời gian:** ~2-3 phút

---

## 🔄 CI Workflow (Chi tiết)

### Step-by-step khi developer push code

```
Developer                 GitHub                 GitHub Actions
    │                       │                           │
    ├─ git push code ──────→ │                          │
    │                       │                          │
    │                       ├─ Trigger workflow ──────→ │
    │                       │                          │
    │                       │  ┌─ Job 1: Backend ────→ │
    │                       │  │  ├─ Checkout        │
    │                       │  │  ├─ Setup Node      │
    │                       │  │  ├─ Lint             │
    │                       │  │  ├─ Build            │
    │                       │  │  └─ Test  (5 min)    │
    │                       │  │                       │
    │                       │  ├─ Job 2: Frontend ──→ │
    │                       │  │  ├─ Checkout        │
    │                       │  │  ├─ Setup Node      │
    │                       │  │  ├─ Lint             │
    │                       │  │  └─ Build  (3 min)   │
    │                       │  │                       │
    │                       │  └─ Job 3: Admin ─────→ │
    │                       │     ├─ Checkout        │
    │                       │     ├─ Setup Node      │
    │                       │     ├─ Lint             │
    │                       │     └─ Build  (3 min)   │
    │                       │                          │
    │          Wait (7-11 min)                         │
    │                       │                          │
    │                       │ ✅ All Pass              │
    │← Report Status ──────┤←──────────────────────────│
    │  (Green badge)       │                          │
    │                       │
    └─ git merge ──────────→ DONE!
```

---

## ✅ CI Pass vs ❌ CI Fail

### ✅ CI PASS (Green)

```
Meaning:
├─ Backend: Lint ✓ Build ✓ Test ✓
├─ Frontend: Lint ✓ Build ✓
└─ Admin: Lint ✓ Build ✓

Effect:
├─ PR chỉnh sửa nhận badge ✅
├─ Có thể merge vào main/dev
├─ Code quality đảm bảo
└─ Safe để deploy lên production
```

**Badge:** ![CI/CD Pipeline](https://img.shields.io/badge/CI-Pass-green)

---

### ❌ CI FAIL (Red)

```
Meaning: Bất cứ job nào fail

Examples:
├─ Backend test 3 cases fail
├─ Frontend lint error (wrong indentation)
└─ Admin build error (import not found)

Effect:
├─ PR nhận badge ❌
├─ KHÔNG thể merge
├─ Developer phải fix bugs
├─ Push fix lại → CI re-run
└─ Lặp lại đến khi pass
```

**Badge:** ![CI/CD Pipeline](https://img.shields.io/badge/CI-Fail-red)

---

## 🔍 Điều gì được kiểm tra

### Lint (ESLint)

```
✓ Cú pháp TypeScript/JavaScript hợp lệ
✓ Indentation đúng
✓ Không có unused variables
✓ Không có console.log trong code
✓ Code style nhất quán (semicolon, quotes, etc)

Hỏi: "Code có viết đúng format không?"
```

### Build (Compile)

```
✓ TypeScript compile thành JavaScript
✓ Bundle dependencies
✓ Resolve import paths
✓ Process assets

Hỏi: "Code có chạy được không?"
```

### Test (Jest)

```
✓ Unit tests pass
✓ Integration tests pass
✓ Coverage >= threshold

Hỏi: "Tính năng có hoạt động đúng không?"
```

---

## 📊 Cache Strategy (Tối ưu)

### npm Cache

```
Behavior:
├─ First run: Download 200MB packages → 3 min
├─ Next run: Load from cache → 30s
└─ TTL: 5-7 ngày (auto expire)

Config:
├─ cache: npm
└─ cache-dependency-path: package-lock.json

Effect: Tăng tốc CI lên 10x
```

### Docker Cache

```
CI dùng GitHub's runner cache
  → Fast execution

Docker prod dùng volume cache
  → Consistent across deploys
```

---

## ⏱️ Thời gian thực hiện

| Job | Setup | Main | Total |
|-----|-------|------|-------|
| Backend | 2 min | 3 min | 5 min |
| Frontend | 2 min | 1 min | 3 min |
| Admin | 2 min | 1 min | 3 min |
| **Parallel** | | | **5 min** |
| **Sequential** | | | **11 min** |

**Thực tế:** Chạy song song, tổng ~7-11 phút

---

## 🚨 Lỗi phổ biến

### ❌ Problem 1: npm ci fails
```
Error: Cannot find module 'xyz'

Nguyên nhân:
├─ package-lock.json cũ/không sync
└─ Dependencies không được install đúng

Fix:
├─ npm install → update package-lock.json
└─ Push lại
```

### ❌ Problem 2: PostgreSQL health check timeout
```
Error: pg_isready failed

Nguyên nhân:
├─ PostgreSQL startup quá lâu
└─ Image pull timeout

Fix:
├─ Tăng timeout từ 5s → 10s
└─ Hoặc setup retry
```

### ❌ Problem 3: Test timeout
```
Error: Test timeout after 5000ms

Nguyên nhân:
├─ Database query quá chậm
└─ Network issue

Fix:
├─ Tăng jest timeout
└─ Optimize query
```

### ❌ Problem 4: Lint error
```
Error: Unexpected console statement

Nguyên nhân:
├─ console.log() left in code
└─ Code style không match

Fix:
├─ Remove console.log
└─ Run: npm run lint -- --fix
```

---

## 💡 Best Practices

### ✅ DO

```
1. Commit thường xuyên
   → Phát hiện lỗi sớm

2. Chạy CI locally trước push
   → npm run lint
   → npm run build
   → npm test

3. Cập nhật dependencies
   → npm update
   → npm audit fix

4. Viết meaningful commit messages
   → "Fix: database connection timeout"

5. Review CI logs kỹ
   → Xem error message rõ

6. Giữ branch dev clean
   → Không commit debug code
```

### ❌ DON'T

```
1. Push code khi local test fail
   → Sẽ làm team khó chịu

2. Commit console.log() / debugger
   → Sẽ bị lint fail

3. Ignore lint warnings
   → Nợ technical debt

4. Có quá nhiều breaking changes
   → Khó merge & test

5. Để CI chạy quá lâu (>20 min)
   → Cần optimize
```

---

## 🔧 Cấu hình Chi tiết

### File: `.github/workflows/ci.yml`

**Trigger points:**
```yaml
on:
  push:
    branches: [main, dev]      # Khi push vào main/dev
  pull_request:
    branches: [main, dev]      # Khi mở PR tới main/dev
```

**Node version:**
```yaml
node-version: 20  # LTS version
```

**Services (Backend job):**
```yaml
services:
  postgres:
    image: postgres:16
  redis:
    image: redis:7
```

---

## 📈 Metrics

### Current Setup

```
Jobs: 3 (Backend, Frontend, Admin)
Parallel: Yes
Frequency: Per push + Per PR
Total time: 7-11 min
Cache enabled: Yes (npm)
```

### Nếu thêm monitoring

```
- Code coverage reports
- Security scanning (npm audit)
- Performance testing
- E2E tests
- Deploy staging (if dev passed)
```

---

## 🎯 Status Badge

**Embed trong README.md:**

```markdown
[![CI/CD Pipeline](https://github.com/TVinhNguyen/restaurant-hotel-erp/actions/workflows/ci.yml/badge.svg)](https://github.com/TVinhNguyen/restaurant-hotel-erp/actions)
```

**Hiển thị:**
- 🟢 Green: CI Pass
- 🔴 Red: CI Fail
- 🟡 Yellow: Running

---

## 📱 Workflow trong team

```
Developer Flow:

1. Create branch
   git checkout -b feature/new-feature

2. Code & commit
   git add .
   git commit -m "feat: add new feature"

3. Push & create PR
   git push origin feature/new-feature
   → Open PR on GitHub

4. CI runs automatically
   → 7-11 min

5. Result:
   ✅ PASS → Ready for review
   ❌ FAIL → Fix errors → Push again

6. Code review
   → Reviewer checks code

7. Merge
   git merge --squash feature/new-feature
   → Merges to main/dev

8. Auto-deploy (if configured)
   → Deploy to staging/production
```

---

## 🔗 Tài liệu

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Jest Testing](https://jestjs.io/)
- [ESLint](https://eslint.org/)
- [NestJS CI/CD](https://docs.nestjs.com/deployment/continuous-integration)
- [Next.js Build](https://nextjs.org/docs/deployment)

---

## 📞 Debugging CI

**View detailed logs:**

```
GitHub → Actions tab → Click workflow → Click job → Expand step
```

**Run locally:**

```bash
# Backend
cd backend
npm ci
npm run lint
npm run build
npm test

# Frontend
cd frontend
npm ci
npm run build

# Admin
cd admin
npm ci
npm run build
```

**Re-run failed CI:**

```
GitHub → Actions → Click failed workflow → "Re-run failed jobs"
```

---

**End of CI Report**
