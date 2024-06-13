import React from "react";
import { useNavigate  } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import supabase from "../utils/Supabase"; // Assuming you have a supabase client
import { faBriefcase, faPlus } from "@fortawesome/free-solid-svg-icons";


export default function Header({setIsModalOpen, setToken}) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      } else {
        // setIsAuthenticated(false);

        setToken(null)
        sessionStorage.removeItem("user_id");
      
        navigate("/login");
      }
    } catch (error) {
      console.log("Error logging out:", error);
    }
  }
  return (
    <div className="w-screen h-[8vh] px-4 py-2 flex justify-between bg-slate-900 ">
      <h1 className="text-white font-gilroy font-black text-2xl flex gap-2 items-center "><FontAwesomeIcon icon={faBriefcase} className="text-white"/>{" "} TrakJob</h1>
      <div className="flex gap-2">
        <button className="text-white border border-primary bg-[#2c81ff] text-sm px-2 rounded-lg font-gilroy font-semibold hover:bg-blue-600 transition ease-in-out duration-200" onClick={() => setIsModalOpen(true)}>
          <FontAwesomeIcon icon={faPlus} />{" "}Add Job
        </button>
        <button className="text-red-500 border border-red-500 text-sm px-2 rounded-lg font-gilroy font-semibold hover:bg-red-500 hover:text-white transition ease-in-out duration-200" onClick={handleLogout}>
          Logout
        </button>
        
      </div>
    </div>
  );
}
