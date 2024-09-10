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
      return action.payload;
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
    case SET_COURSES_SELECTED:
      return {
        ...state,
        coursesSelected: action.payload,
      };
    case SET_PATHWAYS:
      console.log("Updated Pathways: " + JSON.stringify(action.payload));
      return {
        ...state,
        pathways: action.payload
      }
    default:
      return state;
  }
};
