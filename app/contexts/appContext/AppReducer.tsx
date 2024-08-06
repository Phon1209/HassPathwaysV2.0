import {
  ApplicationContext,
  ApplicationDispatch,
} from "@/app/model/AppContextInterface";
import {INITIAL_LOAD_DATA, SET_CATALOG, SET_PATHWAYS} from "../actions";

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
    case SET_PATHWAYS:
      return {
        ...state,
        pathwayData: action.payload,
      }

    default:
      return state;
  }
};
