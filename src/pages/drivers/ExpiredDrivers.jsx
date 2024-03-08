import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GetAPI from "../../utilities/GetAPI";
import { PutAPI } from "../../utilities/PutAPI";
import MyDataTable from "../../components/MyDataTable";
import Loader from "../../components/Loader";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../utilities/Toaster";
import {
  DTApproved,
  DTPending,
  DTRejected,
  DTView,
  TabButton,
} from "../../utilities/Buttons";
import { BASE_URL } from "../../utilities/URL";
import Layout from "../../components/Layout";
import { active, block } from "../../utilities/CustomStyles";
import moment from "moment";

export default function ExpiredDrivers() {
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const driversFeatureId =
    featureData && featureData.find((ele) => ele.title === "Drivers")?.id;
  const navigate = useNavigate();
  const [tab, setTab] = useState("Expired");
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [loader, setLoader] = useState(false);
  const { data, reFetch } = GetAPI("expirydriver", driversFeatureId);
  const changeDriverStatus = async (status, userId) => {
    setDisabled(true);
    let change = await PutAPI("userstatus", driversFeatureId, {
      status: status,
      userId: userId,
    });
    if (change?.data?.status === "1") {
      reFetch();
      if (status) {
        success_toaster(change?.data?.message);
      } else {
        info_toaster(change?.data?.message);
      }
      setDisabled(false);
    } else {
      error_toaster(change?.data?.message);
      setDisabled(false);
    }
  };
  const driverDetails = async (id) => {
    setDisabled(true);
    setLoader(true);
    var config = {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    };
    try {
      axios
        .get(
          BASE_URL + `driverdetails?featureId=${driversFeatureId}&id=${id}`,
          config
        )
        .then((dat) => {
          if (dat.data?.status === "1") {
            navigate("/driver-details", {
              state: {
                driDetails: dat?.data?.data,
                driverId: id,
                featureId: driversFeatureId,
              },
            });
            info_toaster(dat?.data?.message);
          } else {
            error_toaster(dat?.data?.message);
          }
          setDisabled(false);
          setLoader(false);
        });
    } catch (err) {
      setDisabled(false);
      setLoader(false);
    }
  };
  const expiredDrivers = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.expiredDrivers?.filter(
            (dri) =>
              search === "" ||
              select === null ||
              ((
                (dri?.user?.firstName).toLowerCase() +
                " " +
                (dri?.user?.lastName).toLowerCase()
              ).match(search.toLowerCase()) &&
                select.value === "1") ||
              ((dri?.user?.email).toLowerCase().match(search.toLowerCase()) &&
                select.value === "2") ||
              ((dri?.user?.countryCode + " " + dri?.user?.phoneNum).match(
                search.toLowerCase()
              ) &&
                select.value === "3") ||
              ((dri?.user?.countryCode + dri?.user?.phoneNum).match(
                search.toLowerCase()
              ) &&
                select.value === "3") ||
              (dri?.approvedByAdmin === "approved" &&
                search === "Approved" &&
                select.value === "4") ||
              (dri?.approvedByAdmin === "pending" &&
                search === "Pending" &&
                select.value === "5")
          )
        : [];
    return filteredArray;
  };
  const soonExpiringDrivers = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.expriryInNextThree?.filter(
            (dri) =>
              search === "" ||
              select === null ||
              ((
                (dri?.user?.firstName).toLowerCase() +
                " " +
                (dri?.user?.lastName).toLowerCase()
              ).match(search.toLowerCase()) &&
                select.value === "1") ||
              ((dri?.user?.email).toLowerCase().match(search.toLowerCase()) &&
                select.value === "2") ||
              ((dri?.user?.countryCode + " " + dri?.user?.phoneNum).match(
                search.toLowerCase()
              ) &&
                select.value === "3") ||
              ((dri?.user?.countryCode + dri?.user?.phoneNum).match(
                search.toLowerCase()
              ) &&
                select.value === "3") ||
              (dri?.approvedByAdmin === "approved" &&
                search === "Approved" &&
                select.value === "4") ||
              (dri?.approvedByAdmin === "pending" &&
                search === "Pending" &&
                select.value === "5")
          )
        : [];
    return filteredArray;
  };
  const columns = [
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
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
    },
    {
      name: "Registered By",
      selector: (row) => row.registered,
    },
    {
      name: "Licesnse (Issue)",
      selector: (row) => row.issue,
    },
    {
      name: "Licesnse (Expiry)",
      selector: (row) => row.expiry,
    },
    {
      name: "Approval Status",
      selector: (row) => row.approval,
      minWidth: "200px",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      minWidth: "200px",
    },
  ];
  const datas = [];
  if (tab === "Expired") {
    expiredDrivers()?.map((dri, index) => {
      return datas.push({
        id: index + 1,
        action: (
          <div className="flex gap-x-2">
            <DTView
              view={() => driverDetails(dri?.user?.id)}
              disabled={disabled}
            />
          </div>
        ),
        name: dri?.user?.firstName + " " + dri?.user?.lastName,
        email: dri?.user?.email,
        phone: dri?.user?.countryCode + " " + dri?.user?.phoneNum,
        registered: <div className="capitalize">{dri?.user?.registeredBy}</div>,
        issue: moment(dri?.licIssueDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
        expiry: moment(dri?.licExpiryDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
        completed: dri?.asRec + dri?.asDel,
        cancelled: dri?.bookingCancelled,
        approval:
          dri?.approvedByAdmin === "approved" ? (
            <DTApproved />
          ) : dri?.approvedByAdmin === "pending" ? (
            <DTPending />
          ) : (
            <DTRejected />
          ),
        status: dri?.user?.status ? (
          <button
            onClick={() => changeDriverStatus(false, dri?.user?.id)}
            className={active}
            disabled={disabled}
          >
            Active
          </button>
        ) : (
          <button
            onClick={() => changeDriverStatus(true, dri?.user?.id)}
            className={block}
            disabled={disabled}
          >
            Inactive
          </button>
        ),
      });
    });
  } else if (tab === "Expiring soon") {
    soonExpiringDrivers()?.map((dri, index) => {
      return datas.push({
        id: index + 1,
        action: (
          <div className="flex gap-x-2">
            <DTView
              view={() => driverDetails(dri?.user?.id)}
              disabled={disabled}
            />
          </div>
        ),
        name: dri?.user?.firstName + " " + dri?.user?.lastName,
        email: dri?.user?.email,
        phone: dri?.user?.countryCode + " " + dri?.user?.phoneNum,
        registered: <div className="capitalize">{dri?.user?.registeredBy}</div>,
        issue: moment(dri?.licIssueDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
        expiry: moment(dri?.licExpiryDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
        completed: dri?.asRec + dri?.asDel,
        cancelled: dri?.bookingCancelled,
        approval:
          dri?.approvedByAdmin === "approved" ? (
            <DTApproved />
          ) : dri?.approvedByAdmin === "pending" ? (
            <DTPending />
          ) : (
            <DTRejected />
          ),
        status: dri?.user?.status ? (
          <button
            onClick={() => changeDriverStatus(false, dri?.user?.id)}
            className={active}
            disabled={disabled}
          >
            Active
          </button>
        ) : (
          <button
            onClick={() => changeDriverStatus(true, dri?.user?.id)}
            className={block}
            disabled={disabled}
          >
            Inactive
          </button>
        ),
      });
    });
  }
  return data.length === 0 || loader ? (
    <Loader />
  ) : (
    <Layout
      search={true}
      value={search}
      onChange={(e) => setSearch(e.target.value.replace(/\+/g, ""))}
      options={[
        { value: "1", label: "Name" },
        { value: "2", label: "Email" },
        { value: "3", label: "Phone #" },
        { value: "4", label: "Approved" },
        { value: "5", label: "Pending" },
      ]}
      selectValue={select}
      selectOnChange={(e) => {
        setSelect(e);
        e === null && setSearch("");
        e && e.value === "4" && setSearch("Approved");
        e && e.value === "5" && setSearch("Pending");
      }}
      title="Drivers"
      content={
        <section className="space-y-3">
          <div className="flex">
            <TabButton text="Expired" set={setTab} tab={tab} width="w-44" />
            <TabButton
              text="Expiring soon"
              set={setTab}
              tab={tab}
              width="w-44"
            />
          </div>
          <div className="flex justify-end gap-x-5">
            <Link
              to={"/create-driver/step-one"}
              className="py-2.5 px-12 rounded bg-themePurple font-medium text-base text-white border border-themePurple hover:bg-transparent hover:text-themePurple"
            >
              Create Driver
            </Link>
          </div>
          <MyDataTable columns={columns} data={datas} dependancy={data} />
        </section>
      }
    />
  );
}
