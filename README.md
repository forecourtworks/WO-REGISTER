# Forecourt Works Ltd — Work Order Register

**Tagline:** *Engineering Reliability Into Every Forecourt*

Standalone digital register for all technical service work orders.

## Files
| File | Purpose |
|------|---------|
| `index.html` | Application UI and styles |
| `app.js` | Application logic, data store, query, PDF export |
| `forecourt-logo-mark.png` | Official FSW logo used in header & PDF export |

## How to run
1. Open `index.html` in Chrome, Edge, or any modern browser.
2. No server or install required — works offline after first load of fonts/CDN.
3. Data is stored in the browser’s **localStorage** (key: `fsw_wo_register_v1`).

## Features
- **Default view** — last 5 work orders only
- **+ ADD** — creates the next sequential work order number automatically
- **Editable grid** — every field can be changed (Type, dates, Status, Client, Location, Job Title, Zoho, eTIMS, amounts)
- **Auto Balance** — calculated from Inv Amt − Paid
- **Status dropdown** — Completed · Ongoing · Pending · Started · Stopped · Cancelled
- **Query** — filter by Client Name, Work Order No, Date range, Status
- **Reset** — clears filters and returns to last-5 view
- **Export PDF** — landscape A4, all 14 columns, official logo, double navy boundary, colour-coded status
- **Delete** — per-row delete with confirmation
- **Auto-save** — changes persist across page reloads

## Historical data
Work orders **0001–0068** from the original register are pre-loaded.  
The next **+ ADD** will create **0069**.

## PDF export style
Matches Forecourt Works Ltd document guidelines:
- Double navy boundary
- Company header left + official logo top-right
- Landscape A4 so all columns fit
- Status colour coding

## Future
Designed for later connection to a shared backend / GitHub repository.  
Currently fully local.

---
Forecourt Works Limited · Ramco Court, GT 3B, South C, Nairobi  
+254 729-002-087 · sales@forecourtworks.co.ke
