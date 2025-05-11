import { OrderFulfilled as OrderFulfilledEvent } from "../generated/Seaport/Seaport"
import { NFTSale } from "../generated/schema"
import { BigInt } from "@graphprotocol/graph-ts"

export function handleOrderFulfilled(event: OrderFulfilledEvent): void {
  let offer = event.params.offer
  let consideration = event.params.consideration

  // Skip if either side of the order is empty — indicates an invalid trade
  if (offer.length == 0 || consideration.length == 0) return

  let nftItem = offer[0]
  // Only track NFT sales — itemType 2 = ERC721, itemType 3 = ERC1155
  if (nftItem.itemType != 2 && nftItem.itemType != 3) return

  let paymentItem = consideration[consideration.length - 1]

  // Create a unique ID by combining transaction hash and log index
  let sale = new NFTSale(event.transaction.hash.toHex() + "-" + event.logIndex.toString())

  // Populate the sale entity with on-chain data
  sale.collection = nftItem.token
  sale.tokenId = nftItem.identifier
  sale.price = paymentItem.amount
  sale.paymentToken = paymentItem.token
  sale.timestamp = event.block.timestamp
  sale.txHash = event.transaction.hash
  
  // Persist the entity to the subgraph store
  sale.save()
}
