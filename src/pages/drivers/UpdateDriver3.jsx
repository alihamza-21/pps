import React, { useState } from "react";
import "react-phone-input-2/lib/style.css";
import { useLocation, useNavigate } from "react-router-dom";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../utilities/Toaster";
import { inputStyle, labelStyle } from "../../utilities/Input";
import Layout from "../../components/Layout";
import { MiniLoader } from "../../components/Loader";
import { BackButton } from "../../utilities/Buttons";
import { PutAPI } from "../../utilities/PutAPI";

export default function UpdateDriver3() {
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const driversFeatureId =
    featureData && featureData.find((ele) => ele.title === "Drivers")?.id;
  const navigate = useNavigate();
  const location = useLocation();
  const driverId = localStorage.getItem("driverId");
  const driDetails = location?.state?.driDetails;
  const [loader, setLoader] = useState(false);
  const [license, setLicense] = useState({
    licIssueDate: driDetails?.driverDetail?.licIssueDate,
    licExpiryDate: driDetails?.driverDetail?.licExpiryDate,
    frontImageLic: "",
    backImageLic: "",
    userId: driverId,
    imageUpdated: false,
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
    } else if (license.imageUpdated && license.frontImageLic === "") {
      info_toaster("Please enter License's Front Image");
    } else if (license.imageUpdated && license.backImageLic === "") {
      info_toaster("Please enter License's Back Image");
    } else {
      setLoader(true);
      const formData = new FormData();
      formData.append("licIssueDate", license.licIssueDate);
      formData.append("licExpiryDate", license.licExpiryDate);
      license.imageUpdated
        ? formData.append("frontImageLic", license.frontImageLic)
        : formData.append("frontImageLic", "");
      license.imageUpdated
        ? formData.append("backImageLic", license.backImageLic)
        : formData.append("backImageLic", "");
      formData.append("userId", license.userId);
      let res = await PutAPI("updatelicense", driversFeatureId, formData);
      if (res?.data?.status === "1") {
        navigate("/drivers");
        success_toaster(res?.data?.message);
        setLicense({
          licIssueDate: "",
          licExpiryDate: "",
          frontImageLic: "",
          backImageLic: "",
          userId: "",
          imageUpdated: false,
        });
        setLoader(false);
      } else {
        error_toaster(res?.data?.message);
        setLoader(false);
      }
    }
  };
  return (
    <>
      <Layout
        title="Create Driver"
        content={
          <section className="space-y-4">
            <div>
              <BackButton />
            </div>
            <section className="grid grid-cols-12 gap-5">
              <form className="col-span-8 grid grid-cols-2 gap-x-20 gap-y-5 bg-white rounded-md p-8 relative min-h-[572px]">
                {loader ? (
                  <MiniLoader />
                ) : (
                  <>
                    <div className="col-span-2 flex items-center text-lg my-4">
                      <h3 className="font-medium text-2xl">License Info</h3>
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
                    <div className="flex items-center gap-x-4 min-h-[79.61px]">
                      <label className={labelStyle} htmlFor="imageUpdated">
                        Do you want to upload new Image,?
                      </label>
                      <input
                        value={license.imageUpdated}
                        onChange={(e) =>
                          setLicense({
                            ...license,
                            imageUpdated: !license.imageUpdated,
                          })
                        }
                        type="checkbox"
                        name="imageUpdated"
                        id="imageUpdated"
                      />
                    </div>
                    <div
                      className={`space-y-1 ${
                        license.imageUpdated ? "visible" : "invisible"
                      }`}
                    >
                      <label className={labelStyle} htmlFor="frontImageLic">
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
                        name="frontImageLic"
                        id="frontImageLic"
                        className={inputStyle}
                      />
                    </div>
                    <div
                      className={`space-y-1 ${
                        license.imageUpdated ? "visible" : "invisible"
                      }`}
                    >
                      <label className={labelStyle} htmlFor="backImageLic">
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
                        name="backImageLic"
                        id="backImageLic"
                        className={inputStyle}
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
          </section>
        }
      />
    </>
  );
}
