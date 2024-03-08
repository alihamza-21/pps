import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { BackButton, ModalButtons } from "../../utilities/Buttons";
import { BASE_URL2 } from "../../utilities/URL";
import Layout from "../../components/Layout";
import { blue, gray } from "../../utilities/CustomStyles";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../utilities/Toaster";
import { PostAPI } from "../../utilities/PostAPI";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import Loader, { MiniLoader } from "../../components/Loader";
import { inputStyle, labelStyle } from "../../utilities/Input";
import GetAPI from "../../utilities/GetAPI";

export default function DBSdetails() {
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const dbsFeatureId =
    featureData && featureData.find((ele) => ele.title === "All Addresses")?.id;
  const { data, reFetch } = GetAPI(
    `addressdetails?featureId=${dbsFeatureId}&id=${parseInt(
      localStorage.getItem("dbsId")
    )}`
  );
  const [loader, setLoader] = useState(false);
  const [approveDBS, setApproveDBS] = useState({
    lat: "",
    lng: "",
    secondPostalCode: "",
    addressId: "",
  });
  function splitLatLng(str, type) {
    const [lat, lng] = str.split(",").map((co) => co.trim());
    if (type === "Approve") {
      setApproveDBS({ ...approveDBS, lat: lat, lng: lng });
    }
  }
  const [approveModal, setApproveModal] = useState(false);
  const closeApproveModal = () => {
    setApproveModal(false);
    setApproveDBS({ lat: "", lng: "", secondPostalCode: "", addressId: "" });
  };
  const approveDBSfunc = async (e) => {
    e.preventDefault();
    if (approveDBS.lat === "" || approveDBS.lat === undefined) {
      info_toaster("Please enter your Address's Latitude");
    } else if (approveDBS.lng === "" || approveDBS.lng === undefined) {
      info_toaster("Please enter your Address's Longitude");
    } else {
      setLoader(true);
      let res = await PostAPI("approveaddress", dbsFeatureId, {
        lat: approveDBS.lat,
        lng: approveDBS.lng,
        secondPostalCode: approveDBS.secondPostalCode,
        addressId: approveDBS.addressId,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setApproveModal(false);
        setApproveDBS({
          lat: "",
          lng: "",
          secondPostalCode: "",
          addressId: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  return data.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      title={
        <>
          DBS{" "}
          <span className="text-black text-opacity-60">
            {data?.data?.postalCode + " " + data?.data?.secondPostalCode}
          </span>
        </>
      }
      content={
        <>
          <Modal
            onClose={closeApproveModal}
            isOpen={approveModal}
            size="xl"
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <form>
                <ModalHeader>
                  <h1 className="text-center">Approve Address</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-[176px]">
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="space-y-4 h-40 pt-5">
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="lat">
                          Address Coordinates
                        </label>
                        <input
                          onChange={(e) => {
                            splitLatLng(e.target.value, "Approve");
                          }}
                          type="text"
                          id="lat"
                          placeholder="31.4931172,74.1985346"
                          className={inputStyle}
                        />
                      </div>
                    </div>
                  </ModalBody>
                )}
                <ModalFooter>
                  <ModalButtons
                    text="Approve"
                    close={closeApproveModal}
                    action={approveDBSfunc}
                  />
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <section className="space-y-4">
            <div className="flex justify-between">
              <BackButton />
              {data?.data?.verified ? (
                <></>
              ) : (
                <button
                  onClick={() => {
                    setApproveModal(true);
                    setApproveDBS({
                      lat: "",
                      lng: "",
                      secondPostalCode:
                        data?.data?.secondPostalCode === "Pendiente"
                          ? ""
                          : data?.data?.secondPostalCode,
                      addressId: data?.data?.id,
                    });
                  }}
                  className="flex items-center gap-x-2 font-medium text-base text-white bg-themePurple py-2.65 px-5 border border-themePurple rounded hover:bg-transparent hover:text-themePurple"
                >
                  Approve
                </button>
              )}
            </div>
            <section className="bg-white rounded-lg grid grid-cols-12 shadow-md">
              <div className="col-span-9 py-8 px-8 space-y-5 border-r border-r-black border-opacity-10">
                <h1 className="font-medium text-2xl">Postal Code</h1>
                <div className="flex gap-x-3">
                  <div className="w-10 h-10 flex justify-center items-center rounded-fullest bg-themePurple">
                    <img
                      src={BASE_URL2 + data?.data?.structureType?.icon}
                      alt="icon"
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-base">
                      {data?.data?.postalCode +
                        " " +
                        data?.data?.secondPostalCode}
                    </h3>
                    <p className="font-normal text-sm text-black text-opacity-60">
                      {data?.data?.structureType?.title}
                    </p>
                    <p className="font-normal text-base text-black text-opacity-60 mt-2">
                      {data?.data?.corregimiento?.title +
                        ", " +
                        data?.data?.district?.title}
                    </p>
                  </div>
                  <div>
                    {data?.data?.verified ? (
                      <button className={blue}>Verified</button>
                    ) : (
                      <button className={gray}>Pending</button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-x-32">
                    <ul className="space-y-2 font-normal text-base text-black text-opacity-60">
                      <li>Structure Type</li>
                      <li>Building Name</li>
                      <li>Province</li>
                      <li>District</li>
                      <li>Corregimiento</li>
                      <li>Latitude</li>
                      <li>Longitude</li>
                      {data?.data?.structureType &&
                        data?.data?.structureType?.structQuestions?.map(
                          (quest, key) => <li>{quest?.label}</li>
                        )}
                    </ul>
                    <ul className="space-y-2 font-normal text-base text-end">
                      <li>
                        {data?.data?.structureType?.title
                          ? data?.data?.structureType?.title
                          : "No data"}
                      </li>
                      <li>
                        {data?.data?.buildingName
                          ? data?.data?.buildingName
                          : "No data"}
                      </li>
                      <li>
                        {data?.data?.province?.title
                          ? data?.data?.province?.title
                          : "No data"}
                      </li>
                      <li>
                        {data?.data?.district?.title
                          ? data?.data?.district?.title
                          : "No data"}
                      </li>
                      <li>
                        {data?.data?.corregimiento?.title
                          ? data?.data?.corregimiento?.title
                          : "No data"}
                      </li>
                      <li>{data?.data?.lat ? data?.data?.lat : "No data"}</li>
                      <li>{data?.data?.lng ? data?.data?.lng : "No data"}</li>
                      {data?.data?.structureType &&
                        data?.data?.structureType?.structQuestions?.map(
                          (quest, key) => (
                            <li>
                              {quest?.value !== "" ? quest?.value : "No data"}
                            </li>
                          )
                        )}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-span-3 py-8 px-6 space-y-5">
                <h1 className="font-medium text-2xl">Sender Details</h1>
                <div className="flex gap-x-3">
                  <div className="w-12 h-12 flex justify-center items-center rounded-fullest bg-themePurple text-white">
                    <FaUser size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-themePurple">
                      {data?.data?.senderDetails?.name}
                    </h3>
                    <p className="font-normal text-sm text-themePurple text-opacity-60">
                      Member Since: {data?.data?.senderDetails?.memberSince}
                    </p>
                  </div>
                </div>
                <div>
                  <h6 className="font-normal text-sm text-black text-opacity-60">
                    Email
                  </h6>
                  <p className="font-normal text-sm">
                    {data?.data?.senderDetails?.email}
                  </p>
                </div>
                <div>
                  <h6 className="font-normal text-sm text-black text-opacity-60">
                    Phone
                  </h6>
                  <p className="font-normal text-sm">
                    {data?.data?.senderDetails?.phone}
                  </p>
                </div>
              </div>
            </section>
          </section>
        </>
      }
    />
  );
}
