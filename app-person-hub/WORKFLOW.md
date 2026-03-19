# MyProj Workflow

## Overview
This repository hosts a multi-part application. The frontend codebase lives in `Frontend/`. Backend is planned but not yet implemented.

## Frontend
**Location:** `Frontend/`

### Install
```bash
cd Frontend
npm install
```

### Run (Dev)
```bash
npm run dev
```

### Build (Prod)
```bash
npm run build
```

### Mock API Workflow
- Calendar events are fetched from `src/modules/calendar/mock/googleEvents.json`.
- Local persistence uses `localStorage` key `calendar_events_v1`.
- API simulation lives in `src/modules/calendar/api/calendarApi.ts` (Promise + delay).

## Backend
**Status:** Placeholder (not yet implemented)
- Recommended location: `Backend/`
- Target: provide real Calendar/Events API to replace mock layer.

## Conventions
- Feature modules live under `Frontend/src/modules/`.
- Shared UI components live under `Frontend/src/components/shared/`.
- Global theme tokens live in `Frontend/src/index.css`.
- Update project documentation in `Frontend/docs/` after each sprint.
