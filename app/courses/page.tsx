"use client";

import { MouseEventHandler, useEffect, useState } from "react";
import CourseCard from "../components/course/CourseCard";
import Spinner from "../../app/components/utils/Spinner"; // Import Spinner component
import { useAppContext } from "../contexts/appContext/AppProvider";
import { ICourseSchema } from "../../public/data/dataInterface";
import { CourseCardProps } from "@/app/model/CourseInterface";

const MyCourses = () => {
  const [courseFilter, setCourseFilter] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { courses, fetchCourses, courseState } = useAppContext();
  const [filteredCourses, setFilteredCourses] = useState();

  useEffect(() => {
    const newFilteredCourses = courses.filter(course =>
      course.status !== "No Selection"
    );
    
    setFilteredCourses(newFilteredCourses);
    setIsLoading(false);
  }, [courses]);

  useEffect(() => {
    
    console.log(courses);

  }, []);

  return (
    <>
      <header className="mb-4 md:mb-8">
        <h1 className="title">My Courses</h1>
      </header>
      <section>
        <div className="course-button-group sm:flex flex-wrap gap-x-2 hidden">
          <ModeRadioButton
            checked={courseFilter === 0}
            label={"All"}
            tag={0}
            clickCallback={() => {
              setCourseFilter(0);
            }}
          />
          {courseState.map((state) => (
            <ModeRadioButton
              checked={state.value === courseFilter}
              label={state.display}
              tag={0}
              key={state.display}
              clickCallback={() => {
                setCourseFilter(state.value);
              }}
            />
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-3">
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