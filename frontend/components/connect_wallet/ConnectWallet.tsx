import { useContext } from "react"
import { WalletContext } from "../../contexts/WalletContext"
import styles from "./connectWallet.module.css"
import { ZERO_ADDRESS } from "../../public/constants"

function ConnectWallet() {
  const { address, fuelInstalled, connect, disconnect } = useContext(WalletContext)

  function pretty_address(addr: string, digits = 6) {
    return addr.slice(0, 2 + digits) + "•••" + addr.slice(-digits)
  }

  if (fuelInstalled === false) {
    return (
      <div className={styles.container}>
        <button>
          <a href="https://fuels-wallet.vercel.app/docs/install/" target="_blank" rel="noreferrer">
            Download Fuel Wallet
          </a>
        </button>
      </div>
    )
  } else if (address.toString() == ZERO_ADDRESS) {
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
        <div className={styles.address}>{pretty_address(address.toString()!)}</div>
        <button onClick={disconnect}> Disconnect</button>
      </div>
    )
  }
}

export default ConnectWallet
