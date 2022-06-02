import { FC, useContext, useEffect, useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { SmallPokemon } from "../../interfaces";

import styles from "./pokemonCard.module.css";
import { AiFillStar } from 'react-icons/ai';
import { AuthContext } from '../../context';


interface Props {
  pokemon: SmallPokemon;
}

export const PokemonCard: FC<Props> = ({ pokemon }) => {

  const {  poke } = useContext(AuthContext);
  const { id, img, name } = pokemon;
  const [isFavorite, setIsFavorite] = useState(false);





  useEffect(() => {
   
    if (poke.includes(pokemon.id)) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
    console.log({isfavorite: isFavorite});
  }, [isFavorite, poke, pokemon.id])





  return (
    <Link href={`/name/${name}`}>
      <a className={styles.poke__card}>
      <div className={styles["poke__card-id"]}>{id}</div>
      <div style={{backgroundColor: !isFavorite ? "var(--first-color)" : "yellow"}} className={`shape shape__smaller ${styles.shape__smaller}`}></div>

        <div className={styles["poke__card-header"]}>
          {
            isFavorite && (<div className={styles["poke__card-fav"]}> <AiFillStar />
            </div>)
          }
      
     
          <Image
            height={140}
            width={140}
            src={img}
            alt=""
            className={styles.poke__img}
          />
        </div>

        <div className={styles["poke__card-data"]}>
          <h3 className={styles["poke__card-title"]}>{name}</h3>
        </div>
      </a>
    </Link>
  );
};
