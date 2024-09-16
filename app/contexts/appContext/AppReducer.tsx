import {
  ApplicationContext,
  ApplicationDispatch,
} from "@/app/model/AppContextInterface";
import { INITIAL_LOAD_DATA, SET_CATALOG, SET_COURSES, SET_COURSES_SELECTED, SET_PATHWAYS } from "../actions";

export const appReducer: (
  state: ApplicationContext,
  action: ApplicationDispatch
) => ApplicationContext = (
  state: ApplicationContext,
  action: ApplicationDispatch
) => {
  switch (action.type) {
    case INITIAL_LOAD_DATA:
      return {
        ...state,
        catalog_year: action.payload.catalog_year,
        courses: action.payload.courses,
      };
    case SET_CATALOG:
      return {
        ...state,
        catalog_year: action.payload,
      };
    case SET_COURSES:
      return {
        ...state,
        courses: action.payload,
      };
    case SET_PATHWAYS:
      return {
        ...state,
        pathwayData: action.payload
      }
    default:
      return state;
  }
};
