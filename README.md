# How to Scrape French Freelance Missions: Free-Work + Codeur in One Feed (Day Rates, Budgets)

> **Run it now, no code: [french-freelance-missions on the Apify Store](https://apify.com/bibian/french-freelance-missions)** &nbsp;|&nbsp; no browser, no proxy

Free-Work and Codeur.com are two of the main French marketplaces for freelance IT missions, but each has its own site, its own format and no shared export. This guide shows how to get both as one clean, deduplicated dataset: day rate (TJM) or budget as numbers, skills, location, remote policy and full description, with a free Apify Actor, from the console or from code.

Searches this page answers: french freelance missions scraper, free-work scraper, codeur scraper, TJM freelance France, freelance day rate scraper.

## What you get from the French Freelance Missions scraper

- Every freelance IT mission from Free-Work and every freelance project from Codeur.com, in one unified schema, newest first.
- Day rate or budget as numbers (`salaryMin`/`salaryMax` in EUR/day for Free-Work, `budgetMin`/`budgetMax` for Codeur.com), so you can compare the two sources directly.
- A mission republished by the same agency on both sites is deduplicated, instead of appearing twice.
- Skills, location, remote policy, publication date and, optionally, the full mission description.

Export the dataset as JSON, CSV or Excel, or read it through the Apify API. A real sample (five results, personal data removed, long texts truncated) is in [`sample-output.json`](sample-output.json).

## Output fields

| Field | What it is |
|---|---|
| `id`, `url` | Stable mission id (`<source>:<sourceId>`) and public link |
| `title` | Mission title |
| `companyName`, `companyUrl`, `confidentialCompany` | Hiring company when disclosed (Codeur.com often keeps it confidential) |
| `locationLabel`, `city`, `region`, `postalCode`, `country` | Where the mission is based (Free-Work only: Codeur.com never discloses a location) |
| `remote` | `full`, `hybrid`, `onsite` or `unknown` (Free-Work only) |
| `employmentType` | Always `freelance` |
| `salaryMin`, `salaryMax`, `salaryCurrency`, `salaryPeriod` | Free-Work's disclosed day rate, as numbers |
| `budget`, `budgetMin`, `budgetMax`, `budgetCurrency`, `budgetPeriod` | Codeur.com's disclosed budget, as a label and as numbers |
| `datePosted`, `validThrough` | Publication and expiry dates |
| `skills`, `industry`, `experienceLevel` | Required skills, job family, seniority |
| `source`, `sourceId` | `free-work.com` or `codeur.com`, and the mission's id on that site |
| `status`, `offersCount`, `viewsCount` | Codeur.com only: project status and how many freelancers already answered or viewed it |
| `description` | Plain text, only when full descriptions are enabled |

## Use cases

- **Compare day rates across two marketplaces** in one dataset, instead of running two separate actors and merging them yourself.
- **Price your own TJM**: see what French clients actually pay for a given skill, right now, on both sites at once.
- **Build a daily mission alert.** Schedule a run every morning with `publishedWithinDays: 1` and send only the new missions to Slack, e-mail or a spreadsheet.
- **Avoid duplicate outreach**: a mission posted by the same agency on both Free-Work and Codeur.com is merged into a single record.

## Input

| Field | What it does |
|---|---|
| `keywords` | Job title, skill or technology, for example `data engineer`. Empty means every mission. |
| `sources` | Marketplaces to query: `free-work`, `codeur`, or both (default). |
| `location` | City, department or region. Free-Work only: a Codeur.com project never discloses a location, so setting this returns no Codeur result. |
| `remote` | `any` (default), `full`, `hybrid` or `onsite`. Free-Work only, for the same reason as `location`. |
| `publishedWithinDays` | Keep only missions published in the last N days. Use `1` for a daily alert. |
| `minDayRate` | Keep only missions whose disclosed day rate or budget is at least this many euros. A mission with nothing disclosed (most Codeur.com flat-fee quotes) is dropped once this is set. |
| `maxItems` | The run stops once this many missions are saved, across both sources combined (default 50). |
| `includeDescriptions` | Adds the mission description or project brief as plain text (default `true`). |
| `onlyNew` | For scheduled runs: only the missions an earlier run of the same search did not already deliver. |

Example input:

```json
{
  "keywords": "data engineer",
  "maxItems": 50
}
```

## Four ways to use it

### 1. Apify console, no code

1. Open [the Actor page](https://apify.com/bibian/french-freelance-missions) and click **Try for free** (a free Apify account is enough).
2. Fill in the input form (keywords, filters and the maximum number of results) and click **Start**.
3. When the run finishes, open the **Output** tab, check the table, then **Export** as CSV, Excel or JSON.
4. For a daily alert, open **Schedules**, create a daily schedule for the Actor, set `onlyNew: true`, and optionally add an integration that sends new results to Slack, e-mail or Google Sheets.

### 2. Apify API with JavaScript

```bash
npm install apify-client
export APIFY_TOKEN="your token from Apify console, Settings, Integrations"
node examples/run.js
```

```js
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const run = await client.actor('bibian/french-freelance-missions').call({
    "keywords": "data engineer",
    "maxItems": 50
});

const { items } = await client.dataset(run.defaultDatasetId).listItems();
for (const item of items) {
    const rate = item.salaryMax ?? item.budgetMax ?? '-';
    console.log(`${item.title} | ${item.source} | ${item.locationLabel ?? '-'} | up to ${rate} EUR/day`);
}
```

The complete file is [`examples/run.js`](examples/run.js) (ES module, Node 18 or later).

### 3. Apify API with Python

```bash
pip install apify-client
export APIFY_TOKEN="your token from Apify console, Settings, Integrations"
python examples/run.py
```

```python
import os
from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run = client.actor("bibian/french-freelance-missions").call(run_input={
    "keywords": "data engineer",
    "maxItems": 50,
})

for item in client.dataset(run.default_dataset_id).iterate_items():
    rate = item.get("salaryMax") or item.get("budgetMax") or "-"
    print(f"{item['title']} | {item.get('source')} | {item.get('locationLabel') or '-'} | up to {rate} EUR/day")
```

The complete file is [`examples/run.py`](examples/run.py). Never put your token in the code: read it from the `APIFY_TOKEN` environment variable as above.

## Pricing

Pay per result: see the current price per 1,000 missions on the [Store page](https://apify.com/bibian/french-freelance-missions) — a tiny start fee is included, you only pay for the missions saved to the dataset. Apify's free plan includes monthly credits, enough to try it on a few hundred results. The Store page is the reference for the exact price.

## Limits and honest notes

- Only what each site publishes is collected. Free-Work discloses a day rate on some missions only; Codeur.com discloses a budget range on some projects only — the rest show as `null` (visible in `sample-output.json`).
- `location` and `remote` only filter Free-Work: Codeur.com never discloses either, so combining them with `sources: ["codeur"]` returns nothing.
- The dataset contains freelance missions only. No recruiter or client contact details are exported.
- This is an unofficial tool, not affiliated with Free-Work or Codeur.com. Check each site's terms and the data protection rules that apply to your use.

## FAQ

**Does it need a browser or a proxy?**
No. The Actor reads the data directly, so runs are fast and cheap.

**How do I only get new missions every day?**
Set `publishedWithinDays` to `1` and `onlyNew` to `true`, then schedule the Actor once a day.

**Does it remove duplicates between the two sites?**
Yes. A mission reposted by the same agency on both Free-Work and Codeur.com is deduplicated.

**Can I query just one of the two sites?**
Yes, set `sources` to `["free-work"]` or `["codeur"]`.

## Try it

**[Open french-freelance-missions on the Apify Store](https://apify.com/bibian/french-freelance-missions)**

The code in `examples/` is released under the MIT license (see [LICENSE](LICENSE)). The data belongs to its original publishers.
