import React from "react";
import { DTEdit } from "../utilities/Buttons";

export default function ChargesCard(props) {
  return (
    <div className="bg-white px-8 py-12 flex flex-col justify-center items-center gap-y-3 rounded-md relative">
      <div className="absolute top-4 right-4 w-fit">
        <DTEdit edit={props.onClick} />
      </div>
      <h4 className="font-medium text-xl text-black text-opacity-60 text-center">
        {props.info}
      </h4>
      <h1 className={`font-bold text-3xl ${props.textColor}`}>{props.value}</h1>
    </div>
  );
}
