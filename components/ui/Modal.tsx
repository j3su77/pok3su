import { Dispatch, FC, FunctionComponent, ReactNode, SetStateAction, useEffect } from 'react';

import {  RiCloseLine } from "react-icons/ri";

import styles from "./modal.module.css"

interface Props {
    children: ReactNode,
    state: boolean,
    changeState: Dispatch<SetStateAction<boolean>>,
    title: string
}

export const Modal: FC<Props> = ({ children, state, changeState, title }) => {
    
  useEffect(() => {
    if (process.browser)
      document
        .querySelector("body")!
        .classList.toggle("modal__open", state);
  }, [state]);
  return (
      <>
        {state && (
          <div className={styles.modal__section}>
            <div className={styles.modal__container}>
              <div className={styles.modal__header}>{title}</div>
  
              <button className={styles["modal__btn-close"]} onClick={() => changeState(false)}>
                <RiCloseLine size={20} />
              </button>
              {children}
            </div >
          </div>
        )}
      </>
    );
  };
  
