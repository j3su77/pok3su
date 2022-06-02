/* eslint-disable @next/next/no-img-element */
import React, { FC } from 'react'

import styles from "./favoriteCard.module.css"
import Image from 'next/image';

interface Props {
  poke: number
}

export const FavoriteCard: FC<Props>  = ({poke}) => {
  console.log({poke: poke});

  var min = 100;
  var max = 1200;

  var x = Math.random()*(max - min)+min;

  
  return (
    <div className={styles.favoriteCard}>
      <img
      className={styles.favoriteCard__img}
       src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${poke}.svg`}
       alt={``}
       width={"100%"}
        height={x}
       />
    </div>
  )
}


