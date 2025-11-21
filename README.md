# 🏨 Restaurant-Hotel ERP System

**Project Based Learning (PBL6): The Management of Chain Restaurant-Hotel**

A comprehensive ERP (Enterprise Resource Planning) system for managing restaurant and hotel operations, including reservations, guest management, room management, restaurant services, employee management, and financial operations.

[![CI/CD Pipeline](https://github.com/TVinhNguyen/restaurant-hotel-erp/actions/workflows/ci.yml/badge.svg)](https://github.com/TVinhNguyen/restaurant-hotel-erp/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Team](#team)

---

## ✨ Features

### Guest & Reservation Management

- 📅 **Online Booking System**: Customers can book rooms/tables online
- 👤 **Guest Profile Management**: Track guest information, preferences, and history
- 🏷️ **Reservation Management**: Create, modify, and cancel reservations
- 💳 **Payment Processing**: Multiple payment methods with secure transaction handling

### Property Management (PMS)

- 🏨 **Multi-Property Support**: Manage multiple hotel/restaurant locations
- 🛏️ **Room Management**: Room types, availability, pricing, and housekeeping status
- 📊 **Rate Plans**: Dynamic pricing strategies and seasonal rates
- 🎁 **Promotions**: Discount codes and special offers

### Human Resources

- 👥 **Employee Management**: Employee profiles, positions, and departments
- ⏰ **Attendance Tracking**: Clock in/out system with shift management
- 💰 **Payroll**: Salary calculation with deductions and overtimes
- 📅 **Leave Management**: Leave requests and approval workflow

---

## 🏗️ Architecture

```
Frontend (Next.js) ──┐
                     ├──> Backend API (NestJS) ──> PostgreSQL
Admin (Refine) ──────┘                         └──> Redis Cache
```

---

## 🛠️ Technology Stack

- **Backend**: NestJS v11 + TypeScript + TypeORM
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Admin**: Refine + Next.js 15
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Messaging**: RabbitMQ 3
- **Infrastructure**: Docker + Docker Compose

---

## 🚀 Getting Started

### Prerequisites

- Node.js v20+
- pnpm v9+
- Docker & Docker Compose
- PostgreSQL 16 (if not using Docker)

### Installation

```bash
# Clone repository
git clone https://github.com/TVinhNguyen/restaurant-hotel-erp.git
cd restaurant-hotel-erp

# Start infrastructure services (Postgres, Redis, RabbitMQ)
docker-compose -f infra/compose.yaml up -d

# Install all app dependencies via pnpm workspace
pnpm install

# Start dev servers as needed
pnpm dev:backend      # http://localhost:4000
pnpm dev:frontend     # http://localhost:3001
pnpm dev:admin        # http://localhost:3000
```

### Workspace Scripts

| Command                                                     | Description                                                      |
| ----------------------------------------------------------- | ---------------------------------------------------------------- |
| `pnpm dev:backend` / `pnpm dev:frontend` / `pnpm dev:admin` | Start an individual app in watch mode                            |
| `pnpm build`                                                | Build backend, frontend, admin, and shared packages sequentially |
| `pnpm lint`                                                 | Run ESLint across all workspaces (serialized for stable output)  |
| `pnpm test`                                                 | Execute available unit tests in every workspace                  |
| `pnpm test:e2e` (from `backend/`)                           | Run backend e2e test suite (health endpoints)                    |

### Access Applications

- **Frontend**: http://localhost:3001
- **Admin Panel**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Docs**: http://localhost:4000/api/docs

### Messaging & Async Events

- RabbitMQ connection string is configured via `RABBITMQ_URL` (see `backend/.env.example`).
- `MessagingService` publishes reservation lifecycle events to durable queues:
  - `reservation.confirmed`
  - `reservation.checked_in`
  - `reservation.checked_out`
  - `reservation.cancelled`
- Health endpoint now reports RabbitMQ status at `/api/v1/health` for better observability.

---

## 👥 Team

**Da Nang University of Science and Technology - PBL6**

| Name              | Role                 | GitHub                                         |
| ----------------- | -------------------- | ---------------------------------------------- |
| Le Khiet Dan      | Team Lead / Backend  | [@lekietdan](https://github.com/lekietdan)     |
| Nguyen Thanh Vinh | Full-stack Developer | [@TVinhNguyen](https://github.com/TVinhNguyen) |
| Nguyen Khanh Huy  | Frontend Developer   | [@nk-huy](https://github.com/nk-huy)           |
| Dang Toan Quoc    | Backend Developer    | [@dtquoc](https://github.com/dtquoc)           |
| Ho Xuan Huy       | Database Designer    | [@hxhuy](https://github.com/hxhuy)             |

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file

---

**Last Updated:** November 15, 2025
