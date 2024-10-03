import { useState, useEffect } from "react";
import { Bookmark, BookmarkChecked, HelpIcon } from "../utils/Icon";
import { IPathwaySchema } from "@/public/data/dataInterface";
import { useAppContext } from "@/app/contexts/appContext/AppProvider";
import { HelpBox } from "./helpBox";
import { courseState } from "@/public/data/staticData";
import Link from "next/link";

const PathwayCard = ({ title, department, coursesIn }: IPathwaySchema) => {
  // TODO: use courses to determine the compatibility
  // TODO: change to bookmark state and update React Context
  // TODO: Compute tooltip
  
  const [bookmark, setBookmark] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const { courses } = useAppContext();
  const getBookmarks = () => {
    var bmks = localStorage.getItem("bookmarks")
    if (bmks == null) {
      localStorage.setItem("bookmarks", "[]");
    }
    else {
      setBookmark(JSON.parse(bmks).find(x => x.title === title) != undefined);
    }
  }

  
  const toggleBookmark = () => {
    let current: IPathwaySchema[] = JSON.parse(localStorage.getItem("bookmarks"));
    if (bookmark)
      current = current.filter(i => i.title != title);
    else if (current.find(x => x.title === title) == undefined) {
      current.push({ title: title, department: department, coursesIn: coursesIn });
    }
    localStorage.setItem("bookmarks", JSON.stringify(current));
    setBookmark(!bookmark);
  }
  

  useEffect(() => {
    getBookmarks();
  }, [])
  // Statuses: Completed, In Progress, Planned, Interested, No Selection
  
  const inPathway = courses.filter((course) => coursesIn.includes(course.subject + "-" + course.courseCode));

  // TODO: map status to display so that we don't need different variables for each status
  /*
  let items = [];
  const statuses = courseState.map((state) => state.display);
  for (let status of statuses) {
    const statusCourses = inPathway.filter((course) => course.status === status);
    const statusItems = statusCourses.map((course) => (
      <div key={course.courseCode} className="flex gap-2 items-center">
        <p className="text-sm text-green-500">✔</p>
        <b className="text-sm">{course.courseCode}:</b>
        <p className="text-sm">{course.title}</p>
      </div>
    ));
    items.push(statusItems);
    console.log(courses);
  }
  */
  
  const completed = inPathway.filter((course) => course.status === "Completed");
  const completedItems = completed.map((course) => (
    <div key={course.subject + "-" + course.courseCode} className="flex gap-2 items-center">
      <p className="text-sm text-green-500">✔</p>
      <b className="text-sm">{course.subject + "-" + course.courseCode}:</b>
      <p className="text-sm">{course.title}</p>
    </div>
  ));
  const inProgress = inPathway.filter((course) => course.status === "In Progress");
  const inProgressItems = inProgress.map((course) => (
    <div key={course.subject + "-" + course.courseCode} className="flex gap-2 items-center">
      <p className="text-sm text-yellow-500">⏺</p>
      <b className="text-sm">{course.subject + "-" + course.courseCode}:</b>
      <p className="text-sm">{course.title}</p>
    </div>
  ));
  const planned = inPathway.filter((course) => course.status === "Planned");
  const plannedItems = planned.map((course) => (
    <div key={course.subject + "-" + course.courseCode} className="flex gap-2 items-center">
      <p className="text-sm text-gray-500">⏺</p>
      <b className="text-sm">{course.subject + "-" + course.courseCode}:</b>
      <p className="text-sm">{course.title}</p>
    </div>
  ));
  
  return (
    <section className="pathway-card">
      <header className="flex justify-between w-full items-start">
        <div className="w-[367px] mb-2">
          <div className="flex flex-col md:flex-row gap-2 items-start py-1">
            <Link className="pathway-title flex-1" href={'/pathways/'+title.replace("/", "+")}>{title}</Link>
            <p className="tag">{department}</p>
          </div>
          <div className="progress-bar">
            <div className="flex gap-1">
              <div className="indicator bg-status-bar-active"></div>
              <div className="indicator bg-status-bar-in-progress"></div>
              <div className="indicator bg-status-bar-inactive"></div>
            </div>
            <HelpIcon // TODO: Add tooltip
            onMouseEnter={() => setIsShown(true)}
            onMouseLeave={() => setIsShown(false)}
            />
            {isShown && (
              //<HelpBox/>
              true
              )
            }
          </div>
        </div>
        <div onClick={toggleBookmark} className="p-2">
          {bookmark ? <BookmarkChecked /> : <Bookmark />}
        </div>
      </header>
      <div className="flex gap-3 flex-col">
        {completedItems}
        {inProgressItems}
        {plannedItems}
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
