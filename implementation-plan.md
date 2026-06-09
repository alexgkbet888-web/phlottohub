# PCSO Lotto Trends MVP Execution Plan

## Product Positioning

Build an independent PCSO lotto trend chart tool for the Philippine market, using the dense chart structure of Chinese lottery trend sites such as 500 while replacing the lottery games and data source with PCSO games and Philippine draw results.

The product must not sell tickets, accept wagers, or claim guaranteed predictions. It should present historical draw data and visual analysis for reference and entertainment.

## MVP Scope

The first version uses all important PCSO public result games in small-to-large order:

- 2D Lotto
- 3D Lotto
- 4D Lotto
- 6D Lotto
- Lotto 6/42
- Mega Lotto 6/45
- Super Lotto 6/49
- Grand Lotto 6/55
- Ultra Lotto 6/58

Included pages and features:

- PCSO game tabs
- Trend type tabs
- 30/50/100 draw window controls
- Custom issue range query
- Official video sync design block
- Latest draw result
- Game-specific history table
- Basic trend matrix with omission values
- Position trend lines
- No-position number group
- Bottom statistic rows
- Frequency chart
- Hot and cold numbers
- Current overdue numbers
- Product roadmap and monetization framing
- Responsible gaming and unofficial-site disclaimer

## Data Model

Game:

- code
- name
- displayOrder
- shortName
- numberCount
- numberMin
- numberMax
- drawDays
- drawTime

DrawResult:

- id
- gameCode
- drawDate
- drawTime
- numbers
- jackpot
- winners
- sourceLabel

TrendMetric:

- gameCode
- number
- frequency
- currentOmission
- maxOmission
- averageOmission
- lastSeenDrawId

## Future Technical Stack

Recommended production stack:

- Next.js for SEO and server rendering
- Tailwind CSS for interface styling
- PostgreSQL and Prisma for data storage
- ECharts or SVG/canvas for trend charts
- Vercel Cron, GitHub Actions, or a small worker for PCSO data refresh
- Supabase, Neon, or Railway for database hosting

## Implementation Phases

1. Static MVP prototype
   - Build the core UX and algorithm behavior with seed data.
   - Validate chart readability and mobile layout.

2. Data ingestion
   - Add PCSO official result scraper.
   - Normalize draw dates, jackpot values, winners, and game names.
   - Store source URL and update timestamp.

3. SEO buildout
   - Generate pages for each game, date archive, statistics type, and trend chart.
   - Add sitemap, robots.txt, canonical URLs, Open Graph, and JSON-LD.

4. User accounts
   - Add saved numbers, result checker, alerts, and notification preferences.

5. Monetization
   - Add ad placements.
   - Add paid plan for advanced chart views, export, alerts, and no ads.
   - Add API keys for data access.

## Compliance Notes

Every page should include:

- This is not the official PCSO website.
- The site does not sell tickets or accept bets.
- Historical statistics do not predict future results.
- Users should play responsibly.
