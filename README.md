# PCSO Lotto Trends MVP

This folder contains a static MVP prototype for an independent Philippine PCSO lotto trend chart site inspired by the dense chart structure of 500-style lottery trend pages.

## Open The Prototype

Open `index.html` in a browser.

No install step is required. The prototype uses plain HTML, CSS, and JavaScript with an official-result snapshot taken from the PCSO public result page for product demonstration.

## Included Files

- `index.html` - app shell, SEO tags, PCSO game tabs, trend tabs, controls, matrix chart, statistics, history, roadmap, disclaimer
- `styles.css` - mobile-first responsive interface
- `app.js` - official-result snapshot, draw history, trend chart, frequency, hot/cold, overdue logic
- `implementation-plan.md` - execution plan for turning the MVP into a production product
- `operations-blueprint.md` - complete operating design for API/data sync, video sync, SEO, database, admin and monitoring
- `complete-product-design.md` - product-manager and engineering-architect blueprint with corrected data rules
- `preview.png` - generated only if visual verification is available in the local runtime

## Implemented MVP Features

- Games ordered from small to large: 2D, 3D, 4D, 6D, 6/42, 6/45, 6/49, 6/55, 6/58
- Lottery family logo badges in the hero, game navigation and latest result cards
- 500-style portal navigation: top source bar, brand/search header, blue main menu and PCSO lottery dock
- Lottery logo badges mapped to official PCSO game names: 2D, 3D, 4D, 6D, Lotto 6/42, Mega Lotto 6/45, Super Lotto 6/49, Grand Lotto 6/55 and Ultra Lotto 6/58
- Separate multi-session charts for 2D and 3D: 2PM, 5PM and 9PM
- 3D/Swertres 2024 history backfill from the public LottoPCSO historical table: 126 date rows and 377 usable draw sessions
- 2D uses one 01-31 number matrix; 3D, 4D and 6D use digit-position trend design
- June 8, 2026 is shown as awaiting official publication until PCSO publishes a result
- 500-style chart controls: latest 30, 50, 100 and custom issue range
- Basic trend matrix with issue, date, draw numbers, position groups, and no-position group
- Omission values
- Position trend lines
- Repeat-number highlighting
- Bottom summary rows: frequency, average omission, max omission, current omission
- Hot/cold number lists
- Overdue number list
- Recent history table
- Official video sync design section
- Trend tabs render different chart data, not only different titles
- Desktop trend chart keeps 2D in one readable 01-31 matrix and uses horizontal fallback only for wider lotto games.
- Mobile/H5 hides the dense matrix and renders a card-based trend summary instead.
- The portal now includes popular charts, jackpot watch, schedule, tools, local links and data notes.
- The portal includes a score center for basketball, football and sabong result references, with only official/authorized data shown as scores.
- Responsible gaming and unofficial-site disclaimer

## Next Production Step

Migrate this static MVP into a Next.js app with:

- PostgreSQL and Prisma models for games and draw results
- PCSO official data ingestion and cache refresh
- SEO route generation for game, date, statistics, and trend pages
- Advanced chart modules: odd/even, big/small, sum, span, tail, zone, consecutive, repeat, and no-position charts
- User saved numbers and alerts
- Ads, paid no-ad plan, CSV export, and API keys
