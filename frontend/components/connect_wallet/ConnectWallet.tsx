import { BigNumberish, Provider, Wallet, TransactionResponse, Address } from "fuels"
import { useContext } from "react"
import WalletContext, { WalletContextType } from "../../contexts/WalletContext"
import styles from "./connectWallet.module.css"

function ConnectWallet() {
  const { address, provider, wallet, setAddress, setProvider, setWallet } = useContext(WalletContext) as WalletContextType

  async function connect() {
    await window.FuelWeb3.connect()
    const accounts = await window.FuelWeb3.accounts()
    window.FuelWeb3.getWallet(accounts[0])
    setAddress(accounts[0])
    setProvider(window.FuelWeb3.getProvider())
    setWallet(window.FuelWeb3.getWallet(accounts[0]))
  }
  async function disconnect() {
    await window.FuelWeb3.disconnect()
    setAddress(null)
    setWallet(null)
  }

  function pretty_address(address: string, digits = 6) {
    return address.slice(0, 2 + digits) + "•••" + address.slice(-digits)
  }

  if (!address) {
    return (
      <div className={styles.container}>
        <button className={styles.connect_button} onClick={connect}>
          Connect Wallet
        </button>
      </div>
    )
  } else {
    return (
      <div className={styles.container}>
        <div className={styles.address}>{pretty_address(address)}</div>
        <button onClick={disconnect}> Disconnect</button>
      </div>
    )
  }
}

export default ConnectWallet
