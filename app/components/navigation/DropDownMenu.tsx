"use client";

import React, { useState } from 'react';
import ChevronUp from "@/public/assets/svg/chevron-up.svg?svgr";
import ChevronDown from "@/public/assets/svg/chevron-down.svg?svgr";

const MenuDropdown = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="flex items-center px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
          onClick={toggleDropdown}
        >
          <span>{title}</span>
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
