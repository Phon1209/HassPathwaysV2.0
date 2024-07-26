export type courseState = "Planned" | "In Progress" | "Interested";

export interface CourseCardProps {
  title: string;
  courseCode: string;
  tag: Array<string>;
  status?: courseState
}

export interface IFilterState {
  filter: Array<string>;
  level: Array<string>;
  prefix: Array<string>;
  semester: Array<string>;
  prereq: Array<string>;
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
