import type { GetStaticProps, NextPage } from 'next'
import { pokeApi } from '../apis';

import { MainLayout } from '../components/layouts';
import { PokemonCard } from '../components/pokemon';
import { SmallPokemon, PokemonListResponse } from '../interfaces';

import styles from '../styles/Home.module.css'


interface Props {
  pokemons: SmallPokemon[]
}


const HomePage: NextPage<Props> = ({pokemons}) => {
  return (
    <MainLayout title={'Pok3su | Home'} >
       <div className={`container grid ${styles.poke__container}`}>
       {
          pokemons.map((pokemon, id) => (
           <PokemonCard key={id} pokemon={pokemon} />
          ))
        }
       </div>
    </MainLayout>
  )
}



export const getStaticProps: GetStaticProps = async (ctx) => {

  const {data} = await pokeApi.get<PokemonListResponse>("/pokemon?limit=151")

  const pokemons: SmallPokemon[] = data.results.map((poke, i) => ({
    ...poke,
    id: i + 1,
    img: `https://raw.githubusercontent.com/PokeApi/sprites/master/sprites/pokemon/other/dream-world/${i + 1}.svg`
  }))

  return {
    props: {
       pokemons
    }
  }
}







export default HomePage
