"use client";

import {
  SearchIcon,
  Filter,
  CheckBoxChecked,
  CheckBoxUnChecked,
} from "@/app/components/utils/Icon";
import {
  Fragment,
  useState,
  useDeferredValue,
  useEffect,
  useCallback,
} from "react";
import { courseFilters } from "@/public/data/staticData";
import CourseCard from "./CourseCard";
import {
  FilterProps,
  FilterSectionProps,
  IFilterState,
  SearchInputProps,
} from "@/app/model/CourseInterface";
import { ICourseSchema } from "@/public/data/dataInterface";
import { flattenFilterParams } from "../utils/url";
import dynamic from "next/dynamic";
import { useAppContext, fetchCourses } from '@/app/contexts/appContext/AppProvider';

const Spinner = dynamic(() => import("@/app/components/utils/Spinner"));

export const FilterAction = {
  ADD: "add",
  REM: "remove",
};

export const DesktopFilterSection = ({
  filterState,
  filterDispatch,
  searchString,
  setSearchString,
}: FilterSectionProps) => {
  return (
    <>
      <div className="filters flex justify-start items-start gap-8 mb-4 md:mb-8">
        <DesktopFilter
          filterState={filterState}
          filterDispatch={filterDispatch}
        />
        <div className="grow flex flex-col gap-4">
          <SearchInput
            setSearchString={setSearchString}
            searchString={searchString}
          />
          <div className="max-h-[100vh] overflow-y-scroll">
            <CourseList searchString={searchString} filterState={filterState} />
          </div>
        </div>
      </div>
    </>
  );
};

export const FilterSection = ({
  filterState,
  filterDispatch,
  setSearchString,
  searchString,
}: FilterSectionProps) => {
  return (
    <>
      <div className="filters flex justify-between gap-4 mb-4 md:mb-8">
        <SearchInput
          setSearchString={setSearchString}
          searchString={searchString}
        />
        <FilterDropdown
          filterState={filterState}
          filterDispatch={filterDispatch}
        />
      </div>
      <CourseList searchString={searchString} filterState={filterState} />
    </>
  );
};

export const MyCourseDesktopFilterSection = ({
  filterState,
  filterDispatch,
  searchString,
  setSearchString,
}: FilterSectionProps) => {
  return (
    <>
      <div className="filters flex justify-start items-start gap-8 mb-4 md:mb-8">
        <div className="grow flex flex-col gap-4">
          <CourseList searchString={searchString} filterState={filterState} />
        </div>
      </div>
    </>
  );
}

export const MyCourseFilterSection = ({
  filterState,
  filterDispatch,
  setSearchString,
  searchString,
}: FilterSectionProps) => {
  return (
    <>
      <CourseList searchString={searchString} filterState={filterState} />
    </>
  );
}

const SearchInput = ({ searchString, setSearchString }: SearchInputProps) => {
  return (
    <label htmlFor="course-input" className="basis-0 grow">
      <div className="px-3.5 py-2.5 flex items-center gap-2 cursor-text border-gray-300 border border-solid rounded-lg input-wrapper">
        <SearchIcon />
        <input
          className="outline-none text-gray-500 text-md w-full basis-0 grow "
          type="text"
          name="course"
          id="course-input"
          value={searchString}
          placeholder="Search"
          onChange={(e) => setSearchString(e.target.value)}
        />
      </div>
    </label>
  );
};

