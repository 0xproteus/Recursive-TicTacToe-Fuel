import { SlotState } from "../../pages"
import styles from "./tictactoe.module.css"
import Cell from "../cell/cell"

interface Props {
  tictactoe_state: SlotState[]
  game_state: SlotState
  index: number
  next_play_position: number
  make_play: (board: number, position: number) => void
}

function TicTacToe({ tictactoe_state, game_state, index, next_play_position, make_play }: Props) {
  const highlight = next_play_position == index || next_play_position == 10

  if (game_state == SlotState.Player1) {
    return (
      <div
        className={styles.container}
        style={{
          borderBottom: index == 6 || index == 7 || index == 8 ? "none" : "",
          borderLeft: index == 0 || index == 3 || index == 6 ? "none" : "",
          borderRight: index == 2 || index == 5 || index == 8 ? "none" : "",
          borderTop: index == 0 || index == 1 || index == 2 ? "none" : "",
        }}
      >
        <div className={styles.player1Won}></div>
      </div>
    )
  } else if (game_state == SlotState.Player2) {
    return (
      <div
        className={styles.container}
        style={{
          borderBottom: index == 6 || index == 7 || index == 8 ? "none" : "",
          borderLeft: index == 0 || index == 3 || index == 6 ? "none" : "",
          borderRight: index == 2 || index == 5 || index == 8 ? "none" : "",
          borderTop: index == 0 || index == 1 || index == 2 ? "none" : "",
        }}
      >
        <div className={styles.player2Won}></div>
      </div>
    )
  } else {
    //background: (next_play_position == index || next_play_position == 10)? "rgba(76, 175, 80, 0.3)" : ''
    return (
      <div
        className={styles.container}
        style={{
          borderBottom: index == 6 || index == 7 || index == 8 ? "none" : "",
          borderLeft: index == 0 || index == 3 || index == 6 ? "none" : "",
          borderRight: index == 2 || index == 5 || index == 8 ? "none" : "",
          borderTop: index == 0 || index == 1 || index == 2 ? "none" : "",
        }}
      >
        <div className={styles.line}>
          <Cell state={tictactoe_state[0]} index={[index, 0]} make_play={make_play} highlight={highlight} />
          <Cell state={tictactoe_state[1]} index={[index, 1]} make_play={make_play} highlight={highlight} />
          <Cell state={tictactoe_state[2]} index={[index, 2]} make_play={make_play} highlight={highlight} />
        </div>
        <div className={styles.line}>
          <Cell state={tictactoe_state[3]} index={[index, 3]} make_play={make_play} highlight={highlight} />
          <Cell state={tictactoe_state[4]} index={[index, 4]} make_play={make_play} highlight={highlight} />
          <Cell state={tictactoe_state[5]} index={[index, 5]} make_play={make_play} highlight={highlight} />
        </div>
        <div className={styles.line}>
          <Cell state={tictactoe_state[6]} index={[index, 6]} make_play={make_play} highlight={highlight} />
          <Cell state={tictactoe_state[7]} index={[index, 7]} make_play={make_play} highlight={highlight} />
          <Cell state={tictactoe_state[8]} index={[index, 8]} make_play={make_play} highlight={highlight} />
        </div>
      </div>
    )
  }
}

export default TicTacToe
