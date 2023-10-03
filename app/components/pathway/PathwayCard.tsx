import React from "react";
import { Bookmark, BookmarkChecked, HelpIcon } from "../utils/Icon";
import { IPathwaySchema } from "@/public/data/dataInterface";
import Link from "next/link";

const PathwayCard = ({ title, department, courses }: IPathwaySchema) => {
  // TODO: use courses to determine the compatibility
  // TODO: change to bookmark state and update React Context
  // TODO: Compute tooltip

  const bookmark = false;
  const tooltip = null;

  return (
    <section className="pathway-card">
      <header className="flex justify-between w-full items-start">
        <div className="w-[367px] mb-2">
          <div className="flex flex-col md:flex-row gap-2 items-start py-1">
            <Link
              href={"/pathways/"+title}
              className="pathway-title flex-1"
              >
              {title}
            </Link>
            <p className="tag">{department}</p>
          </div>
          <div className="progress-bar">
            <div className="flex gap-1">
              <div className="indicator bg-status-bar-active"></div>
              <div className="indicator bg-status-bar-in-progress"></div>
              <div className="indicator bg-status-bar-inactive"></div>
            </div>
            <HelpIcon />
          </div>
        </div>
        <div className="p-2">
          {bookmark ? <BookmarkChecked /> : <Bookmark />}
        </div>
      </header>
      <div className="flex gap-3 flex-col">
        {/* {
        courses.map((course, i) => {
          return (
            <div className="courselist" key={course.courseCode}>
              <StatusIndicator {...course} />
              <span>{course.title}</span>
            </div>
          );
        })
        } */}
      </div>
    </section>
  );
};

const StatusIndicator = (status: string) => {
  return (
    <div className="w-4 h-4 basis-4 grow-0 shrink-0 rounded-lg bg-gray-100 border border-solid border-gray-300"></div>
  );
};

export default PathwayCard;
