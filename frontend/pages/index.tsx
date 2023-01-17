import styles from "../styles/Home.module.css"
import Board from "../components/board/board"
import { useState, useEffect, useContext } from "react"
import { BigNumberish, Address } from "fuels"
import { ContractAbi__factory } from "../contracts"
import ConnectWallet from "../components/connect_wallet/ConnectWallet"
import { WalletContext } from "../contexts/WalletContext"
import { ZeroBytes32 } from "@fuel-ts/constants"
import Overlay from "../components/overlay/overlay"
import { title } from "../public/title"
import { CONTRACT_ID, ZERO_ADDRESS } from "../public/constants"

declare global {
  interface Window {
    fuel: any
  }
}

export type PlayerState = {
  player1: Address
  player2: Address
  current_player: Address
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
  const [players, setPlayers] = useState<PlayerState>({
    player1: Address.fromString(ZeroBytes32),
    player2: Address.fromString(ZeroBytes32),
    current_player: Address.fromString(ZeroBytes32),
  })
  const [winner, setWinner] = useState<SlotState>(SlotState.Empty)

  const [gameID_input, set_gameID_input] = useState<string>("0")
  const [overlay, setOverlay] = useState<boolean>(false)
  const [playPosition, setPlayPosition] = useState<number[]>([10, 10])

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
          player1: Address.fromString(value.player1.value),
          player2: Address.fromString(value.player2.value),
          current_player: Address.fromString(value.next_player.value),
        } as PlayerState)
        setWinner(value.winner)
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
      setGameID(logs[0].game_id)
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
      if (players?.current_player.toHexString() === address?.toHexString()) {
        setPlayPosition([board, position])
        const contr = ContractAbi__factory.connect(CONTRACT_ID, wallet)
        try {
          await contr.functions.make_play(board, position).txParams({ gasPrice: 1 }).call()
          setPlayPosition([10, 10])
        } catch (err) {
          console.log(err)
          console.log("rejected")
          setPlayPosition([10, 10])
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

  const help = (
    <div>
      <p>
        Recursive Tic-Tac-Toe is a variation of the classic Tic-Tac-Toe game where each cell on the board contains a smaller Tic-Tac-Toe board. The objective of the game is to get three of your
        symbols in a row on the larger board.
      </p>
      <p> To play connect you wallet and start a new game or insert a game ID to join an already existing one.</p>
    </div>
  )

  const help2 = (
    <div>
      <p>
        The position in which a player can make their move on the board is determined by the location of the previous player&apos;s move. For example, if the previous player made a move in the center
        and top-left corner of a cell, the next player must make their move in the top-left corner board.
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

            <input type="number" id="gameIDinput" placeholder="Game ID" onChange={(v) => set_gameID_input(v.target.value)} />
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
        <Board tictactoe_state={boardState} game_state={gameBoard} nex_play_positon={nextPlayPositon} make_play={makePlay} play_position={playPosition} />
        <h2>Game ID: {gameID.toString()}</h2>
        <h2 style={{ display: "flex" }}>
          Current Turn: {players?.current_player.toHexString() === address?.toHexString() ? "Yours" : "Opponent's"}{" "}
          <div className={players.current_player.toString() === players.player1.toString() ? styles.player1 : styles.player2}></div>
        </h2>
        <h2>Play Position: {nextPlayPositon == 10 ? "Free Play" : playPositions[nextPlayPositon]}</h2>
        <h2>
          Opponent:{" "}
          {players.player2.toString() === ZERO_ADDRESS || players.player1.toString() === ZERO_ADDRESS
            ? "No Opponent"
            : players.player1.toString() === address.toString()
            ? players.player2.toString()
            : players.player1.toString()}
        </h2>
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
