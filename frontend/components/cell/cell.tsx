import { SlotState } from "../../pages"
import styles from "./cell.module.css"

interface Props {
  state: SlotState
  index: number[]
  highlight: boolean
  make_play: (board: number, position: number) => void
}

function Cell({ state, index, make_play, highlight }: Props) {
  const className = highlight ? styles.boxHighlight : styles.box

  if (state == SlotState.Player1) {
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
        <div className={styles.player1}></div>
      </div>
    )
  } else if (state == SlotState.Player2) {
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
        <div className={styles.player2}></div>
      </div>
    )
  } else {
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
        <button
          className={styles.playbutton}
          onClick={() => {
            make_play(index[0], index[1])
          }}
        >
          -
        </button>
      </div>
    )
  }
}

export default Cell
