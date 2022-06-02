

import styles from "./noFavorites.module.css"
import Image from 'next/image';


export const NoFavorites = () => {
  return (
    <div className={styles.nofavorites__container}>
      <div  className={styles.nofavorites__img}>
      <Image  
     
      src={"/pikachu-cry.png"}
      alt="cry picachu"
      width="250"
      height="200"
      objectFit='fill'
      />
      </div>
      <h2 className={styles.nofavorites__text}>No tienes Ningun Pokemon Favorito😞<wbr /> ¡Vamos! Hazte con todos.</h2>
    </div>
  )
}
