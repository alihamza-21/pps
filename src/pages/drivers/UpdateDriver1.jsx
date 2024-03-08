import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useLocation, useNavigate } from "react-router-dom";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../utilities/Toaster";
import { inputStyle, labelStyle, style } from "../../utilities/Input";
import Layout from "../../components/Layout";
import { BackButton } from "../../utilities/Buttons";
import { MiniLoader } from "../../components/Loader";
import { PutAPI } from "../../utilities/PutAPI";

export default function UpdateDriver1() {
  const remover = (str) => {
    if (str[0] === "+") {
      var result = str.slice(1);
    } else {
      result = str;
    }
    return result;
  };
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const driversFeatureId =
    featureData && featureData.find((ele) => ele.title === "Drivers")?.id;
  const navigate = useNavigate();
  const location = useLocation();
  const driverId = localStorage.getItem("driverId");
  const driDetails = location?.state?.driDetails;
  const [loader, setLoader] = useState(false);
  const [driver, setDriver] = useState({
    userId: driverId,
    firstName: driDetails?.firstName,
    lastName: driDetails?.lastName,
    countryCode: driDetails?.countryCode,
    phoneNum: driDetails?.phoneNum,
    imageUpdated: false,
    profileImage: "",
  });
  const onChange = (e) => {
    setDriver({ ...driver, [e.target.name]: e.target.value });
  };
  const driverFunc = async (e) => {
    e.preventDefault();
    if (driver.firstName === "") {
      info_toaster("Please enter Driver's First Name");
    } else if (driver.lastName === "") {
      info_toaster("Please enter Driver's Last Name");
    } else if (driver.phoneNum === "") {
      info_toaster("Please enter Driver's Phone Number");
    } else if (driver.imageUpdated && driver.profileImage === "") {
      info_toaster("Please enter Driver's Profile Image");
    } else {
      setLoader(true);
      const formData = new FormData();
      formData.append("userId", driver.userId);
      formData.append("firstName", driver.firstName);
      formData.append("lastName", driver.lastName);
      formData.append("countryCode", `+${remover(driver.countryCode)}`);
      formData.append("phoneNum", driver.phoneNum);
      formData.append("imageUpdated", driver.imageUpdated);
      driver.imageUpdated
        ? formData.append("profileImage", driver.profileImage)
        : formData.append("profileImage", "");
      let res = await PutAPI("updateprofile", driversFeatureId, formData);
      if (res?.data?.status === "1") {
        setDriver({
          userId: "",
          firstName: "",
          lastName: "",
          countryCode: "507",
          phoneNum: "",
          imageUpdated: false,
          profileImage: "",
        });
        navigate("/drivers");
        success_toaster(res?.data?.message);
      } else {
        error_toaster(res?.data?.message);
      }
    }
  };
  return (
    <>
      <style>{style}</style>
      <Layout
        title="Create Driver"
        content={
          <section className="space-y-4">
            <div>
              <BackButton />
            </div>
            <section className="grid grid-cols-12 gap-5">
              <form className="col-span-8 grid grid-cols-2 gap-x-20 gap-y-5 bg-white rounded-md p-8 relative min-h-[568px]">
                {loader ? (
                  <MiniLoader />
                ) : (
                  <>
                    <div className="col-span-2 flex items-center text-lg my-4">
                      <h3 className="font-medium text-2xl">Personal Info</h3>
                    </div>
                    <div className="space-y-1">
                      <label className={labelStyle} htmlFor="firstName">
                        First Name
                      </label>
                      <input
                        value={driver.firstName}
                        onChange={onChange}
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder="Enter Driver's First Name"
                        className={inputStyle}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelStyle} htmlFor="lastName">
                        Last Name
                      </label>
                      <input
                        value={driver.lastName}
                        onChange={onChange}
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder="Enter Driver's Last Name"
                        className={inputStyle}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelStyle} htmlFor="phoneNum">
                        Phone no
                      </label>
                      <div className="flex gap-x-1">
                        <PhoneInput
                          inputStyle={{
                            display: "block",
                            width: "88px",
                            paddingTop: "22px",
                            paddingBottom: "22px",
                            background: "#F4F5FA",
                            color: "black",
                            border: "none",
                          }}
                          inputProps={{
                            id: "countryCode",
                            name: "countryCode",
                          }}
                          country="Panama"
                          value={driver.countryCode}
                          onChange={(code) =>
                            setDriver({ ...driver, countryCode: code })
                          }
                        />
                        <input
                          value={driver.phoneNum}
                          onChange={onChange}
                          type="number"
                          name="phoneNum"
                          id="phoneNum"
                          placeholder="Enter Driver's Phone Number"
                          className={inputStyle}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-x-4 min-h-[79.61px]">
                      <label className={labelStyle} htmlFor="imageUpdated">
                        Do you want to upload new Image,?
                      </label>
                      <input
                        value={driver.imageUpdated}
                        onChange={(e) =>
                          setDriver({
                            ...driver,
                            imageUpdated: !driver.imageUpdated,
                          })
                        }
                        type="checkbox"
                        name="imageUpdated"
                        id="imageUpdated"
                      />
                    </div>
                    <div
                      className={`space-y-1 ${
                        driver.imageUpdated ? "visible" : "invisible"
                      }`}
                    >
                      <label className={labelStyle} htmlFor="profileImage">
                        Profile Image
                      </label>
                      <input
                        onChange={(e) =>
                          setDriver({
                            ...driver,
                            [e.target.name]: e.target.files[0],
                          })
                        }
                        type="file"
                        name="profileImage"
                        id="profileImage"
                        className={inputStyle}
                      />
                    </div>
                    <div className="col-span-2 flex justify-end items-center mt-20">
                      <button
                        type="submit"
                        onClick={driverFunc}
                        className="bg-themePurple w-40 font-medium text-xl text-white py-2.5 px-5 rounded border border-themePurple hover:text-themePurple hover:bg-transparent"
                      >
                        Update
                      </button>
                    </div>
                  </>
                )}
              </form>
              <div className="col-span-4 bg-white rounded-md space-y-5 p-8">
                <h2 className="font-bold text-xl text-themePurple">
                  Your Entries
                </h2>
                <hr className="border-none h-0.5 bg-black bg-opacity-10" />
                <div>
                  <h6 className="font-medium text-sm">Name</h6>
                  <p className="font-bold text-base text-black text-opacity-60">
                    {driver.firstName === ""
                      ? "Enter Driver's Name"
                      : driver.firstName + " " + driver.lastName}
                  </p>
                </div>
                <hr className="border-none h-0.5 bg-black bg-opacity-10" />
                <div>
                  <h6 className="font-medium text-sm">Phone No</h6>
                  <p className="font-bold text-base text-black text-opacity-60">
                    {driver.phoneNum === ""
                      ? "Enter Driver's Phone Number"
                      : `+${remover(driver.countryCode)} ${driver.phoneNum}`}
                  </p>
                </div>
              </div>
            </section>
          </section>
        }
      />
    </>
  );
}
