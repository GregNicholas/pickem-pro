import { Dispatch, SetStateAction } from "react";
import styles from "./Modal.module.css";
import { RiCloseLine } from "react-icons/ri";
import { useRouter } from "next/router";
import { useLeagueContext } from "../../context/LeagueContext";
import { League } from "../../types";

type ModalProps = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  message: string;
  leagueData: League;
}

const Modal = ({ setIsOpen, message, leagueData }: ModalProps) => {
  const router = useRouter();

  const goToLeaguePage = () => {
    router.push(`leagues/${leagueData.name}`);
    setIsOpen(false)
  }

  return (
    <>
    <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
    <div className={styles.centered}>
        <div className={styles.modal}>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button>
          <div className={styles.modalContent}>
            {message}
          </div>
          <div className={styles.modalActions}>
            <div className={styles.actionsContainer}>
              <button className={styles.deleteBtn} onClick={goToLeaguePage}>
                Go to League page
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};

export default Modal;