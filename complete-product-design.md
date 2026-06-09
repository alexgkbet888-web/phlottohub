# PCSO 500-Style Lotto Portal: Complete Product And Engineering Design

## 1. Product Goal

Build a real operating website for the Philippine market:

- PCSO official latest results
- Multi-session 2D and 3D results
- 500-style trend charts
- Result history
- Statistics
- Official draw video links
- Draw schedule
- SEO archive pages
- Admin review and sync monitoring

This is an information and statistics website only. It must not sell tickets, accept bets, or promise predictions.

## 2. Critical Corrections

The product must follow these rules:

- Never show June 8, 2026 results before PCSO publishes them.
- If the official PCSO page has no result for a draw date/time, show "Awaiting official publication".
- 2D and 3D are not single daily draws. They must be modeled as separate sessions:
  - 2D Lotto 2PM
  - 2D Lotto 5PM
  - 2D Lotto 9PM
  - 3D Lotto 2PM
  - 3D Lotto 5PM
  - 3D Lotto 9PM
- Official result rows are the only rows allowed in public charts and result lists.
- Any internal QA fixture must stay outside production UI and be clearly flagged in the admin/test environment.
- Clicking trend tabs must change the table model, not only the title.
- Clicking a latest result must open that specific series chart.
- Game order must start from 2D and move upward:
  - 2D
  - 3D
  - 4D
  - 6D
  - 6/42
  - 6/45
  - 6/49
  - 6/55
  - 6/58

## 3. Reference Site Scope

The production site should combine two 500-style areas:

- `kaijiang.500.com` style result portal:
  - latest result list
  - draw dates
  - jackpot / prize
  - links to detail, trend, history, rules and news
  - schedule and result status

- `datachart.500.com` style chart center:
  - issue range controls
  - chart tabs
  - omission values
  - trend lines
  - bottom summary rows
  - dense horizontal matrix

## 4. Site Navigation

Top navigation:

- Results
- Trends
- Stats
- Videos
- Schedule
- Responsible Gaming

Home page modules:

- Official latest synced date
- Today's draw status
- Official latest results
- Popular trend chart entrance
- Official video section
- Jackpot watch
- SEO FAQ
- Responsible gaming disclaimer

## 5. Data Source Strategy

Official result page:

https://www.pcso.gov.ph/searchlottoresult.aspx

Observed structure:

- The page lists draw result fields:
  - LOTTO GAME
  - COMBINATIONS
  - DRAW DATE
  - JACKPOT (PHP)
  - WINNERS
- It currently shows official rows up to June 7, 2026.
- June 8, 2026 is shown as Today's National Draw schedule, not as a published result.
- No public JSON API has been confirmed.

Production sync approach:

- Treat the PCSO HTML result table as the primary public source.
- Use a worker to fetch, parse, normalize and store rows.
- Use YouTube videos as supporting evidence, not as primary number data.
- Add admin review for conflicts.
- The frontend must never invent draw rows for missing dates.
- If a draw is scheduled but not published, the UI shows pending/awaiting official publication.
- If PCSO changes draw times or published game labels, the sync worker updates `DrawSeries` and flags affected pages for review.

Third-party result sites:

- Sites such as lottopcso.com, pcsolotto.ph, pcsogames.com and LottoBot can be used only as comparison or backfill candidates.
- They should not be treated as the primary source unless a formal data agreement is signed.
- Any mismatch between third-party data and PCSO official rows must be marked as conflict and sent to admin review.

Sports score sections:

- Basketball scores should use official PBA pages or a licensed sports data provider.
- Football scores should use Philippines Football League data or a licensed sports data provider.
- Sabong/e-sabong content requires Philippine legal review. Public pages should not provide odds, betting links, illegal livestreams, or unlicensed online cockfighting operations.
- Competitor websites may be inspected for product structure, but their private APIs, login-only endpoints, or vendor feeds must not be used as the operating data source without permission or a contract.
- The target operating model is authoritative data aggregation: official sources first, licensed vendors second, third-party public pages only for cross-checking.
- Frontend score modules must distinguish three states: official result, scheduled match/event, and pending authorized source. Do not fabricate scores to fill the page.

3D/Swertres 2024 historical backfill:

- Public source inspected: https://www.lottopcso.com/swertres-result-today-hearing-history-and-summary-2024/
- Extracted shape: date, 2:00 PM, 5:00 PM, 9:00 PM.
- Imported scope in the prototype: January 2, 2024 to May 10, 2024.
- Imported count: 126 date rows and 377 usable 3D draw sessions.
- Rows with "-" or blank values are not imported as draw results.
- Source label in UI: LottoPCSO 2024 Swertres 历史回填.
- Production rule: use this as a backfill/cross-check source and reconcile against PCSO official archives before marking rows as official.

## 6. YouTube Sync

