import requests
import pandas as pd
from datetime import datetime
import time  # Import time for sleep function

# Subgraph API endpoint (deployed on The Graph Studio)
SUBGRAPH_URL = "https://api.studio.thegraph.com/query/110739/seaport-nft-tracker/version/latest"

# GraphQL query to fetch the latest 250 NFT sales sorted by timestamp (descending)
QUERY = """
{
  nftsales(first: 250, orderBy: timestamp, orderDirection: desc) {
    id
    collection
    tokenId
    price
    paymentToken
    timestamp
    txHash
  }
}
"""

def fetch_nft_sales():
    """Fetch NFT sales data from the subgraph and save it as a CSV file."""
    print("📦 Fetching NFT sales from subgraph...")
    
    try:
        # Retry mechanism: attempts up to 3 times if request fails
        for attempt in range(3):
            try:
                # Send POST request to the GraphQL endpoint
                response = requests.post(
                    SUBGRAPH_URL,
                    json={"query": QUERY},
                    timeout=30
                )
                response.raise_for_status()  # Raise exception for HTTP errors
                result = response.json()
                break                        # Exit retry loop on success
            except requests.exceptions.RequestException as e:
                if attempt == 2:  # Final attempt failed
                    raise
                print(f"⚠️ Request failed, retrying... ({attempt+1}/3)")
                time.sleep(2)  # Wait before retrying

        # Handle GraphQL-level errors (e.g., invalid schema, query error)
        if 'errors' in result:
            error_msg = "\n".join([e['message'] for e in result['errors']])
            print(f"❌ GraphQL Error:\n{error_msg}")
            return None
            
        # Extract the 'nftsales' array from response
        sales = result['data'].get('nftsales', [])
        
        if not sales:
            print("📭 No sales data found (subgraph might not be fully synced)")
            return None

        # Convert sales list to a pandas DataFrame
        df = pd.DataFrame(sales)
        
        # Process data: convert wei to ETH, timestamps to readable datetime
        df['price'] = df['price'].astype(float) / 1e18  # Convert wei to ETH
        df['timestamp'] = pd.to_numeric(df['timestamp'])  # Ensure numeric timestamp
        df['datetime'] = pd.to_datetime(df['timestamp'], unit='s')  # Convert to datetime
        
        # Normalize addresses to lowercase for consistency
        df['collection'] = df['collection'].str.lower()  # Collection addresses to lowercase
        df['paymentToken'] = df['paymentToken'].str.lower()  # Payment tokens to lowercase
        
        # Save the processed DataFrame to CSV
        df.to_csv("nft_sales.csv", index=False)
        print(f"✅ Successfully saved {len(df)} sales records to nft_sales.csv")
        print(f"📅 Latest data timestamp: {df['datetime'].max()}")
        return df

    except Exception as e:
        # Catch-all error handling
        print(f"⚠️ Error occurred: {str(e)}")
        return None
    
# Execute the function if run as main script
if __name__ == "__main__":
    fetch_nft_sales()