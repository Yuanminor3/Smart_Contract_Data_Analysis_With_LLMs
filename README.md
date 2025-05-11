# Smart_Contract_Data_Analysis_With_LLMs

## 📋 Project Information
- **Course**: ELENE6883 Introduction to Blockchain Technology – Columbia University, Spring 2025
- **Team Members**:
  - Yuan Jiang (yj2848@columbia.edu)
  - Junfeng Zou (jz3850@columbia.edu)
  - Rosie Wang (rw3085@columbia.edu)
  - Huayuan Jiang (hj2683@columbia.edu)
  - Xiaohang Ding (xd2330@columbia.edu)

## 📚 Overview
This project explores how smart contract event data can be extracted from the Ethereum blockchain and used to enable meaningful analysis with large language models (LLMs). We focus on OpenSea's Seaport contract, indexing NFT sales events using **The Graph Protocol**, processing the results with **Python**, and generating structured data for NFT market trend prediction.

## 📄 Demo and Documentation
- [📘 Final Report (PDF)](docs/Final_Report.pdf)
- [📂 NFT Sales Dataset (CSV)](./nft_sales.csv)

## 📦 NFT Sales Data Extraction (Python)

Our Python script ([`fetch_sales.py`](./fetch_sales.py)) connects to the deployed GraphQL subgraph and queries the latest 250 NFT sales captured by the `OrderFulfilled` event of Seaport. The script features:
- 📤 **Robust GraphQL request logic** with retries and error handling
- 📊 **Automatic conversion** of raw fields into human-readable formats (e.g., ETH price, datetime)
- 🧹 **Normalization** of addresses for cross-contract aggregation
- 📁 **Output:** A clean CSV dataset: [`nft_sales.csv`](./nft_sales.csv)

### 📑 `nft_sales.csv` Columns Explained

| Column         | Description                                                                 |
|----------------|-----------------------------------------------------------------------------|
| `id`           | Unique identifier (`txHash-logIndex`) for deduplication                     |
| `collection`   | NFT contract address (ERC-721 or ERC-1155)                                  |
| `tokenId`      | NFT token ID                                                                |
| `price`        | Sale price in ETH (converted from `wei`)                                    |
| `paymentToken` | Address of payment token (e.g., `0x0` = ETH)                                |
| `timestamp`    | Block timestamp in Unix seconds                                             |
| `txHash`       | Transaction hash for reference or traceability                              |
| `datetime`     | Human-readable timestamp (`YYYY-MM-DD HH:MM:SS`) for sorting and analysis   |

This dataset is suitable for:
- Feeding to an LLM for question-answering or forecasting prompts
- Creating visualizations like price trends, collection-based distributions, or sale frequency histograms

## 📄 Resources

- [The Graph Documentation](https://thegraph.com/docs/)
- [Seaport Contract on Etherscan](https://etherscan.io/address/0x00000000006c3852cbef3e08e8df289169ede581)
