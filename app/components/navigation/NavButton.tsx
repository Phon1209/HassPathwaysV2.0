"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavButton = ({
  link,
  text,
  Icon,
  keyword,
}: {
  link: string;
  text: string;
  Icon: any;
  keyword: string;
}) => {
  const pathname = usePathname();
  const selected = pathname.match(new RegExp(`${keyword}$`, "gm"));
  // const selected = pathname === keyword;

  return (
    <Link href={link}>
      <div
        className={`flex items-center py-2 px-3 gap-2 rounded-md hover:bg-gray-50 ${
          selected && "text-primary-800 bg-gray-100"
        }`}
      >
        <Icon.type
          {...Icon.props}
          className={`${selected && "nav-button--selected"} hidden md:block`}
        />
        {/**/}
        <span
          className={`text-sm lg:text-md font-semibold ${
            !selected && "text-gray-700"
          }`}
        >
          {text}
        </span>
      </div>
    </Link>
  );
};

export default NavButton;
