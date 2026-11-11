"""Minimal example: run the french-freelance-missions Actor and print the results.

Usage: APIFY_TOKEN=... python run.py   (pip install apify-client)
"""
import os
import sys

from apify_client import ApifyClient

token = os.environ.get("APIFY_TOKEN")
if not token:
    sys.exit("Set the APIFY_TOKEN environment variable first.")

client = ApifyClient(token)

run_input = {
    "keywords": "data engineer",
    "maxItems": 50,
}

run = client.actor("bibian/french-freelance-missions").call(run_input=run_input)

count = 0
for item in client.dataset(run.default_dataset_id).iterate_items():
    count += 1
    rate = item.get("salaryMax") or item.get("budgetMax") or "-"
    print(f"{item['title']} | {item.get('source')} | {item.get('locationLabel') or '-'} | up to {rate} EUR/day")
print(f"{count} results")
