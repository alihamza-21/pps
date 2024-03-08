import React, { useState } from "react";
import GetAPI from "../../utilities/GetAPI";
import MyDataTable from "../../components/MyDataTable";
import Loader from "../../components/Loader";
import { DTPay, TabButton } from "../../utilities/Buttons";
import Layout from "../../components/Layout";
import { BASE_URL2 } from "../../utilities/URL";
import { PostAPI } from "../../utilities/PostAPI";
import { error_toaster, success_toaster } from "../../utilities/Toaster";

export default function PaymentRequests() {
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const driversFeatureId =
    featureData && featureData.find((ele) => ele.title === "Drivers")?.id;
  const [tab, setTab] = useState("Pending");
  const [disabled] = useState(false);
  const [loader] = useState(false);
  const { data, reFetch } = GetAPI(
    "pending-payment-requests",
    driversFeatureId
  );
  const paidRequests = GetAPI("paid-payment-requests", driversFeatureId);
  const payToDriverFunc = async (requestId, driverId) => {
    let res = await PostAPI("pay-to-driver", driversFeatureId, {
      requestId: requestId,
      driverId: driverId,
      via: "",
      note: "",
      transitionId: "",
    });
    if (res?.data?.status === "1") {
      success_toaster(res?.data?.message);
      reFetch();
      paidRequests.reFetch();
    } else {
      error_toaster(res?.data?.message);
    }
  };
  const columns = [];
  const datas = [];
  if (tab === "Pending") {
    columns.push(
      {
        name: "#",
        selector: (row) => row.id,
      },
      {
        name: "Action",
        selector: (row) => row.action,
        minWidth: "160px",
      },
      {
        name: "Name",
        selector: (row) => row.name,
      },
      {
        name: "Image",
        selector: (row) => row.image,
      },
      {
        name: "Amount ($)",
        selector: (row) => row.amount,
      },
      {
        name: "Payment Status",
        selector: (row) => row.payment,
      }
    );
    data?.data?.map((dri, index) => {
      return datas.push({
        id: index + 1,
        action: (
          <div className="flex gap-x-2">
            <DTPay
              pay={() => payToDriverFunc(dri?.id, dri?.userId)}
              disabled={disabled}
            />
          </div>
        ),
        name: dri?.user?.firstName + " " + dri?.user?.lastName,
        image: (
          <div className="">
            <img
              src={`${BASE_URL2}${dri?.user?.image}`}
              alt={`profile${index}`}
              className="w-20 h-20 object-contain"
            />
          </div>
        ),
        amount: dri?.amount,
        payment: <span className="capitalize">{dri?.status}</span>,
      });
    });
  } else if (tab === "Paid") {
    columns.push(
      {
        name: "#",
        selector: (row) => row.id,
      },
      {
        name: "Name",
        selector: (row) => row.name,
      },
      {
        name: "Image",
        selector: (row) => row.image,
      },
      {
        name: "Amount ($)",
        selector: (row) => row.amount,
      },
      {
        name: "Payment Status",
        selector: (row) => row.payment,
      }
    );
    paidRequests?.data?.data?.map((dri, index) => {
      return datas.push({
        id: index + 1,
        name: dri?.user?.firstName + " " + dri?.user?.lastName,
        image: (
          <div className="">
            <img
              src={`${BASE_URL2}${dri?.user?.image}`}
              alt={`profile${index}`}
              className="w-20 h-20 object-contain"
            />
          </div>
        ),
        amount: dri?.amount,
        payment: <span className="capitalize">{dri?.type}</span>,
      });
    });
  }
  return data.length === 0 || loader ? (
    <Loader />
  ) : (
    <Layout
      title="Payment Requests"
      content={
        <section className="space-y-3">
          <div className="flex">
            <TabButton text="Pending" set={setTab} tab={tab} width="w-36" />
            <TabButton text="Paid" set={setTab} tab={tab} width="w-36" />
          </div>
          <MyDataTable columns={columns} data={datas} dependancy={data} />
        </section>
      }
    />
  );
}
