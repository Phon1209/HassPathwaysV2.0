"use client";

import React, { useState } from "react";
import ChevronUp from "@/public/assets/svg/chevron-up.svg?svgr";
import ChevronDown from "@/public/assets/svg/chevron-down.svg?svgr";
import { useAppContext } from "@/app/contexts/appContext/AppProvider";

const catalogList = [
  {
    text: "2022 - 2023 Catalog",
    value: 2023,
  },
  {
    text: "2021 - 2022 Catalog",
    value: 2022,
  },
  {
    text: "2020 - 2021 Catalog",
    value: 2021,
  },
  {
    text: "2019 - 2020 Catalog",
    value: 2020,
  },
  {
    text: "2018 - 2019 Catalog",
    value: 2019,
  },
];

const CatalogDropdown = () => {
  const { catalog_year, setCatalog } = useAppContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const catalogText = catalogList.filter((cat) => cat.value === catalog_year)[0]
    .text;

  return (
    <div
      className="dropdown flex items-center gap-2 w-[320px] bg-white border-solid border border-gray-300 text-gray-500 py-[10px] px-[14px] rounded-lg prevent-select"
      onClick={() => {
        setDropdownOpen((open) => !open);
      }}
    >
      <div className="grow">{catalogText}</div>
      <div>
        {!dropdownOpen && <ChevronDown />}
        {dropdownOpen && <ChevronUp />}
      </div>

      {dropdownOpen && (
        <div className="dropdown-choices ut-shadow-lg">
          {catalogList.map((choice) => {
            return (
              <div
                className="dropdown-choice"
                key={choice.value}
                value={choice.value}
                onClick={() => {
                  setCatalog(choice.value);
                }}
              >
                {choice.text}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CatalogDropdown;