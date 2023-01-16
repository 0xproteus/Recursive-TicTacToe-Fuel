import { SlotState } from "../../pages"
import styles from "./cell.module.css"

interface Props {
  state: SlotState
  index: number[]
  highlight: boolean
  play_position: number[]
  make_play: (board: number, position: number) => void
}

function Cell({ state, index, make_play, highlight, play_position }: Props) {
  const className = highlight ? styles.boxHighlight : styles.box
  const play = play_position[0] === index[0] && play_position[1] === index[1]

  let cell_state
  if (state == SlotState.Player1) {
    cell_state = <div className={styles.player1}></div>
  } else if (state == SlotState.Player2) {
    cell_state = <div className={styles.player2}></div>
  } else if (highlight) {
    cell_state = (
      <button
        style={{ backgroundColor: play ? "var(--primary_color)" : "" }}
        className={styles.playbutton}
        onClick={() => {
          make_play(index[0], index[1])
        }}
      ></button>
    )
  }

  return (
    <div
      className={className}
      style={{
        borderBottom: index[1] == 6 || index[1] == 7 || index[1] == 8 ? "none" : "",
        borderLeft: index[1] == 0 || index[1] == 3 || index[1] == 6 ? "none" : "",
        borderRight: index[1] == 2 || index[1] == 5 || index[1] == 8 ? "none" : "",
        borderTop: index[1] == 0 || index[1] == 1 || index[1] == 2 ? "none" : "",
      }}
    >
      {cell_state}
    </div>
  )
}

export default Cell
