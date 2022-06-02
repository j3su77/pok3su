
import { createContext } from 'react';
import { IUser } from '../../interfaces';


interface ContextProps {
    isLoggedIn: boolean;
    user?: IUser;
    poke: number[]

    loginUser: (email: string, password: string) => Promise<boolean>;
    registerUser: (name: string, email: string, password: string) => Promise<{ hasError: boolean; message?: string; }>;
    logout: () => void;
    updatedPokemonsFav: () => Promise<boolean>
    pokemonFavorites: number[]
}


export const AuthContext = createContext({} as ContextProps );