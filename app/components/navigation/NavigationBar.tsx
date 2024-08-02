"use client";

import React from "react";
import Link from "next/link";
import NavButton from "./NavButton";
import CatalogDropdown from "./CatalogDropdown";
import { BarChart, HomeLine, SearchIcon } from "../utils/Icon";
import MenuBurger from "@/public/assets/svg/menu-04.svg?svgr";
import CloseButton from "@/public/assets/svg/x-close.svg?svgr";

const NavigationBar = ({ className }: { className?: string }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <nav
      className={`relative navigation-bar flex gap-y-3 flex-row items-start md:items-center justify-between ${className}`}
    >
      <Link href="/">
        <header className="text-md lg:text-xl font-semibold">
          <span className="text-primary-900">Hass</span> Pathways
        </header>
      </Link>

      <div
        onClick={() => {
          setMenuOpen((open) => !open);
        }}
        className="z-20 block md:hidden cursor-pointer"
      >
        {menuOpen ? <CloseButton /> : <MenuBurger />}
      </div>
      <div
        className={`absolute z-10 top-0 right-0 md:relative flex-col md:flex-row gap-y-3 gap-x-5 items-end md:items-center ${
          menuOpen
            ? "block md:flex rounded-lg p-8 pt-16 md:p-0 border md:border-0 border-solid border-gray-300 bg-white"
            : "hidden md:flex"
        }`}
      >
        <ul
          className={`flex flex-col md:flex-row items-start gap-5 md:gap-4 md:px-4 self-stretch ${
            menuOpen ? "mb-5 md:mb-0" : ""
          }`}
        >
          <div className="bg-gray-100 rounded-md flex gap-2" style={{ padding: '3px' }}>
          <NavButton
            link="/courses"
            text="My Courses"
            Icon={<HomeLine />}
            keyword="courses"
          />
          <NavButton
            link="/courses/search"
            text="Search Courses"
            Icon={<SearchIcon />}
            keyword="courses/search"
          />
          </div>
          <div className="bg-gray-100 rounded-md flex gap-2" style={{ padding: '3px' }}>
          <NavButton
            link="/pathways"
            text="My Pathways"
            Icon={<BarChart />}
            keyword="pathways"
          />
          <NavButton
            link="/pathways/search"
            text="Explore Pathways"
            Icon={<SearchIcon />}
            keyword="pathways/search"
          />
          </div>
        </ul>
        <CatalogDropdown />
      </div>
    </nav>
  );
};

export default NavigationBar;
