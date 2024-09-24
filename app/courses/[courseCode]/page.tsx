"use client";

import { SemesterTable } from "@/app/components/course/OfferTable";
import BreadCrumb from "@/app/components/navigation/Breadcrumb";
import {
  ICourseSchema,
} from "@/public/data/dataInterface";
import { TemplateContext } from "next/dist/shared/lib/app-router-context";
// import { URLSearchParams } from "next/dist/compiled/@edge-runtime/primitives/url";
import React, { Fragment, useDeferredValue, useEffect, useState } from "react";

/**
 * Interface for course code
 */
type ICourseCode = {
  params: {
    courseCode: string;
  };
};

// Empty course object template
const emptyCourse: ICourseSchema = {
  title: "course not found",
  description: "des not found",
  prereqs: undefined,
  term: undefined,
  attributes: {
    CI: false,
    HI: false,
    major_restricted: false,
  },
  subject: "not found",
  courseCode: "not found",
  filter: "",
  status: "No Selection",
};

/**
 * React functional component for CoursePage.
 * Fetches and displays course information based on the courseCode from params.
 *
 * @param data - Object containing course code in params.
 */

const CoursePage: React.FC<ICourseCode> = (data) => {
  const { courseCode } = data.params;
  const courseSubject = courseCode.split("-")[0];
  const courseID = courseCode.split("-")[1];
  emptyCourse.courseCode = courseID;
  emptyCourse.subject = courseSubject;
  // Here I use use state state to fetch data and repace the template data:
  const [courseDescription, setCourseDescription] =
  useState<ICourseSchema>(emptyCourse);

  // Testing new API:
  useEffect(() => {
    const apiController = new AbortController();

    fetch(`http://localhost:3000/api/course/${courseCode}`, {
      signal: apiController.signal,
      cache: "no-store",
      next:{
        revalidate: false
      }
    })
      .then((response) => response.json())
      .then((data) => {
        // Assuming the data structure is similar to your previous API
        setCourseDescription((prev) => ({
          ...prev,
          title: data.title,
          description: data.description,
          prereqs: data.prereqs,
          attributes: data.attributes,
          term: data.courseSemester,
        }));
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });

    return () => {
      apiController.abort();
    };
  }, [courseCode]);

  // TODO: Still need the semester offered data being updated.
  // braket slising
  // TODO: Need to Parse Prereqs for better display (nested, and, or)
  // Test the new route, see if it can fetch the new code:

  useEffect(() => {
    // console.log("Current courseDescription:", courseDescription);
  }, [courseDescription]);

  const term = courseDescription?.term ?? "Unfound Terms";
  const courseName = courseDescription?.title ?? "Unfound Course";
  const description = courseDescription?.description
    ? courseDescription.description
    : "No Description Found";
  const prereqs = courseDescription?.prereqs ?? "Unfound Prereqs";
  // const thsemesterOffered = courseDescription?.semesterOffered ?? "Unfound Course SemesterOfferend"

  return (
    <Fragment>
      <header className="description-header">
        <BreadCrumb
          path={[
            { display: "Courses", link: "/courses/search" },
            { display: courseCode, link: "" },
          ]}
        />
        <h1>
          {courseDescription.title} ({courseCode})
        </h1>
      </header>
      <section className="description-section">
        <header>
          <h3>Course Description</h3>
        </header>
        <p>{description}</p>
      </section>
      <section className="description-section">
        <header>
          <h3>Prerequisites</h3>
        </header>
        {!courseDescription.prereqs && <p>None</p>}
      </section>
      <section className="description-section">
        <header>
          <h3>Semester Offered</h3>
        </header>
        {/*<SemesterTable term={term} />*/}
      </section>
    </Fragment>
  );
};

// Export the CoursePage component
export default CoursePage;
