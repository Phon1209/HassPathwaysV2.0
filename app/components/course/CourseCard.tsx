import React, { useState } from "react";
import { CourseCardProps } from "@/app/model/CourseInterface";
import Link from "next/link";
import CourseCardDropDown from "./CourseDropDownButton";

const CourseCard = ({
  title,
  courseCode,
  tag = [],
  properties = {},
  offered = {},
  prerequsits = [],
  status = "No Selection"
}: CourseCardProps) => {
  const [state, setState] = useState(status);

  const offeredSemesters = [];
  if (offered.fall) offeredSemesters.push("Fall");
  if (offered.spring) offeredSemesters.push("Spring");
  if (offered.summer) offeredSemesters.push("Summer");

  return (
    <section className="course-card">
      <div className="flex flex-col fold:flex-row justify-between items-center">
        <div className="flex flex-col">
          <header className="course-title">
            <Link
              href={`/courses/${courseCode}`}
              className="text-md font-semibold break-normal"
            >
              {title}
            </Link>
            <p className="text-sm text-gray-600">{courseCode}</p>
          </header>
          <div className="flex gap-x-1 flex-wrap mt-2">
            {properties.CI && (
              <p className="tag tag-primary">
                Communication Intensive
              </p>
            )}
            {properties.HI && (
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
          {prerequsits.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-semibold">Prerequisites:</h4>
              <ul className="list-disc ml-4">
                {prerequsits.map((prereq) => (
                  <li key={prereq} className="text-sm text-gray-600">
                    {prereq}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <CourseCardDropDown title={title} courseCode={courseCode} tag={tag} status={state} />
      </div>
    </section>
  );
};

export default CourseCard;
