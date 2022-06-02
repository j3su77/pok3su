import { FC, ReactNode, useEffect, useReducer } from 'react';
import Cookies from "js-cookie"

import { UIContext, uiReducer } from './';

interface Props {
    children: ReactNode
}

export interface UIState {
  isMenuOpen: boolean,
}

const UI_INITIAL_STATE: UIState = {
  isMenuOpen: false,

}


export const UIProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);


  const toggleSideMenu = () => {
      dispatch({ type: "[UI] - ToggleMenu" })
  }





 return (
    <UIContext.Provider value={{
       ...state,

       // Methods
       toggleSideMenu,
    }}>
        {children}
    </UIContext.Provider>
 );
};