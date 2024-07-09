import { IcourseStatus, IpathwayData } from "@/public/data/staticInterface";

type ApplicationContextTemplate = {
  catalog_year: string;

  // Methods
  setCatalog: (...arg: any) => any;
};

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
