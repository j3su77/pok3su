import { FC, useReducer, useEffect, ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';

import Cookies from 'js-cookie';
import axios, { AxiosError } from 'axios';

import { AuthContext, authReducer } from './';

import { pok3suApi } from '../../apis';
import { IUser } from '../../interfaces';

export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser;
    poke: number[]
}

interface Props {
    children: ReactNode,
}


const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
    poke: []
}


export const AuthProvider:FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer( authReducer, AUTH_INITIAL_STATE );
    const { data, status } = useSession();
    const router = useRouter();

    const [pokemonFavorites, setPokemonFavorites] = useState<number[]>([]);


    useEffect(() => {
      if ( status === 'authenticated' ) {
        dispatch({ type: '[Auth] - Login', payload: data?.user as IUser })
      }else {
          dispatch({type: '[Auth] - Logout'})
      }
      
    }, [ status, data ])



    useEffect(() => {
        const use = async() => { 
        if(status === "authenticated"){
               await updatedPokemonsFav()
          }
         }
         use()
    }, [status])


    
  
    const updatedPokemonsFav = async (): Promise<boolean> => {

        let emailUser;
        
     
            emailUser = data?.user?.email!

            try {
                console.log(emailUser)
                const { data } = await pok3suApi.post('/addfavorite', { emailUser });
                console.log({pro:data});
                if(data) {
                    dispatch({type: '[Auth] - Update Pokemons Favorites', payload: data })
               
                }
                return true;
            } catch (error) {
                if ( axios.isAxiosError(error) ) {
                   console.log("" + error.response)
                }
                return false
            }
       
      
    }


    const loginUser = async( email: string, password: string ): Promise<boolean> => {

        try {
            const { data } = await pok3suApi.post('/user/login', { email, password });
            const { token, user } = data;
            Cookies.set('token', token );
            dispatch({ type: '[Auth] - Login', payload: user });
            return true;
        } catch (error) {
            if ( axios.isAxiosError(error) ) {
                console.log( error.response)
                }
                return false
        }

    }


    const registerUser = async( name: string, email: string, password: string ): Promise<{hasError: boolean; message?: string}> => {
        try {
            const { data } = await pok3suApi.post('/user/register', { name, email, password });
            const { token, user } = data;
            Cookies.set('token', token );
            dispatch({ type: '[Auth] - Login', payload: user });
            return {
                hasError: false
            }

        } catch (error) {
            if ( axios.isAxiosError(error) ) {
                const { message } = error.response?.data as {message : string}
                return {
                  hasError: true,
                  message
                };
            }
            return {
                hasError: true,
                message: 'No se pudo crear el usuario - intente de nuevo'
            }
        }
    }


    const logout = () => {
      
        Cookies.remove("userIn")
        signOut();
        // router.reload();
        // Cookies.remove('token');
    }



    return (
        <AuthContext.Provider value={{
            ...state,

            // Methods
            loginUser,
            registerUser,
            logout,
            updatedPokemonsFav,
            pokemonFavorites
        }}>
            { children }
        </AuthContext.Provider>
    )
};