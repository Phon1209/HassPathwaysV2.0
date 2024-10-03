"use client";

import React, {
  useState,
  useReducer,
  useDeferredValue,
  useEffect,
  Suspense,
} from "react";
import PathwayCard from "@/app/components/pathway/PathwayCard";
import { useAppContext } from "@/app/contexts/appContext/AppProvider";
import {
  SearchInput,
  FilterCheckBox,
} from "@/app/components/pathway/FilterComponent";
import { IpathwayData } from "@/public/data/staticInterface";
import { IPathwaySchema } from "@/public/data/dataInterface";
import dynamic from "next/dynamic";
import { debounce } from "lodash";
import { validCatalogYear } from "@/public/data/staticData";
import Link from "next/link";
import ChevronRight from "@/public/assets/svg/chevron-right.svg?svgr";

const Spinner = dynamic(() => import("@/app/components/utils/Spinner"));

const getFilterList = (pathwayCategory, filterMask) => {
  const filterList = pathwayCategory
    .filter((_, i) => (1 << i) & filterMask)
    .reduce((acc, pathwayCategory) => {
      if (acc === "") return pathwayCategory.value;
      return acc + "," + pathwayCategory.value;
    }, "");
  return filterList === null ? "" : filterList;
};

const SearchCourse = () => {
  const { pathwaysCategories, catalog_year } = useAppContext();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const MAX_FILTER = (1 << pathwaysCategories.length) - 1;
  const [filterState, dispatchFilter] = useReducer(
    (state: number, action: { payload: number }) => {
      const rep = 1 << action.payload;
      if (action.payload === MAX_FILTER) {
        return state === action.payload ? 0 : MAX_FILTER;
      }
      return state & rep ? state - rep : state + rep;
    },
    0
  );

  const activeFilter = (state: number, index: number) =>
    (state & (1 << index)) !== 0;

  const [searchString, setSearchString] = useState("");
  const [resultPathways, setResultPathways] = useState<IPathwaySchema[]>([]);

  const deferSearchString = useDeferredValue(searchString);
  const deferFilterState = useDeferredValue(filterState);

  //TODO Refactor to utilize pathwayData
  useEffect(() => {
    const apiController = new AbortController();
    const validYear = validCatalogYear.includes(catalog_year);
    const searchStr = deferSearchString;
    const searchDepart = getFilterList(pathwaysCategories, deferFilterState);
    const searchYear = validYear ? catalog_year : "2024-2025";

    setIsLoading(true);

    fetch(
      `http://localhost:3000/api/pathway/search?${new URLSearchParams({
        searchString: searchStr,
        department: searchDepart,
        catalogYear: searchYear,
      })}`,
      {
        signal: apiController.signal,
        cache: "no-store",
        next: {
          revalidate: false,
        },
      }
    )
      .then((data) => data.json())
      .then((data) => {
        setResultPathways(data);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("Fetching Error: ", err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => apiController.abort("Cancelled");
  }, [deferFilterState, deferSearchString, catalog_year]);

  useEffect(() => {
  }, [resultPathways]);

  return (
    <>
      <header className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-8">
          <h1 className="title mb-3">Explore Pathways</h1>
          <Link href={"/pathways"}>
            <span className="flex text-primary-700 gap-2 text-sm font-semibold">
              My Pathways <ChevronRight />
            </span>
          </Link>
        </div>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="w-full fold:w-[320px]">
            <Suspense>
              <SearchInput
                setSearchString={setSearchString}
                searchString={searchString}
              />
            </Suspense>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold lg:hidden">Department</h3>
            <div className="flex button-group flex-wrap">
              <FilterCheckBox
                clickCallback={() => dispatchFilter({ payload: MAX_FILTER })}
                label="All"
                checked={filterState === MAX_FILTER}
              />
              {
              pathwaysCategories.map((pathway, i) => (
                <FilterCheckBox
                  checked={activeFilter(filterState, i)}
                  key={pathway.value}
                  label={pathway.display}
                  clickCallback={() => dispatchFilter({ payload: i })}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {isLoading ? (
        <Spinner />
      ) : (
        <section className="py-8 flex flex-wrap gap-x-10 gap-y-4 justify-around md:justify-start">
          {resultPathways.map((pathway, i) => (
            <PathwayCard {...pathway} key={i} />
          ))}
        </section>
      )}
    </>
  );
};

export default SearchCourse;
