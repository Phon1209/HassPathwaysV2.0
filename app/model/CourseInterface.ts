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

export interface CourseCardProps {
  ID: string;                   // Course ID
  crosslisted: Array<string>;   // List of cross-listed courses
  description: string;          // Course description
  name: string;                 // Course name
  offered: {                    // Offerings across different terms
    even: boolean;
    fall: boolean;
    odd: boolean;
    spring: boolean;
    summer: boolean;
  };
  title: string;                // Course title (same as name in this context)
  courseCode: string;           // Combined subject and ID, e.g., "ARTS-4070"
  tag: Array<string>;           // Array of tags associated with the course
  status?: string;              // Optional course status, e.g., "No Selection"
}

export interface IFilterState {
  title: string;           
  courseCode: string;      
  tag: Array<string>;      
  status?: string;         
}

export type filterType = "filter" | "level" | "prefix" | "semester" | "prereq";

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
