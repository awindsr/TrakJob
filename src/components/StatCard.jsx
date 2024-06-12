import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./StatCard.css";

export default function StatCard({ total_applied, in_touch, interviewed, rejected }) {
  return (
    <div className="w-full mx-auto flex justify-around items-center h-[10rem] statcard rounded-lg font-gilroy gap-4">
      <StatItem title="Total Applied" value={total_applied} change="10% since last week" color="text-green-500" bgColor="#eeecf9" titleColor="#8d75f6"/>
      <StatItem title="In Touch" value={in_touch} change="2% since yesterday" color="text-red-500" bgColor="#f9f0e5" titleColor="#fd9d2f"/>
      <StatItem title="Interviewed" value={interviewed} change="4% since last week" color="text-green-500" bgColor="#dcfce7" titleColor="#4ade80"/>
      <StatItem title="Rejected" value={rejected} change="8% since last week" color="text-red-500" bgColor="#f8e7ea" titleColor="#ff485f"/>
    </div>
  );
}

function StatItem({ title, value, change, color, bgColor, titleColor }) {
  return (
    <div className="flex flex-col gap-5 items-start justify-between h-full w-1/4 p-4 shadow-md" style={{ backgroundColor: bgColor }}>
      <p className="text-[.8rem] font-semibold text-gray-500">{title}</p>
      <div className="flex flex-col gap-2">
        <h2 className="text-5xl font-bold" style={{ color: titleColor }}>{value}</h2>
        <p className={`${color} text-[.8rem] font-medium rounded-full bg-white px-3 py-1`}>{change}</p>
      </div>
    </div>
  );
}
