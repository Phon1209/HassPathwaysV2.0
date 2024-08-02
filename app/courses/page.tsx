"use client";
import { MouseEventHandler, useState } from "react";
import CourseCard from "../components/course/CourseCard";
import Link from "next/link";
import ChevronUp from "@/public/assets/svg/chevron-up.svg?svgr";
import ChevronDown from "@/public/assets/svg/chevron-down.svg?svgr";
import ChevronRight from "@/public/assets/svg/chevron-right.svg?svgr";
import { useAppContext } from "../contexts/appContext/AppProvider";

const MyCourses = () => {
  const [courseFilter, setCourseFilter] = useState(0);
  const { courseState } = useAppContext();

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
              checked={0 === courseFilter}
              label={"All"}
              tag={0}
              clickCallback={() => {
                setCourseFilter(0);
              }}
            />
            {courseState.map((state) => {
              return (
                <ModeRadioButton
                  checked={state.value === courseFilter}
                  label={state.display}
                  tag={0}
                  key={state.display}
                  clickCallback={() => {
                    setCourseFilter(state.value);
                  }}
                />
              );
            })}
          </div>
        </section>
      </header>
      <section className="my-4 grid grid-flow-row gap-y-3">
        <CourseCard tag={["T"]} courseCode="TEST-3000" title="Test1" />
      </section>
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
      className={`flex gap-2 items-center !rounded-md hover:!bg-gray-100 ${
        checked ? " !bg-gray-50" : ""
      }`}
      onClick={clickCallback}
    >
      <span
        className={`text-xs md:text-sm lg:text-lg font-semibold ${fontStyle}`}
      >
        {label}
      </span>
      <p className={`tag ${tagStyle}`}>{tag}</p>
    </button>
  );
};

export default MyCourses;
