# NextRep prototype handoff

## Start
Run `npm install` then `npx expo start --web` in this directory.

## Implemented
- Responsive login-role selector, player and coach navigation
- Player stats, progress visualization, goals, activity, result entry
- Coach roster, search, testing, approvals demo, analytics, announcements

## Important limitations
- This is a frontend demonstration. Login accepts any credentials and does **not** authenticate.
- All data is sample data, and edits are held in React state only; refreshing loses them.
- Coach roster and aggregate statistics are mock data. Some features are placeholders (photo storage, reports, backend account management).
- Backend, persistence, secure authentication, approval APIs and testing workflow must be integrated before production use.
- Sample athlete names and statistics come from the supplied mockup; they are not verified player records.

## Files changed
- `src/app/index.tsx`: prototype application
- `src/app/_layout.tsx`: minimal Expo Router Stack to replace Expo starter tab navigation

The original uploaded project is not overwritten; this is a separate ZIP with node_modules, .git and Expo caches excluded.
