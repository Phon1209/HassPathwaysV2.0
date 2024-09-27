"use client";

import { ISemesterData, ISingleYearOfferedSchema, IOfferedSchema } from "@/public/data/dataInterface";
import { FC, Fragment, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import ArrowLeft from "@/public/assets/svg/arrow-left.svg?svgr";
import ArrowRight from "@/public/assets/svg/arrow-right.svg?svgr";

const TableData = ({ data }) => {
  if (!data) return <div className="!text-gray-600">Unavailable</div>;

  return (
    <div>
      <div>
        Available
      </div>
    </div>
  );
};

export const SemesterTable: FC<IOfferedSchema> = (term) => {
  return (
    <Fragment>
      {!isMobileOnly && (
        <section className="hidden sm:grid grid-table grid-cols-4 max-w-[960px] overflow-clip rounded-xl border-solid border border-gray-200 bg-white ut-shadow-sm">
          <div className="table-header">Year</div>
          <div className="table-header">Spring</div>
          <div className="table-header">Summer</div>
          <div className="table-header">Fall</div>
          {
          term.years.map((year) => {
            return (
              <Fragment key={year.year}>
                <header className="font-medium">{year.year}</header>
                <TableData data={year.spring} />
                <TableData data={year.summer} />
                <TableData data={year.fall} />
              </Fragment>
            );
          })}
        </section>
      )}
      
    </Fragment>
  );
};

//<MobileTable years={years} /> TODO: Fix mobile table

const MobileTable: FC<Array<ISingleYearOfferedSchema>> = (years) => {
  const [yearIndex, setYearIndex] = useState(0);
  const t: ISingleYearOfferedSchema | undefined = years.at(yearIndex);
  if (!t) return <></>;
  return (
    <section className="block sm:hidden w-52">
      <header className="px-[8.7px] py-[6.53px] flex justify-between">
        <div className="p-[4.35px]">
          <ArrowLeft />
        </div>
        <span>{t.year}</span>
        <div className="p-[4.35px]">
          <ArrowRight />
        </div>
      </header>
    </section>
  );
};
