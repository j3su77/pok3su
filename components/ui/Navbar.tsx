import { useContext } from "react";
import Link from "next/link";
import { MdCatchingPokemon } from "react-icons/md";
import { FaBars } from "react-icons/fa";
import { UIContext } from "../../context";

import styles from "./navbar.module.css";
import { AuthContext } from "../../context/auth/";
import NextLink from "next/link";
import { RiCloseLine } from "react-icons/ri";
import { useRouter } from "next/router";

export const Navbar = () => {
  const { toggleSideMenu, isMenuOpen } = useContext(UIContext);
  const { isLoggedIn, logout, poke } = useContext(AuthContext);
  const router = useRouter();

  return (
    <header className={styles.header} id="header">
      <nav className={`${styles.nav} container`}>
        <Link href={"/"}>
          <h2 className={styles.nav__logo}>
            <MdCatchingPokemon />
            Pok<span>3</span>su
          </h2>
        </Link>
        <div>
          <div className={styles["nav__content-menu"]}>
            <div className={styles.nav__menu} id="nav-menu">
              <ul className={styles.nav__list}>
                <li className={styles.nav__item}>
                  <Link href={`/`}>
                    <a className={styles.nav__link}>Inicio</a>
                  </Link>
                </li>
                {isLoggedIn && (
                  <li className={styles.nav__item}>
                    <Link href="/favorites">
                      <a
                        className={`${styles.nav__link} ${styles["content__favorite-icon"]}`}
                        data-number={poke.length}
                      >
                        Favoritos
                      </a>
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div className={styles["nav__session"]}>
              {isLoggedIn && (
                <a
                  className={`${styles["nav__button-session"]} button`}
                  onClick={logout}
                >
                  Salir
                </a>
              )}
              {!isLoggedIn && router.asPath !== "/auth/login" && (
                <Link href="/auth/login">
                  <a className={`${styles["nav__button-session"]} button`}>
                    Entrar
                  </a>
                </Link>
              )}
              {!isLoggedIn && router.asPath !== "/auth/register" && (
                <Link href="/auth/register">
                  <a className={`${styles["nav__button-session"]} button`}>
                    Crear cuenta
                  </a>
                </Link>
              )}
            </div>
          </div>

          <div className={styles["nav__content-right"]}>
            {isLoggedIn && (
              <Link href="/favorites">
                <a
                  className={`${styles["content__favorite-icon"]} ${styles.icon__fav}`}
                  data-number={poke.length}
                >
                  <MdCatchingPokemon />
                </a>
              </Link>
            )}
            {!isMenuOpen ? (
              <div className={`${styles.nav__toggle} fadeIn`} id="nav-toggle">
                <FaBars onClick={toggleSideMenu} />
              </div>
            ) : (
              <div className={styles.nav__close} id="nav-close">
                <RiCloseLine onClick={toggleSideMenu} />
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
