"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { appReducer } from "./AppReducer";
import {INITIAL_LOAD_DATA, SET_CATALOG, SET_PATHWAYS} from "../actions";
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
  pathwayData: "",
  setPathways: () => {},
  setCatalog: () => {},
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
    };

    dispatch({
      type: INITIAL_LOAD_DATA,
      payload: localStorageString
        ? JSON.parse(localStorageString)
        : stateWithoutLocalStorage,
    });
  }, []);

  // Update localStorage
  useEffect(() => {
    localStorage.setItem(APPLICATION_STATE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await     fetch(
            `http://localhost:3000/api/pathway/search?${new URLSearchParams({
              searchString: "",
              department: "",
              catalogYear: "2022-2023",
            })}`);
        const initialData = await response.json();
        console.log("INIT: " + JSON.stringify(initialData));
        dispatch({
          type: SET_PATHWAYS,
          payload: initialData,
        });
        console.log("INIT Pathways")
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    fetchInitialData();
  }, []);


  // Declare any state function here
  // and pass through value props in AppContext.Provider
  const setCatalog = (catalog_year: number) => {
    dispatch({ type: SET_CATALOG, payload: catalog_year });
  };


  const setPathways = (pathwayData: any) => {
    dispatch({type: SET_PATHWAYS, payload: pathwayData})
  };

  return (
    <AppContext.Provider value={{ ...state, setCatalog,setPathways }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
export default AppContextProvider;
