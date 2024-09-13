import {
  IcourseStatus,
  IpathwayData,
  IcourseFilter,
  ICatalogList,
  PathwayDepartmentSchema,
} from "./staticInterface";

export const APPLICATION_STATE_KEY = "application";

export const pathwaysCategories: Array<IpathwayData> = [
  { display: "Art", value: "Arts" },
  { display: "CogSci", value: "Cognitive Science" },
  { display: "Comm", value: "Communication & Media" },
  { display: "Econ", value: "Economics" },
  { display: "STS", value: "STS" },
  { display: "Inter", value: "Interdisciplinary" },
  { display: "GSAS", value: "Games & Simulation Arts & Sciences" },
];

export const courseState: Array<IcourseStatus> = [
  { display: "Completed", value: 1 },
  { display: "In Progress", value: 2 },
  { display: "Planned", value: 3 },
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
        displayName: "Hass Inquiry",
        value: "HI",
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
  {
    displayName: "Status",
    apiName: "status",
    options: [
      {
        displayName: "Completed",
        value: "Completed",
      },
      {
        displayName: "In Progress",
        value: "In Progress",
      },
      {
        displayName: "Planned",
        value: "Planned",
      },
      {
        displayName: "No Selection",
        value: "No Selection",
      },
    ],
  },
];

export const noBookmarkedText: string = "Explore our pathways in the catalog";
export const noMatchedText: string =
  "Explore our courses and select your course to see compatible pathways!";

export const catalogList: ICatalogList = [
  {
    text: "2023-2024",
    // value: 2024,
  },
  {
    text: "2022-2023",
    // value: 2023,
  },
  {
    text: "2021-2022",
    //value: 2022,
  },
  {
    text: "2020-2021",
    //value: 2021,
  },
  {
    text: "2019-2020",
    //value: 2020,
  },
];

// https://hass.rpi.edu/hass-pathways, Arts, Cognitive Science, Communication & Media, Economics, STS, Interdisciplinary, Games & Simulation Arts & Sciences
export const pathwayDepartment: Array<PathwayDepartmentSchema> = [
  { pathway: "Cognitive Science", department: "Cognitive Science" },
  { pathway: "Design, Innovation, and Society", department: "STS" },
  { pathway: "Economics", department: "Economics" },
  { pathway: "Ethics, Integrity, and Social Responsibility", department: "Interdisciplinary" },
  { pathway: "Extent and Limits of Rationality", department: "Interdisciplinary" },
  { pathway: "Game Studies", department: "Games & Simulation Arts & Sciences" },
  { pathway: "Global Languages and Cultures", department: "Communication & Media"},
  { pathway: "Graphic and Interactive Media Design", department: "Communication & Media"},
  { pathway: "Narrative and Storytelling", department: "Communication & Media"},
  { pathway: "Strategic Writing", department: "Communication & Media"},
  { pathway: "Media and Culture", department: "Communication & Media"},
  { pathway: "Visual and Media Arts", department: "Arts"},
  { pathway: "Music and Sound", department: "Arts"},
  { pathway: "Psychological Science", department: "Cognitive Science"},
  { pathway: "Philosophy and Logic", department: "Cognitive Science"},
  { pathway: "Science, Technology, and Society", department: "STS"},
  { pathway: "Sustainability Studies", department: "STS"},
  { pathway: "Pre-Health", department: "Interdisciplinary"},
  { pathway: "History", department: "Interdisciplinary"},
  { pathway: "Public Health", department: "Interdisciplinary"},
  { pathway: "Well-being: Body and Mind", department: "Interdisciplinary"},
  { pathway: "Information Technology and Web Sciences", department: "Interdisciplinary"},
  { pathway: "Transfer Student Social Science", department: "Interdisciplinary"},
  { pathway: "Transfer Student Arts and Humanities", department: "Interdisciplinary"},
];


export const validCatalogYear: string[] = ["2022-2023", "2021-2022", "2020-2021", "2019-2020"];
