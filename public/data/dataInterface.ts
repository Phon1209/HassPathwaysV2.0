
export interface ICourseSchema {
  title: string;
  courseCode: string;
  filter: string;
  description: string;
  subject: string;
  status: string;
  prereqs?: IPrereqSchema;
  term?: IOfferedSchema;
  attributes: IPropertiesSchema;
}

export interface IPathwaySchema {
  title: string;
  coursesIn: string[];
  department: string;
}

export interface IPrereqSchema {
  raw_precoreqs: string;
  courses: Array<string>;
}

export interface IPropertiesSchema {
  HI: boolean;
  CI: boolean;
  major_restricted: boolean;
}

export interface ISingleYearOfferedSchema {
  year: string;
  fall: boolean;
  spring: boolean;
  summer: boolean;
}

export interface IOfferedSchema {
  years: Array<ISingleYearOfferedSchema>;
  uia: boolean;
  text: string;
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

export interface ICourseClusterSchema {
  name: string;
  description: string;
  numCourses: number;
  courses: Array<string>;
}

export interface IPathwayDescriptionSchema {
  description: string;
  compatibleMinor: Array<string>;
  courses: Array<string>
  clusters: Array<ICourseClusterSchema>;
}

export type IFAQ = {
  question: string;
  answer: string;
  icon: string;
};
