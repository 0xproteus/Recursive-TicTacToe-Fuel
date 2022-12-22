import { createContext } from "react"
import { Dispatch, SetStateAction } from "react"
import { BigNumberish, Provider, Wallet, TransactionResponse, Address } from "fuels"

export type WalletContextType = {
  address: string | null
  provider: Provider
  wallet: Wallet | null

  setAddress: Dispatch<string | null>
  setProvider: Dispatch<Provider>
  setWallet: Dispatch<Wallet | null>
}

const WalletContext = createContext<WalletContextType | null>(null)

export default WalletContext
