import React, { useEffect, useState } from "react";
import supabase from "../utils/Supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

export default function AddJobModal({ setIsModalOpen, getData }) {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    company: "",
    platform: "",
    status: "",
    interview_date: "",
    applied_date: "",
    user_id: sessionStorage.getItem("user_id"),
  });
  
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleAddJob = async () => {
    try {
      const { data, error } = await supabase
        .from("job_applications")
        .insert([
          {
            job_title: formData.title,
            jd_link: formData.url,
            company: formData.company,
            applied_platform: formData.platform,
            current_status: formData.status,
            interview_date: formData.interview_date,
            applied_date: formData.applied_date,
            user_id: formData.user_id,
          },
        ])
        .select();
      if (error) {
        throw new Error(error.message);
      } else {
        setSuccessMessage("Job added successfully!");
      }
    } catch (error) {
      setErrorMessage(error.message);
      console.log("Error adding job:", error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title === "") {
      setErrorMessage("Job title is required");
    } else if (formData.company === "") {
      setErrorMessage("Company name is required");
    } else if (formData.platform === "") {
      setErrorMessage("Applied platform is required");
    } else if (formData.status === "") {
      setErrorMessage("Current status is required");
    } else if (formData.applied_date === "") {
      setErrorMessage("Applied date is required");
    } else {
      handleAddJob();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setSuccessMessage(null);
    }, 2000);
  }, [successMessage]);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  if (successMessage) {
    return (
      <div className="w-screen h-screen bg-transparent flex justify-center items-center font-gilroy transition duration-200 ease-in-out">
        <div className="w-auto h-auto bg-white rounded-lg p-4 border border-gray-600 flex gap-4 items-center justify-center">
          <FontAwesomeIcon
            icon={faCheck}
            className="text-green-500 font-bold text-2xl"
          />
          {successMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen  flex justify-center items-center font-gilroy transition duration-200 ease-in-out  backdrop-filter backdrop-blur-sm ">
      <div className="w-1/3 h-auto bg-white rounded-lg p-4 border border-gray-600 ">
        <div className="flex flex-col mb-2">
          <h1 className="text-2xl font-bold text-left">Add Job</h1>
          <p className="text-sm text-gray-500">Please fill the details</p>
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            handleSubmit(e);
          }}>
          <div className="flex w-full justify-between gap-3">
            <input
              type="text"
              value={formData.title}
              placeholder="Job Title"
              className="p-2 border border-gray-300 rounded-lg w-full"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <input
              type="url"
              value={formData.url}
              placeholder="Job URL"
              className="p-2 border border-gray-300 rounded-lg w-full"
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
            />
          </div>

          <input
            type="text"
            value={formData.company}
            placeholder="Company"
            className="p-2 border border-gray-300 rounded-lg"
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
          />
          <input
            type="text"
            value={formData.platform}
            placeholder="Applied Platform"
            className="p-2 border border-gray-300 rounded-lg"
            onChange={(e) =>
              setFormData({ ...formData, platform: e.target.value })
            }
          />
          <label htmlFor="status">Current Status</label>
          <select
            className="p-2 border border-gray-300 rounded-lg"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }>
            <option value="Applied">Applied</option>
            <option value="In Touch">In Touch</option>
            <option value="Interview">Interview Scheduled</option>
            <option value="Rejected">Rejected</option>
          </select>
          <div className="flex w-full gap-3">
            <label htmlFor="applied_date">Applied Date</label>
            <input
              type="date"
              value={formData.applied_date}
              placeholder="Applied Date"
              className="p-2 border border-gray-300 rounded-lg w-full"
              onChange={(e) =>
                setFormData({ ...formData, applied_date: e.target.value })
              }
            />
            <label htmlFor="interview_date">Interview Date</label>
            <input
              type="date"
              value={formData.interview_date}
              placeholder="Interview Date"
              className="p-2 border border-gray-300 rounded-lg w-full"
              onChange={(e) =>
                setFormData({ ...formData, interview_date: e.target.value })
              }
            />
          </div>
          <div className="flex gap-3 w-full justify-center">
            <button
              className="bg-red-500 text-white p-2 rounded-lg"
              onClick={() => {
                setIsModalOpen((prev) => !prev);
              }}>
              Close
            </button>
            <button
              className="bg-primary text-white p-2 rounded-lg"
              onClick={handleAddJob}>
              Add Job
            </button>
          </div>
          {errorMessage && (
            <p className="text-red-500 text-md mt-2 mx-auto">{errorMessage}</p>
          )}
          {successMessage && (
            <div className="flex items-center justify-center">
              <FontAwesomeIcon
                icon={faCheck}
                className="text-green-500 font-bold text-2xl mr-2"
              />
              <p className="text-green-500 font-bold">{successMessage}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