Official channel:

https://www.youtube.com/channel/UCpOm2kv1upnIFoOT7rSp6hg/videos

RSS feed:

https://www.youtube.com/feeds/videos.xml?channel_id=UCpOm2kv1upnIFoOT7rSp6hg

Production logic:

- Poll RSS every 15-30 minutes.
- Store video ID, title, publishedAt, thumbnail and URL.
- Match by date and title keywords.
- Embed matched video on result detail pages.
- Keep unmatched videos in admin review.

## 7. Core Database Model

DrawSeries:

- id
- code
- family
- name
- displayOrder
- numberCount
- numberMin
- numberMax
- ordered
- drawTime
- drawDays
- active

DrawResult:

- id
- seriesId
- issue
- drawDate
- drawTime
- numbersJson
- jackpot
- winners
- sourceUrl
- sourceLabel
- sourceHash
- status: official, pending, conflict
- createdAt
- updatedAt

DrawVideo:

- id
- youtubeVideoId
- title
- url
- thumbnailUrl
- publishedAt
- matchedDrawDate
- matchedDrawTime
- matchedSeriesId
- status

SyncJob:

- id
- source
- startedAt
- finishedAt
- status
- fetchedRows
- insertedRows
- updatedRows
- conflictRows
- errorMessage

TrendSnapshot:

- id
- seriesId
- viewType
- windowSize
- payloadJson
- calculatedAt

AuditLog:

- id
- entityType
- entityId
- action
- beforeJson
- afterJson
- createdBy
- createdAt

## 8. Trend Views

Implemented in the prototype:

- Basic trend
- Odd/even trend
- Big/small trend
- Sum trend
- Span trend
- Tail trend
- Zone trend
- Hot/cold omission

Basic trend:

- Ordered games: use exact digit positions.
- Lotto 6-number games: sort numbers ascending, then show sorted position 1 to 6.
- For 2D, show one 01-31 professional matrix and mark both winning numbers in the same row.
- For 3D, 4D and 6D, show digit-position trend models when the user selects a position-specific view in a future advanced chart.

Derived trend:

- Each tab renders a different column model.
- Each row has one or more derived hits.
- Trend line connects derived hits over time.
- Bottom rows summarize frequency, max omission and current omission.

## 8.1 Desktop And Mobile Chart UX

Desktop:

- Do not show every digit position group in one huge matrix by default.
- For 2D, remove the position switcher and keep the 01-31 matrix visible in one normal desktop viewport.
- For 3D/4D/6D, use the chart tab itself to determine the model; any future position view should be presented as an advanced chart mode, not as a confusing default control.
- For 6/58, keep horizontal scroll available as a fallback, but the default view should still be focused and readable.

Mobile/H5:

- Do not force the dense desktop matrix into a phone screen.
- Hide the matrix table under mobile breakpoint.
- Show a card-based trend summary:
  - issue
  - date
  - draw time
  - numbers
  - current trend summary
  - derived hit label when applicable
- Provide a link or toggle to open the full professional matrix only when the user wants it.

This gives the product two modes:

- Desktop professional research mode.
- Mobile quick-check and lightweight trend mode.

## 9. Sync Schedule

High-frequency polling windows:

- 13:55-14:40 Manila time: 2D/3D 2PM
- 16:55-17:40 Manila time: 2D/3D 5PM
- 20:55-22:10 Manila time: 2D/3D 9PM and major draws

Backfill:

- Daily 03:00: backfill last 7 days.
- Weekly: backfill last 12 months.
- Monthly: data integrity scan.

No-result handling:

- Create no official result row.
- Show pending state.
- Continue polling during the high-frequency window.
- If no result after window, mark sync job as delayed and alert admin.

## 10. Admin Console

Required screens:

- Sync dashboard
- Result conflicts
- Manual result correction
- Video matching
- Game configuration
- SEO page status
- Sitemap status
- Ad placement management
- Audit log

## 11. Monitoring

Alerts:

- PCSO page unavailable
- PCSO table structure changed
- Result missing after expected draw time
- Duplicate official row
- Number count mismatch
- Number out of range
- Jackpot parse failure
- YouTube feed unavailable
- Sitemap generation failure

## 12. Monetization

Stage 1:

- SEO pages
- Display ads
- Result pages and trend pages as traffic core

Stage 2:

- No-ad membership
- Advanced chart windows
- Saved numbers
- Draw alerts
- CSV export
- Image sharing

Stage 3:

- API keys
- Telegram bot
- B2B data licensing

## 13. Compliance Copy

Every page footer:

This website is an independent information and statistics platform. It is not affiliated with, endorsed by, or operated by PCSO. We do not sell lottery tickets, accept bets, process wagers, or guarantee winning numbers. All trend charts and statistics are based on historical draw results and are provided for informational reference only. Please play responsibly.
