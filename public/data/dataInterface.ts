export type courseState = "Planned" | "In Progress" | "Interested" | "No Selection";


export interface ICourseSchemaSaved {
  title: string;
  courseCode: string;
  tag: Array<string>;
  state: courseState;
}

export interface ICourseSchema {
  title: string;
  courseCode: string;
  filter: string;
  description: string;
  prereqs: any;
  tag: Array<string>;
  state?: courseState;
}

export interface IPathwaySchema {
  title: string;
  coursesIn: string[];
  department: string;
}

interface IPrereqSchema {
  type: "course" | "and" | "or";
  nested?: Array<IPrereqSchema>;
  course?: string;
}

export interface ISemesterData {
  instructor: Array<string>;
  seats: string;
}

export interface ITerm {
  year: string;
  spring?: ISemesterData;
  fall?: ISemesterData;
  summer?: ISemesterData;
}

export interface ICourseDescriptionSchema {
  title: string;
  description: string;
  prereqs?: IPrereqSchema;
  term: Array<ITerm>;
}

export interface ICourseClusterSchema {
  name: string;
  description: string;
  courses: Array<ICourseSchema>;
}

export interface IPathwayDescriptionSchema {
  description: string;
  compatibleMinor: Array<string>;
  courses: Array<ICourseSchema> | Array<ICourseClusterSchema>;
}

export type IFAQ = {
  question: string;
  answer: string;
  icon: string;
};
