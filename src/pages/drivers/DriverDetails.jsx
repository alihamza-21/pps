import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AiFillCar } from "react-icons/ai";
import { BsBank, BsFillCreditCard2BackFill } from "react-icons/bs";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { TbLicense } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";
import { ModeContext } from "../../App";
import MyDataTable from "../../components/MyDataTable";
import {
  error_toaster,
  info_toaster,
} from "../../utilities/Toaster";
import {
  BackButton,
  DTApproved,
  DTPending,
  DTRejected,
  DTView,
  TabButton,
} from "../../utilities/Buttons";
import { BASE_URL, BASE_URL2 } from "../../utilities/URL";
import Layout from "../../components/Layout";
import DetailsCard from "../../components/DetailsCard";

export default function DriverDetails() {
  const { dark } = useContext(ModeContext);
  const [tab, setTab] = useState("Pickup");
  const [modal, setModal] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [modalType, setModalType] = useState("");
  const [wallet, setWallet] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const driDetails = location?.state?.driDetails;
  const driId = location?.state?.driverId;
  const driversFeatureId = location?.state?.featureId;
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
          BASE_URL + `bookingdetails?featureId=${driversFeatureId}&id=${id}`,
          config
        )
        .then((dat) => {
          if (dat.data?.status === "1") {
            localStorage.setItem("orderId", dat?.data?.data?.id);
            navigate("/booking-details");
            info_toaster(dat?.data?.message);
            setDisabled(false);
          } else {
            error_toaster(dat?.data?.message);
            setDisabled(false);
          }
        });
    } catch (err) {}
  };
  const walletDetails = async () => {
    var config = {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    };
    try {
      axios
        .get(
          BASE_URL + `driver/wallet?featureId=${driversFeatureId}&id=${driId}`,
          config
        )
        .then((dat) => {
          if (dat.data?.status === "1") {
            setWallet(dat?.data?.data);
          } else {
            error_toaster(dat?.data?.message);
          }
        });
    } catch (err) {}
  };
  useEffect(() => {
    walletDetails();
  }, []);
  const transColumns = [
    {
      name: "#",
      selector: (row) => row.id,
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
    },
    {
      name: "Type",
      selector: (row) => row.type,
    },
    {
      name: "Date",
      selector: (row) => row.date,
    },
  ];
  const transData = [];
  wallet?.transactions?.map((trans, index) => {
    return transData.push({
      id: index + 1,
      amount: trans?.amount,
      type: trans?.type,
      date: trans?.date,
    });
  });
  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
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
    {
      name: "Action",
      selector: (row) => row.action,
      minWidth: "160px",
    },
  ];
  const datas = [];
  if (tab === "Pickup") {
    driDetails?.deliveryDriver?.map((det, index) =>
      datas.push({
        id: index + 1,
        orderId: det?.trackingId,
        pickUp:
          det?.pickupAddress?.postalCode + det?.pickupAddress?.secondPostalCode,
        dropOff:
          det?.dropoffAddress?.postalCode +
          det?.dropoffAddress?.secondPostalCode,
        date: det?.pickupDate,
        status: det?.bookingStatus?.title,
        action: (
          <DTView view={() => bookingDetails(det?.id)} disabled={disabled} />
        ),
      })
    );
  } else if (tab === "Drop Off") {
    driDetails?.receivingDriver?.map((det, index) =>
      datas.push({
        id: index + 1,
        orderId: det?.trackingId,
        pickUp:
          det?.pickupAddress?.postalCode + det?.pickupAddress?.secondPostalCode,
        dropOff:
          det?.dropoffAddress?.postalCode +
          det?.dropoffAddress?.secondPostalCode,
        date: det?.pickupDate,
        status: det?.bookingStatus?.title,
        action: <DTView view={() => bookingDetails(det?.id)} />,
      })
    );
  }
  return (
    <Layout
      title="Driver Details"
      content={
        <>
          <Modal
            onClose={() => setModal(false)}
            isOpen={modal}
            size={modalType === "Transactions" ? "3xl" : "xl"}
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                <h1 className="text-center">
                  {modalType === "License"
                    ? "License Details"
                    : modalType === "Vehicle"
                    ? "Vehicle Details"
                    : modalType === "Earnings"
                    ? "Earnings"
                    : modalType === "Bank"
                    ? "Bank Details"
                    : modalType === "Transactions"
                    ? "Transactions"
                    : ""}
                </h1>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {modalType === "License" ? (
                  <div className="space-y-4">
                    <div>
                      Expiry:{" "}
                      <span className="font-bold">
                        {driDetails?.driverDetail?.licExpiryDate}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2">
                      <div className="space-y-2">
                        <h4>Front Image</h4>
                        <div>
                          <img
                            src={
                              BASE_URL2 +
                              driDetails?.driverDetail?.licFrontImage
                            }
                            alt="front"
                            className="w-full h-40 object-cover"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4>Back Image</h4>
                        <div>
                          <img
                            src={
                              BASE_URL2 + driDetails?.driverDetail?.licBackImage
                            }
                            alt="back"
                            className="w-full h-40 object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : modalType === "Vehicle" ? (
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                    <div>
                      Vehcile Type:{" "}
                      <span className="font-bold">
                        {driDetails?.driverDetail?.vehicleType?.title}
                      </span>
                    </div>
                    <div>
                      Vehcile Company:{" "}
                      <span className="font-bold">
                        {driDetails?.driverDetail?.vehicleMake}
                      </span>
                    </div>
                    <div>
                      Vehcile Model:{" "}
                      <span className="font-bold">
                        {driDetails?.driverDetail?.vehicleModel}
                      </span>
                    </div>
                    <div>
                      Vehcile Color:{" "}
                      <span className="font-bold">
                        {driDetails?.driverDetail?.vehicleColor}
                      </span>
                    </div>
                    <div>
                      Registration Year:{" "}
                      <span className="font-bold">
                        {driDetails?.driverDetail?.vehicleYear}
                      </span>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <h2>Vehicle Images: </h2>
                      <div className="grid grid-cols-2 gap-2">
                        {driDetails?.vehicleImages?.map((veh, index) => (
                          <div className="border border-black border-opacity-20 rounded-lg overflow-hidden">
                            <img
                              src={BASE_URL2 + veh?.image}
                              alt={`vehicle ${index}`}
                              className="w-full h-40 object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : modalType === "Earnings" ? (
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 pb-4">
                    <div>
                      Total Earnings:{" "}
                      <span className="font-bold">
                        {wallet?.currencyUnit + wallet?.totalEarning}
                      </span>
                    </div>
                    <div>
                      Available Balance:{" "}
                      <span className="font-bold">
                        {wallet?.currencyUnit + wallet?.availableBalance}
                      </span>
                    </div>
                  </div>
                ) : modalType === "Bank" ? (
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 pb-4">
                    <div>
                      Bank:{" "}
                      <span className="font-bold">
                        {wallet?.bank?.bankName}
                      </span>
                    </div>
                    <div>
                      Account Title:{" "}
                      <span className="font-bold">
                        {wallet?.bank?.accountName}
                      </span>
                    </div>
                    <div>
                      Account No.:{" "}
                      <span className="font-bold">
                        {wallet?.bank?.accountNumber}
                      </span>
                    </div>
                  </div>
                ) : modalType === "Transactions" ? (
                  <section className="max-h-[540px] overflow-auto">
                    <MyDataTable columns={transColumns} data={transData} />
                  </section>
                ) : (
                  <></>
                )}
              </ModalBody>
            </ModalContent>
          </Modal>
          <section className="2xl:space-y-4 space-y-8">
            <div className="flex justify-between">
              <div className="flex">
                <BackButton />
              </div>
              <div className="flex">
                <TabButton text="Pickup" set={setTab} tab={tab} width="w-40" />
                <TabButton
                  text="Drop Off"
                  set={setTab}
                  tab={tab}
                  width="w-40"
                />
              </div>
            </div>
            <section className="2xl:grid 2xl:grid-cols-12 gap-x-5 flex flex-col gap-y-5">
              <div className="2xl:col-span-9 2xl:order-1 order-2">
                <MyDataTable columns={columns} data={datas} />
              </div>
              <div
                className={`2xl:col-span-3 2xl:order-2 order-1 ${
                  dark ? "bg-themeBlack2 text-white" : "bg-white text-black"
                } rounded-lg space-y-5 py-12 px-12`}
              >
                <div className="pb-5">
                  <img
                    src={BASE_URL2 + driDetails?.image}
                    alt="profile"
                    className="w-20 h-20 object-cover rounded-fullest block mx-auto"
                  />
                </div>
                <div className="space-y-2">
                  <h2 className="font-bold text-xl text-themePurple">
                    {driDetails?.firstName + " " + driDetails?.lastName}
                  </h2>
                  <p className="font-normal text-base text-themePurple text-opacity-60">
                    Member Since: {driDetails?.joinedOn}
                  </p>
                </div>
                <hr className="border-none h-0.5 bg-black bg-opacity-20" />
                <div className="space-y-2">
                  <h2 className="font-normal text-sm text-black text-opacity-60">
                    Email
                  </h2>
                  <p className="font-normal text-base">{driDetails?.email}</p>
                </div>
                <hr className="border-none h-0.5 bg-black bg-opacity-20" />
                <div className="space-y-2">
                  <h2 className="font-normal text-sm text-black text-opacity-60">
                    Phone no
                  </h2>
                  <p className="font-normal text-base">
                    {driDetails?.countryCode + " " + driDetails?.phoneNum}
                  </p>
                </div>
                <hr className="border-none h-0.5 bg-black bg-opacity-20" />
                <div className="space-y-2">
                  <h2 className="font-normal text-sm text-black text-opacity-60">
                    Vehicle
                  </h2>
                  <p className="font-normal text-base">
                    {driDetails?.driverDetail?.vehicleType?.title}
                  </p>
                </div>
                <hr className="border-none h-0.5 bg-black bg-opacity-20" />
                <div className="space-y-2">
                  <h2 className="font-normal text-sm text-black text-opacity-60">
                    Status
                  </h2>
                  <p className="font-normal text-base">
                    {driDetails?.driverDetail?.approvedByAdmin ===
                    "approved" ? (
                      <DTApproved />
                    ) : driDetails?.driverDetail?.approvedByAdmin ===
                        "pending" || driDetails?.driverDetail === null ? (
                      <DTPending />
                    ) : (
                      <DTRejected />
                    )}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <DetailsCard
                    onClick={() => {
                      setModal(true);
                      setModalType("License");
                    }}
                    Icon={TbLicense}
                    text="License Details"
                  />
                  <DetailsCard
                    onClick={() => {
                      setModal(true);
                      setModalType("Vehicle");
                    }}
                    Icon={AiFillCar}
                    text="Vehicle Details"
                  />
                  <DetailsCard
                    onClick={() => {
                      // walletDetails();
                      setModal(true);
                      setModalType("Earnings");
                    }}
                    Icon={FaMoneyCheckAlt}
                    text="Earnings"
                  />
                  <DetailsCard
                    onClick={() => {
                      // walletDetails();
                      setModal(true);
                      setModalType("Bank");
                    }}
                    Icon={BsBank}
                    text="Bank Details"
                  />
                  <DetailsCard
                    onClick={() => {
                      // walletDetails();
                      setModal(true);
                      setModalType("Transactions");
                    }}
                    Icon={BsFillCreditCard2BackFill}
                    text="Transactions"
                  />
                </div>
              </div>
            </section>
          </section>
        </>
      }
    />
  );
}
