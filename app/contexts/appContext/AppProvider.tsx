"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { appReducer } from "./AppReducer";
import { INITIAL_LOAD_DATA, SET_CATALOG, SET_COURSES, SET_COURSES_SELECTED } from "../actions";
import {
  courseState,
  pathwaysCategories,
  APPLICATION_STATE_KEY,
} from "@/public/data/staticData";
import { ApplicationContext } from "@/app/model/AppContextInterface";
import { ICourseSchema } from "@/app/model/CourseInterface";

const constantApplicationValue = { courseState, pathwaysCategories };

const defaultInitialState: ApplicationContext = {
  catalog_year: "2022-2023",
  courses: [],
  coursesSelected: [],
  setCourses: () => {},
  setCatalog: () => {},
  fetchCourses: () => {},
  updateCourseState: () => {},
  ...constantApplicationValue,
};

const AppContext = createContext<ApplicationContext>(defaultInitialState);

const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, defaultInitialState);

  useEffect(() => {
    const localStorageString = localStorage.getItem(APPLICATION_STATE_KEY);
    const stateWithoutLocalStorage = {
      ...defaultInitialState,
      catalog_year: "2022-2023",
    };

    const initialState = localStorageString
      ? JSON.parse(localStorageString)
      : stateWithoutLocalStorage;

    dispatch({
      type: INITIAL_LOAD_DATA,
      payload: initialState,
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(APPLICATION_STATE_KEY, JSON.stringify(state));
  }, [state]);

  const setCatalog = (catalog_year: string) => {
    dispatch({ type: SET_CATALOG, payload: catalog_year });
  };

  const updateCourseState = (name: string, status: string) => {
    const courses = state.courses;
    const updatedCourses = courses.map(course =>
      course.name === name
        ? { ...course, status: status }
        : course);
    setCourses(updatedCourses);
  };

  const setCourses = (courses: ICourseSchema[]) => {
    console.log("SETTING COURSES");
    dispatch({ type: SET_COURSES, payload: courses });
    localStorage.setItem("courses", JSON.stringify(courses));
    fetchCourses();
  };

  const fetchCourses = async () => {
    const localStorageCourses = localStorage.getItem("courses");
    if (localStorageCourses) {
      console.log("Courses already fetched, returning existing courses...");
      console.log("Courses fetched from local storage...");
      const courses = JSON.parse(localStorageCourses);

      dispatch({ type: SET_COURSES, payload: courses });
      return courses;

    } else {
      console.log("Courses not fetched yet, fetching now...");
      const apiController = new AbortController();
      const fetchUrl = `http://localhost:3000/api/course/search?${new URLSearchParams({
        catalogYear: state.catalog_year,
      })}`;
      try {
        const response = await fetch(fetchUrl, {
          signal: apiController.signal,
          cache: "force-cache",
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        const transformedData = Object.keys(data).map((courseName) => ({
          ...data[courseName],
          name: courseName,
          status: "No Selection",
        }));

        setCourses(transformedData);

        localStorage.setItem("courses", JSON.stringify(transformedData));
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Fetching Error: ", error);
        }
      }
    } 
  };

  return (
    <AppContext.Provider value={{ ...state, setCatalog, setCourses, updateCourseState, fetchCourses }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
export default AppContextProvider;
