import React, { useEffect, useState } from 'react';
import { CourseCardProps } from "@/app/model/CourseInterface";
import { ICourseSchema, courseState, ICourseSchemaSaved } from "../../../public/data/dataInterface";

const colorMap = {
  "No Selection": "bg-primary-700 text-white",
  "Planned": "bg-orange-500 text-white",
  "In Progress": "bg-green-500 text-white",
  "Interested": "bg-blue-500 text-white", 
};

const CourseCardDropDown = ({ title, courseCode, tag, status = "No Selection" }: CourseCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dropDownText, setDropDownText] = useState<courseState>(status);

  // Function to save the course state to local storage
  const saveCourse = (newState: courseState) => {
    let current: ICourseSchema[] = JSON.parse(localStorage.getItem("courses") || "[]");
    const courseIndex = current.findIndex(course => course.title === title);

    if (courseIndex !== -1) {
      current[courseIndex].state = newState;
    } else {
      current.push({ title, courseCode, tag, state: newState });
    }

    localStorage.setItem("courses", JSON.stringify(current));
    setSaved(true);
    setDropDownText(newState);
  };

  // Function to remove the course from local storage
  const removeCourse = () => {
    let current: ICourseSchemaSaved[] = JSON.parse(localStorage.getItem("courses") || "[]");
    current = current.filter(course => course.title !== title);
    localStorage.setItem("courses", JSON.stringify(current));
    setSaved(false);
    setDropDownText("No Selection");
  };

  useEffect(() => {
    if (dropDownText !== "No Selection") {
      setSaved(true);
    }
  }, [dropDownText]);

  // Handlers for dropdown options
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
    setIsOpen(false);
    setDropDownText("Remove");
    removeCourse();
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div
        id="fixed-size-div"
        className={`text-sm font-semibold px-2 py-2.5 border border-solid border-gray-300 rounded-lg cursor-pointer text-center ${colorMap[dropDownText]}`}
      >
        {dropDownText}
      </div>
      {isOpen && !saved && (
        <div className="absolute w-48 bg-white shadow-lg rounded-lg border border-solid border-gray-300 z-10">
          <ul>
            <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer" onClick={handleOption1}>Planned</li>
            <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer" onClick={handleOption2}>In Progress</li>
            <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer" onClick={handleOption3}>Interested</li>
          </ul>
        </div>
      )}
      {isOpen && saved && (
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
