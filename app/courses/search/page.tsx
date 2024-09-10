"use client";

import React, { useState, useReducer } from "react";
import {
  FilterSection,
  DesktopFilterSection,
  FilterAction,
} from "@/app/components/course/SearchComponent";
import Link from "next/link";
import ChevronRight from "@/public/assets/svg/chevron-right.svg?svgr";
import { IFilterDispatch, IFilterState } from "@/app/model/CourseInterface";

const SearchCourse = () => {
  const [filterState, filterDispatch] = useReducer(
    (state: IFilterState, action: IFilterDispatch) => {
      switch (action.type) {
        case FilterAction.ADD:
          return {
            ...state,
            [action.payload.group]: [
              ...state[action.payload.group],
              action.payload.value,
            ],
          };
        case FilterAction.REM:
          return {
            ...state,
            [action.payload.group]: state[action.payload.group].filter(
              (e: string) => e !== action.payload.value
            ),
          };
        default:
          return state;
      }
    },
    {
      filter: [],
      level: [],
      prefix: [],
      semester: [],
      prereq: [],
      status: [],
    }
  );

  const [searchString, setSearchString] = useState<string>("");

  return (
    <>
      <header>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-8">
          <h1 className="title mb-3">Find Courses</h1>
          <Link href={"/courses"}>
            <span className="flex text-primary-700 gap-2 text-sm font-semibold">
              My Courses <ChevronRight />
            </span>
          </Link>
        </div>
      </header>
      <div className="hidden lg:block">
        <DesktopFilterSection
          filterState={filterState}
          filterDispatch={filterDispatch}
          setSearchString={setSearchString}
          searchString={searchString}
        />
      </div>
      <div className="block lg:hidden">
        <FilterSection
          filterState={filterState}
          filterDispatch={filterDispatch}
          setSearchString={setSearchString}
          searchString={searchString}
        />
      </div>
    </>
  );
};

export default SearchCourse;
