# Asset Source Log: Bar Guau Guau

**Sourced:** 2026-05-18
**Sourced by:** Lens

All photos sourced from Restaurant Guru (restaurantguru.com/Bar-Guau-Guau-Puerto-Penasco), which aggregates photos from the Google Maps photo pool for this business. These are customer-submitted photos from the Google Business Profile -- authentic, real-world images of the actual venue. No stock or AI-generated images.

---

## Files

| File | Source URL | Description | Notes |
|---|---|---|---|
| `exterior_1.jpg` | https://img02.restaurantguru.com/c05d-Restaurant-Bar-Guau-Guau-exterior.jpg | 3-panel composite: street scene at night + close-up of neon GUAU sign + wide building facade with motorcycle crowd | Best exterior reference |
| `interior_1.jpg` | https://img02.restaurantguru.com/cd41-Club-Bar-Guau-Guau-interior.jpg | 3-panel composite: full building exterior packed with crowd + bar counter backlit + interior pole stage | Best bar interior reference |
| `interior_2.jpg` | https://img02.restaurantguru.com/ca02-Club-Bar-Guau-Guau-view.jpg | 3-panel composite: daytime exterior with diamond-G mural + nighttime exterior + outdoor rally stage | Best daytime logo reference |
| `interior_3.jpg` | https://img02.restaurantguru.com/c7c6-Pub-and-bar-Bar-Guau-Guau-photo.jpg | 3-panel composite: women posing outside + two nighttime exterior crowd shots | Staff/crowd reference |
| `interior_4.jpg` | https://img02.restaurantguru.com/c3f4-Pub-and-bar-Bar-Guau-Guau-picture.jpg | 3-panel composite: busy event street + Rocky Point Rally outdoor stage + rooftop/balcony seating area | Event/rooftop reference |
| `interior_hero.jpg` | https://img.restaurantguru.com/w550/h367/re93-Bar-Guau-Guau-interior.jpg | Single frame: chrome pole on glossy red-lit stage, laser lights, black booth seating | Stage interior hero shot |
| `dish_1.jpg` | https://img02.restaurantguru.com/c6d9-Restaurant-Bar-Guau-Guau-mussels.jpg | 4-panel composite: food spread with tacos/chips/Tecate + candid at bar + best daylight logo shot + illuminated diamond-G sign close-up | Best food reference + logo reference |
| `map_location.jpg` | https://img02.restaurantguru.com/maps/bar-guau-guau-puerto-penasco-map.jpg | Static Google Maps pin showing Ferrocarrilera neighborhood location | Location confirmation |

---

## Dirty originals archived 2026-05-18

All Restaurant Guru composite photos had a cartoon butler mascot watermark baked in (Restaurant Guru branding overlay). Becca flagged this. Clean butler-free panels were cropped from the composites via `scripts/crop_clean_panels.py` and saved to `assets/clean/`. The dirty originals were moved to `assets/_archive/` and are no longer referenced anywhere in the site HTML.

| Archived file | Reason |
|---|---|
| `_archive/exterior_1.jpg` | Butler watermark in top composite panel |
| `_archive/interior_1.jpg` | Butler watermark in top composite panel; pole stage panel blocked by house rules |
| `_archive/interior_2.jpg` | Butler watermark in bottom composite panel |
| `_archive/interior_3.jpg` | Butler watermark in top-right composite panel |
| `_archive/interior_4.jpg` | Butler watermark in bottom composite panel |
| `_archive/interior_hero.jpg` | Pole stage shot; blocked by house rules |
| `_archive/dish_1.jpg` | Butler watermark in top composite panel; food panel had low light/unusable |

Clean replacements are in `assets/clean/` -- 11 butler-free panels, all real Bar Guau Guau photography. See file list below.

| Clean file | Native size | Content | Used in |
|---|---|---|---|
| `clean/sign_mural.jpg` | 213x271 | Neon GUAU sign + bikini mural close-up | galeria.html |
| `clean/sign_crowd_red.jpg` | 213x271 | Red-lit motorcycle crowd + neon GUAU | galeria.html |
| `clean/bar_counter_red.jpg` | 234x310 | Red-backlit bar counter with bottles | index.html (La Casa), nosotros.html, galeria.html |
| `clean/exterior_day_bike.jpg` | 217x310 | Daytime venue exterior with motorcycle | galeria.html |
| `clean/exterior_night_mural.jpg` | 212x310 | Night exterior + bikini mural + neon | galeria.html |
| `clean/girls_bikes.jpg` | 234x310 | Three women posing in front of motorcycles | galeria.html |
| `clean/exterior_crowd_distant.jpg` | 234x310 | Wide crowd shot at venue with bikes | galeria.html |
| `clean/mural_closeup.jpg` | 209x310 | Close-up of GUAU mural with bikini art | galeria.html |
| `clean/motorcycle_street.jpg` | 366x213 | Rocky Point street with motorcycles | galeria.html |
| `clean/rally_stage.jpg` | 366x213 | Rocky Point Rally outdoor stage | eventos.html (background), galeria.html |
| `clean/diamond_g_sign_lit.jpg` | 251x310 | Illuminated diamond-G logo sign at night | og:image all pages, galeria.html |

---

## Sources searched but not yielding usable assets

| Source | Result |
|---|---|
| Business own website | No website found; no domain identified |
| Facebook (barguauguau, bar.guau.guau, barguauguaupp, barguauguaupuertopenasco) | All variants returned browser-compatibility error ("Facebook no está disponible en este navegador") |
| Instagram (barguauguau, bar_guau_guau, guauguaubar, guau_guau_bar, barguauguaurockypoint, barguauguau.pp) | All variants returned Instagram login wall; no content extractable without auth |
| TripAdvisor | No listing found; TripAdvisor search redirected to Taxco (unrelated) |
| Yelp / Yelp Mexico | No listing found |
| Flickr | No results for this venue |
| Wayback Machine | Blocked (Claude Code cannot fetch from web.archive.org) |
| Google search results | All Google search result pages returned error/empty (no SERP content extractable) |
| Bing search results | No relevant results found for this specific venue |
| rockypoint360.com | SSL certificate error |
| rockypointconnects.com | No results for "guau" |
| Foursquare | Requires login |
