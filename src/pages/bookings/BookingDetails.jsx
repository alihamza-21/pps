import React, { useContext, useEffect, useState } from "react";
import { BsBoxSeam } from "react-icons/bs";
import { FaArrowDown, FaUser } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { ModeContext } from "../../App";
import { BackButton } from "../../utilities/Buttons";
import { BASE_URL2, imgURL } from "../../utilities/URL";
import Layout from "../../components/Layout";
import StatusPill from "../../components/StatusPill";
import Select from "react-select";
import GetAPI from "../../utilities/GetAPI";
import { PostAPI } from "../../utilities/PostAPI";
import { error_toaster, success_toaster } from "../../utilities/Toaster";
import Loader from "../../components/Loader";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import moment from "moment";
import QRCode from "react-qr-code";

export default function BookingDetails() {
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const bookingsFeatureId =
    featureData && featureData.find((ele) => ele.title === "Bookings")?.id;
  const { dark } = useContext(ModeContext);
  const bookingId = localStorage.getItem("orderId");
  const [modal, setModal] = useState(false);
  const { data, reFetch } = GetAPI(
    `bookingdetails?id=${bookingId}&`,
    bookingsFeatureId
  );
  const statuses = GetAPI("allstatuses", bookingsFeatureId);
  const allStatus = [];
  statuses?.data?.data?.map((sta, index) => {
    return allStatus.push({
      value: sta?.id,
      label: sta?.title,
    });
  });
  const convertTo12Hour = (time) => {
    if (time && time !== "") {
      let hours = parseInt(time.substr(0, 2));
      let minutes = time.substr(3, 2);
      let ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${ampm}`;
    }
  };
  const changeStatusFunc = async (bookingStatusId) => {
    let res = await PostAPI("updatebookingstatus", bookingsFeatureId, {
      bookingId: bookingId,
      bookingStatusId: bookingStatusId,
    });
    if (res?.data?.status === "1") {
      success_toaster(res?.data?.message);
      reFetch();
    } else {
      error_toaster(res?.data?.message);
    }
  };

  const handlePrint = () => {
    const sectionToPrint = document.getElementById("sectionToPrint");
    if (sectionToPrint) {
      const printContents = sectionToPrint.innerHTML;

      const newWindow = window.open();
      newWindow.document.write(`<!DOCTYPE html>
      <html lang="en">
   <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <title>Print Coupon</title>
    </head>
   <body>`);
      newWindow.document.write(printContents);
      newWindow.document.write("</body></html>");
      newWindow.document.close();
      setTimeout(() => {
        newWindow.print();
        setModal(false);
      }, 500);
    }
  };

  useEffect(() => {
    if (modal) {
      setTimeout(handlePrint, 500);
    }
  }, [modal]);

  return data.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      title="Booking Details"
      content={
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <BackButton />
            </div>
            <div className="flex items-center gap-x-6">
              <div className="flex items-center gap-x-3">
                <h4 className="font-medium text-xl">Status:</h4>
                <div className="font-semibold text-lg text-themePurple border border-themePurple py-2 px-4 rounded">
                  {data?.data?.bookingStatus}
                </div>
              </div>
              <div className="w-80 inner">
                <Select
                  onChange={(e) => changeStatusFunc(e.value)}
                  options={allStatus}
                  inputId="dbs"
                  placeholder="Change Status"
                />
              </div>
              <div>
                <button
                  onClick={() => setModal(true)}
                  className="flex items-center gap-x-2 font-medium text-base text-white bg-themePurple 
                  py-2.5 px-5 border border-themePurple rounded hover:bg-transparent
                   hover:text-themePurple"
                >
                  Print
                </button>
              </div>
            </div>
          </div>
          <section className="grid grid-cols-12 gap-5">
            <div
              className={`col-span-12 ${
                dark ? "bg-themeBlack2" : "bg-white"
              } py-8 px-10 rounded-lg`}
            >
              <div className="flex gap-5 [&>div]:min-w-[12.5%] overflow-auto pb-5">
                {data?.data?.bookingHistory?.map((booking, index) => (
                  <StatusPill
                    title={booking?.statusText}
                    text={booking?.statusDesc}
                    pillStatus={booking?.status ? "completed" : "inProcess"}
                    date={booking?.date}
                    time={convertTo12Hour(booking?.time)}
                  />
                ))}
              </div>
            </div>
            <div
              className={`xl:row-span-3 2xl:col-span-4 xl:col-span-6 col-span-12 ${
                dark ? "text-white bg-themeBlack2" : "text-black bg-white"
              } py-8 px-10 rounded-lg space-y-8`}
            >
              <h1 className="font-medium text-2xl">
                Order#
                <span
                  className={`${
                    dark ? "text-white" : "text-black"
                  } text-opacity-60 ml-2`}
                >
                  {data?.data?.trackingId}
                </span>
              </h1>
              <h1 className="font-medium text-2xl">
                Scheduled By
                <span
                  className={`${
                    dark ? "text-white" : "text-black"
                  } text-opacity-60 ml-2`}
                >
                  {data?.data?.scheduleSetBy
                    ? (data?.data?.scheduleSetBy).charAt(0).toUpperCase() +
                      (data?.data?.scheduleSetBy).slice(1)
                    : "No Data"}
                </span>
              </h1>
              <div className={`space-y-4`}>
                <h1 className="font-medium text-2xl">Sender Details</h1>
                <div className="space-y-2">
                  <h5
                    className={`font-bold text-xl ${
                      dark ? "text-white" : "text-themePurple"
                    }`}
                  >
                    {data?.data?.senderDetails?.name}
                  </h5>
                  <span>
                    Member since: {data?.data?.senderDetails?.memberSince}
                  </span>
                  <div>
                    <span
                      className={`font-normal text-sm ${
                        dark ? "text-white" : "text-black"
                      } text-opacity-60`}
                    >
                      Email
                    </span>
                    <p className="font-normal text-base">
                      {data?.data?.senderDetails?.email}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`font-normal text-sm ${
                        dark ? "text-white" : "text-black"
                      } text-opacity-60`}
                    >
                      Phone no
                    </span>
                    <p className="font-normal text-base">
                      {data?.data?.senderDetails?.phone}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="font-medium text-2xl">Recipient Details</h1>
                <div className="space-y-2">
                  <h5
                    className={`font-bold text-xl ${
                      dark ? "text-white" : "text-themePurple"
                    }`}
                  >
                    {data?.data?.recipientDetails?.name}
                  </h5>
                  <div>
                    <span
                      className={`font-normal text-sm ${
                        dark ? "text-white" : "text-black"
                      } text-opacity-60`}
                    >
                      Email
                    </span>
                    <p className="font-normal text-base">
                      {data?.data?.recipientDetails?.email}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`font-normal text-sm ${
                        dark ? "text-white" : "text-black"
                      } text-opacity-60`}
                    >
                      Phone
                    </span>
                    <p className="font-normal text-base">
                      {data?.data?.recipientDetails?.phone}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`font-normal text-sm ${
                        dark ? "text-white" : "text-black"
                      } text-opacity-60`}
                    >
                      Security Code
                    </span>
                    <p className="font-normal text-base capitalize">
                      {data?.data?.securityCode}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`font-normal text-sm ${
                        dark ? "text-white" : "text-black"
                      } text-opacity-60`}
                    >
                      Order Instructions
                    </span>
                    <p className="font-normal text-base capitalize">
                      {data?.data?.instructions}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`font-normal text-sm ${
                        dark ? "text-white" : "text-black"
                      } text-opacity-60`}
                    >
                      Leave At Door
                    </span>
                    <p className="font-normal text-base">
                      {data?.data?.leaveAtDoor ? "True" : "False"}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`font-normal text-sm ${
                        dark ? "text-white" : "text-black"
                      } text-opacity-60`}
                    >
                      Pod Image
                    </span>
                    {data?.data?.podImage ? (
                      <img src={`${BASE_URL2}${data?.data?.podImage}`} alt="" />
                    ) : (
                      <p className="font-normal text-base">N/A</p>
                    )}
                  </div>
                  <div>
                    <span
                      className={`font-normal text-sm ${
                        dark ? "text-white" : "text-black"
                      } text-opacity-60`}
                    >
                      Signature Image
                    </span>
                    {data?.data?.signatureImage ? (
                      <img
                        src={`${BASE_URL2}${data?.data?.signatureImage}`}
                        alt=""
                      />
                    ) : (
                      <p className="font-normal text-base">N/A</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`xl:row-span-3 2xl:col-span-4 xl:col-span-6 col-span-12 ${
                dark ? "bg-themeBlack2 text-white" : "bg-white text-black"
              } py-8 px-10 rounded-lg space-y-12`}
            >
              <div className="space-y-4">
                <h1 className="font-medium text-2xl flex items-center gap-x-5">
                  <TbTruckDelivery
                    size={32}
                    className={dark ? "text-white" : "text-themePurple"}
                  />
                  <span>Delivery Details</span>
                </h1>
                <div className="flex gap-x-5 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-fit border border-themeOrange rounded-fullest p-1">
                      <div className="w-4 h-4 rounded-fullest bg-themeOrange"></div>
                    </div>
                    <img
                      src={`${imgURL}line${dark ? "D" : ""}.webp`}
                      alt="line"
                    />
                    <div className="w-fit border border-themeOrange p-1">
                      <div className="w-4 h-4 bg-themeOrange"></div>
                    </div>
                    <img
                      src={`${imgURL}line${dark ? "D" : ""}.webp`}
                      alt="line"
                    />
                    <div className="w-fit border border-themeOrange p-1">
                      <div className="w-4 h-4 bg-themeOrange"></div>
                    </div>
                    <img
                      src={`${imgURL}line${dark ? "D" : ""}.webp`}
                      alt="line"
                    />
                    <div className="w-fit border border-themeOrange rounded-fullest p-1">
                      <div className="w-4 h-4 rounded-fullest bg-themeOrange"></div>
                    </div>
                  </div>
                  <div className="space-y-6 w-full">
                    <div className="flex justify-between min-h-[44px]">
                      <div>
                        <p className="font-medium text-base">Pickup</p>
                        <p
                          className={`font-normal text-sm ${
                            dark ? "text-white" : "text-black"
                          } text-opacity-60`}
                        >
                          {data?.data?.deliveryDetails?.pickupCode}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <p
                          className={`font-normal text-sm ${
                            dark ? "text-white" : "text-black"
                          } text-opacity-60`}
                        >
                          {data?.data?.deliveryDetails?.pickupTime}
                        </p>
                        <p
                          className={`font-normal text-sm ${
                            dark ? "text-white" : "text-black"
                          } text-opacity-60`}
                        >
                          {data?.data?.deliveryDetails?.pickupDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between min-h-[44px]">
                      <div>
                        <p className="font-medium text-base">
                          Receiving Warehouse
                        </p>
                        <p
                          className={`font-normal text-sm ${
                            dark ? "text-white" : "text-black"
                          } text-opacity-60`}
                        >
                          {data?.data?.receivingWarehouse &&
                            `${data?.data?.receivingWarehouse?.addressDB?.PostalCode} ${data?.data?.receivingWarehouse?.addressDB?.secondPostalCode}`}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <p
                          className={`font-normal text-sm ${
                            dark ? "text-white" : "text-black"
                          } text-opacity-60`}
                        >
                          {data?.data?.receivingWarehouse &&
                            data?.data?.receivingWarehouse?.name}
                        </p>
                        <p
                          className={`font-normal text-sm ${
                            dark ? "text-white" : "text-black"
                          } text-opacity-60`}
                        >
                          {data?.data?.receivingWarehouse &&
                            data?.data?.receivingWarehouse?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between min-h-[44px]">
                      <div>
                        <p className="font-medium text-base">
                          Delivery Warehouse
                        </p>
                        <p
                          className={`font-normal text-sm ${
                            dark ? "text-white" : "text-black"
                          } text-opacity-60`}
                        >
                          {data?.data?.deliveryWarehouse &&
                            `${data?.data?.deliveryWarehouse?.addressDB?.PostalCode} ${data?.data?.deliveryWarehouse?.addressDB?.secondPostalCode}`}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <p
                          className={`font-normal text-sm ${
                            dark ? "text-white" : "text-black"
                          } text-opacity-60`}
                        >
                          {data?.data?.deliveryWarehouse &&
                            data?.data?.deliveryWarehouse?.name}
                        </p>
                        <p
                          className={`font-normal text-sm ${
                            dark ? "text-white" : "text-black"
                          } text-opacity-60`}
                        >
                          {data?.data?.deliveryWarehouse &&
                            data?.data?.deliveryWarehouse?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between min-h-[44px]">
                      <div>
                        <p className="font-medium text-base">Drop off</p>
                        <p
                          className={`font-normal text-sm ${
                            dark ? "text-white" : "text-black"
                          } text-opacity-60`}
                        >
                          {data?.data?.deliveryDetails?.dropoffCode}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <p
                          className={`font-normal text-sm ${
                            dark ? "text-white" : "text-black"
                          } text-opacity-60`}
                        >
                          {data?.data?.deliveryDetails?.dropoffTime}
                        </p>
                        <p
                          className={`font-normal text-sm ${
                            dark ? "text-white" : "text-black"
                          } text-opacity-60`}
                        >
                          {data?.data?.deliveryDetails?.dropoffDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="font-medium text-2xl flex items-center gap-x-5">
                  <BsBoxSeam
                    size={32}
                    className={dark ? "text-white" : "text-themePurple"}
                  />
                  <span>Parcel Details</span>
                </h1>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="font-medium text-base">
                      Type of shipment
                    </span>
                    <span
                      className={`font-normal text-base ${
                        dark ? "text-white" : "text-black"
                      } text-opacity-60`}
                    >
                      {data?.data?.parcelDetails?.shipmentType}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-base">Category</span>
                    <span
                      className={`font-normal text-base ${
                        dark ? "text-white" : "text-black"
                      } text-opacity-60`}
                    >
                      {data?.data?.parcelDetails?.category}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-base">Size</span>
                    <span
                      className={`font-normal text-base ${
                        dark ? "text-white" : "text-black"
                      } text-opacity-60`}
                      dangerouslySetInnerHTML={{
                        __html: data?.data?.parcelDetails?.size,
                      }}
                    />
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-base">Weight</span>
                    <span
                      className={`font-normal text-base ${
                        dark ? "text-white" : "text-black"
                      } text-opacity-60`}
                    >
                      {data?.data?.parcelDetails?.weight}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-base">Distance</span>
                    <span
                      className={`font-normal text-base ${
                        dark ? "text-white" : "text-black"
                      } text-opacity-60`}
                    >
                      {data?.data?.parcelDetails?.distance}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-base">Pickup Date</span>
                    <span
                      className={`font-normal text-base ${
                        dark ? "text-white" : "text-black"
                      } text-opacity-60`}
                    >
                      {data?.data?.parcelDetails?.pickupDate}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-base">ETA</span>
                    <span
                      className={`font-normal text-base ${
                        dark ? "text-white" : "text-black"
                      } text-opacity-60`}
                    >
                      {data?.data?.parcelDetails?.ETA}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-base">Order Amount</span>
                    <span
                      className={`font-normal text-base ${
                        dark ? "text-white" : "text-black"
                      } text-opacity-60`}
                    >
                      {data?.data?.parcelDetails?.orderTotal}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-base">
                      Admin Earnings
                    </span>
                    <span
                      className={`font-normal text-base ${
                        dark ? "text-white" : "text-black"
                      } text-opacity-60`}
                    >
                      {data?.data?.billingDetails?.adminEarning}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className={`xl:col-span-4 col-span-6 ${
                dark ? "bg-themeBlack2 text-white" : "bg-white text-black"
              } py-8 px-10 rounded-lg space-y-5 relative 2xl:h-auto min-h-[200px]`}
            >
              <h1 className="font-medium text-2xl">
                Delivery Guy{" "}
                <span className="font-normal text-sm text-opacity-40">
                  (Pickup Driver)
                </span>
              </h1>
              {Object.keys(data?.data?.receivingDriver).length === 0 ? (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center">
                  <h3 className="bg-themeYellow bg-opacity-50 w-fit text-lg rounded-lg px-10 py-2">
                    Not Assigned Yet
                  </h3>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-x-3 mb-3">
                    <div
                      className={`w-fit rounded-fullest ${
                        dark
                          ? "bg-white text-black"
                          : "bg-themePurple text-white"
                      } p-4`}
                    >
                      <FaUser size={28} />
                    </div>
                    <div className="space-y-1">
                      <h5
                        className={`font-bold text-xl ${
                          dark ? "text-white" : "text-themePurple"
                        }`}
                      >
                        {data?.data?.receivingDriver?.name}
                      </h5>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-normal text-sm text-opacity-60">
                        Email
                      </span>
                      <p className="font-normal text-base">
                        {data?.data?.receivingDriver?.email}
                      </p>
                    </div>
                    <div>
                      <span className="font-normal text-sm text-opacity-60">
                        Phone no
                      </span>
                      <p className="font-normal text-base">
                        {data?.data?.receivingDriver?.phone}
                      </p>
                    </div>
                    <div>
                      <span className="font-normal text-sm text-opacity-60">
                        Earning
                      </span>
                      <p className="font-normal text-base">
                        {data?.data?.billingDetails?.pickupDriverEarning}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div
              className={`xl:col-span-4 col-span-6 ${
                dark ? "bg-themeBlack2 text-white" : "bg-white text-black"
              } py-8 px-10 rounded-lg space-y-5 relative 2xl:h-auto min-h-[200px]`}
            >
              <h1 className="font-medium text-2xl">Transporter guy</h1>
              {Object.keys(data?.data?.transporterGuy).length === 0 ? (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center">
                  <h3 className="bg-themeYellow bg-opacity-50 w-fit text-lg rounded-lg px-10 py-2">
                    Not Assigned Yet
                  </h3>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-x-3 mb-3">
                    <div
                      className={`w-fit rounded-fullest ${
                        dark
                          ? "bg-white text-black"
                          : "bg-themePurple text-white"
                      } p-4`}
                    >
                      <FaUser size={28} />
                    </div>
                    <div className="space-y-1">
                      <h5
                        className={`font-bold text-xl ${
                          dark ? "text-white" : "text-themePurple"
                        }`}
                      >
                        {data?.data?.transporterGuy?.name}
                      </h5>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-normal text-sm text-opacity-60">
                        Email
                      </span>
                      <p className="font-normal text-base">
                        {data?.data?.transporterGuy?.email}
                      </p>
                    </div>
                    <div>
                      <span className="font-normal text-sm text-opacity-60">
                        Phone no
                      </span>
                      <p className="font-normal text-base">
                        {data?.data?.transporterGuy?.phone}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div
              className={`xl:col-span-4 col-span-6 ${
                dark ? "bg-themeBlack2 text-white" : "bg-white text-black"
              } py-8 px-10 rounded-lg space-y-5 relative 2xl:h-auto min-h-[200px]`}
            >
              <h1 className="font-medium text-2xl">
                Delivery Guy{" "}
                <span className="font-normal text-sm text-opacity-40">
                  (Dropoff Driver)
                </span>
              </h1>
              {Object.keys(data?.data?.deliveryDriver).length === 0 ? (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center">
                  <h3 className="bg-themeYellow bg-opacity-50 w-fit text-lg rounded-lg px-10 py-2">
                    Not Assigned Yet
                  </h3>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-x-3 mb-3">
                    <div
                      className={`w-fit rounded-fullest ${
                        dark
                          ? "bg-white text-black"
                          : "bg-themePurple text-white"
                      } p-4`}
                    >
                      <FaUser size={28} />
                    </div>
                    <div className="space-y-1">
                      <h5
                        className={`font-bold text-xl ${
                          dark ? "text-white" : "text-themePurple"
                        }`}
                      >
                        {data?.data?.deliveryDriver?.name}
                      </h5>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-normal text-sm text-opacity-60">
                        Email
                      </span>
                      <p className="font-normal text-base">
                        {data?.data?.deliveryDriver?.email}
                      </p>
                    </div>
                    <div>
                      <span className="font-normal text-sm text-opacity-60">
                        Phone no
                      </span>
                      <p className="font-normal text-base">
                        {data?.data?.deliveryDriver?.phone}
                      </p>
                    </div>
                    <div>
                      <span className="font-normal text-sm text-opacity-60">
                        Earning
                      </span>
                      <p className="font-normal text-base">
                        {data?.data?.billingDetails?.deliveryDriverEarning}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          <Modal
            onClose={() => {
              setModal(false);
            }}
            isOpen={modal}
            isCentered
            size={"3xl"}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton />
              <ModalBody paddingTop={5} paddingBottom={5}>
                <div
                  id="sectionToPrint"
                  style={{ width: "99%", margin: "auto" }}
                >
                  <div className="border-2 border-black m-1">
                    <div className="grid grid-cols-12">
                      <div className="flex items-center font-bold pl-1 pr-1 border-black border-r-2 first-letter:col-span-1">
                        E
                      </div>
                      <div className="col-span-11 px-2 flex flex-col gap-2">
                        <div className="flex justify-end text-xs font-semibold">
                          panamapostal.com
                        </div>
                        <div className="text-xs font-semibold">
                          <h2>Sender: {data?.data?.senderDetails?.name}</h2>
                          <p>From: {data?.data?.deliveryDetails?.pickupCode}</p>
                        </div>
                        <div className="flex justify-center text-xs font-semibold">
                          Date:{" "}
                          {moment(data?.data?.createdAt).format("DD-MM-YYYY")}
                        </div>
                        {/* <div>
                    <img
                      src="/images/qrcode.webp"
                      alt="qrcode"
                      className="w-full h-12 object-contain"
                    />
                  </div> */}
                      </div>
                    </div>
                    <div className="border-black border-t-2 border-b-2 py-1">
                      <div className="font-semibold uppercase text-center text-xs">
                        {data?.data?.parcelDetails?.shipmentType}{" "}
                        <sup className="uppercase text-xs">Tm</sup>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 p-2">
                      <div className="col-span-3 space-y-5">
                        <div>
                          <div className="flex gap-5 text-xs font-semibold">
                            <div>Sending Warehouse:</div>
                            <div>
                              <div>{data?.data?.deliveryWarehouse?.name}</div>
                              <div className="flex justify-center my-2">
                                <FaArrowDown />
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-5 text-xs font-semibold">
                            <div>Receiving Warehouse: </div>
                            <div>{data?.data?.receivingWarehouse?.name}</div>
                          </div>
                        </div>
                        <div className="flex gap-5 text-xs font-semibold">
                          <div>Receiver: </div>
                          <div className="flex flex-col">
                            <div className="capitalize">
                              {data?.data?.recipientDetails?.name}
                            </div>
                            <div>
                              {data?.data?.deliveryDetails?.dropoffCode}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <img
                          src="/images/logo-gray.webp"
                          alt="logo-gray"
                          className="w-20"
                        />
                      </div>
                    </div>
                    <div className="border-black border-t-2 border-b-2 py-0.5 flex flex-col items-center gap-2">
                      <h2 className="text-xs font-semibold uppercase text-center">
                        Pps Tracking #
                      </h2>
                      <QRCode
                        size={256}
                        style={{
                          height: "40px",
                          width: "40px",
                        }}
                        value={data?.data?.trackingId}
                        viewBox={`0 0 256 256`}
                      />
                      <div className="text-xs text-center font-semibold">
                        {data?.data?.trackingId}
                      </div>
                    </div>
                    <div className="p-0.5 text-xs font-semibold uppercase text-center">
                      {data?.data?.deliveryDetails?.dropoffCode}
                    </div>
                  </div>
                </div>
              </ModalBody>
            </ModalContent>
          </Modal>
        </section>
      }
    />
  );
}
