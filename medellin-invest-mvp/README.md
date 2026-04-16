# Medellín Invest — Phase 1 MVP

> The mobile app for discovering and analyzing real estate investments in Medellín.

This is a **UI-first MVP** built with React Native + Expo + TypeScript. The
entire app is wired to a mock service layer with realistic Medellín sample
data, so it's immediately demoable end-to-end without any backend.

## Highlights

- **Investor-focused UX** — every listing surfaces ROI, cap rate, and
  short- vs. long-term rental potential at a glance.
- **Live ROI calculator** — pure utility in `utils/roi.ts` powers a calculator
  UI that updates as you change nightly rate, occupancy, financing, etc.
- **Premium proptech design system** — neutral palette with a navy primary and
  warm gold accent, consistent spacing/radius/shadow tokens.
- **Mock service layer** — `services/mock/index.ts` mimics an async API.
  Swap implementations for real network calls without changing screens.

## Stack

- React Native + Expo (SDK 51)
- TypeScript
- Expo Router (typed routes)
- React Hook Form + Zod (listing validation)
- Zustand (favorites & auth state)
- @expo/vector-icons (Ionicons)
- expo-image (image rendering)

## Folder structure

```
app/                       expo-router screens
  (tabs)/                  Home, Explore, Map, Favorites, Profile
  property/[id].tsx        Property detail
  auth/                    login, signup, forgot-password
  listings/                create (multi-step), edit
  dashboard/               buyer, broker

components/
  ui/                      Screen, Card, Text, PrimaryButton, MetricBadge, …
  property/                PropertyCard, FeaturedPropertyCard, Carousel, …
  roi/                     ROICalculator, ROIStatsCard, ROIComparisonCard, …
  map/                     MapPlaceholder
  forms/                   FormInput, FormSelect, FormToggle, FilterSheet, SortSheet
  layout/                  DashboardHeader

features/
  listings/                schema.ts (zod) for create-listing flow

services/
  mock/                    properties, users, async service stubs

hooks/                     useProperties, useProperty
store/                     favorites, auth (Zustand)
utils/                     roi.ts (pure ROI math), format.ts
constants/                 neighborhoods, propertyTypes, amenities
types/                     Property, Broker, User, Inquiry, …
theme/                     colors, spacing, typography
```

## Phase 1 scope (built)

- [x] App structure & navigation (tabs + stack)
- [x] Reusable component library
- [x] Mock data layer (12 realistic Medellín listings)
- [x] Mock service layer (filter, sort, search, similar, top ROI)
- [x] Home, Explore, Map, Favorites, Profile screens
- [x] Property detail with carousel, amenities, ROI calculator, broker contact
- [x] Buyer + Broker dashboards
- [x] Add Listing 6-step form (validated with zod)
- [x] Edit Listing screen
- [x] Login / Signup / Forgot password (UI only)
- [x] Loading, empty, and error states throughout

## Phase 1 — explicitly **not** built (deferred to later phases)

- Real backend / database
- Real authentication
- Payments
- Push notifications
- Live maps API integration (we ship a polished map placeholder for now)

## Getting started

### Fastest: test on your phone via Expo Go (no Apple account needed)

1. Install **Expo Go** from the [App Store](https://apps.apple.com/app/expo-go/id982107779)
   or [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent).
2. From this folder:
   ```bash
   cd medellin-invest-mvp
   npm install
   npx expo start
   ```
3. Scan the QR code printed in the terminal with Expo Go (Android) or the
   Camera app (iOS). The app boots in seconds — every screen, the ROI
   calculator, and the multi-step listing flow are demoable end-to-end.

> **Why no Apple account?** Expo Go is a host app already on the App Store.
> Your JS bundle runs inside it, so you skip provisioning, signing, and
> TestFlight entirely. All deps in this MVP are Expo Go-compatible.

### Other run targets

```bash
npx expo start
# then press:
#   i — iOS simulator (requires Xcode)
#   a — Android emulator (requires Android Studio)
#   w — web preview in the browser
```

### Type-checking

```bash
npm run typecheck
```

## Demoing the app

1. Launch the app — you start signed in as a buyer (mocked).
2. **Home** — featured listings, neighborhoods carousel, top ROI section,
   short-term opportunities, broker CTA.
3. **Explore** — search, filters (price, neighborhood, type, beds, ROI, etc.),
   sort sheet, "load more" pagination, pull-to-refresh.
4. **Map** — interactive map preview with price markers and a bottom-sheet
   listing preview.
5. **Favorites** — saved portfolio summary (total value, avg ROI).
6. **Profile** → **Buyer dashboard** — saved properties, ROI snapshot,
   inquiry history.
7. **Profile** → **Broker dashboard** — listings, leads, KPIs, "Add listing".
8. **Add listing** — 6-step flow with zod validation and a final review card.
9. **Property detail** — open any listing to see the full carousel, amenities,
   broker card with WhatsApp/call buttons, and the live ROI calculator.

## Notes on the mock layer

All async operations resolve via `setTimeout`-backed promises in
`services/mock/index.ts`. When the real backend lands, replace the bodies of
`propertiesService.list`, `byId`, `featured`, etc. with `fetch` calls — the
screens consuming them stay the same.

Property images are served from `picsum.photos` for stable, recognizable
placeholders. Avatars are served from `i.pravatar.cc`.

## ROI calculator

The pure ROI math lives in `utils/roi.ts`:

- `calculateROI(inputs)` returns gross/net for both short- and long-term
  strategies, picks the best, and computes cap rate, cash-on-cash return,
  payback years, and mortgage payment.
- `defaultInputsFromProperty(p)` seeds the calculator from any listing.
- `monthlyMortgage(loan, rate, years)` is broken out and reusable.

UI:

- `ROIStatsCard` — at-a-glance stats grid (cap rate, cash-on-cash, monthly
  net, annual net, payback, cash invested).
- `ROIComparisonCard` — short-term vs. long-term side-by-side with a "BEST"
  indicator.
- `InvestmentSummaryCard` — compact pill at the top of the property detail.
- `ROICalculator` — full interactive form combining all of the above.

A disclaimer is shown wherever live calculations appear.
