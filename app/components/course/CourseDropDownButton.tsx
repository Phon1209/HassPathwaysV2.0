import React, { useEffect, useState } from 'react';

const CourseCardDropDown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropDownText, setDropDownText] = useState("No Selection");

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const handleOption1 = () => {
    setIsOpen(false);
    setDropDownText("Planned");
  };
  const handleOption2 = () => {
    setIsOpen(false);
    setDropDownText("In Progress");
  };
  const handleOption3 = () => {
    setIsOpen(false);
    setDropDownText("Interested");
  };

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="text-sm font-semibold text-gray-25 bg-primary-700 px-2 py-2.5 border border-solid border-gray-300 rounded-lg cursor-pointer text-center w-28">
        {dropDownText}
      </div>
      {isOpen && (
        <div className="absolute w-48 bg-white shadow-lg rounded-lg border border-solid border-gray-300 z-10">
          <ul>
            <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer w-48" onClick={handleOption1}>Planned</li>
            <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer w-48" onClick={handleOption2}>In Progress</li>
            <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer w-48" onClick={handleOption3}>Interested</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default CourseCardDropDown;
