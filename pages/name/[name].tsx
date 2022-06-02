import { useContext, useEffect, useState } from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import confetti from "canvas-confetti";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { FaRuler } from "react-icons/fa";
import { GiWeight } from "react-icons/gi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

import { MainLayout } from "../../components/layouts";
import { pokeApi } from "../../apis";
import { IUser, Pokemon, PokemonListResponse } from "../../interfaces";
import { getPokemonInfo } from "../../utils";
import { CardType } from "../../components/pokemon";
import { pok3suApi } from "../../apis";
import { AuthContext } from "../../context/auth";

import { Modal } from "../../components/ui/";

import styles from "../../styles/PokemonByNamePage.module.css";

interface Props {
  pokemon: Pokemon;
}

interface FormData {
  id?: string;
  num: number;
  e: React.FormEvent<HTMLFormElement>;
}

const PokemonByNamePage: NextPage<Props> = ({ pokemon }) => {
  const router = useRouter();
  const { user, updatedPokemonsFav, poke } = useContext(AuthContext);
  const { status } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [acceptDelete, setAcceptDelete] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (poke.includes(pokemon.id)) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
    console.log({ isfavorite: isFavorite });
  }, [isFavorite, poke, pokemon.id]);

  const onConfetti = () => {
    confetti({
      zIndex: 999,
      particleCount: 100,
      spread: 160,
      origin: {
        x: .9,
        y: .2,
      },
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPosting(true);
    const num = pokemon.id;
    const _id = user?._id;

    try {
      const { data } = await pok3suApi.put("/addfavorite", { _id, num });
      if (data) {
        await updatedPokemonsFav();
      }
      setTimeout(() => setIsPosting(false), 1000);  
      if (data.includes(pokemon.id)) {
        setIsFavorite(true);
        onConfetti();
      } else {
        setIsFavorite(false);
      }
    } catch (error) {
      setIsPosting(false);
      console.log(error);
    }
  };

  const openModal = () => {
    setModal1(!modal1);
  };
  const question = (prop: boolean) => {
    prop ? setAcceptDelete(true) : setAcceptDelete(false);
    setModal1(false);
  };
  useEffect(() => {
    const url = router.asPath
    acceptDelete && router.replace(`/auth/login?p=${url}`);
  }, [acceptDelete]);

  return (
    <MainLayout title={pokemon.name}>
      <div className={`${styles.pokemonpage} container`}>
        <div className={`${styles["pokemonpage__content-title"]}`}>
          <div className={styles.separate__item} />
          <h2 className={`section__title-center ${styles.pokemonpage__title}`}>
            {pokemon.id} - {pokemon.name}
          </h2>
          <form
            onSubmit={(e) => onSubmit(e)}
            className={styles.pokemonpage__form}
          >
            {status === "authenticated" && (
              <>
                <button
                  disabled={ isPosting }
                  type="submit"
                  className={`${styles["pokemonpage__button-favorite"]}`}
                >
                  {isFavorite ? <AiFillStar /> : <AiOutlineStar />}
                </button>
                {poke.length === 0 && (
                  <span className={styles.info__fav}>
                    Toca para agregar a favoritos
                  </span>
                )}
              </>
            )}
          </form>
          {status !== "authenticated" && (
            <div className={styles.pokemonpage__form}>
              <button
                className={`${styles["pokemonpage__button-favorite"]} ${styles["pokemonpage__button-favorite-out"]}`}
                onClick={openModal}
              >
                <AiOutlineStar />
              </button>
              <span className={styles.info__fav}>
                Toca para agregar a favoritos
              </span>
            </div>
          )}
        </div>

        <div className={`${styles.pokemonpage__container} container grid`}>
          <div className={styles["pokemonpage__content-main-image"]}>
            <div className={styles.pokemonpage__height}>
              <div className={styles.separate__item} />
              <p className={styles["pokemonpage__height-text"]}>
                <FaRuler /> {(pokemon.height * 100) / 1000} Metros
              </p>
              <div className={styles.separate__item} />
            </div>
            <div>
              <div className={styles["pokemonpage__content-img"]}>
                <Image
                  width={400}
                  height={400}
                  priority
                  className={styles["pokemonpage__main-img"]}
                  src={
                    pokemon.sprites.other?.dream_world.front_default ||
                    "./no-image.png"
                  }
                  alt={pokemon.name}
                />
              </div>
              <div className={styles.pokemonpage__weight}>
                <GiWeight /> {(pokemon.weight * 100) / 1000} Kilogramos
              </div>
            </div>
          </div>

          <div className={styles["pokemonpage__content-main-information"]}>
            <div className={`grid ${styles["pokemonpage__content-sprites"]}`}>
              <div>
                <Image
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  width={96}
                  height={96}
                />
              </div>

              <div>
                <Image
                  src={pokemon.sprites.back_default}
                  alt={pokemon.name}
                  width={96}
                  height={96}
                />
              </div>

              <div>
                <Image
                  src={pokemon.sprites.back_shiny}
                  alt={pokemon.name}
                  width={96}
                  height={96}
                />
              </div>

              <div>
                <Image
                  src={pokemon.sprites.front_shiny}
                  alt={pokemon.name}
                  width={96}
                  height={96}
                />
              </div>
            </div>

            <div className={styles["pokemonpage__content-type"]}>
              <h2 className={styles["pokemonpage__type-title"]}>Tipo:</h2>

              <div className={styles["pokemonpage__card-type"]}>
                {pokemon.types.map(({ type }, index) => (
                  <CardType key={index} type={type.name} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal title="Inicia sesion para guardarlo en favoritos" state={modal1} changeState={setModal1}>
        <div className={styles["modal__body"]}>
          <div className={styles["modal__body-title"]}>
            <h3>¿Deseas iniciar sesion?</h3>
          </div>
          <div className={styles["modal__content-btns-acceptdeny"]}>
            <button
              className={`${styles["modal__btn-accept"]} button`}
              onClick={() => question(true)}
            >
              Si, por favor
            </button>
            <button
              className={`${styles["modal__btn-cancel"]} button`}
              onClick={() => question(false)}
            >
              Ahora no joven
            </button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const { data } = await pokeApi.get<PokemonListResponse>("/pokemon?limit=151");

  const pokemonsNames: string[] = data.results.map((pokemon) => pokemon.name);
  return {
    paths: pokemonsNames.map((name) => ({
      params: { name },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { name } = params as { name: string };

  const pokemon = await getPokemonInfo(name);

  if (!pokemon) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      pokemon,
    },
  };
};

export default PokemonByNamePage;
