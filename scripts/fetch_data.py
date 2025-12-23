import requests
from bs4 import BeautifulSoup
import pandas as pd
import json
import os
import sys
from urllib.parse import urlparse

# Allowed domains for data fetching (HTTPS only)
ALLOWED_DOMAINS = [
    'prsindia.org',
    'loksabha.nic.in',
    'rajyasabha.nic.in',
    'eci.gov.in',
    'myneta.info'
]

def is_allowed_url(url):
    """Validate that URL is from an allowed domain and uses HTTPS."""
    try:
        parsed = urlparse(url)
        # Ensure HTTPS
        if parsed.scheme != 'https':
            return False
        # Check domain is allowed
        domain = parsed.netloc.lower()
        return any(domain == allowed or domain.endswith('.' + allowed) for allowed in ALLOWED_DOMAINS)
    except Exception:
        return False

def ensure_data_directory():
    """Ensure the data directory exists."""
    data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
    return data_dir

def fetch_legislation():
    """Fetch legislation data from trusted sources."""
    # Define trusted sources for legislative data (HTTPS only)
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
        # Validate URL before making request
        if not is_allowed_url(source["url"]):
            print(f"Skipping untrusted URL: {source['url']}")
            continue
            
        try:
            response = requests.get(
                source["url"], 
                timeout=30, 
                headers={'User-Agent': 'Mozilla/5.0 (compatible; MPTracker/1.0)'},
                verify=True  # Enforce SSL certificate verification
            )
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')

            # Extract data based on source selectors
            bills = soup.select(".bill-item") if "bill-item" in response.text else []

            for bill in bills:
                name = bill.select_one(source["selector"]["bill_name"])
                status = bill.select_one(source["selector"]["bill_status"])
                date = bill.select_one(source["selector"]["bill_date"])
                summary = bill.select_one(source["selector"]["bill_summary"])

                legislation_data.append({
                    "name": name.text.strip() if name else "N/A",
                    "status": status.text.strip() if status else "N/A",
                    "date": date.text.strip() if date else "N/A",
                    "summary": summary.text.strip() if summary else "N/A",
                    "source": source["name"]
                })

            print(f"Successfully fetched data from {source['name']}")

        except requests.exceptions.SSLError as e:
            print(f"SSL verification failed for {source['name']}: {e}")
        except requests.RequestException as e:
            print(f"Error fetching data from {source['name']}: {e}")
        except Exception as e:
            print(f"Unexpected error processing {source['name']}: {e}")

    return legislation_data

def fetch_mps():
    """Fetch MP data - placeholder for future implementation."""
    # This will be expanded to fetch actual MP data
    print("MP data fetching not yet implemented - using static data")
    return []

def fetch_know_your_rep():
    """Fetch Know Your Rep data - placeholder for future implementation."""
    # This will be expanded to fetch representative performance data
    print("Know Your Rep data fetching not yet implemented - using static data")
    return []

def save_data(data, filename):
    """Save data to JSON file in the data directory."""
    data_dir = ensure_data_directory()
    filepath = os.path.join(data_dir, filename)
    
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    
    print(f"Data saved to {filepath}")

def main():
    """Main function to orchestrate data fetching."""
    # Get section from environment variable (set by workflow)
    section = os.environ.get('UPDATE_SECTION', 'all').lower()
    
    print(f"Starting data update for section: {section}")
    print("=" * 50)
    
    if section in ['all', 'legislation']:
        print("\nFetching legislation data...")
        legislation_data = fetch_legislation()
        if legislation_data:
            save_data(legislation_data, "legislation.json")
        else:
            print("No legislation data fetched - sources may be unavailable")
    
    if section in ['all', 'mps']:
        print("\nFetching MP data...")
        mps_data = fetch_mps()
        if mps_data:
            save_data(mps_data, "mps.json")
    
    if section in ['all', 'know_your_rep']:
        print("\nFetching Know Your Rep data...")
        kyr_data = fetch_know_your_rep()
        if kyr_data:
            save_data(kyr_data, "know_your_rep.json")
    
    print("\n" + "=" * 50)
    print("Data update complete!")

if __name__ == "__main__":
    main()