import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { ModeContext } from "../../App";
import MyDataTable from "../../components/MyDataTable";
import {
  error_toaster,
  info_toaster,
  mini_toaster,
} from "../../utilities/Toaster";
import { BackButton, DTView } from "../../utilities/Buttons";
import { BASE_URL } from "../../utilities/URL";
import Layout from "../../components/Layout";

export default function CustomerDetails() {
  const { dark } = useContext(ModeContext);
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const emailRef = useRef();
  const phoneRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const cusDetails = location?.state?.cusDetails;
  const customersFeatureId = location?.state?.featureId;
  const bookingDetails = async (id) => {
    setDisabled(true);
    var config = {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    };
    try {
      axios
        .get(
          BASE_URL + `bookingdetails?featureId=${customersFeatureId}&id=${id}`,
          config
        )
        .then((dat) => {
          if (dat.data?.status === "1") {
            localStorage.setItem("orderId", dat?.data?.data?.id);
            navigate("/booking-details");
            info_toaster(dat?.data?.message);
          } else {
            error_toaster(dat?.data?.message);
          }
          setDisabled(false);
        });
    } catch (err) {
      setDisabled(false);
    }
  };
  const customerDetails = () => {
    const filteredArray = location?.state?.cusDetails?.customer?.filter(
      (det) =>
        search === "" ||
        select === null ||
        ((det?.trackingId).toLowerCase().match(search.toLowerCase()) &&
          select.value === "1") ||
        ((
          (det?.pickupAddress?.postalCode).toLowerCase() +
          " " +
          (det?.pickupAddress?.secondPostalCode).toLowerCase()
        ).match(search.toLowerCase()) &&
          select.value === "2") ||
        ((
          (det?.pickupAddress?.postalCode).toLowerCase() +
          (det?.pickupAddress?.secondPostalCode).toLowerCase()
        ).match(search.toLowerCase()) &&
          select.value === "2") ||
        ((
          (det?.dropoffAddress?.postalCode).toLowerCase() +
          " " +
          (det?.dropoffAddress?.secondPostalCode).toLowerCase()
        ).match(search.toLowerCase()) &&
          select.value === "3") ||
        ((
          (det?.dropoffAddress?.postalCode).toLowerCase() +
          (det?.dropoffAddress?.secondPostalCode).toLowerCase()
        ).match(search.toLowerCase()) &&
          select.value === "3")
    );
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
      name: "Order #",
      selector: (row) => row.orderId,
    },
    {
      name: "Pickup DBS #",
      selector: (row) => row.pickUp,
    },
    {
      name: "Drop off DBS #",
      selector: (row) => row.dropOff,
    },
    {
      name: "Date",
      selector: (row) => row.date,
    },
    {
      name: "Status",
      selector: (row) => row.status,
    },
  ];
  const datas = [];
  customerDetails()?.map((det, index) => {
    return datas.push({
      id: index + 1,
      action: (
        <DTView view={() => bookingDetails(det?.id)} disabled={disabled} />
      ),
      orderId: det?.trackingId,
      pickUp:
        det?.pickupAddress?.postalCode +
        " " +
        det?.pickupAddress?.secondPostalCode,
      dropOff:
        det?.dropoffAddress?.postalCode +
        " " +
        det?.dropoffAddress?.secondPostalCode,
      date: det?.pickupDate,
      status: det?.bookingStatus?.title,
    });
  });
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text.current.innerText);
    mini_toaster("Copied to Clipboard!");
  };
  return (
    <Layout
      search={true}
      value={search}
      onChange={(e) => setSearch(e.target.value.replace(/\+/g, ""))}
      options={[
        { value: "1", label: "Order #" },
        { value: "2", label: "Pickup DBS #" },
        { value: "3", label: "Drop off DBS #" },
      ]}
      selectValue={select}
      selectOnChange={(e) => {
        setSelect(e);
        e === null && setSearch("");
      }}
      title="Customer Details"
      content={
        <section className="space-y-4">
          <div>
            <BackButton />
          </div>
          <section className="2xl:grid 2xl:grid-cols-12 gap-x-5 flex flex-col gap-y-8">
            <div className="2xl:col-span-9 2xl:order-1 order-2">
              <MyDataTable columns={columns} data={datas} />
            </div>
            <div
              className={`2xl:col-span-3 2xl:order-2 order-1 ${
                dark ? "bg-themeBlack2 text-white" : "bg-white text-black"
              } rounded-lg flex flex-col items-center text-center gap-y-5 py-8 px-12`}
            >
              <FaUser size={40} />
              <div>
                <h4 className="font-bold text-2xl">
                  {cusDetails?.firstName + " " + cusDetails?.lastName}
                </h4>
                <p className="font-normal text-sm">
                  Member Since: {cusDetails?.joinedOn}
                </p>
              </div>
              <hr
                className={`border-none w-full h-0.5 ${
                  dark ? "bg-white bg-opacity-60" : "bg-black bg-opacity-20"
                }`}
              />
              <div>
                <p className="font-normal text-sm text-opacity-60">Email</p>
                <p
                  className="font-medium text-lg underline cursor-pointer"
                  ref={emailRef}
                  onClick={() => copyToClipboard(emailRef)}
                >
                  {cusDetails?.email}
                </p>
              </div>
              <hr
                className={`border-none w-full h-0.5 ${
                  dark ? "bg-white bg-opacity-60" : "bg-black bg-opacity-20"
                }`}
              />
              <div>
                <p className="font-normal text-sm text-opacity-60">Phone</p>
                <p
                  className="font-medium text-lg underline cursor-pointer"
                  ref={phoneRef}
                  onClick={() => copyToClipboard(phoneRef)}
                >
                  {cusDetails?.countryCode + " " + cusDetails?.phoneNum}
                </p>
              </div>
            </div>
          </section>
        </section>
      }
    />
  );
}
