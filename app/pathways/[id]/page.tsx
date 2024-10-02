"use client";
import CourseCard from "@/app/components/course/CourseCard";
import BreadCrumb from "@/app/components/navigation/Breadcrumb";
import React, { FC, MouseEventHandler, useContext, useEffect, useState } from "react";
import { useAppContext } from "@/app/contexts/appContext/AppProvider";
import {
  ICourseClusterSchema,
  ICourseSchema,
  IPathwayDescriptionSchema,
} from "@/public/data/dataInterface";

const pathwayTempData: IPathwayDescriptionSchema = {
  description: `This course embraces the science of psychology. The aim is for
  students to learn how using the scientific method provides important
  insights about mind, brain, and behavior. This course integrates
  research on neuroscience throughout all the standard topics in an
  introductory course in psychology. The course presents advances across
  all subfields of psychology. In addition to standard exams, there are
  online assignments for each chapter and online laboratory experiences.`,
  compatibleMinor: ["1234", "123435", "52", "General Psychological Minor"],
  courses: [
    {
      title: "Introduction to abc",
      courseCode: "ACBD-1234",
      tag: ["Fall", "Spring"],
    },
    {
      title: "Introduction to React",
      courseCode: "ract-1234",
      tag: ["Fall", "Spring"],
    },
  ],
};

// const pathwayTempData: IPathwayDescriptionSchema = {
//   description: `This course embraces the science of psychology. The aim is for
//   students to learn how using the scientific method provides important
//   insights about mind, brain, and behavior. This course integrates
//   research on neuroscience throughout all the standard topics in an
//   introductory course in psychology. The course presents advances across
//   all subfields of psychology. In addition to standard exams, there are
//   online assignments for each chapter and online laboratory experiences.`,
//   compatibleMinor: ["1234", "123435", "52", "General Psychological Minor"],
//   courses: [
//     {
//       name: "Art1",
//       description: "this is art",
//       courses: [
//         {
//           title: "art",
//           courseCode: "arts-4937",
//           tag: ["Fall"],
//         },
//         {
//           title: "art",
//           courseCode: "arts-1957",
//           tag: ["Fall"],
//         },
//       ],
//     },
//     {
//       name: "Elec",
//       description: "this is art",
//       courses: [
//         {
//           title: "ele",
//           courseCode: "arts-8294",
//           tag: ["Fall"],
//         },
//         {
//           title: "ele2",
//           courseCode: "arts-9854",
//           tag: ["Fall"],
//         },
//       ],
//     },
//   ],
// };

const emptyPathway: IPathwayDescriptionSchema = {
  description: "",
  compatibleMinor: [],
  courses: [],
  clusters: [],
};

type IPathwayID = {
  params: {
    id: string;
    year: string;
  };
};

const PathwayDescriptionPage: FC<IPathwayID> = (data: IPathwayID) => {
  // Convert pathname to pathwayName
  const pathwayName: string = data.params.id.replaceAll("%20", " ");
  const {catalog_year} = useAppContext()

  const [pathwayData, setPathwayData] =
  useState<IPathwayDescriptionSchema>(emptyPathway);

  // TODO: check if pathway exists, or return something empty
  useEffect(() => {
    const apiController = new AbortController();

    let ret = fetch(`http://localhost:3000/api/pathway/${pathwayName}`, {
      signal: apiController.signal,
      next:{
        revalidate: false
      }
    })
      .then((response) => response.json())
      .then((data) => {
        // Assuming the data structure is similar to your previous API
        console.log(data);
        setPathwayData(data);
      })
      .catch((error) => {
        console.error("WARNING: ", error);
      });
      return () => apiController.abort();
  }, []);
  return (
    <>
      <header className="mb-4 md:mb-8">
        <BreadCrumb
          path={[
            {
              display: "Pathways",
              link: "/pathways/search",
            },
            {
              display: pathwayName,
              link: "",
            },
          ]}
        />
        <h1 className="mt-5 text-display-xs md:text-display-sm font-semibold">
          {pathwayName}
        </h1>
      </header>
      <section className="description-section">
        <header>
          <h3>Pathway Description</h3>
        </header>
        <p>{pathwayData.description}</p>
      </section>
      <section className="description-section">
        <header>
          <h3>Compatible Minor</h3>
        </header>
        <ul>
          {pathwayData.compatibleMinor.map((minor, i) => {
            return <li key={i}>- {minor}</li>;
          })}
        </ul>
      </section>
      <section className="description-section">
        <header>
          <h3>Requirement</h3>
        </header>
        <p>
          Students must choose a minimum of 12 credits as from the course list
          below.
        </p>
      </section>
      <section className="description-section">
        <header>
          <h3>Available Courses</h3>
        </header>
        <CourseSection courses={pathwayData.courses} />
      </section>
    </>
  );
};

interface CourseSectionProps {
  courses: Array<ICourseSchema> | Array<ICourseClusterSchema>;
}

const CourseSection: FC<CourseSectionProps> = ({ courses }) => {
  const [clusterIndex, setClusterIndex] = useState(0);

  if (courses.length === 0) return <></>;

  function instanceOfCluster(object: any): object is ICourseClusterSchema {
    return "name" in object;
  }

  const haveCluster = instanceOfCluster(courses[0]);
  const cluster: ICourseClusterSchema = courses[
    clusterIndex
  ] as ICourseClusterSchema;

  return (
    <>
      {haveCluster && (
        <>
          <ul
            className="rounded-lg flex flex-col sm:flex-row gap-2 p-1 
          bg-gray-50 border border-1 border-gray-200 list-none 
          w-full sm:w-[500px] md:w-[723px] lg:w-full lg:max-w-[723px]"
          >
            {courses.map((cluster: any, i: number) => {
              return (
                <CourseClusterSelection
                  key={cluster.name}
                  title={cluster.name}
                  tag={cluster.courses.length}
                  selected={clusterIndex === i}
                  onClickEvent={() => {
                    setClusterIndex(i);
                  }}
                />
              );
            })}
          </ul>
          <div className="my-3 grid grid-flow-row gap-y-3">
            <CourseList courses={cluster.courses} />
          </div>
        </>
      )}
      {!haveCluster && <CourseList courses={courses as Array<ICourseSchema>} />}
    </>
  );
};

interface CourseClusterProps {
  title: string;
  selected: boolean;
  onClickEvent: MouseEventHandler;
  tag: string | number;
}

const CourseClusterSelection: FC<CourseClusterProps> = ({
  title,
  selected,
  onClickEvent,
  tag,
}) => {
  return (
    <li
      className={`flex items-center text-xs md:text-sm cursor-pointer justify-center gap-x-2 px-3 py-[7px] rounded-[6px] font-semibold ${
        selected ? "text-gray-700 bg-white ut-shadow-lg" : "text-gray-500"
      }`}
      onClick={onClickEvent}
    >
      {title}
      <p className="tag tag-gray">{tag}</p>
    </li>
  );
};

interface CourseListProps {
  courses: Array<ICourseSchema>;
}

const CourseList: FC<CourseListProps> = ({ courses }) => {
  return (
    <div className="my-3 grid grid-flow-row gap-y-3">
      {courses.map((course) => {
        return <CourseCard key={course.courseCode} {...course} />;
      })}
    </div>
  );
};

export default PathwayDescriptionPage;
