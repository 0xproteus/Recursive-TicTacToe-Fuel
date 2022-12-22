import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import Board from "../components/board/board"
import { useState, useEffect, use } from "react"

import { BigNumberish, Provider, Wallet, TransactionResponse, Address } from "fuels"
import { ContractAbi__factory } from "../contracts"
import { ContractAbi, IdentityOutput, IdentityInput, AddressInput } from "../contracts/ContractAbi"
import WalletContext from "../contexts/WalletContext"
import ConnectWallet from "../components/connect_wallet/ConnectWallet"

declare global {
  interface Window {
    FuelWeb3: any
  }
}

const NativeAssetId = "0x0000000000000000000000000000000000000000000000000000000000000000"

const RPC = "https://node-beta-2.fuel.network/graphql"
//const RPC = "http://127.0.0.1:4000/graphql"

const CONTRACT_ID = "0xadf36b39d2680fea4912d8ec3c814db2d92e5734b63e5cfa48f11a50d3b196f7"

export type PlayerState = {
  player1: string | null
  player2: string | undefined
  current_player: string | undefined
}

export enum SlotState {
  Empty,
  Player1,
  Player2,
}

const playPositions = ["Top Left", "Top Middle", "Top Center", "Center Left", "Center", "Center Right", "Bottom Left", "Bottom Center", "Bottom Right"]
const winningMessage = ["On Going", "Player 1", "Player 2"]

export default function Home() {
  const [address, setAddress] = useState<string | null>(null)
  const [gameID, setGameID] = useState<BigNumberish>(1)
  const [boardState, setBoardState] = useState<SlotState[][]>(Array(9).fill(Array(9).fill(SlotState.Empty)))
  const [nextPlayPositon, setNextPlayPositon] = useState(10)
  const [gameBoard, setGameBoard] = useState<SlotState[]>(Array(9).fill(SlotState.Empty))
  const [players, setPlayers] = useState<PlayerState>()
  const [winner, setWinner] = useState<SlotState>(SlotState.Empty)
  const [provider, setProvider] = useState<Provider>(new Provider(RPC))
  const [wallet, setWallet] = useState<any>(new Wallet())
  const [contract, setContract] = useState<ContractAbi>(ContractAbi__factory.connect(CONTRACT_ID, provider))
  const [gameID_input, set_gameID_input] = useState<string>("0")

  useEffect(() => {
    setContract(ContractAbi__factory.connect(CONTRACT_ID, provider))
  }, [wallet])

  useEffect(() => {
    const interval = setInterval(() => {
      // getState();
      setGameID((v) => {
        getState(v)
        return v
      })
      //console.log(gameID)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getState = async (gameID: BigNumberish) => {
    try {
      const accounts = await window.FuelWeb3.accounts()
      const account = accounts[0]
      const address = new Address(account)

      const { value } = await contract.functions
        .player_state({
          Address: { value: address.toHexString() },
        })
        .get()
      console.log("game id", value.toNumber())
      setGameID(value)
      //console.log(account, window.FuelWeb3.getProvider())
    } catch (err) {
      console.log(err)
    }

    const { value } = await contract.functions.view(gameID).get()
    setGameBoard(value[0])
    setBoardState(value[1])
    setNextPlayPositon(value[2])
    setPlayers({
      player1: value[3].Address?.value,
      player2: value[4].Address?.value,
      current_player: value[5].Address?.value,
    } as PlayerState)
    setWinner(value[6])
    console.log(value)
  }

  const startGame = async () => {
    const contr = ContractAbi__factory.connect(CONTRACT_ID, wallet)

    try {
      const { value } = await contr.functions.start_game().txParams({ gasPrice: 1 }).call()
      setGameID(value)
    } catch (err) {
      console.log(err)
    }

    await getState(gameID)
  }

  const joinGame = async () => {
    const contr = ContractAbi__factory.connect(CONTRACT_ID, wallet)

    try {
      await contr.functions.join_game(gameID).txParams({ gasPrice: 1 }).call()
    } catch (err) {
      console.log(err)
    }

    await getState(gameID)
  }

  const makePlay = async (board: number, position: number) => {
    if ((nextPlayPositon == board || nextPlayPositon == 10) && winner == SlotState.Empty) {
      // if (players?.current_player?.Address?.value === players?.player1?.Address?.value) {
      //   await contract1.functions.make_play(board, position).call()
      // } else {
      //   await contract2.functions.make_play(board, position).call()
      // }

      const contr = ContractAbi__factory.connect(CONTRACT_ID, wallet)
      try {
        await contr.functions.make_play(board, position).txParams({ gasPrice: 1 }).call()
      } catch (err) {
        console.log(err)
      }

      await getState(gameID)
    }
  }

  return (
    <div className={styles.container}>
      <WalletContext.Provider
        value={{
          address,
          provider,
          wallet,
          setAddress,
          setProvider,
          setWallet,
        }}
      >
        <header className={styles.header}>
          <div></div>
          <div className={styles.header_right}>
            <ConnectWallet />
          </div>
        </header>
        <main className={styles.main}>
          <Board tictactoe_state={boardState} game_state={gameBoard} nex_play_positon={nextPlayPositon} make_play={makePlay} />
          <button onClick={startGame}>Start Game</button>
          <button onClick={joinGame}>Join Game</button>
          <button onClick={() => getState(gameID)}>getstate</button>

          <div>
            <input type="number" id="gameIDinput" placeholder="0" value={gameID_input} onChange={(v) => set_gameID_input(v.target.value)} />
            <button onClick={() => setGameID(Number(gameID_input))}>set game id</button>
          </div>

          {/* <h2>Current Game ID: {gameID}</h2> */}
          <h2>Current Turn: {players?.current_player === players?.player1 ? "Player 1 X" : "Player 2 O"}</h2>
          <h2>Play Positon: {nextPlayPositon == 10 ? "Free Play" : playPositions[nextPlayPositon]}</h2>
          <h2>Winner: {winningMessage[winner]}</h2>
        </main>
      </WalletContext.Provider>
    </div>
  )
}
