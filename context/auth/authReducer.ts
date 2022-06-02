
import { AuthState } from './';
import { IUser } from '../../interfaces';


type AuthActionType = 
   | { type: '[Auth] - Login', payload: IUser } 
   | { type: '[Auth] - Logout' } 
   | { type: '[Auth] - Update Pokemons Favorites', payload: number[]}


export const authReducer = ( state: AuthState, action: AuthActionType ): AuthState => {

   switch (action.type) {
        case '[Auth] - Login':
            return {
                ...state,
                isLoggedIn: true,
                user: action.payload
            }

        case '[Auth] - Logout':
            return {
                ...state,
                isLoggedIn: false,
                user: undefined,
            }
            case '[Auth] - Update Pokemons Favorites':
                return {
                    ...state,
                    poke: action.payload
                }


       default:
          return state;
   }

}