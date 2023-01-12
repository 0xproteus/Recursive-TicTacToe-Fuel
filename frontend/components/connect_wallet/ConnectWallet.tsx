import { BigNumberish, Provider, Wallet, TransactionResponse, Address } from "fuels"
import { useContext, useEffect, useState } from "react"
import { WalletContext } from "../../contexts/WalletContext"
import { ContractAbi__factory } from "../../contracts"
import { CONTRACT_ID } from "../../public/constants"
import styles from "./connectWallet.module.css"

function ConnectWallet() {
  const { address, setAddress, provider, setProvider, setWallet, fuelInstalled, setFuelInstalled, setGameID, isConnected, setConnected } = useContext(WalletContext)

  const connect = async () => {
    try {
      await window.fuel.connect()

      const account = await window.fuel.accounts()
      window.fuel.getWallet(account[0])
      const add = new Address(account[0])
      setAddress(add)
      setProvider(window.fuel.getProvider())
      setWallet(window.fuel.getWallet(account[0]))
      setConnected(true)
      const contract = ContractAbi__factory.connect(CONTRACT_ID, provider)
      const { value } = await contract.functions
        .player_state({
          Address: { value: add.toHexString() },
        })
        .get()
      setGameID(value)
    } catch (err) {}
  }

  const disconnect = async () => {
    await window.fuel.disconnect()
    setAddress(null)
    setWallet(null)
    setGameID(0)
    setConnected(false)
  }

  function pretty_address(address: string, digits = 6) {
    return address.slice(0, 2 + digits) + "•••" + address.slice(-digits)
  }

  const c = async () => {
    try {
      const accounts = await window.fuel.accounts()

      if (accounts) {
        const accounts = await window.fuel.accounts()
        window.fuel.getWallet(accounts[0])
        const add = new Address(accounts[0])
        setAddress(add)
        setProvider(window.fuel.getProvider())
        setWallet(window.fuel.getWallet(accounts[0]))
        setConnected(true)
        const contract = ContractAbi__factory.connect(CONTRACT_ID, provider)
        const { value } = await contract.functions
          .player_state({
            Address: { value: add.toHexString() },
          })
          .get()
        setGameID(value)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (window.fuel) {
      c()
      setFuelInstalled(true)
    } else {
      setFuelInstalled(false)
    }
  }, [])

  if (fuelInstalled === false) {
    return (
      <div className={styles.container}>
        <button>
          <a href="https://fuels-wallet.vercel.app/docs/install/" target="_blank">
            Download Fuel Wallet
          </a>
        </button>
      </div>
    )
  } else if (!address) {
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
