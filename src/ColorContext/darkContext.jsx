/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useReducer, useEffect } from 'react';
import darkReducer from './darkReducer';

const INITIAL_STATE = {
    darkMode: false,
    role: localStorage.getItem('role') || 'SERVICE_ADMIN', // Initialiser à partir du localStorage
};

export const ColorContext = React.createContext(INITIAL_STATE);

export function ColorContextProvider({ children }) {
    const [state, dispatch] = useReducer(darkReducer, INITIAL_STATE);

    useEffect(() => {
        console.log("Current State:", state);
    }, [state]);

    return (
        <ColorContext.Provider
            value={{
                darkMode: state.darkMode,
                role: state.role,
                dispatch,
            }}
        >
            {children}
        </ColorContext.Provider>
    );
}
