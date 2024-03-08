import React from "react";

export default function DetailsCard(props) {
  const { Icon } = props;
  return (
    <button
      onClick={props.onClick}
      className="bg-themeGray rounded-md py-5 px-4 flex flex-col justify-center items-center gap-y-3 text-center"
    >
      <div className="p-2 w-fit bg-themePurple rounded-fullest">
        <Icon size={28} className="text-themeOrange" />
      </div>
      <h2 className="font-medium text-sm text-black text-opacity-60">
        {props.text}
      </h2>
    </button>
  );
}
