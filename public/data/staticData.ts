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
  { display: "GSAS", value: "GSAS" },
  { display: "Lang", value: "Language and Literature" },
  { display: "Restricted", value: "Major Restricted" },
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
      {
        displayName: "Major Restricted",
        value: "major_restricted",
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
    text: "2024-2025",
    // value: 2025,
  },
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
  { pathway: "Game Studies", department: "GSAS" },
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
  // Old Pathways
  { pathway: "Art History, Theory, and Criticism", department: "Arts"},
  { pathway: "Artificial Intelligence", department: "Cognitive Science"},
  { pathway: "Behavioral and Cognitive Neuroscience", department: "Cognitive Science"},
  { pathway: "Chinese Language", department: "Language and Literature"},
  { pathway: "Creative Design and Innovation", department: "Interdisciplinary"},
  { pathway: "Design, Innovation, and Society Pathway", department: "Major Restricted"},
  { pathway: "Economics of Banking and Finance", department: "Economics"},
  { pathway: "Economics of Decision-Making", department: "Economics"},
  { pathway: "Economics of Healthcare Markets", department: "Economics"},
  { pathway: "Economics of Policy and Regulations", department: "Economics"},
  { pathway: "Economics of Quantitative Modeling", department: "Economics"},
  { pathway: "Economics of Technology and Innovation", department: "Economics"},
  { pathway: "Electronic Arts", department: "Arts"},
  { pathway: "Environmental Futures", department: "Interdisciplinary"},
  { pathway: "Fact and Fiction", department: "Interdisciplinary"},
  { pathway: "Gender, Race, Sexuality, Ethnicity, and Social Change", department: "Interdisciplinary"},
  { pathway: "Graphic Design", department: "Communication & Media"},
  { pathway: "Interactive Media/Data Design", department: "Communication & Media"},
  { pathway: "Language", department: "Language and Literature"},
  { pathway: "Law and Policy", department: "STS"},
  { pathway: "Linguistics", department: "Language and Literature"},
  { pathway: "Literature and Creative Writing", department: "Language and Literature"},
  { pathway: "Living in a World of Data", department: "Interdisciplinary"},
  { pathway: "Logical Thinking", department: "Cognitive Science"},
  { pathway: "Mind, Brain, and Intelligence", department: "Cognitive Science"},
  { pathway: "Music Composition and Production", department: "Arts"},
  { pathway: "Music Performance", department: "Arts"},
  { pathway: "Music and Culture", department: "Arts"},
  { pathway: "Philosophy", department: "Cognitive Science"},
  { pathway: "Strategic Communication", department: "Interdisciplinary"},
  { pathway: "Studio Arts", department: "Arts"},
  { pathway: "Sustainability", department: "STS"},
  { pathway: "Thinking with Science", department: "Interdisciplinary"},
  { pathway: "Understanding Human Behavior", department: "Cognitive Science"},
  { pathway: "Video, Performance, and Social Practice", department: "Arts"},
];


export const validCatalogYear: string[] = ["2024-2025","2023-2024","2022-2023", "2021-2022", "2020-2021", "2019-2020"];
