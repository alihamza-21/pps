import React, { createContext, useState } from "react";
import Loader from "./Loader";
import LeftBar from "./LeftBar";
import MainSection from "./MainSection";
import TopBar from "./TopBar";

export const LayoutContext = createContext(null);
export default function Layout(props) {
  const [loader, setLoader] = useState(false);
  const [expand, setExpand] = useState(false);
  return loader ? (
    <Loader />
  ) : (
    <>
      <LayoutContext.Provider value={{ expand, setExpand, setLoader }}>
        <LeftBar expand={expand ? true : false} />
        <TopBar
          search={props.search}
          value={props.value}
          onChange={props.onChange}
          options={props.options}
          selectValue={props.selectValue}
          selectOnChange={props.selectOnChange}
        />
        <MainSection title={props.title} content={props.content} />
      </LayoutContext.Provider>
    </>
  );
}
