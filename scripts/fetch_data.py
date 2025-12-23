import requests
from bs4 import BeautifulSoup
import pandas as pd
import json
import os

def fetch_legislation():
    # Define trusted sources for legislative data
    sources = [
        {
            "name": "PRS India",
            "url": "https://prsindia.org/bills",
            "selector": {
                "bill_name": ".bill-name",
                "bill_status": ".bill-status",
                "bill_date": ".bill-date",
                "bill_summary": ".bill-summary"
            }
        },
        {
            "name": "Lok Sabha",
            "url": "https://loksabha.nic.in/",
            "selector": {
                "bill_name": ".bill-title",
                "bill_status": ".bill-status",
                "bill_date": ".bill-date",
                "bill_summary": ".bill-desc"
            }
        }
    ]

    legislation_data = []

    for source in sources:
        try:
            response = requests.get(source["url"])
            soup = BeautifulSoup(response.text, 'html.parser')

            # Extract data based on source selectors
            bills = soup.select(".bill-item") if "bill-item" in response.text else []

            for bill in bills:
                name = bill.select_one(source["selector"]["bill_name"]).text.strip() if bill.select_one(source["selector"]["bill_name"]) else "N/A"
                status = bill.select_one(source["selector"]["bill_status"]).text.strip() if bill.select_one(source["selector"]["bill_status"]) else "N/A"
                date = bill.select_one(source["selector"]["bill_date"]).text.strip() if bill.select_one(source["selector"]["bill_date"]) else "N/A"
                summary = bill.select_one(source["selector"]["bill_summary"]).text.strip() if bill.select_one(source["selector"]["bill_summary"]) else "N/A"

                legislation_data.append({
                    "name": name,
                    "status": status,
                    "date": date,
                    "summary": summary,
                    "source": source["name"]
                })

        except Exception as e:
            print(f"Error fetching data from {source['name']}: {e}")

    # Save data to JSON
    with open("data/legislation.json", "w") as f:
        json.dump(legislation_data, f, indent=4)

if __name__ == "__main__":
    fetch_legislation()