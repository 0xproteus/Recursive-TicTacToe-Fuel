import styles from "./overlay.module.css"

interface Props {
  modal?: React.ReactNode
  show: boolean
  close: () => void
}

function Overlay({ modal, show, close }: Props) {
  return (
    <div className={`${styles.container}  ${show ? styles.show : ""}`} onClick={close}>
      <div className={styles.modal}>{modal}</div>
    </div>
  )
}

export default Overlay
