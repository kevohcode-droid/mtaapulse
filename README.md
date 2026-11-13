# MtaaPulse

MtaaPulse is a civic reporting platform scaffold. The current frontend is a responsive React, TypeScript, and Vite implementation of the citizen-facing community overview visible in the shared Figma preview.

## Project inspection and implementation plan

The repository initially contained only its README, empty `frontend/` and `backend/` directories, and placeholder documentation/database/test directories. It had no frontend framework, package manifest, routes, backend services, API contracts, authentication, or data models to preserve.

Implementation plan:

1. Establish the client in the existing `frontend/` directory using React, TypeScript, and Vite; do not introduce backend behavior that the repository cannot support.
2. Reproduce the accessible Figma preview’s visual system and dashboard layout: sage canvas, dark-green navigation and impact panel, coral action color, statistics, neighborhood map, nearby reports, and activity timeline.
3. Implement navigation, search, report filtering/pagination, map/list views, report details, notifications/profile menus, responsive layouts, and an accessible report submission dialog.
4. Isolate sample reports and browser-only persistence in `frontend/src/data.ts`. Clearly identify all sample metrics and mock behavior in the interface.
5. Connect to real civic APIs only after API, authentication, authorization, and upload contracts are added to this repository; document the required integration points.
6. Build and manually verify the UI at desktop and mobile widths.

The Figma URL’s share thumbnail was accessible and used as the visual reference. The interactive Figma editor and its other screens were not accessible during implementation; the screenshot therefore does not verify pages beyond the overview shown in that preview.

## Run the frontend

```sh
cd frontend
npm install
npm run dev
```

Create a production build with:

```sh
cd frontend
npm run build
```

## Current functionality and integration boundary

- The overview, reports, live map/list, community, insights, and settings views are included.
- Search, report category/status filters, pagination, report detail/activity dialogs, responsive navigation, photo previews, and browser geolocation are interactive.
- New reports and up to three small image files are saved in the current browser’s `localStorage`. Existing seeded reports and dashboard KPI values are explicitly illustrative; they are not civic-service data.
- The map is a stylized, illustrative neighborhood map. It is not geocoded, navigable, or connected to a map provider.
- No backend, API, database, authentication/registration, administrator permissions, department assignment, real status updates, server-side file upload, or live notification/weather service exists in this repository. These must be implemented and secured on the server before browser-local demo persistence is replaced with production behavior.

## Integration requirements

Before connecting a service, define the report/list/detail/status API response shapes, authentication and role model, department assignment/comment permissions, upload limits/storage behavior, and location/geocoding provider. Then replace the isolated demo data adapter in `frontend/src/data.ts` with the agreed API client and add server-side validation and authorization. Do not treat the browser’s local storage or editable UI as a trusted source of civic reports or permissions.
