import { Wallet, Provider, Contract, ContractFactory, Address } from "fuels"
import { ContractAbi__factory } from "./contracts"
import { ContractAbi, IdentityOutput } from "./contracts/ContractAbi"

const WALLET_SECRET = "0xde97d8624a438121b86a1956544bd72ed68cd69f2c99555b08b1e8c51ffd511c"

/*
0x187d1bec9462bd73a3338b1a9d0facbfdb8d9fb13442d80f1f604b06b78e46b7 s {
  bech32Address: 'fuel1r6ecu6w906qsx4aj0taykgv45qmvtg3gw7cmedwp3n7wlzgsuswss7h2xq'
}
*/

const WALLET2 = "0x37fa81c84ccd547c30c176b118d5cb892bdb113e8e80141f266519422ef9eefd"
const CONTRACT_ID = "0xadf36b39d2680fea4912d8ec3c814db2d92e5734b63e5cfa48f11a50d3b196f7"

const wallet = Wallet.fromPrivateKey(WALLET_SECRET)
const wallet2 = Wallet.fromPrivateKey(WALLET2)

const eaddress = new Address("fuel1tscplygwatx9p9l8ek8hn88ly2urmf3667c56lw3mrxlpt4gmn5s2ss2f9")
const eaddress2 = new Address("fuel1z0kxkjy9h2xdl36x32tq3chwd43m3al6sr6ry6y3u78kpmu0rfaqmftf2t")

const contract = ContractAbi__factory.connect(CONTRACT_ID, wallet)
const contract2 = ContractAbi__factory.connect(CONTRACT_ID, wallet2)
const NativeAssetId = "0x0000000000000000000000000000000000000000000000000000000000000000"
async function main() {
  // await contract.functions.start_game().call()
  // await contract2.functions.join_game(1).call()

  const tx = await wallet.transfer(eaddress, 100, NativeAssetId)
  await tx.wait()
  const tx2 = await wallet.transfer(eaddress2, 100, NativeAssetId)
  await tx2.wait()
  // await contract.functions.make_play(4, 4).call()
  // await contract2.functions.make_play(4, 3).call()

  // const { value } = await contract.functions.view(1).get()
  // console.log(value)
}
main()
