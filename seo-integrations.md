# SEO And Analytics Integrations

PH Lotto Hub is prepared for analytics and webmaster tooling. Fill the values in `analytics-config.js`, then publish the site.

## Needed IDs

- Google Analytics 4 Measurement ID: starts with `G-`
- Microsoft Clarity Project ID: a short project code from the Clarity dashboard
- Google Search Console verification token: from the HTML tag verification method
- Bing Webmaster verification token: from the HTML meta tag method

## Current Code Support

- `analytics-config.js` stores tool IDs in one place.
- `analytics.js` loads GA4 and Microsoft Clarity only when IDs are present.
- `app.js` sends page views and product events:
  - `route_view`
  - `lotto_series_select`
  - `trend_view_change`
  - `trend_window_change`
  - `trend_custom_range_query`
  - `chart_option_toggle`
  - `site_search`
  - `outbound_link_click`
- `robots.txt` points crawlers to `sitemap.xml`.
- `sitemap.xml` currently lists the homepage. Real SEO landing pages should be added when the site moves from hash routes to static URLs.

## Recommended Accounts

- Google Search Console: verify `phlottohub.com`, submit `https://phlottohub.com/sitemap.xml`.
- Google Analytics 4: create a Web data stream for `https://phlottohub.com`.
- Microsoft Clarity: create a project for `phlottohub.com`.
- Bing Webmaster Tools: import from Google Search Console or verify with a meta tag.
