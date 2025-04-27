/* eslint-disable react-refresh/only-export-components */
import React, { useReducer, createContext, Dispatch } from "react";
import { initialState } from "./initialState";
import { appReducer } from "./reducer";
import { AppState, AppAction } from "../types";

// Define AppContext with proper types
interface AppContextType {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

export const AppContext = createContext<AppContextType>({
  state: initialState,
  dispatch: () => null,
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
