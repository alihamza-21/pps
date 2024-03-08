import React, { useContext } from "react";
import { ModeContext } from "../App";

export default function ListHead(props) {
  const { dark } = useContext(ModeContext);
  return (
    <>
      <h1
        className={`font-bold uppercase ${dark ? "text-white" : "text-black"}`}
      >
        {props.title}
      </h1>
      <hr className="border-none h-0.5 bg-black bg-opacity-20" />
    </>
  );
}
