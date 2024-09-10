import { IcourseStatus, IpathwayData } from "@/public/data/staticInterface";

import { CourseCardProps, SingleCourse } from "@/app/model/CourseInterface";
import { fetchCourses } from '@/app/contexts/appContext/AppProvider';
import {IPathwaySchema} from "@/public/data/dataInterface";

export interface ApplicationContext {
  catalog_year: string;
  courseState: any;
  pathwayData: any;
  pathwaysCategories: any; 
  courses: CourseCardProps[];
  setCourses: (courses: CourseCardProps[]) => void;
  coursesSelected: SingleCourse[]; 
  updateCourseInContext: (course: SingleCourse) => void;
  setCoursesSelected: (courses: SingleCourse[]) => void; 
  setCatalog: (catalog_year: string) => void;
  fetchCourses: () => JSON;
  setPathways: (pathwayData: IPathwaySchema) => void;
}

type ApplicationConstant = {
  courseState: IcourseStatus[];
  pathwaysCategories: IpathwayData[];
};

export type ApplicationContext = ApplicationContextTemplate &
  ApplicationConstant;

export type ApplicationDispatch = {
  type: string;
  payload: any;
};
