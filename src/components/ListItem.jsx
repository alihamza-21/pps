import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { ModeContext } from "../App";

export default function ListItem(props) {
  const { Icon } = props;
  const location = useLocation().pathname;
  const { dark } = useContext(ModeContext);
  return (
    <li>
      <Link
        to={props.to}
        className={`${
          props.to === location && !dark
            ? "bg-themePurple text-themeOrange"
            : props.to === location && dark
            ? "bg-white text-themeOrange"
            : props.active && !dark
            ? "bg-themePurple text-themeOrange"
            : props.active && dark
            ? "bg-white text-themeOrange"
            : dark
            ? "text-white"
            : "text-black text-opacity-40"
        } flex items-center gap-x-4 px-4 py-2 rounded font-medium text-base`}
      >
        <Icon size={24} />
        <span>{props.title}</span>
      </Link>
    </li>
  );
}
