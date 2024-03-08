import React, { useContext } from "react";
import DataTable from "react-data-table-component";
import { ModeContext } from "../App";
import primaryStyles, { primaryStylesDark } from "../utilities/CustomStyles";

export default function MyDataTable(props) {
  const { dark } = useContext(ModeContext);
  return (
    <DataTable
      theme="myTheme"
      customStyles={dark ? primaryStylesDark : primaryStyles}
      columns={props.columns}
      data={props.data}
      noDataComponent={
        props.dependancy && props.dependancy.status === "2"
          ? "You are not authorized to access it"
          : "No Data Available"
      }
      pagination
    />
  );
}
