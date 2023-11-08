import styles from './Loader.module.css';

export default function Loader() {
  return (
    <div className={styles.box}>
        <div className={styles.shadow}></div>
            {/* <div className={styles.gravity}> */}
                <div className={styles.ball}></div>
            {/* </div> */}
    </div>
    )
}