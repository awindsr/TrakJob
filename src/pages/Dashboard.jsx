import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
// import ProgressCard from "../components/ProgressCard"; // Ensure you have this import if it's a separate file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import supabase from "../utils/Supabase";

export default function Dashboard({ setIsAuthenticated }) {
  const [jobData, setJobData] = useState([]);

  const getData = async () => {
    try {
      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .eq("user_id", "7ce514f1-f159-42f2-bb0e-f38928e0c862");
      if (error) {
        console.error(error);
        throw new Error(error.message);
      }
      setJobData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

const total_applied = jobData.length;
const in_touch = jobData.filter((job) => job.current_status === "In Touch").length;
const interviewed = jobData.filter((job) => job.current_status === "Interviewed").length;
const rejected = jobData.filter((job) => job.current_status === "Rejected").length;
//   console.log(total_applied)

//   console.log(jobData);

  return (
    <div className="w-[100vw] h-auto bg-white flex flex-col justify-start items-start">
      <div className="w-screen h-[8vh]">
        <Header setIsAuthenticated={setIsAuthenticated} />
      </div>
      <div className="p-8 flex flex-col gap-5 items-center w-full h-auto justify-center">
        <StatCard total_applied={total_applied} in_touch={in_touch} interviewed={interviewed} rejected={rejected} />
        <div className="bg-[#f3f6ff] w-full flex gap-2 h-auto mt-4 p-4 rounded-md">
          <div className="flex flex items-start justify-start w-full h-auto gap-2 ">
            <div className="w-1/4 h-auto flex flex-col p-4 bg-white shadow-md rounded-lg font-gilroy text-gray-500">
              In progress
              {jobData.map(
                (job) =>
                  job.current_status === "Applied" && (
                    <div className="w-full h-full flex flex-col p-2 bg-gray-200 ">

                    <ProgressCard
                      key={job.id}
                      job_title={job.job_title}
                      company={job.company}
                      date_applied={job.date_applied}
                      applied_platform={job.applied_platform}
                      current_status={job.current_status}
                        tagBg="bg-[#eeecf9]"
                         tagTextColor="text-[#8d75f6]"
                    />
                    </div>
                  )
              )}
            </div>
            <div className="w-1/4 h-auto flex flex-col p-4 bg-white shadow-md rounded-lg font-gilroy text-gray-500">
              In Touch
              {jobData.map(
                (job) =>
                  job.current_status === "In Touch" && (
                    <div className="w-full h-full flex flex-col p-2 bg-gray-200 ">

                    <ProgressCard
                      key={job.id}
                      job_title={job.job_title}
                      company={job.company}
                      date_applied={job.date_applied}
                      applied_platform={job.applied_platform}
                      current_status={job.current_status}
                      tagBg="bg-[#f9f0e5]"
                       tagTextColor="text-[#fd9d2f]"
                     
                    />
                    </div>
                  )
              )}
            </div>
            <div className="w-1/4 h-auto flex flex-col p-4 bg-white shadow-md rounded-lg font-gilroy text-gray-500">
              Interview
              {jobData.map(
                (job) =>
                  job.current_status === "Interviewed" && (
                    <div className="w-full h-full flex flex-col p-2 bg-gray-200 ">

                    <ProgressCard
                      key={job.id}
                      job_title={job.job_title}
                      company={job.company}
                      date_applied={job.date_applied}
                      applied_platform={job.applied_platform}
                      current_status={job.current_status}
                      interview_date={job.interview_date}
                      tagBg="bg-green-100"
                       tagTextColor="text-green-500"
                     
                    />
                    </div>
                  )
              )}
            </div>
            <div className="w-1/4 h-auto flex flex-col p-4 bg-white shadow-md rounded-lg font-gilroy text-gray-500">
              Rejected
              {jobData.map(
                (job) =>
                  job.current_status === "Rejected" && (
                    <div className="w-full h-full flex flex-col p-2 bg-gray-200 ">

                    <ProgressCard
                      key={job.id}
                      job_title={job.job_title}
                      company={job.company}
                      date_applied={(job.date_applied)?.split("T")[0]}
                      applied_platform={job.applied_platform}
                      current_status={job.current_status}
                      tagBg="bg-red-100"
                       tagTextColor="text-red-500"
                     
                    />
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressCard({ job_title, company, date_applied, applied_platform, current_status, tagBg,tagTextColor, interview_date }) {
    // const dateapplied = date_applied.split("T")[0]
  return (
    <div className="w-full h-auto p-4 bg-white shadow-md rounded-lg font-gilroy text-gray-500 mt-4">
      
        <div className="bg-white rounded-lg flex flex-col gap-4 w-full h-auto p-4 shadow-sm">
          <div className="flex justify-between items-center w-full">
            <div className={`${tagBg} ${tagTextColor} flex justify-between items-center px-3  font-bold w-auto py-1 rounded-full`}>
              {current_status} <br></br>{interview_date}
            </div>
            <div>
              <FontAwesomeIcon icon={faEllipsis} className="text-gray-400" />
            </div>
          </div>
          <div className="flex flex-col mt-4">
            <h2 className="text-2xl font-gilroy text-black">{job_title}</h2>
            <p className="text-slate-700 text-sm">{company}</p>
          </div>
          <div className="flex gap-3 mt-4">
            <p className="text-green-500 bg-green-100 px-3 py-1 w-1/2 rounded-full text-sm flex items-center justify-center">
              Applied: {date_applied}
            </p>
            <p className="text-yellow-500 bg-yellow-100 px-3 py-1 w-1/2 rounded-full text-sm flex items-center justify-center">
              {applied_platform}
            </p>
          </div>
        </div>
      </div>
    
  );
}
