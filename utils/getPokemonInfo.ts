import { pokeApi } from "../apis";
import { Pokemon } from "../interfaces";


export const getPokemonInfo = async (nameOrId: string) => {
  try {
    const { data } = await pokeApi.get<Pokemon>(`/pokemon/${nameOrId}`);

    const {id, name, sprites, abilities, weight, height,types} = data

    return {
      id,
      name,
      sprites,
      abilities,
      weight,
      height,
      types,
    };
  } catch (error) {
      return null
  }
};
