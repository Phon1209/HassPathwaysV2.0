export type courseState = "Planned" | "In Progress" | "Interested" | "No Selection";

/*
ID: "4070"

cross listed: [] (0)

description: "An intermediate hands-on studio course in 3D computer animation, acting, dialog, cinematography, and story building."

name: "3D Animation"

offered: {even: false, fall: true, odd: false, spring: false, summer: false, …}

prerequisites: ["ARTS-2230"] (1)

professors: ["Silvia Ruzanka"] (1)

properties: {CI: false, HI: false, major_restricted: false}

sections: {1: Object}

subj: "ARTS"
*/

export interface IFilterState {
  filter: string[];
  level: string[];
  prefix: string[];
  prereq: string[];
  semester: string[];
  status: string[]; 
}

export type filterType = "filter" | "level" | "prefix" | "semester" | "prereq" | "status";

export interface IFilterDispatch {
  type: string;
  payload: {
    group: filterType;
    value: string;
  };
}

export interface FilterSectionProps {
  filterState: IFilterState;
  filterDispatch: React.Dispatch<IFilterDispatch>;
  searchString: string;
  setSearchString: React.Dispatch<React.SetStateAction<string>>;
}

export interface FilterProps {
  filterState: IFilterState;
  filterDispatch: React.Dispatch<IFilterDispatch>;
}

export interface SearchInputProps {
  searchString: string;
  setSearchString: React.Dispatch<React.SetStateAction<string>>;
}
