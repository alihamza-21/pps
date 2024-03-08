import React, { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import GetAPI from "../../utilities/GetAPI";
import { PostAPI } from "../../utilities/PostAPI";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../utilities/Toaster";
import { inputStyle, labelStyle } from "../../utilities/Input";
import Layout from "../../components/Layout";
import { MiniLoader } from "../../components/Loader";

export default function CreateDriver3() {
  const navigate = useNavigate();
  useEffect(() => {
    if (location?.state?.userId === undefined) {
      navigate("/create-driver/step-one");
      info_toaster("Please complete Step One");
    }
  });
  const location = useLocation();
  const driversFeatureId = location?.state?.featureId;
  const activeWare = GetAPI("activewarehouse", driversFeatureId);
  const [timeline] = useState("3");
  const [loader, setLoader] = useState(false);
  const [license, setLicense] = useState({
    licIssueDate: "",
    licExpiryDate: "",
    frontImage: "",
    backImage: "",
    warehouseId: "",
  });
  const onChange3 = (e) => {
    setLicense({ ...license, [e.target.name]: e.target.value });
  };
  const licenseFunc = async (e) => {
    e.preventDefault();
    if (license.licIssueDate === "") {
      info_toaster("Please enter License's Issue Date");
    } else if (license.licExpiryDate === "") {
      info_toaster("Please enter License's Expiry Date");
    } else if (license.frontImage === "") {
      info_toaster("Please enter License's Front Image");
    } else if (license.backImage === "") {
      info_toaster("Please enter License's Back Image");
    } else if (license.warehouseId === "") {
      info_toaster("Please select Warehouse");
    } else {
      setLoader(true);
      const formData = new FormData();
      formData.append("licIssueDate", license.licIssueDate);
      formData.append("licExpiryDate", license.licExpiryDate);
      formData.append("frontImage", license.frontImage);
      formData.append("backImage", license.backImage);
      formData.append("warehouseId", license.warehouseId.value);
      formData.append("userId", location?.state?.userId);
      let res = await PostAPI("registerstep3", driversFeatureId, formData);
      if (res?.data?.status === "1") {
        navigate("/drivers");
        success_toaster(res?.data?.message);
        setLicense({
          licIssueDate: "",
          licExpiryDate: "",
          frontImage: "",
          backImage: "",
          warehouseId: "",
        });
        setLoader(false);
      } else {
        error_toaster(res?.data?.message);
        setLoader(false);
      }
    }
  };
  const options2 = [];
  activeWare.data?.data?.map((activeWare, index) =>
    options2.push({
      value: activeWare?.id,
      label: activeWare?.name,
    })
  );
  return (
    <>
      <Layout
        title="Create Driver"
        content={
          <section className="grid grid-cols-12 gap-5">
            <form className="col-span-8 grid grid-cols-2 gap-x-20 gap-y-5 bg-white rounded-md p-8 relative min-h-[572px]">
              {loader ? (
                <MiniLoader />
              ) : (
                <>
                  <div className="col-span-2 flex items-center text-lg my-4">
                    <div
                      className={`
                    ${
                      timeline === "1" || timeline === "2" || timeline === "3"
                        ? "bg-themePurple text-white"
                        : "bg-black bg-opacity-20"
                    } min-w-[40px] min-h-[40px] rounded-fullest flex justify-center items-center`}
                    >
                      1
                    </div>
                    <div
                      className={`${
                        timeline === "2" || timeline === "3"
                          ? "border-y-themePurple"
                          : "border-y-black border-opacity-20"
                      } w-full h-0 border-y mx-4`}
                    ></div>
                    <div
                      className={`
                    ${
                      timeline === "2" || timeline === "3"
                        ? "bg-themePurple text-white"
                        : "bg-black bg-opacity-20"
                    } min-w-[40px] min-h-[40px] rounded-fullest flex justify-center items-center`}
                    >
                      2
                    </div>
                    <div
                      className={`${
                        timeline === "3"
                          ? "border-y-themePurple"
                          : "border-y-black border-opacity-20"
                      } w-full h-0 border-y mx-4`}
                    ></div>
                    <div
                      className={`
                    ${
                      timeline === "3"
                        ? "bg-themePurple text-white"
                        : "bg-black bg-opacity-20"
                    } min-w-[40px] min-h-[40px] rounded-fullest flex justify-center items-center`}
                    >
                      3
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className={labelStyle} htmlFor="licIssueDate">
                      License Issue Date
                    </label>
                    <input
                      value={license.licIssueDate}
                      onChange={onChange3}
                      type="date"
                      name="licIssueDate"
                      id="licIssueDate"
                      className={inputStyle}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelStyle} htmlFor="licExpiryDate">
                      License Expiry Date
                    </label>
                    <input
                      value={license.licExpiryDate}
                      onChange={onChange3}
                      type="date"
                      name="licExpiryDate"
                      id="licExpiryDate"
                      className={inputStyle}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelStyle} htmlFor="frontImage">
                      Front Image
                    </label>
                    <input
                      onChange={(e) =>
                        setLicense({
                          ...license,
                          [e.target.name]: e.target.files[0],
                        })
                      }
                      type="file"
                      name="frontImage"
                      id="frontImage"
                      className={inputStyle}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelStyle} htmlFor="backImage">
                      Back Image
                    </label>
                    <input
                      onChange={(e) =>
                        setLicense({
                          ...license,
                          [e.target.name]: e.target.files[0],
                        })
                      }
                      type="file"
                      name="backImage"
                      id="backImage"
                      className={inputStyle}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelStyle} htmlFor="warehouseId">
                      Warehouse
                    </label>
                    <Select
                      value={license.warehouseId}
                      onChange={(e) =>
                        setLicense({ ...license, warehouseId: e })
                      }
                      options={options2}
                      inputId="warehouseId"
                    />
                  </div>
                  <div className="col-span-2 flex justify-end items-center mt-20">
                    <button
                      type="submit"
                      onClick={licenseFunc}
                      className="bg-themePurple w-40 font-medium text-xl text-white py-2.5 px-5 rounded border border-themePurple hover:text-themePurple hover:bg-transparent"
                    >
                      Create
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
                <h6 className="font-medium text-sm">License Issue Date</h6>
                <p className="font-bold text-base text-black text-opacity-60">
                  {license.licIssueDate === ""
                    ? "Enter License's Issue Date"
                    : license.licIssueDate}
                </p>
              </div>
              <hr className="border-none h-0.5 bg-black bg-opacity-10" />
              <div>
                <h6 className="font-medium text-sm">License Expiry Date</h6>
                <p className="font-bold text-base text-black text-opacity-60">
                  {license.licExpiryDate === ""
                    ? "Enter License's Expiry Date"
                    : license.licExpiryDate}
                </p>
              </div>
              <hr className="border-none h-0.5 bg-black bg-opacity-10" />
            </div>
          </section>
        }
      />
    </>
  );
}
