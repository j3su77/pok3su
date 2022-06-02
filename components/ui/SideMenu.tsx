import { useContext, useEffect } from "react";
import Link from "next/link";
import OutsideClickHandler from "react-outside-click-handler";
import { AuthContext, UIContext } from "../../context";

import styles from "./sideMenu.module.css";
import { useRouter } from "next/router";

export const SideMenu = () => {
  const { toggleSideMenu, isMenuOpen } = useContext(UIContext);
  const { isLoggedIn, logout } = useContext(AuthContext);

  useEffect(() => {
    if (process.browser)
      document
        .querySelector("body")!
        .classList.toggle("menu__open", isMenuOpen);
  }, [isMenuOpen]);
  const router = useRouter();
  return (
    <>
      <div
        className={`${styles.sideMenu__menu} ${
          isMenuOpen && styles["show-menu"]
        }`}
        id="sideMenu-menu"
      >
        <OutsideClickHandler
          onOutsideClick={() => {
            isMenuOpen && toggleSideMenu();
          }}
          display="contents"
        >
          <ul className={styles.sideMenu__list} onClick={toggleSideMenu}>
            <li className={styles.sideMenu__item}>
              <Link href={`/`}>
                <a className={styles.sideMenu__link}>Inicio</a>
              </Link>
            </li>
            {isLoggedIn && (
              <li className={styles.sideMenu__item}>
                <Link href={`/favorites`}>
                  <a className={styles.sideMenu__link}>Favoritos</a>
                </Link>
              </li>
            )}

            {isLoggedIn ? (
              <a
                className={`${styles.sideMenu__link} ${styles.sideMenu__logout} button`}
                onClick={logout}
              >
                Cerrar sesión
              </a>
            ) : (
              <>
                {router.asPath !== "/auth/login" && (
                  <li className={styles.sideMenu__item}>
                    <Link href={`/auth/login`}>
                      <a
                        className={`${styles.sideMenu__link} ${styles.sideMenu__login} button`}
                      >
                        Iniciar sesión
                      </a>
                    </Link>
                  </li>
                )}
                {router.asPath !== "/auth/register" && (
                  <li className={styles.sideMenu__item}>
                    <Link href={`/auth/register`}>
                      <a
                        className={`${styles.sideMenu__link} ${styles.sideMenu__login} button`}
                      >
                        Crear cuenta
                      </a>
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </OutsideClickHandler>
      </div>

      {isMenuOpen && <div className={`${styles.dark__screen} fadeIn`} />}
    </>
  );
};
