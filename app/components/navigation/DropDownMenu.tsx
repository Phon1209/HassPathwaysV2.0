
"use client";

import React, { useState } from 'react';
import ChevronUp from "@/public/assets/svg/chevron-up.svg?svgr";
import ChevronDown from "@/public/assets/svg/chevron-down.svg?svgr";

const MenuDropdown = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div 
      className="relative inline-block text-left"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div>
        <button
          type="button"
          className="flex items-center justify-center py-2 px-3 gap-2 rounded-md hover:bg-gray-50 w-[192px]"
        >
          
          <span className="text-sm lg:text-md font-semibold">
            {title}
          </span>
          <div>
            {!isOpen && <ChevronDown />}
            {isOpen && <ChevronUp />}
          </div>
          <div className="absolute left-0 right-0 bottom-[-10px] h-[10px] bg-transparent"></div>
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuDropdown;

