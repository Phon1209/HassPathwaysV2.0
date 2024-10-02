"use client";

import { MouseEventHandler, useEffect, useState, useReducer } from "react";
import CourseCard from "../components/course/CourseCard";
import Link from "next/link";
import ChevronUp from "@/public/assets/svg/chevron-up.svg?svgr";
import ChevronDown from "@/public/assets/svg/chevron-down.svg?svgr";
import ChevronRight from "@/public/assets/svg/chevron-right.svg?svgr";
import { useAppContext } from "../contexts/appContext/AppProvider";
import { ICourseSchema } from "../../public/data/dataInterface";
import { MyCourseFilterSection, MyCourseDesktopFilterSection, FilterAction, filterReducer, filterInitializers } from "@/app/components/course/SearchComponent";
import { IFilterDispatch, IFilterState } from "@/app/model/CourseInterface";
import { filter } from "lodash";

const MyCourses = () => {
  const [courseFilter, setCourseFilter] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { courses, fetchCourses, courseState } = useAppContext();
  const [filteredCourses, setFilteredCourses] = useState();
  const allInitializer = {
    ...filterInitializers,
    status: courseState.map((state) => state.display),
  }
  const [filterState, filterDispatch] = useReducer(filterReducer, allInitializer);

  const [searchString, setSearchString] = useState<string>("");
  let statuses = courseState.map((state) => state.display);
  

  return (
    <>
      <header className="mb-4 md:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-8">
          <h1 className="title mb-3">My Courses</h1>
          <Link href={"/courses/search"}>
              <span className="flex text-primary-700 gap-2 text-sm font-semibold">
                Find Courses <ChevronRight />
              </span>
          </Link>
        </div>
        <section>
          <div className="course-button-group sm:flex flex-wrap gap-x-2 hidden">
            <ModeRadioButton
              checked={filterState.status.length === statuses.length} 
              label={"All"}
              tag={courses.filter((course) => course.status !== "No Selection").length}
              clickCallback={() => {
                if (filterState.status.length === 3) return;
                let clickPayload = {
                  type: FilterAction.SET,
                  payload: { group: "status", value: statuses },
                }
                filterDispatch(clickPayload);
              }}
            />
            {courseState.map((state) => {
              return (
                <ModeRadioButton
                  checked={state.display === filterState.status.join("")}
                  label={state.display}
                  tag={courses.filter((course) => course.status === state.display).length}
                  key={state.display}
                  clickCallback={() => {
                    let clickPayload = {
                      type: FilterAction.SET,
                      payload: { group: "status", value: [state.display] },
                    }
                    filterDispatch(clickPayload);
                  }}
                />
              );
            })}
          </div>
        </section>
      </header>
      <div className="hidden lg:block">
        <MyCourseDesktopFilterSection
          filterState={filterState}
          filterDispatch={filterDispatch}
          setSearchString={setSearchString}
          searchString={searchString}
        />
      </div>
      <div className="block lg:hidden">
        <MyCourseFilterSection
          filterState={filterState}
          filterDispatch={filterDispatch}
          setSearchString={setSearchString}
          searchString={searchString}
        />
      </div>
    </>
  );
};

const ModeRadioButton = ({
  checked,
  label,
  tag,
  clickCallback,
}: {
  checked: boolean;
  label: string;
  tag: number;
  clickCallback: MouseEventHandler;
}) => {
  const tagStyle = checked ? "tag-primary" : "tag-gray";
  const fontStyle = checked ? "text-primary-700" : "text-gray-500";

  return (
    <button
      className={`flex gap-2 items-center !rounded-md hover:!bg-gray-100 ${checked ? " !bg-gray-50" : ""}`}
      onClick={clickCallback}
    >
      <span className={`text-xs md:text-sm lg:text-lg font-semibold ${fontStyle}`}>
        {label}
      </span>
      <p className={`tag ${tagStyle}`}>{tag}</p>
    </button>
  );
};

export default MyCourses;