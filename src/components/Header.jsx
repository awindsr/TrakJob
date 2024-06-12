import React from "react";
import { useNavigate  } from "react-router-dom";

import supabase from "../utils/Supabase"; // Assuming you have a supabase client


export default function Header({setIsAuthenticated}) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      } else {
        // setIsAuthenticated(false);
        navigate("/login");
      }
    } catch (error) {
      console.log("Error logging out:", error);
    }
  }
  return (
    <div className="w-screen h-[8vh] px-4 py-2 flex justify-between bg-slate-900 ">
      <h1 className="text-primary font-gilroy font-black text-4xl">t.</h1>
      <div className="flex gap-2">
        <button className="text-white bg-red-500 px-3 py-1 font-gilroy font-semibold" onClick={handleLogout}>
          Logout
        </button>
        <img
          src="./images/avatar.png"
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </div>
  );
}
