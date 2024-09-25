"use client";

import {createContext, ReactNode, useContext, useEffect, useReducer,} from "react";
import {appReducer} from "./AppReducer";
import {INITIAL_LOAD_DATA, SET_CATALOG, SET_COURSES, SET_PATHWAYS} from "../actions";
import {APPLICATION_STATE_KEY, courseState, pathwaysCategories,} from "@/public/data/staticData";
import {ApplicationContext} from "@/app/model/AppContextInterface";
import {ICourseSchema, IPathwaySchema} from "@/public/data/dataInterface";


const constantApplicationValue = { courseState, pathwaysCategories };

const defaultInitialState: ApplicationContext = {
  catalog_year: "2024-2025",
  courses: [],
  pathwayData: "",
  setCourses: () => {},
  setCatalog: () => {},
  fetchCourses: () => {},
  setPathways: () => {},
  updateCourseState: () => {},
  ...constantApplicationValue,
};

const AppContext = createContext<ApplicationContext>(defaultInitialState);

const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, defaultInitialState);

  useEffect(() => {
    const localStorageString = localStorage.getItem(APPLICATION_STATE_KEY);
    const initialState = localStorageString
      ? JSON.parse(localStorageString)
      : defaultInitialState;

    dispatch({
      type: INITIAL_LOAD_DATA,
      payload: initialState,
    });

    //Set the localStorage with the new initial state
    localStorage.setItem(APPLICATION_STATE_KEY,JSON.stringify(initialState));
  }, []);


  const setCatalog = (catalog_year: string) => {
    dispatch({ type: SET_CATALOG, payload: catalog_year });

    //Check if local stoarage value exists and if it does update with the new catalog year
    const storedStateString = localStorage.getItem(APPLICATION_STATE_KEY);
    if (storedStateString) {
      const storedState = JSON.parse(storedStateString);
      const updatedState = {
        ...storedState,
        catalog_year: catalog_year
      };
      localStorage.setItem(APPLICATION_STATE_KEY, JSON.stringify(updatedState));
    }
  };

  const updateCourseState = (name: string, status: string) => {
    const courses = state.courses;
    const updatedCourses: ICourseSchema[] = courses.map(course =>
      course.title === name
        ? { ...course, status: status}
        : course);
    setCourses(updatedCourses);
  };

  const setCourses = (courses: ICourseSchema[]) => {
    console.log("SETTING COURSES");
    dispatch({ type: SET_COURSES, payload: courses });  
    //Get the localStorage value and if it exists update the course
    const storedStateString = localStorage.getItem(APPLICATION_STATE_KEY);
    if (storedStateString) {
      const storedState = JSON.parse(storedStateString);
      const updatedState = {
        ...storedState,
        courses: courses
      };
      localStorage.setItem(APPLICATION_STATE_KEY, JSON.stringify(updatedState));
    }
    //Currently have two different values in local storage being used for courses
    //TODO Refactor to one single value for localStorage
    localStorage.setItem("courses", JSON.stringify(courses));
  };

  const fetchCourses = async () => {
    const localStorageCourses = localStorage.getItem("courses");
    if (localStorageCourses) {
      console.log("Courses already fetched, returning existing courses...");
      console.log("Courses fetched from local storage...");
      const courses: ICourseSchema = JSON.parse(localStorageCourses);

      dispatch({ type: SET_COURSES, payload: courses });
      return courses;

    } else {
      console.log("Courses not fetched yet, fetching now...");
      const apiController = new AbortController();
      const fetchUrl = `http://localhost:3000/api/course/search?${new URLSearchParams({
        catalogYear: "2023-2024",
      })}`;
      console.log(fetchUrl);
      try {
        const response = await fetch(fetchUrl, {
          signal: apiController.signal});
        if (!response.ok) throw new Error("Network response was not ok");
        const transformedData = await response.json();

        setCourses(transformedData);

        localStorage.setItem("courses", JSON.stringify(transformedData));
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Fetching Error: ", error);
        }
      }
    } 
  };

  //Associated logic with pathway data

  //Initialization for pathway data.
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await     fetch(
            `http://localhost:3000/api/pathway/search?${new URLSearchParams({
              searchString: "",
              department: "",
              catalogYear: "2023-2024",
            })}`);
        const initialData = await response.json();
        dispatch({
          type: SET_PATHWAYS,
          payload: initialData,
        });
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const setPathways = (pathwayData: IPathwaySchema) => {
    dispatch({type: SET_PATHWAYS, payload: pathwayData})
  };

  return (
    <AppContext.Provider value={{ ...state, setCatalog, setCourses, updateCourseState, fetchCourses, setPathways}}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
export default AppContextProvider;
