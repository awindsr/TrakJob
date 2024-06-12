import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import DraggableCard from "../components/DraggableCard";
import DropZone from "../components/DropZone";
import supabase from "../utils/Supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faTrash } from "@fortawesome/free-solid-svg-icons";
import AddJobModal from "../components/AddJobModal";

export default function Dashboard({ setIsAuthenticated }) {
  const [jobData, setJobData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user_id = sessionStorage.getItem("user_id");
  console.log(user_id);

  const getData = async () => {
    try {
      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .eq("user_id", user_id);
      if (error) {
        console.error(error);
        throw new Error(error.message);
      }
      setJobData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const calculateApplicationsFiledChange = () => {
    const currentDate = new Date();
    const lastWeekDate = new Date();
    lastWeekDate.setDate(currentDate.getDate() - 7);


    
  }

  const handleDrop = async (item, newStatus) => {
      console.log(item, newStatus)
    const updatedJobData = jobData.map((job) =>
      job.application_id === item.id ? { ...job, current_status: newStatus } : job
    );
    setJobData(updatedJobData);

    const { data, error } = await supabase
      .from("job_applications")
      .update({ current_status: newStatus })
      .eq("application_id", item.id);

    if (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const appliedJobs = jobData.filter((job) => job.current_status === "Applied");
  const inTouchJobs = jobData.filter(
    (job) => job.current_status === "In Touch"
  );
  const interviewedJobs = jobData.filter(
    (job) => job.current_status === "Interviewed"
  );
  const rejectedJobs = jobData.filter(
    (job) => job.current_status === "Rejected"
  );

  const total_applied = jobData.length;
  const in_touch = jobData.filter(
    (job) => job.current_status === "In Touch"
  ).length;
  const interviewed = jobData.filter(
    (job) => job.current_status === "Interviewed"
  ).length;
  const rejected = jobData.filter(
    (job) => job.current_status === "Rejected"
  ).length;

  console.log(jobData);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative w-[100vw] h-auto bg-white flex flex-col justify-start items-start">
      {isModalOpen && (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <AddJobModal getData={getData} setIsModalOpen={setIsModalOpen} />
    </div>
  )}
        <div className="w-screen h-[8vh]">
          <Header setIsAuthenticated={setIsAuthenticated} setIsModalOpen={setIsModalOpen} />
        </div>
        <div className="p-8 flex flex-col gap-5 items-center w-full h-auto justify-center">
          <StatCard
            total_applied={total_applied}
            in_touch={in_touch}
            interviewed={interviewed}
            rejected={rejected}
          />
          <div className="bg-[#f3f6ff] w-full flex gap-2 h-auto mt-4 p-4 rounded-md">
            <DropZone status="Applied" onDrop={handleDrop}>
              <div className="w-full h-auto flex flex-col p-4 bg-white shadow-md rounded-lg font-gilroy text-gray-500 bg-gray-200">
                Applied
                {appliedJobs.map((job) => (
                  <DraggableCard key={job.application_id} job={job}>
                    <ProgressCard
                      job_title={job.job_title}
                      application_id={job.application_id}
                      company={job.company}
                      date_applied={job.applied_date}
                      applied_platform={job.applied_platform}
                      interview_date={job.interview_date}
                      current_status={job.current_status}
                      getData={getData}
                      tagBg="bg-[#eeecf9]"
                      tagTextColor="text-[#8d75f6]"
                    />
                  </DraggableCard>
                ))}
              </div>
            </DropZone>
            <DropZone status="In Touch" onDrop={handleDrop}>
              <div className="w-full h-auto flex flex-col p-4 bg-white shadow-md rounded-lg font-gilroy text-gray-500 bg-gray-200">
                In Touch
                {inTouchJobs.map((job) => (
                  <DraggableCard key={job.application_id} job={job}>
                    <ProgressCard
                      job_title={job.job_title}
                      application_id={job.application_id}

                      company={job.company}
                      getData={getData}

                      date_applied={job.applied_date}
                      applied_platform={job.applied_platform}
                      current_status={job.current_status}
                      interview_date={job.interview_date}
                      tagBg="bg-[#f9f0e5]"
                      tagTextColor="text-[#fd9d2f]"
                    />
                  </DraggableCard>
                ))}
              </div>
            </DropZone>
            <DropZone status="Interviewed" onDrop={handleDrop}>
              <div className="w-full h-auto flex flex-col p-4 bg-white shadow-md rounded-lg font-gilroy text-gray-500 bg-gray-200">
                Interview
                {interviewedJobs.map((job) => (
                  <DraggableCard key={job.application_id} job={job}>
                    <ProgressCard
                      job_title={job.job_title}
                      application_id={job.application_id}

                      company={job.company}
                      date_applied={job.applied_date}
                      getData={getData}

                      applied_platform={job.applied_platform}
                      current_status={job.current_status}
                      interview_date={job.interview_date}
                      tagBg="bg-green-100"
                      tagTextColor="text-green-500"
                    />
                  </DraggableCard>
                ))}
              </div>
            </DropZone>
            <DropZone status="Rejected" onDrop={handleDrop}>
              <div className="w-full h-auto flex flex-col p-4 bg-white shadow-md rounded-lg font-gilroy text-gray-500 bg-gray-200">
                Rejected
                {rejectedJobs.map((job) => (
                  <DraggableCard key={job.application_id} job={job}>
                    <ProgressCard
                      job_title={job.job_title}
                      application_id={job.application_id}

                      company={job.company}
                      date_applied={job.applied_date}
                      getData={getData}

                      applied_platform={job.applied_platform}
                      interview_date={job.interview_date}
                      current_status={job.current_status}
                      tagBg="bg-red-100"
                      tagTextColor="text-red-500"
                    />
                  </DraggableCard>
                ))}
              </div>
            </DropZone>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

function ProgressCard({

   
  job_title,
  company,
  date_applied,
  applied_platform,
  current_status,
  tagBg,
  tagTextColor,
  interview_date,
  application_id,
  getData
}) 





{
    const handleDelete = async () => {
        try {
            const { error } = await supabase
                .from('job_applications')
                .delete()
                .eq('application_id', application_id);
    
            if (error) {
                console.error(error);
                throw new Error(error.message);
            } else {
                console.log('Deleted');
                getData();
            }
        } catch (error) {
            console.log(error);
        }
    };

    // const appliedDate = 
    // console.log(appliedDate)
    
  return (
    <div className="w-full h-auto p-4 bg-white shadow-md rounded-lg font-gilroy text-gray-500 mt-4">
      <div className="bg-white rounded-lg flex flex-col gap-4 w-full h-auto p-4 shadow-sm">
        <div className="flex justify-between items-center w-full">
          <div
            className={`${tagBg} ${tagTextColor} flex justify-between items-center px-3 font-bold w-auto py-1 rounded-full`}>
            {current_status} <br />
            {interview_date?.split("T")[0]}
          </div>
          <div>
            <FontAwesomeIcon icon={faTrash} className="text-red-500" onClick={handleDelete}/>
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <h2 className="text-2xl font-gilroy text-black">{job_title}</h2>
          <p className="text-slate-700 text-sm">{company}</p>
        </div>
        <div className="flex gap-3 mt-4">
          <p className="text-green-500 bg-green-100 px-3 py-1 w-1/2 rounded-full text-sm flex items-center justify-center">
            Applied: {date_applied.split("T")[0]}
          </p>
          <p className="text-yellow-500 bg-yellow-100 px-3 py-1 w-1/2 rounded-full text-sm flex items-center justify-center">
            {applied_platform}
          </p>
        </div>
      </div>
    </div>
  );
}
