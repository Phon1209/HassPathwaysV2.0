import { IcourseStatus, IpathwayData } from "@/public/data/staticInterface";

import { CourseCardProps } from "@/app/model/CourseInterface";
import { fetchCourses } from '@/app/contexts/appContext/AppProvider';

export interface ApplicationContext {
  catalog_year: string;
  courseState: any; 
  pathwaysCategories: any; 
  courses: CourseCardProps[]; 
  setCourses: (courses: CourseCardProps[]) => void; 
  setCatalog: (catalog_year: string) => void;
  fetchCourses: () => JSON;
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
