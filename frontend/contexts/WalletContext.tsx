import { createContext, useState } from "react"
import { Dispatch, SetStateAction } from "react"
import { BigNumberish, Provider, Wallet, TransactionResponse, Address } from "fuels"

export type WalletContextType = {
  address: Address | null
  provider: Provider
  wallet: any
  fuelInstalled: boolean
  gameID: BigNumberish
  isConnected: boolean

  setAddress: Dispatch<SetStateAction<Address | null>>
  setProvider: Dispatch<SetStateAction<Provider>>
  setWallet: Dispatch<SetStateAction<any>>
  setFuelInstalled: Dispatch<SetStateAction<boolean>>
  setGameID: Dispatch<SetStateAction<BigNumberish>>
  setConnected: Dispatch<SetStateAction<boolean>>
}

export const WalletContext = createContext<WalletContextType>({
  address: null,
  provider: new Provider("https://node-beta-2.fuel.network/graphql"),
  wallet: null,
  fuelInstalled: false,
  gameID: 0,
  isConnected: false,

  setAddress: () => {},
  setWallet: () => {},
  setProvider: () => {},
  setFuelInstalled: () => {},
  setGameID: () => {},
  setConnected: () => {},
})

interface Props {
  children: React.ReactNode
}

function WalletProvider({ children }: Props) {
  const RPC = "https://node-beta-2.fuel.network/graphql"
  //const RPC = "http://127.0.0.1:4000/graphql"

  const [address, setAddress] = useState<Address | null>(null)
  const [wallet, setWallet] = useState<any>(new Wallet())
  const [provider, setProvider] = useState<Provider>(new Provider(RPC))
  const [fuelInstalled, setFuelInstalled] = useState<boolean>(false)
  const [gameID, setGameID] = useState<BigNumberish>(0)
  const [isConnected, setConnected] = useState<boolean>(false)

  return (
    <WalletContext.Provider
      value={{
        wallet,
        provider,
        address,
        fuelInstalled,
        gameID,
        isConnected,

        setWallet,
        setProvider,
        setAddress,
        setFuelInstalled,
        setGameID,
        setConnected,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export default WalletProvider
