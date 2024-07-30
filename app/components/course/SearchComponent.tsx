// "use client";

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
import { debounce } from "lodash";
import { useAppContext } from "@/app/contexts/appContext/AppProvider";

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
          <div className="max-h-[500px] overflow-y-scroll">
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
      {courseFilters.map((section) => {
        return (
          <section key={section.apiName}>
            <header className="text-md font-medium text-gray-900">
              {section.displayName}
            </header>
            <div className="flex flex-wrap">
              {section.options.map((choice) => {
                const selected = filterState[section.apiName].includes(
                  choice.value
                );
                const actionType = selected
                  ? FilterAction.REM
                  : FilterAction.ADD;
                return (
                  <div
                    className="px-3 py-2 basis-auto shrink-0"
                    key={choice.value}
                  >
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
                      <label
                        className={`text-sm shrink-0 cursor-pointer ${
                          selected && "font-medium"
                        }`}
                      >
                        {choice.displayName}
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};

const FilterDropdown = ({ filterState, filterDispatch }: FilterProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <Fragment>
      <div className="dropdown">
        <div
          className={`w-11 h-11 flex justify-center items-center gap-2 cursor-pointer border-gray-300 border border-solid rounded-lg ${
            dropdownOpen && "bg-gray-100"
          }`}
          onClick={() => setDropdownOpen((open) => !open)}
        >
          <Filter className={dropdownOpen ? "path-gray-700" : undefined} />
        </div>
        {dropdownOpen && (
          <div className="rounded-lg shadow-lg p-6 dropdown-choices w-screen translate-x-4 fold:translate-x-0 fold:w-max max-w-xs sm:max-w-sm md:max-w-md grid grid-flow-row gap-2">
            {courseFilters.map((section) => {
              return (
                <section key={section.apiName}>
                  <header className="text-md font-medium text-gray-900">
                    {section.displayName}
                  </header>
                  <div className="flex flex-wrap">
                    {section.options.map((choice) => {
                      const selected = filterState[section.apiName].includes(
                        choice.value
                      );
                      const actionType = selected
                        ? FilterAction.REM
                        : FilterAction.ADD;
                      return (
                        <div
                          className="px-3 py-2 basis-auto shrink-0"
                          key={choice.value}
                        >
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
                            {selected ? (
                              <CheckBoxChecked />
                            ) : (
                              <CheckBoxUnChecked />
                            )}
                            <label
                              className={`text-sm shrink-0 cursor-pointer ${
                                selected && "font-medium"
                              }`}
                            >
                              {choice.displayName}
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
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
  const [courseData, setCourseData] = useState<ICourseSchema[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<ICourseSchema[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const deferredSearchString = useDeferredValue(searchString);
  const deferredFilterState = useDeferredValue(filterState);

  const { pathwaysCategories, catalog_year } = useAppContext();

  const fetchCourses = async () => {
    const apiController = new AbortController();
    const fetchUrl = `http://localhost:3000/api/course/search?${new URLSearchParams({
      searchString: deferredSearchString,
      ...flattenFilterParams(deferredFilterState),
    })}`;

    setIsLoading(true);

    try {
      const response = await fetch(fetchUrl, {
        signal: apiController.signal,
        next: {
          revalidate: false,
        },
        cache: "force-cache",
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setCourseData(data);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Fetching Error: ", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [catalog_year]);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = courseData;
  
      // Prefix Filtering
      if (deferredFilterState.prefix.length) {
        filtered = filtered.filter(course =>
          deferredFilterState.prefix.some(prefix =>
            course.courseCode.startsWith(prefix)
          )
        );
      }
  
      // Level Filtering
      if (deferredFilterState.level.length) {
        filtered = filtered.filter(course =>
          deferredFilterState.level.some(level =>
            course.courseCode.substring(5, 6) === level
          )
        );
      }
  
      // Tag Filtering
      if (deferredFilterState.filter.length) {
        filtered = filtered.filter(course =>
          deferredFilterState.filter.every(tag =>
            course.tag.includes(tags_short_to_long[tag])
          )
        );
      }
  
      // Transform Data
      const transformed = filtered.map(course => ({
        title: course.title,
        courseCode: course.courseCode,
        tag: course.tag,
        description: course.description,
        prereqs: course.prereqs
      }));
  
      // Search String Filtering
      if (deferredSearchString) {
        setFilteredCourses(
          transformed.filter(course =>
            course.title.toLowerCase().includes(deferredSearchString.toLowerCase()) ||
            course.courseCode.toLowerCase().includes(deferredSearchString.toLowerCase())
          )
        );
      } else {
        setFilteredCourses(transformed);
      }
    };
  
    applyFilters();
  }, [deferredSearchString, deferredFilterState, courseData]);
    
  return (
    <section className="flex flex-col gap-3">
      {isLoading ? <Spinner /> : filteredCourses.map((course, i) => (
        <CourseCard {...course} key={i} />
      ))}
    </section>
  );
};

