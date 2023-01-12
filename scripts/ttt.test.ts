import * as fs from "fs"

import { ContractFactory, NativeAssetId, Provider, toHex, Wallet } from "fuels"
import { ContractAbi__factory } from "./contracts"
import * as path from "path"
import { describe, expect, test, it } from "@jest/globals"
import storageSlots from "../contract/out/debug/contract-storage_slots.json"

describe("ExampleContract", () => {
  it("Should increase the game counter", async () => {
    const provider = new Provider("http://127.0.0.1:4000/graphql")
    const wallet = Wallet.fromPrivateKey("0xde97d8624a438121b86a1956544bd72ed68cd69f2c99555b08b1e8c51ffd511c", provider) // await TestUtils.generateTestWallet(provider, [[1_000, NativeAssetId]])

    // Deploy
    const bytecode = fs.readFileSync(path.join(__dirname, "../contract/out/debug/contract.bin"))
    const factory = new ContractFactory(bytecode, ContractAbi__factory.abi, wallet)
    const contract = await factory.deployContract({ storageSlots })

    const { logs: log1 } = await contract.functions.start_game().call()

    expect(toHex(log1[0])).toEqual(toHex(1))

    const wallet2 = Wallet.fromPrivateKey("0x37fa81c84ccd547c30c176b118d5cb892bdb113e8e80141f266519422ef9eefd", provider)
    const contract2 = ContractAbi__factory.connect(contract.id, wallet2)

    const { logs: log2 } = await contract2.functions.start_game().call()
    expect(toHex(log2[0])).toEqual(toHex(2))
  })
  it("Should allow to make play", async () => {
    const provider = new Provider("http://127.0.0.1:4000/graphql")
    const wallet = Wallet.fromPrivateKey("0xde97d8624a438121b86a1956544bd72ed68cd69f2c99555b08b1e8c51ffd511c", provider) // await TestUtils.generateTestWallet(provider, [[1_000, NativeAssetId]])

    // Deploy
    const bytecode = fs.readFileSync(path.join(__dirname, "../contract/out/debug/contract.bin"))
    const factory = new ContractFactory(bytecode, ContractAbi__factory.abi, wallet)
    const contract = await factory.deployContract({ storageSlots })

    const { logs: log1 } = await contract.functions.start_game().call()

    expect(toHex(log1[0])).toEqual(toHex(1))

    const wallet2 = Wallet.fromPrivateKey("0x37fa81c84ccd547c30c176b118d5cb892bdb113e8e80141f266519422ef9eefd", provider)
    const contract2 = ContractAbi__factory.connect(contract.id, wallet2)

    const { logs: log2 } = await contract2.functions.join_game(log1[0]).call()
    expect(toHex(log2[0])).toEqual(toHex(1))

    const { logs: log3 } = await contract.functions.make_play(4, 5).call()

    expect(toHex(log3[0])).toEqual(toHex(1))
    expect(toHex(log3[1])).toEqual(toHex(4))
    expect(toHex(log3[2])).toEqual(toHex(5))
    expect(toHex(log3[3])).toEqual(toHex(1))

    const { value } = await contract.functions.view(log3[0]).get()
    console.log(value)
    expect(value.next_play_position).toEqual(5)
    expect(value.boards_state[4][5]).toEqual(1)
  })
})
