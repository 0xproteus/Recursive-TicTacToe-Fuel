import { createContext, useState, useEffect } from "react"
import { Dispatch, SetStateAction } from "react"
import { BigNumberish, Provider, Wallet, Address } from "fuels"
import { ZeroBytes32 } from "@fuel-ts/constants"
import { ContractAbi__factory } from "../contracts"
import { CONTRACT_ID } from "../public/constants"
import { useFuel } from "../hooks/useFuel"

export type WalletContextType = {
  address: Address
  provider: Provider
  wallet: any
  fuelInstalled: boolean
  gameID: BigNumberish
  isConnected: boolean
  isLoading: boolean

  setAddress: Dispatch<SetStateAction<Address>>
  setProvider: Dispatch<SetStateAction<Provider>>
  setWallet: Dispatch<SetStateAction<any>>
  setFuelInstalled: Dispatch<SetStateAction<boolean>>
  setGameID: Dispatch<SetStateAction<BigNumberish>>
  setConnected: Dispatch<SetStateAction<boolean>>

  connect: () => void
  disconnect: () => void
}

export const WalletContext = createContext<WalletContextType>({
  address: Address.fromString(ZeroBytes32),
  provider: new Provider("https://node-beta-2.fuel.network/graphql"),
  wallet: null,
  fuelInstalled: false,
  gameID: 0,
  isConnected: false,
  isLoading: true,

  setAddress: () => {},
  setWallet: () => {},
  setProvider: () => {},
  setFuelInstalled: () => {},
  setGameID: () => {},
  setConnected: () => {},

  connect: () => {},
  disconnect: () => {},
})

interface Props {
  children: React.ReactNode
}

function WalletProvider({ children }: Props) {
  const RPC = "https://node-beta-2.fuel.network/graphql"
  //const RPC = "http://127.0.0.1:4000/graphql"

  const [address, setAddress] = useState<Address>(Address.fromString(ZeroBytes32))
  const [wallet, setWallet] = useState<any>(new Wallet())
  const [provider, setProvider] = useState<Provider>(new Provider(RPC))
  const [fuelInstalled, setFuelInstalled] = useState<boolean>(false)
  const [gameID, setGameID] = useState<BigNumberish>(0)
  const [isConnected, setConnected] = useState<boolean>(false)
  const [fuel, notDetected, isLoading] = useFuel()

  function connect() {
    const request_connect_wallet = async () => {
      try {
        await fuel.connect()

        const account = await fuel.accounts()
        const add = new Address(account[0])
        setAddress(add)
        setProvider(fuel.getProvider())
        setWallet(fuel.getWallet(account[0]))
        setConnected(true)
        const contract = ContractAbi__factory.connect(CONTRACT_ID, provider)
        const { value } = await contract.functions.player_state({ value: add.toHexString() }).get()
        setGameID(value)
      } catch (err) {
        console.log(err)
      }
    }
    request_connect_wallet()
  }

  function disconnect() {
    const dis = async () => {
      await fuel.disconnect()
      setAddress(Address.fromString(ZeroBytes32))
      setWallet(null)
      setGameID(0)
      setConnected(false)
    }
    dis()
  }

  useEffect(() => {
    const c = async () => {
      try {
        const accounts = await fuel.accounts()

        if (accounts) {
          const accounts = await fuel.accounts()
          fuel.getWallet(accounts[0])
          const add = new Address(accounts[0])
          console.log("ss", add)
          setAddress(add)
          setProvider(fuel.getProvider())
          setWallet(fuel.getWallet(accounts[0]))
          setConnected(true)
          const contract = ContractAbi__factory.connect(CONTRACT_ID, provider)
          const { value } = await contract.functions.player_state({ value: add.toHexString() }).get()
          setGameID(value)
        }
      } catch (err) {
        console.log(err)
      }
    }

    if (fuel) {
      setFuelInstalled(true)
      c()
    } else {
      setFuelInstalled(false)
    }
  }, [isLoading])

  return (
    <WalletContext.Provider
      value={{
        wallet,
        provider,
        address,
        fuelInstalled,
        gameID,
        isConnected,
        isLoading,

        setWallet,
        setProvider,
        setAddress,
        setFuelInstalled,
        setGameID,
        setConnected,

        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export default WalletProvider
