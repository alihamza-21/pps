import React, { useContext } from "react";
import { ModeContext } from "../App";
import { LayoutContext } from "./Layout";

export default function MainSection(props) {
  const { expand } = useContext(LayoutContext);
  const { dark } = useContext(ModeContext);
  return (
    <section
      className={`relative min-h-[calc(100vh-71px)] ${
        expand ? "w-full" : "w-[calc(100%-256px)]"
      } ${
        dark ? "bg-themeBlack" : "bg-themeGray2"
      } top-[71px] py-12 px-10 float-right`}
    >
      <h1
        className={`font-bold text-2xl mb-5 ${
          dark ? "text-white" : "text-black"
        }`}
      >
        {props.title}
      </h1>
      {props.content}
    </section>
  );
}
