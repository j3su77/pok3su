
import styles from "./footer.module.css"

export const Footer = () => {
  return (
    <div className={styles.footer__containter}>
        {new Date().getFullYear()  } - J3su
    </div>
  )
}
