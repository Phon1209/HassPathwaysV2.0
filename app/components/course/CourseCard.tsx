import React, { useState } from "react";
import { useAppContext } from "../../contexts/appContext/AppProvider";
import Link from "next/link";
import CourseCardDropDown from "./CourseDropDownButton";
import { ICourseSchema, IOfferedSchema } from "@/public/data/dataInterface";

const offeredSemestersChecker = ( term: IOfferedSchema | undefined) => {
  if (!term) return [];
  const offeredSemesters = [];
  if (term.years[term.years.length - 1].fall) offeredSemesters.push("Fall");
  if (term.years[term.years.length - 1].spring) offeredSemesters.push("Spring");
  if (term.years[term.years.length - 1].summer) offeredSemesters.push("Summer");
  return offeredSemesters;
};

const CourseCard = ({
  title,
  courseCode,
  subject,
  attributes = {
    CI: false,
    HI: false,
    major_restricted: false
  },
  term = undefined,
  prereqs = undefined,
  status = "No Selection"
}: ICourseSchema) => {
  const [state, setState] = useState(status);
  const {courses, updateCourseState} = useAppContext();
  status = courses.find(course => course.title === title)?.status || "No Selection";
  const offeredSemesters = offeredSemestersChecker(term);
  return (
    <section className="course-card">
      <div className="flex flex-col fold:flex-row justify-between items-start">
        <div className="flex flex-col">
          <header className="course-title">
            <Link
              href={`/courses/${subject + '-' + courseCode}`}
              className="text-md font-semibold break-normal"
            >
              {title}
            </Link>
            <p className="text-sm text-gray-600">{subject + '-' + courseCode}</p>
          </header>
          <div className="flex gap-x-1 flex-wrap mt-2">
            {attributes && attributes.CI && (
              <p className="tag tag-primary">
                Communication Intensive
              </p>
            )}
            {attributes && attributes.HI && (
              <p className="tag tag-primary">
                Hass Inquiry
              </p>
            )}
          </div>
          {offeredSemesters.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-semibold">Offered:</h4>
              <ul className="list-disc ml-4">
                {offeredSemesters.map((semester) => (
                  <li key={semester} className="text-sm text-gray-600">
                    {semester}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {prereqs && prereqs.courses.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-semibold">Prerequisites:</h4>
              <ul className="text-sm text-gray-600">
                {prereqs.raw_precoreqs}
              </ul>
            </div>
          )}
        </div>
        <CourseCardDropDown title={title} courseCode={courseCode} status={status} />
      </div>
    </section>
  );
};

export default CourseCard;