const DesktopFilter = ({ filterState, filterDispatch }: FilterProps) => {
  return (
    <div className="rounded-lg shadow-lg p-6 min-w-[290px] max-w-xs grid grid-flow-row gap-2 border border-solid border-gray-100">
      {courseFilters.map((section) => (
        <section key={section.apiName}>
          <header className="text-md font-medium text-gray-900">
            {section.displayName}
          </header>
          <div className="flex flex-wrap">
            {section.options.map((choice) => {
              const selected = filterState[section.apiName].includes(choice.value);
              const actionType = selected ? FilterAction.REM : FilterAction.ADD;
              return (
                <div className="px-3 py-2 basis-auto shrink-0" key={choice.value}>
                  <div
                    className="cursor-pointer flex gap-2 items-center"
                    onClick={() => {
                      filterDispatch({
                        type: actionType,
                        payload: {
                          group: section.apiName,
                          value: choice.value,
                        },
                      });
                    }}
                  >
                    {selected ? <CheckBoxChecked /> : <CheckBoxUnChecked />}
                    <label className={`text-sm shrink-0 cursor-pointer ${selected && "font-medium"}`}>
                      {choice.displayName}
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};

const FilterDropdown = ({ filterState, filterDispatch }: FilterProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <Fragment>
      <div className="dropdown z-20">
        <div
          className={`w-11 h-11 flex justify-center items-center gap-2 cursor-pointer border-gray-300 border border-solid rounded-lg ${dropdownOpen && "bg-gray-100"}`}
          onClick={() => setDropdownOpen((open) => !open)}
        >
          <Filter className={dropdownOpen ? "path-gray-700" : undefined} />
        </div>
        {dropdownOpen && (
          <div className="rounded-lg shadow-lg p-6 dropdown-choices w-screen translate-x-4 fold:translate-x-0 fold:w-max max-w-xs sm:max-w-sm md:max-w-md grid grid-flow-row gap-2">
            {courseFilters.map((section) => (
              <section key={section.apiName}>
                <header className="text-md font-medium text-gray-900">
                  {section.displayName}
                </header>
                <div className="flex flex-wrap">
                  {section.options.map((choice) => {
                    const selected = filterState[section.apiName].includes(choice.value);
                    const actionType = selected ? FilterAction.REM : FilterAction.ADD;
                    return (
                      <div className="px-3 py-2 basis-auto shrink-0" key={choice.value}>
                        <div
                          className="cursor-pointer flex gap-2 items-center"
                          onClick={() => {
                            filterDispatch({
                              type: actionType,
                              payload: {
                                group: section.apiName,
                                value: choice.value,
                              },
                            });
                          }}
                        >
                          {selected ? <CheckBoxChecked /> : <CheckBoxUnChecked />}
                          <label className={`text-sm shrink-0 cursor-pointer ${selected && "font-medium"}`}>
                            {choice.displayName}
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </Fragment>
  );
};

const CourseList = ({
  searchString,
  filterState,
}: {
  searchString: string;
  filterState: IFilterState;
}) => {
  const [filteredCourses, setFilteredCourses] = useState<ICourseSchema[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const deferredSearchString = useDeferredValue(searchString);
  const deferredFilterState = useDeferredValue(filterState);
  const { catalog_year, courses, fetchCourses} = useAppContext();

  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchCourses();
      setIsLoading(false);
    };
    fetchData();
  }, [catalog_year]);

  

  useEffect(() => {
    const tags_short_to_long = courseFilters.reduce((acc, section) => {
      section.options.forEach(option => {
        if (option.value && option.displayName) {
          acc[option.value] = option.displayName;
        }
      });
      return acc;
    }, {} as Record<string, string>);

    const applyFilters = () => {
      let filtered = courses;

      // Prefix Filtering
      if (deferredFilterState.prefix.length) {
        filtered = filtered.filter(course =>
          deferredFilterState.prefix.some(prefix =>
            course.subj.startsWith(prefix)
          )
        );
      }
      
      // Level Filtering
      if (deferredFilterState.level.length) {
        filtered = filtered.filter(course =>
          deferredFilterState.level.some(level =>
            course.ID.substring(0, 1) === level
          )
        );
      }
      // Semester Filtering
      if (deferredFilterState.semester.length) {
        filtered = filtered.filter(course => {
          const offeredSemesters = [];
          if (course.offered.fall) offeredSemesters.push("F");
          if (course.offered.spring) offeredSemesters.push("S");
          if (course.offered.summer) offeredSemesters.push("U");
          return deferredFilterState.semester.some(sem => offeredSemesters.includes(sem));
        });
      }

      console.log(filtered);

      if (deferredFilterState.status.length) {
        filtered = filtered.filter(course =>
          deferredFilterState.status[0] == course.status
        );
        
      }
      console.log(filtered);

      // CI and HI Filtering
      if (deferredFilterState.filter.length && tags_short_to_long) {
        filtered = filtered.filter(course => {
          const courseTags = course.properties;
          
          return deferredFilterState.filter.some(tag => {
            const tagDisplayName = tags_short_to_long[tag];
            return courseTags[tag] && tagDisplayName;
          });
        });
      }

      // Prerequisite Filtering
      if (deferredFilterState.prereq.includes("Noreq")) {
        filtered = filtered.filter(course =>
          course.prerequisites.length === 0
        );
      }
      
      // Search String Filtering
      if (deferredSearchString) {
        filtered = filtered.filter(course =>
          course.name.toLowerCase().includes(deferredSearchString.toLowerCase()) ||
          course.ID.toLowerCase().includes(deferredSearchString.toLowerCase())
        );
      }

      setFilteredCourses(filtered);
    };

    applyFilters();
  }, [deferredSearchString, deferredFilterState, courses]);

  return (
    <section className="grid grid-cols-3 gap-4">
      {isLoading ? <Spinner /> : filteredCourses.map((course, i) => (
        
        <CourseCard 
          title={course.name}
          courseCode={course.subj + '-' + course.ID}
          properties={course.properties}
          prerequsits={course.prerequisites}
          offered={course.offered}
          status={course.status}
          key={i} />
      ))}
    </section>
  );
};

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
