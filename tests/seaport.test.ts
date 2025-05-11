import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import { CounterIncremented } from "../generated/schema"
import { CounterIncremented as CounterIncrementedEvent } from "../generated/Seaport/Seaport"
import { handleCounterIncremented } from "../src/seaport"
import { createCounterIncrementedEvent } from "./seaport-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let newCounter = BigInt.fromI32(234)
    let offerer = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newCounterIncrementedEvent = createCounterIncrementedEvent(
      newCounter,
      offerer
    )
    handleCounterIncremented(newCounterIncrementedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("CounterIncremented created and stored", () => {
    assert.entityCount("CounterIncremented", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "CounterIncremented",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "newCounter",
      "234"
    )
    assert.fieldEquals(
      "CounterIncremented",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "offerer",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
