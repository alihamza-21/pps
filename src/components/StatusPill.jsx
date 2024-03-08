import React, { useContext } from "react";
import { BsCheckLg } from "react-icons/bs";
import { ModeContext } from "../App";

export default function StatusPill(props) {
  const { dark } = useContext(ModeContext);
  return (
    <div className="space-y-1">
      {props.pillStatus === "completed" ? (
        <div
          className={`${
            dark ? "bg-white text-black" : "bg-themePurple text-white"
          } w-10 h-10 rounded-fullest border border-themePurple flex`}
        >
          <BsCheckLg size={22} className="m-auto" />
        </div>
      ) : props.pillStatus === "inProcess" ? (
        <div
          className={`${
            dark ? "bg-white" : "bg-themeBlue2"
          } w-10 h-10 rounded-fullest border border-transparent flex animate-pulse`}
        >
          <div className="bg-black w-4 h-4 rounded-fullest m-auto"></div>
        </div>
      ) : (
        <div
          className={`w-10 h-10 rounded-fullest border ${
            dark ? "border-white" : "border-black"
          }`}
        ></div>
      )}
      <h4
        className={`font-bold text-sm leading-4 ${
          dark ? "text-white" : "text-black"
        }`}
      >
        {props.title}
      </h4>
      <p
        className={`font-bold text-xs ${
          dark ? "text-white" : "text-black"
        } text-opacity-60 leading-4`}
      >
        {props.text}
      </p>
      <div className="flex flex-col font-medium text-xs">
        <div>{props.date}</div>
        <div>{props.time}</div>
      </div>
    </div>
  );
}
