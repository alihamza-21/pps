import React from "react";
import { Link } from "react-router-dom";
import { imgURL } from "../utilities/URL";

export default function SideBar() {
  return (
    <div className="lg:py-12 py-4 lg:px-12 px-2 flex lg:flex-col items-center justify-center lg:gap-y-12 lg:border-r border-white border-opacity-40 h-fit m-auto w-full">
      <Link to={"/"} className="p-0">
        <img
          src={`${imgURL}auth/logo_orange.webp`}
          alt="logo"
          className="xl:w-60 lg:w-52 w-40"
        />
      </Link>
      <p className="lg:block hidden font-normal xl:text-2xl lg:text-xl text-white text-center">
        Taglines goes here
      </p>
    </div>
  );
}
