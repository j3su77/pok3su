import { useContext  } from 'react';
import { MainLayout } from "../../components/layouts/MainLayout";
import { NoFavorites, FavoriteCard } from "../../components/pokemon";
import { AuthContext } from "../../context";

import styles from "../../styles/FavoritesPage.module.css";


const FavoritesPage = () => {
  const { poke, user } = useContext(AuthContext);


  return (
    <MainLayout title="Pokemons - Favoritos">
      <div className={`${styles.favoritespage__container} container`}>
        {poke.length === 0 ? (
          <NoFavorites />
        ) : (
          <>
            <h3 className={styles["favoritespage__num-favorites"]}>
            Hola <span>{user!.name}</span>, <br />
              {poke.length === 1
                ? `  <br />Tienes solo un pokemon marcado como favorito`
                : poke.length < 10
                ? ` Tienes ${poke.length} pokemones marcados como favoritos`
                : ` ¡WOW! Tienes ${poke.length} pokemones marcados como favoritos, ¡El Equipo Rocket ha sido vencido otra vez! `}{" "}
            </h3>
            {poke
              .sort(() => 0.5 - Math.random())
              .map((poke) => (
                <FavoriteCard key={poke} poke={poke} />
              ))}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default FavoritesPage;
