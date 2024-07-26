import React, { useEffect, useState } from 'react';
import { CourseCardProps } from "@/app/model/CourseInterface";
import {ICourseSchema, courseState} from "../../../public/data/dataInterface";

const CourseCardDropDown = ({ title, courseCode, tag }: CourseCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // track if the course is saved: planned, in progress, or interested
  const [saved, setSave] = useState(false);
  const [dropDownText, setDropDownText] = useState("No Selection");

  function saveCourse(newState : courseState) {
      let current: ICourseSchema[] = JSON.parse(localStorage.getItem("courses"));
      if (saved) {
        current = current.filter(i => i.title != title);
      } else if (current.find(x => x.title === title) == undefined) {
        current.push({ title: title, courseCode: courseCode, tag: tag, state: newState});
        localStorage.setItem("courses", JSON.stringify(current));
        setSave(!saved);
      }
  }
  
  function removeCourse() {
    let current: ICourseSchema[] = JSON.parse(localStorage.getItem("courses"));
    if (saved) {
      current = current.filter(i => i.title != title);
    } else if (current.find(x => x.title === title) == undefined) {
      current.push({ title: title, courseCode: courseCode, tag: tag, state: newState});
      localStorage.setItem("courses", JSON.stringify(current));
      setSave(!saved);
  
    }
  }
  useEffect(() => {
    const div = document.getElementById('fixed-size-div');
    const initialWidth = div.offsetWidth;
    div.style.width = `${initialWidth}px`;
  }, []);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const handleOption1 = () => {
    setIsOpen(false);
    setDropDownText("Planned");
    saveCourse("Planned");
  };
  const handleOption2 = () => {
    setIsOpen(false);
    setDropDownText("In Progress");
    saveCourse("In Progress");
  };
  const handleOption3 = () => {
    setIsOpen(false);
    setDropDownText("Interested");
    saveCourse("Interested");
  };

  const handleOption0 = () => {
    setIsOpen(true);
    setDropDownText("Remove");
    removeCourse();
  }

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div id="fixed-size-div" className="text-sm font-semibold text-gray-25 bg-primary-700 px-2 py-2.5 border border-solid border-gray-300 rounded-lg cursor-pointer text-center">
        {dropDownText}
      </div>
      {
        isOpen && !saved && (
          <div className="absolute w-48 bg-white shadow-lg rounded-lg border border-solid border-gray-300 z-10">
            <ul>
              <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer" onClick={handleOption1}>Planned</li>
              <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer" onClick={handleOption2}>In Progress</li>
              <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer" onClick={handleOption3}>Interested</li>
            </ul>
          </div>
        )}
      {
        isOpen && saved && (
          <div className="absolute w-48 bg-white shadow-lg rounded-lg border border-solid border-gray-300 z-10">
            <ul>
              <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer" onClick={handleOption0}>Remove</li>
            </ul>
          </div>
        )}
    </div>
  );
};

export default CourseCardDropDown;
