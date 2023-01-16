import { Wallet, Provider, Contract, ContractFactory, Address } from "fuels"
import { ContractAbi__factory } from "./contracts"
import { ContractAbi } from "./contracts/ContractAbi"
import { NativeAssetId } from "@fuel-ts/constants"

const WALLET_SECRET = "0xde97d8624a438121b86a1956544bd72ed68cd69f2c99555b08b1e8c51ffd511c"

const WALLET2 = "0x37fa81c84ccd547c30c176b118d5cb892bdb113e8e80141f266519422ef9eefd"

const CONTRACT_ID = "0x50f6e8cab06fd77a69ddc2c4e914d5308a80fe4d99efc30bc0aecad3444e2fba"

const wallet = Wallet.fromPrivateKey(WALLET_SECRET)
const wallet2 = Wallet.fromPrivateKey(WALLET2)

const contract = ContractAbi__factory.connect(CONTRACT_ID, wallet)
const contract2 = ContractAbi__factory.connect(CONTRACT_ID, wallet2)

//Build identity type
// {
//   Address: { value: add.toHexString() },
// }
async function main() {
  const { logs } = await contract.functions.start_game().call()
  console.log(logs[0])
  console.log(logs)
  await contract2.functions.join_game(1).call()

  await contract.functions.make_play(4, 4).call()
  await contract2.functions.make_play(4, 3).call()

  const { value } = await contract.functions.view(1).get()

  console.log(value)

  // const tx = await wallet.transfer(, 100, NativeAssetId)
  // await tx.wait()
  // const tx2 = await wallet.transfer(, 100, NativeAssetId)
  // await tx2.wait()
}
main()
