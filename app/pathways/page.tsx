"use client";
import React, { useState, useReducer, useEffect } from "react";
import {
  ModeRadioButton,
  FilterCheckBox,
} from "../components/pathway/FilterComponent";
import PathwayCard from "../components/pathway/PathwayCard";
import Link from "next/link";
import ChevronRight from "@/public/assets/svg/chevron-right.svg?svgr";
import { useAppContext } from "../contexts/appContext/AppProvider";
import { noBookmarkedText, noMatchedText } from "@/public/data/staticData";
import { IPathwaySchema } from "@/public/data/dataInterface";

// !! Temporary Data, Remove Later
const pathwayList = [
  {
    name: "Graphic and Interactive Media Design",
    category: "Communication & Media",
    courses: [
      {
        title: "abc",
        courseCode: "ARTS-1050",
        tag: [],
      },
      {
        title: "jir",
        courseCode: "ARTS-1200",
        tag: [],
      },
      {
        title: "kri",
        courseCode: "ARTS-2200",
        tag: [],
      },
    ],
  },
  {
    name: "Information Technology and Web Science",
    category: "Inter",
    courses: [
      {
        title: "abc",
        courseCode: "ARTS-1050",
        tag: [],
      },
      {
        title: "jir",
        courseCode: "ARTS-1200",
        tag: [],
      },
      {
        title: "kri",
        courseCode: "ARTS-2200",
        tag: [],
      },
    ],
  },
];

//const pathwayList: Array<IPathwaySchema> = [];

const MyPathways = () => {
  const { pathwaysCategories } = useAppContext();
  // Determine the mode of pathway card
  const [bookmarkedState, setbookmarkedState] = useState(true);
  const [marked, setMarked] = useState([]);

  const MAX_FILTER = (1 << pathwaysCategories.length) - 1;
  // Determine the filter
  const [filterState, dispatchFilter] = useReducer(
    (
      state: number,
      action: {
        payload: number;
      }
    ) => {
      const rep = 1 << action.payload;
      if (action.payload === MAX_FILTER) {
        if (state === action.payload) return 0;
        else return MAX_FILTER;
      }
      if (state & rep) state -= rep;
      else state += rep;
      return state;
    },
    0
  );
  const activeFilter = (state: number, index: number) =>
    (state & (1 << index)) !== 0;

  useEffect(() => {
    var bmks = localStorage.getItem("bookmarks")
    if (bmks == null) {
      localStorage.setItem("bookmarks", "[]");
    }
    else {
      //TODO: investigate how to edit bookmarks
      setMarked(JSON.parse(bmks));
    }
    
  }, [])

  return (
    <>
      <header className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-8">
          <h1 className="title">My Pathways</h1>
          <Link href={"/pathways/search"}>
            <span className="flex text-primary-700 gap-2 text-sm font-semibold">
              Explore Pathways <ChevronRight />
            </span>
          </Link>
        </div>
        <section className="flex flex-col lg:flex-row gap-4">
          <div className="flex button-group">
            <ModeRadioButton
              label="Bookmarked"
              checked={bookmarkedState}
              clickCallback={() => setbookmarkedState(true)}
            />
            <ModeRadioButton
              label="Matched"
              checked={!bookmarkedState}
              clickCallback={() => setbookmarkedState(false)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold md:hidden">Department</h3>
            <div className="flex button-group flex-wrap">
              <FilterCheckBox
                clickCallback={() => dispatchFilter({ payload: MAX_FILTER })}
                label="All"
                checked={filterState === MAX_FILTER}
              />
              {pathwaysCategories.map((pathway, i) => {
                return (
                  <FilterCheckBox
                    checked={activeFilter(filterState, i)}
                    key={pathway.value}
                    label={pathway.display}
                    clickCallback={() => dispatchFilter({ payload: i })}
                  />
                );
              })}
            </div>
          </div>
        </section>
      </header>
      {pathwayList.length === 0 ? (
        <NothingToShow bookmarkedState={bookmarkedState} />
      ) : (
        <section className="py-8 flex flex-wrap gap-x-10 gap-y-4 justify-around md:justify-start">
          {marked.map((pathway, i) => {
            return <PathwayCard {...pathway} key={i} />;
          })}
        </section>
      )}
    </>
  );
};

const NothingToShow = ({ bookmarkedState }: { bookmarkedState: boolean }) => {
  return (
    <section className="flex flex-col justify-center items-center grow gap-8 my-4">
      <header className="text-center">
        <h3 className="text-xl md:text-display-sm font-bold md:font-semibold mb-2">
          No <span>{bookmarkedState ? "Bookmarked" : "Matching"}</span> Pathways
        </h3>
        <p className="text-sm md:text-xl font-medium  text-gray-500">
          {bookmarkedState ? noBookmarkedText : noMatchedText}
        </p>
      </header>
      <div className="flex flex-col-reverse fold:flex-row items-center gap-8 text-sm md:text-md font-semibold">
        <Link
          href="/faq"
          className="rounded-lg px-[18px] py-2.5 text-primary-700"
        >
          Learn More
        </Link>
        {bookmarkedState && (
          <Link
            href="/pathways/search"
            className="rounded-lg px-[18px] py-2.5 bg-primary-600 text-white"
          >
            Explore Pathways
          </Link>
        )}
        {!bookmarkedState && (
          <Link
            href="/courses/search"
            className="rounded-lg px-[18px] py-2.5 bg-primary-600 text-white"
          >
            Explore Courses
          </Link>
        )}
      </div>
    </section>
  );
};

export default MyPathways;
