# 🪨 Shilpa-Kala Showcase — National Heritage Digital Gallery

> *Connecting Ancient Art with the Modern Buyer*

A full-stack **Yarn Workspaces monorepo** powering three applications:

| Package | Tech | Purpose |
|---------|------|---------|
| `@shilpakala/backend` | Fastify + TypeScript | REST API |
| `@shilpakala/web` | React + Vite + TypeScript | Admin Web Dashboard |
| `@shilpakala/mobile` | React Native 0.74 | Buyer & Artist Mobile App |
| `@shilpakala/shared` | TypeScript | Shared types across all packages |

---

## 📁 Project Structure

```
shilpakala-new/
├── package.json               ← Yarn workspaces root
├── packages/
│   ├── shared/                ← Shared TypeScript interfaces
│   │   └── src/index.ts
│   ├── backend/               ← Fastify REST API (port 4000)
│   │   ├── src/
│   │   │   ├── server.ts
│   │   │   ├── models/data.ts ← In-memory seed data
│   │   │   └── routes/
│   │   │       ├── artists.ts
│   │   │       ├── artworks.ts
│   │   │       ├── wip.ts
│   │   │       ├── heritage.ts
│   │   │       └── inquiries.ts
│   ├── web/                   ← React Admin Dashboard (port 3000)
│   │   └── src/
│   │       ├── pages/
│   │       │   ├── Dashboard.tsx
│   │       │   ├── ArtworksPage.tsx   ← Gallery + zoom + WhatsApp
│   │       │   ├── ArtistsPage.tsx
│   │       │   ├── WipPage.tsx        ← Carving timeline
│   │       │   ├── HeritagePage.tsx   ← Heritage stories
│   │       │   └── InquiriesPage.tsx
│   └── mobile/                ← React Native App
│       └── src/
│           ├── screens/
│           │   ├── GalleryScreen.tsx        ← 20+ hi-res images
│           │   ├── ArtworkDetailScreen.tsx  ← Zoom + WhatsApp inquiry
│           │   ├── ArtistsScreen.tsx
│           │   ├── ArtistDetailScreen.tsx
│           │   ├── WipScreen.tsx            ← Stage timeline
│           │   ├── HeritageScreen.tsx
│           │   └── HeritageDetailScreen.tsx
│           ├── navigation/RootNavigator.tsx ← Bottom tabs + stacks
│           ├── api/index.ts
│           └── theme/index.ts               ← Design tokens
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- Yarn 1.22 (`npm install -g yarn`)
- For mobile: React Native CLI, Android Studio / Xcode

### 1 — Install all dependencies
```bash
yarn install
```

### 2 — Run the Backend API
```bash
yarn backend
# Fastify API starts at http://localhost:4000
```

### 3 — Run the Web Admin Dashboard
```bash
yarn web
# Vite dev server at http://localhost:3000
```

### 4 — Run the Mobile App
```bash
# Start Metro bundler
cd packages/mobile && yarn start

# Android (in a new terminal)
cd packages/mobile && yarn android

# iOS (macOS only)
cd packages/mobile && yarn ios
```

---

## 🌐 API Endpoints

Base URL: `http://localhost:4000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/artists` | List all artists |
| GET | `/api/artists/:id` | Artist detail |
| POST | `/api/artists` | Create artist |
| GET | `/api/artworks` | List artworks (filter: `?status=`, `?style=`, `?artistId=`) |
| GET | `/api/artworks/:id` | Artwork detail |
| GET | `/api/artworks/product/:productId` | Find by SKU |
| POST | `/api/artworks` | Create artwork |
| GET | `/api/wip?artworkId=` | WIP timeline stages |
| POST | `/api/wip` | Add WIP stage |
| GET | `/api/heritage` | Heritage stories list |
| GET | `/api/heritage/:id` | Story detail |
| GET | `/api/heritage/style/:style` | Find by style (Hoysala, Chalukya…) |
| POST | `/api/inquiries` | Submit inquiry → returns WhatsApp deep-link |
| GET | `/api/inquiries` | List inquiries (admin) |
| PATCH | `/api/inquiries/:id` | Update inquiry status |

---

## ✨ Features

### Mobile App
- 🖼️ **Premium Gallery** — LazyLoaded high-res images via `react-native-fast-image` (handles 20+)
- 🔍 **Pinch-to-Zoom** — Full-screen zoom via `react-native-image-zoom-viewer`
- ⚒️ **WIP Timeline** — Stage-by-stage carving journey (Raw Block → Complete)
- 💬 **WhatsApp Enquiry** — Pre-formatted message with Product ID, opens WhatsApp directly
- 🏛️ **Heritage Stories** — Hoysala, Chalukya, Dravidian tradition explained with gallery
- 🧑‍🎨 **Artist Profiles** — Verified craftsmen from Shivarapatna, Hampi, Mahabalipuram

### Web Admin
- 📊 **Dashboard** — Live stats (artists, artworks, new inquiries)
- 🗂️ **Artworks** — Filter by status, click for detail + image zoom + WhatsApp link
- 👥 **Artists** — Verified craftsmen cards
- 📅 **WIP Timeline** — Per-artwork carving stage view
- 📖 **Heritage** — Full heritage story editor view  
- 📬 **Inquiries** — CRM table to track & manage buyer inquiries

---

## 🎨 Design Language

| Token | Value |
|-------|-------|
| Background | `#FAF8F4` (Warm Cream) |
| Text | `#1A1208` (Deep Ink) |
| Accent | `#B8860B` (Dark Gold) |
| Muted | `#6B6560` |
| Font (headings) | Georgia / Playfair Display (serif) |
| Font (body) | Inter / System |

---

## 🏆 How Success Criteria Are Met

| Criteria | Implementation |
|----------|----------------|
| 20+ hi-res images without slowdown | `react-native-fast-image` with priority queuing + lazy loading in `FlatList` |
| Inquiry button includes Product ID | WhatsApp URL includes `SKU-XXX-000` in pre-formatted message |
| Premium art gallery UI | Minimalist cream/gold/ink palette, serif headings, clean card layout |
| Zoom feature | `react-native-image-zoom-viewer` (mobile), custom zoom overlay (web) |
| WhatsApp integration | Deep-link `https://wa.me/{number}?text={encoded}` via `Linking.openURL` |

---

## 📦 Tech Stack

| Layer | Library | Version |
|-------|---------|---------|
| API | Fastify | ^4.28 |
| Web UI | React + Vite | ^18 / ^5 |
| Mobile | React Native | 0.74 |
| State/Cache | TanStack Query | ^5 |
| Navigation | React Navigation | ^6 |
| Images (RN) | react-native-fast-image | ^8 |
| Zoom (RN) | react-native-image-zoom-viewer | ^3 |
| Types | TypeScript | ^5.4 |
| Monorepo | Yarn Workspaces | 1.22 |

---

*Made with ❤️ to preserve India's living stone-carving heritage.*

