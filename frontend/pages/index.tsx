import styles from "../styles/Home.module.css"
import Board from "../components/board/board"
import { useState, useEffect, use, useContext } from "react"

import { BigNumberish, Provider, Wallet, TransactionResponse, Address } from "fuels"
import { ContractAbi__factory } from "../contracts"
import { ContractAbi, IdentityOutput, IdentityInput, AddressInput } from "../contracts/ContractAbi"

import ConnectWallet from "../components/connect_wallet/ConnectWallet"
import { WalletContext } from "../contexts/WalletContext"
import { NativeAssetId } from "@fuel-ts/constants"
import Overlay from "../components/overlay/overlay"
import { title } from "../public/title"
import { CONTRACT_ID, ZERO_ADDRESS } from "../public/constants"

declare global {
  interface Window {
    fuel: any
  }
}

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
const winningMessage = ["On Going", "X", "O"]

export default function Home() {
  const { address, provider, wallet, gameID, setGameID, isConnected } = useContext(WalletContext)

  const [boardState, setBoardState] = useState<SlotState[][]>(Array(9).fill(Array(9).fill(SlotState.Empty)))
  const [nextPlayPositon, setNextPlayPositon] = useState(10)
  const [gameBoard, setGameBoard] = useState<SlotState[]>(Array(9).fill(SlotState.Empty))
  const [players, setPlayers] = useState<PlayerState>()
  const [winner, setWinner] = useState<SlotState>(SlotState.Empty)

  const [gameID_input, set_gameID_input] = useState<string>("0")
  const [opponentAddress, setOpponentAddress] = useState<Address | undefined>(undefined)
  const [overlay, setOverlay] = useState<boolean>(false)

  const contract = ContractAbi__factory.connect(CONTRACT_ID, provider)

  useEffect(() => {
    const interval = setInterval(() => {
      setGameID((v) => {
        getState(v)
        return v
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getState = async (gameID: BigNumberish) => {
    if (gameID != 0) {
      try {
        const { value } = await contract.functions.view(gameID).get()
        setGameBoard(value.game_state)
        setBoardState(value.boards_state)
        setNextPlayPositon(value.next_play_position)
        setPlayers({
          player1: value.player1.Address?.value,
          player2: value.player2.Address?.value,
          current_player: value.next_player.Address?.value,
        } as PlayerState)
        setWinner(value.winner)
        if (value.player1.Address?.value === address?.toHexString()) {
          const Oppaddress = Address.fromString(value.player2.Address!.value)
          setOpponentAddress(Oppaddress)
        } else {
          const Oppaddress = Address.fromString(value.player1.Address!.value)
          setOpponentAddress(Oppaddress)
        }
        console.log(value)
      } catch (err) {
        console.log(err)
      }
    }
  }

  const startGame = async () => {
    const contr = ContractAbi__factory.connect(CONTRACT_ID, wallet)

    try {
      const { logs } = await contr.functions.start_game().txParams({ gasPrice: 1 }).call()
      setGameID(logs[0])
    } catch (err) {
      console.log(err)
    }
  }

  const joinGame = async (id: number) => {
    const contr = ContractAbi__factory.connect(CONTRACT_ID, wallet)
    if (id != 0) {
      try {
        await contr.functions.join_game(id).txParams({ gasPrice: 1 }).call()
        setGameID(id)
      } catch (err) {
        console.log(err)
      }
      await getState(gameID)
    }
  }

  const makePlay = async (board: number, position: number) => {
    if ((nextPlayPositon == board || nextPlayPositon == 10) && winner == SlotState.Empty) {
      if (players?.current_player === address?.toHexString()) {
        const contr = ContractAbi__factory.connect(CONTRACT_ID, wallet)
        try {
          await contr.functions.make_play(board, position).txParams({ gasPrice: 1 }).call()
        } catch (err) {
          console.log(err)
        }
      }
      await getState(gameID)
    }
  }

  const quitGame = async () => {
    const contr = ContractAbi__factory.connect(CONTRACT_ID, wallet)

    try {
      await contr.functions.quit_game().txParams({ gasPrice: 1 }).call()
      setGameID(0)
    } catch (err) {
      console.log(err)
    }
  }

  let help = (
    <div>
      <p>
        In this game there is a board with 9 cells just like regular Tic-Tac-Toe with the twist that inside each cell there is another game of Tic-Tac-Toe occurring, in order to win you have to allign
        3 winning Tic-Tac-Toes.
      </p>
      <p> To play connect you wallet and start a new game or insert a game ID to join an already existing one.</p>
    </div>
  )

  let help2 = (
    <div>
      <p>
        The position in the board on which you can play in is determined by the action of the player in the previous turn, so if they played in the board center and, top left corner of the cell the
        next player must make a move in the board top left corner.
      </p>
      <p> To make a move in your turn click on the position you wish and confirm the transaction on your wallet. To exit game and start a new one press the Quit button.</p>
    </div>
  )

  let display
  if (gameID == 0) {
    display = (
      <>
        {title}
        <div>
          <h2>Join or Start a Game</h2>
          <div className={styles.buttonsContainer}>
            {isConnected ? (
              <>
                <button onClick={startGame}>Start </button>
                <button onClick={() => joinGame(Number(gameID_input))}>Join </button>
              </>
            ) : (
              <>
                <button className={styles.grayButton}>Connect First </button>
                <button className={styles.grayButton}>Connect First </button>
              </>
            )}

            <input type="number" id="gameIDinput" placeholder="Game ID" /*value={gameID_input}*/ onChange={(v) => set_gameID_input(v.target.value)} />
            <button
              onClick={() => {
                setOverlay(true)
              }}
            >
              Help
            </button>
          </div>
        </div>
        <Overlay
          show={overlay}
          modal={help}
          close={() => {
            setOverlay(false)
          }}
        ></Overlay>
      </>
    )
  } else {
    display = (
      <>
        {title}
        <Board tictactoe_state={boardState} game_state={gameBoard} nex_play_positon={nextPlayPositon} make_play={makePlay} />
        <h2>Game ID: {gameID.toString()}</h2>
        <h2>Opponent: {opponentAddress?.toString() === ZERO_ADDRESS ? "No Opponent" : opponentAddress?.toString()}</h2>
        <h2>Current Turn: {players?.current_player === players?.player1 ? "X" : "O"}</h2>
        <h2>Play Position: {nextPlayPositon == 10 ? "Free Play" : playPositions[nextPlayPositon]}</h2>
        <h2>Winner: {winningMessage[winner]}</h2>

        <div className={styles.buttonsContainer}>
          <button
            onClick={() => {
              setOverlay(true)
            }}
          >
            Help
          </button>

          <button onClick={quitGame}>Quit</button>
        </div>

        <Overlay
          modal={help2}
          show={overlay}
          close={() => {
            setOverlay(false)
          }}
        ></Overlay>
      </>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div></div>
        <div className={styles.header_right}>
          <ConnectWallet />
        </div>
      </header>

      <main className={styles.main}>{display}</main>
    </div>
  )
}
