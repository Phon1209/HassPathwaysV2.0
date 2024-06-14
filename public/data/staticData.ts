import {
  IcourseStatus,
  IpathwayData,
  IcourseFilter,
  ICatalogList,
} from "./staticInterface";

export const APPLICATION_STATE_KEY = "application";

export const pathwaysCategories: Array<IpathwayData> = [
  { display: "Art", value: "Arts" },
  { display: "CogSci", value: "Cognitive Science" },
  { display: "Comm", value: "Communication & Media" },
  { display: "Econ", value: "Economics" },
  { display: "STS", value: "STS" },
  { display: "Inter", value: "Interdisciplinary" },
];

export const courseState: Array<IcourseStatus> = [
  { display: "Completed", value: 1 },
  { display: "In Progress", value: 2 },
  { display: "Planned", value: 3 },
  { display: "Interested", value: 4 },
  { display: "Not Selected", value: 5 },
];

export const courseFilters: Array<IcourseFilter> = [
  {
    displayName: "Filter",
    apiName: "filter",
    options: [
      {
        displayName: "Communication Intensive",
        value: "CI",
      },
      {
        displayName: "Professional Development II",
        value: "PDII",
      },
      {
        displayName: "Hass Inquiry",
        value: "HInq",
      },
    ],
  },
  {
    displayName: "Level",
    apiName: "level",
    options: [
      {
        displayName: "1000",
        value: "1",
      },
      {
        displayName: "2000",
        value: "2",
      },
      {
        displayName: "4000",
        value: "4",
      },
    ],
  },
  {
    displayName: "Prerequisites",
    apiName: "prereq",
    options: [
      {
        displayName: "No Prereq",
        value: "Noreq",
      },
    ],
  },
  {
    displayName: "Prefix",
    apiName: "prefix",
    options: [
      {
        displayName: "ARTS",
        value: "ARTS",
      },
      {
        displayName: "COGS",
        value: "COGS",
      },
      {
        displayName: "COMM",
        value: "COMM",
      },
      {
        displayName: "ECON",
        value: "ECON",
      },
      {
        displayName: "GSAS",
        value: "GSAS",
      },
      {
        displayName: "INQR",
        value: "INQR",
      },
      {
        displayName: "ITWS",
        value: "ITWS",
      },
      {
        displayName: "LANG",
        value: "LANG",
      },
      {
        displayName: "LITR",
        value: "LITR",
      },
      {
        displayName: "PHIL",
        value: "PHIL",
      },
      {
        displayName: "PSYC",
        value: "PSYC",
      },
      {
        displayName: "STSO",
        value: "STSO",
      },
      {
        displayName: "WRIT",
        value: "WRIT",
      },
    ],
  },
  {
    displayName: "Semester",
    apiName: "semester",
    options: [
      {
        displayName: "Fall",
        value: "F",
      },
      {
        displayName: "Spring",
        value: "S",
      },
      {
        displayName: "Summer",
        value: "U",
      },
    ],
  },
];

export const noBookmarkedText: string = "Explore our pathways in the catalog";
export const noMatchedText: string =
  "Explore our courses and select your course to see compatible pathways!";

export const catalogList: ICatalogList = [
  {
    text: "2022 - 2023 Catalog",
    value: 2023,
  },
  {
    text: "2021 - 2022 Catalog",
    value: 2022,
  },
  {
    text: "2020 - 2021 Catalog",
    value: 2021,
  },
  {
    text: "2019 - 2020 Catalog",
    value: 2020,
  },
];
