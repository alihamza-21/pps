import React, { useState } from "react";
import GetAPI from "../../utilities/GetAPI";
import { PostAPI } from "../../utilities/PostAPI";
import { active, block } from "../../utilities/CustomStyles";
import MyDataTable from "../../components/MyDataTable";
import Loader from "../../components/Loader";
import { error_toaster, success_toaster } from "../../utilities/Toaster";
import Layout from "../../components/Layout";

export default function Payments() {
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const paymentsFeatureId =
    featureData &&
    featureData.find((ele) => ele.title === "Driver Payment System")?.id;
  const { data, reFetch } = GetAPI("driverpaymentsystem", paymentsFeatureId);
  const [disabled, setDisabled] = useState(false);
  const changePaymentSystem = async (paymentSystemId) => {
    setDisabled(true);
    let res = await PostAPI("updatepaymentsystem", paymentsFeatureId, {
      paymentSystemId: paymentSystemId,
    });
    if (res?.data?.status === "1") {
      reFetch();
      success_toaster(res?.data?.message);
      setDisabled(false);
    } else {
      error_toaster(res?.data?.message);
      setDisabled(false);
    }
  };
  const getPayments = () => {
    const filteredArray =
      data?.status === "1" ? data?.data?.filter((pay) => pay) : [];
    return filteredArray;
  };
  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
    },
    {
      name: "Payment Type",
      selector: (row) => row.type,
    },
    {
      name: "Status",
      selector: (row) => row.status,
    },
  ];
  const datas = [];
  getPayments()?.map((pay, index) =>
    datas.push({
      id: index + 1,
      type: pay?.systemType,
      status: pay?.status ? (
        <button disabled={disabled} className={active}>
          Active
        </button>
      ) : (
        <button
          onClick={() => changePaymentSystem(pay?.id)}
          disabled={disabled}
          className={block}
        >
          Inactive
        </button>
      ),
    })
  );
  return data.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      title="Payment System"
      content={<MyDataTable columns={columns} data={datas} dependancy={data} />}
    />
  );
}
