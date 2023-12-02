"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { appReducer } from "./AppReducer";
import { INITIAL_LOAD_DATA, SET_CATALOG } from "../actions";
import {
  courseState,
  pathwaysCategories,
  APPLICATION_STATE_KEY,
} from "@/public/data/staticData";
import { ApplicationContext } from "@/app/model/AppContextInterface";

const constantApplicationValue = { courseState, pathwaysCategories };

const defaultInitialState: ApplicationContext = {
  catalog_year: -1, // this value is to keep the dropdown text empty while fetching localStorage
  // TODO: all course with status
  setCatalog: () => {},
  myCourses: [],
  ...constantApplicationValue,
};

const getInitialState: () => ApplicationContext = () => defaultInitialState;

const AppContext = createContext<ApplicationContext>(getInitialState());

const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, getInitialState());

  // Get data from localStorage
  useEffect(() => {
    const localStorageString = localStorage.getItem(APPLICATION_STATE_KEY);
    const stateWithoutLocalStorage = {
      ...defaultInitialState,
      catalog_year: 2023,
      myCourses: []
    };

    let payload = stateWithoutLocalStorage;
    if (localStorageString) {
      const localStorageData = JSON.parse(localStorageString);
      payload = {
        ...stateWithoutLocalStorage, // First spread the context state
        ...localStorageData, // Then spread the localStorage data
      };
    }

    dispatch({
      type: INITIAL_LOAD_DATA,
      payload: payload,
    });
  }, []);

  // Update localStorage
  useEffect(() => {
    localStorage.setItem(APPLICATION_STATE_KEY, JSON.stringify(state));
  }, [state]);

  // Declare any state function here
  // and pass through value props in AppContext.Provider
  const setCatalog = (catalog_year: number) => {
    dispatch({ type: SET_CATALOG, payload: catalog_year });
  };

  return (
    <AppContext.Provider value={{ ...state, setCatalog }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
export default AppContextProvider;
