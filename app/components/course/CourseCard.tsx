import React from "react";
import { CourseCardProps } from "@/app/model/CourseInterface";
import Link from "next/link";
import CourseCardDropDown from "./CourseDropDownButton";

const CourseCard = ({ title, courseCode, tag }: CourseCardProps) => {
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
            {tag?.map((t) => (
              <p className="tag tag-primary" key={t}>
                {t}
              </p>
            ))}
          </div>
        </div>
        <CourseCardDropDown title={title} courseCode={courseCode} tag={tag} />
      </div>
    </section>
  );
};

export default CourseCard;
