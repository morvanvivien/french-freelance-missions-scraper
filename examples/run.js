// Minimal example: run the french-freelance-missions Actor and print the results.
// Usage: APIFY_TOKEN=... node run.js   (Node 18 or later, npm install apify-client)
import { ApifyClient } from 'apify-client';

const token = process.env.APIFY_TOKEN;
if (!token) {
    console.error('Set the APIFY_TOKEN environment variable first.');
    process.exit(1);
}

const client = new ApifyClient({ token });

const input = {
    "keywords": "data engineer",
    "maxItems": 50
};

const run = await client.actor('bibian/french-freelance-missions').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();

console.log(`${items.length} results`);
for (const item of items) {
    const rate = item.salaryMax ?? item.budgetMax ?? '-';
    console.log(`${item.title} | ${item.source} | ${item.locationLabel ?? '-'} | up to ${rate} EUR/day`);
}
