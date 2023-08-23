import { Dispatch, SetStateAction } from "react";
import styles from "./Modal.module.css";
import { RiCloseLine } from "react-icons/ri";
import { useRouter } from "next/router";

type ModalProps = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  message: string;
  name: string;
}

const Modal = ({ setIsOpen, message, name }: ModalProps) => {
  const router = useRouter();

  const goToLeaguePage = () => {
    router.push(`leagues/${name}`);
    setIsOpen(false)
  }

  return (
    <>
    <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
    <div className={styles.centered}>
        <div className={styles.modal}>
          {/* <div className={styles.modalHeader}>
            <h5 className={styles.heading}>Dialog</h5>
          </div> */}
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