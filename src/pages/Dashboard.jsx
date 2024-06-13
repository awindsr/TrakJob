import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import DraggableCard from "../components/DraggableCard";
import DropZone from "../components/DropZone";
import supabase from "../utils/Supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faClose, faLink } from "@fortawesome/free-solid-svg-icons";


import AddJobModal from "../components/AddJobModal";
import { useNavigate } from "react-router-dom";
// import EditCardModal from "../components/EditCardModal";

export default function Dashboard({ setIsAuthenticated, token, setToken }) {
  const navigate = useNavigate();
  const [jobData, setJobData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const user_id = token;

  const getData = async () => {
    if (!user_id) {
      return navigate("/login");
    }
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

  useEffect(() => {
    getData();
  }, []);

  const handleDrop = async (item, newStatus) => {
    const updatedJobData = jobData.map((job) =>
      job.application_id === item.id
        ? { ...job, current_status: newStatus }
        : job
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

  const appliedJobs = jobData.filter((job) => job.current_status === "Applied");
  const inTouchJobs = jobData.filter((job) => job.current_status === "In Touch");
  const interviewedJobs = jobData.filter((job) => job.current_status === "Interviewed");
  const rejectedJobs = jobData.filter((job) => job.current_status === "Rejected");

  const total_applied = jobData.length;
  const in_touch = jobData.filter((job) => job.current_status === "In Touch").length;
  const interviewed = jobData.filter((job) => job.current_status === "Interviewed").length;
  const rejected = jobData.filter((job) => job.current_status === "Rejected").length;

  const openEditModal = (job) => {
    setCurrentJob(job);
    setIsEditModalOpen(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative w-[100vw] h-auto bg-white flex flex-col justify-start items-start">
        {isModalOpen && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <AddJobModal
              getData={getData}
              setIsModalOpen={setIsModalOpen}
              token={token}
            />
          </div>
        )}
        <div className="w-screen h-[8vh]">
          <Header
            setIsAuthenticated={setIsAuthenticated}
            setIsModalOpen={setIsModalOpen}
            setToken={setToken}
          />
        </div>
        <div className="p-8 flex flex-col gap-5 items-center w-full h-auto justify-center">
          <StatCard
            total_applied={total_applied}
            in_touch={in_touch}
            interviewed={interviewed}
            rejected={rejected}
          />
          {jobData.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center">
              <h1 className="text-2xl font-gilroy font-bold text-gray-600">
                No Jobs Found
              </h1>
              Click on the "Add Job" button to add a new job
            </div>
          ) : (
            <div className="bg-[#f3f6ff] w-full flex gap-2 h-auto mt-4 p-4 rounded-md">
              <DropZone status="Applied" onDrop={handleDrop}>
                <div className="w-full h-auto flex flex-col p-4 bg-white shadow-md rounded-lg font-gilroy text-gray-500 bg-gray-200">
                  Applied
                  <div className="bg-gray-300 p-2 rounded-md">
                    {appliedJobs.map((job) => (
                      <DraggableCard key={job.application_id} job={job}>
                        <ProgressCard
                          job_title={job.job_title}
                        job={job}

                          application_id={job.application_id}
                          company={job.company}
                          date_applied={job.applied_date}
                          applied_platform={job.applied_platform}
                          interview_date={job.interview_date}
                          current_status={job.current_status}
                          jd_link = {job.jd_link}
                          getData={getData}
                          tagBg="bg-[#eeecf9]"
                          openEditModal={openEditModal}

                          tagTextColor="text-[#8d75f6]"
                        />
                      </DraggableCard>
                    ))}
                  </div>
                </div>
              </DropZone>
              <DropZone status="In Touch" onDrop={handleDrop}>
                <div className="w-full h-auto flex flex-col p-4 bg-white shadow-md rounded-lg font-gilroy text-gray-500 bg-gray-200">
                  In Touch
                  <div className="bg-gray-300 p-2 rounded-md">
                    {inTouchJobs.map((job) => (
                      <DraggableCard key={job.application_id} job={job}>
                        <ProgressCard
                          job_title={job.job_title}
                        job={job}

                          application_id={job.application_id}
                          company={job.company}
                          getData={getData}
                          date_applied={job.applied_date}
                          applied_platform={job.applied_platform}
                          current_status={job.current_status}
                          interview_date={job.interview_date}
                          jd_link = {job.jd_link}

                          tagBg="bg-[#f9f0e5]"
                          openEditModal={openEditModal}

                          tagTextColor="text-[#fd9d2f]"
                        />
                      </DraggableCard>
                    ))}
                  </div>
                </div>
              </DropZone>
              <DropZone status="Interviewed" onDrop={handleDrop}>
                <div className="w-full h-auto flex flex-col p-4 bg-white shadow-md rounded-lg font-gilroy text-gray-500 bg-gray-200">
                  Interview
                  <div className="bg-gray-300 p-2 rounded-md">
                    {interviewedJobs.map((job) => (
                      <DraggableCard key={job.application_id} job={job}>
                        <ProgressCard
                          job_title={job.job_title}
                        job={job}

                          application_id={job.application_id}
                          company={job.company}
                          date_applied={job.applied_date}
                          getData={getData}
                          applied_platform={job.applied_platform}
                          current_status={job.current_status}
                          interview_date={job.interview_date}
                          jd_link = {job.jd_link}

                          tagBg="bg-green-100"
                          tagTextColor="text-green-500"
                          openEditModal={openEditModal}

                        />
                      </DraggableCard>
                    ))}
                  </div>
                </div>
              </DropZone>
              <DropZone status="Rejected" onDrop={handleDrop}>
                <div className="w-full h-auto flex flex-col p-4 bg-white shadow-md rounded-lg font-gilroy text-gray-500 bg-gray-200">
                  Rejected
                  <div className="bg-gray-300 p-2 rounded-md">
                    {rejectedJobs.map((job) => (
                      <DraggableCard key={job.application_id} job={job}>
                        <ProgressCard
                        job={job}
                          job_title={job.job_title}
                          application_id={job.application_id}
                          company={job.company}
                          date_applied={job.applied_date}
                          getData={getData}
                          applied_platform={job.applied_platform}
                          interview_date={job.interview_date}
                          jd_link = {job.jd_link}

                          current_status={job.current_status}
                          tagBg="bg-red-100"
                          tagTextColor="text-red-500"
                          openEditModal={openEditModal}
                        />
                      </DraggableCard>
                    ))}
                  </div>
                </div>
              </DropZone>
              
            </div>
          )}
        </div>
      </div>
      {isEditModalOpen && (
        <EditCardModal
          setIsEditModalOpen={setIsEditModalOpen}
          job={currentJob}
          getData={getData}
        />
      )}
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
  jd_link,
  tagTextColor,
  interview_date,
  application_id,
  getData,
  openEditModal,
  job
}) {
  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("job_applications")
        .delete()
        .eq("application_id", application_id);

      if (error) {
        console.error(error);
        throw new Error(error.message);
      } else {
        console.log("Deleted");
        getData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-auto p-4 bg-white shadow-md rounded-lg font-gilroy text-gray-500 mt-4">
      <div className="bg-white rounded-lg flex flex-col gap-4 w-full h-auto p-4 shadow-sm">
        <div className="flex justify-between items-center w-full">
          <div
            className={`${tagBg} ${tagTextColor} flex justify-between items-center px-3 font-bold w-auto py-1 rounded-full`}
          >
            {current_status} <br />
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faEdit}
              className="text-gray-700"
              onClick={() => openEditModal({ jd_link, job_title, company, date_applied, applied_platform, current_status, interview_date, application_id })}
            />

            <FontAwesomeIcon
              icon={faTrash}
              className="text-red-500"
              onClick={handleDelete}
            />
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <div className="flex items-center gap-2">

          <h2 className="text-[1.4rem] font-gilroy text-black">{job_title}</h2>{" "}
          {jd_link && <FontAwesomeIcon icon={faLink} className="text-blue-500 cursor-pointer" onClick={() => window.open(jd_link, "_blank")}/>}
      
          </div>
          <p className="text-slate-700 text-sm">{company}</p>
        </div>
        <div className="flex gap-1 mt-4 w-full">
          {(current_status === "Applied" || current_status === "In Touch") && (
            <p className="text-green-500 bg-green-100 px-3 py-1 w-1/2 rounded-full text-sm flex items-center justify-center">
              Applied: {date_applied.split("T")[0]}
            </p>
          )}

          {current_status === "Interviewed" && interview_date && (
            <p className="text-green-500 bg-green-100 px-3 py-1 w-1/2 rounded-full text-sm flex items-center justify-center">
              Interview: {interview_date.split("T")[0]}
            </p>
          )}
          <p className="text-yellow-500 bg-yellow-100 px-3 py-1 w-1/2 rounded-full text-sm flex items-center justify-center">
            {applied_platform}
          </p>
        </div>
      </div>
    </div>
  );
}

function EditCardModal({ setIsEditModalOpen, job, getData }) {
  const [formData, setFormData] = useState({
    job_title: job?.job_title,
    company: job?.company,
    applied_date: job?.date_applied,
    applied_platform: job?.applied_platform,
    current_status: job?.current_status,
    interview_date: job?.interview_date,
    jd_link:  job?.jd_link
  });

  console.log(formData.jd_link)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('job_applications')
        .update(formData)
        .eq('application_id', job.application_id);

      if (error) {
        console.error(error);
        throw new Error(error.message);
      } else {
        console.log("Updated");
        getData();
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-1/3 h-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Job Application</h2>
          <FontAwesomeIcon
            icon={faClose}
            className="text-red-500 cursor-pointer"
            onClick={() => setIsEditModalOpen(false)}
            text-right
          />
        </div>
        <form onSubmit={handleSubmit} >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="job_title">
              Job Title
            </label>
            <input
              type="text"
              name="job_title"
              value={formData.job_title}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company">
              Company
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date_applied">
              Date Applied
            </label>
            <input
              type="date"
              name="date_applied"
              value={formData.applied_date.split('T')[0]} // Ensure date is in YYYY-MM-DD format
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="applied_platform">
              Applied Platform
            </label>
            <input
              type="text"
              name="applied_platform"
              value={formData.applied_platform}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="current_status">
              Current Status
            </label>
            <select
              name="current_status"
              value={formData.current_status}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="Applied">Applied</option>
              <option value="In Touch">In Touch</option>
              <option value="Interviewed">Interviewed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jd_link">JD Link</label>
          <input
              type="url"
              name="jd_url"
              value={formData.jd_link}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          {formData.current_status === "Interviewed" && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="interview_date">
                Interview Date
              </label>
              <input
                type="date"
                name="interview_date"
                value={formData.interview_date ? formData.interview_date.split('T')[0] : ''}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          )}
          <div className="flex items-center justify-between mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}




