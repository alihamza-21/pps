import React, { useEffect, useState } from "react";
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

export default function CreateDriver2() {
  const navigate = useNavigate();
  useEffect(() => {
    if (location?.state?.userId === undefined) {
      navigate("/create-driver/step-one");
      info_toaster("Please complete Step One");
    }
  });
  const location = useLocation();
  const driversFeatureId = location?.state?.featureId;
  const activeVeh = GetAPI("getactivevehicles", driversFeatureId);
  const [timeline] = useState("2");
  const [loader, setLoader] = useState(false);
  const [vehicle, setVehicle] = useState({
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vehicleColor: "",
    vehImages: [],
    vehicleTypeId: "",
  });
  const onChange2 = (e) => {
    if (e.target.name === "vehImages") {
      setVehicle({ ...vehicle, [e.target.name]: [...e.target.files] });
    } else {
      setVehicle({ ...vehicle, [e.target.name]: e.target.value });
    }
  };
  const vehicleFunc = async (e) => {
    e.preventDefault();
    if (vehicle.vehicleMake === "") {
      info_toaster("Please enter Vehicle's Make");
    } else if (vehicle.vehicleModel === "") {
      info_toaster("Please enter Vehicle's Model");
    } else if (vehicle.vehicleColor === "") {
      info_toaster("Please enter Vehicle's Color");
    } else if (vehicle.vehicleYear === "") {
      info_toaster("Please enter Vehicle's Year");
    } else if (vehicle.vehImages.length === 0) {
      info_toaster("Please select at least one image for the vehicle");
    } else if (vehicle.vehicleTypeId === "") {
      info_toaster("Please select Vehicle Type");
    } else {
      setLoader(true);
      const formData = new FormData();
      formData.append("vehicleMake", vehicle.vehicleMake);
      formData.append("vehicleModel", vehicle.vehicleModel);
      formData.append("vehicleColor", vehicle.vehicleColor);
      formData.append("vehicleYear", vehicle.vehicleYear);
      formData.append("vehicleTypeId", vehicle.vehicleTypeId.value);
      formData.append("userId", location?.state?.userId);
      vehicle.vehImages.forEach((file) => {
        formData.append("vehImages", file);
      });
      let res = await PostAPI("registerstep2", driversFeatureId, formData);
      if (res?.data?.status === "1") {
        setVehicle({
          vehicleMake: "",
          vehicleModel: "",
          vehicleYear: "",
          vehicleColor: "",
          vehImages: [],
          vehicleTypeId: "",
        });
        navigate("/create-driver/step-three", {
          state: {
            userId: res?.data?.data?.userId,
            featureId: driversFeatureId,
          },
        });
        success_toaster(res?.data?.message);
        setLoader(false);
      } else {
        error_toaster(res?.data?.message);
        setLoader(false);
      }
    }
  };
  const options = [];
  activeVeh.data?.data?.map((activeVeh, index) =>
    options.push({
      value: activeVeh?.id,
      label: activeVeh?.title,
    })
  );
  return (
    <>
      <Layout
        title="Create Driver"
        content={
          <section className="grid grid-cols-12 gap-5">
            <form className="col-span-8 grid grid-cols-2 gap-x-20 gap-y-5 bg-white rounded-md p-8 relative min-h-[568px]">
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
                    <label className={labelStyle} htmlFor="vehicleMake">
                      Vehicle Make
                    </label>
                    <input
                      value={vehicle.vehicleMake}
                      onChange={onChange2}
                      type="text"
                      name="vehicleMake"
                      id="vehicleMake"
                      placeholder="Enter Vehicle's Make"
                      className={inputStyle}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelStyle} htmlFor="vehicleModel">
                      Vehicle Model
                    </label>
                    <input
                      value={vehicle.vehicleModel}
                      onChange={onChange2}
                      type="text"
                      name="vehicleModel"
                      id="vehicleModel"
                      placeholder="Enter Vehicle's Model"
                      className={inputStyle}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelStyle} htmlFor="vehicleColor">
                      Vehicle Color
                    </label>
                    <input
                      value={vehicle.vehicleColor}
                      onChange={onChange2}
                      type="text"
                      name="vehicleColor"
                      id="vehicleColor"
                      placeholder="Enter Vehicle's Color"
                      className={inputStyle}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelStyle} htmlFor="vehicleYear">
                      Vehicle Year
                    </label>
                    <input
                      value={vehicle.vehicleYear}
                      onChange={onChange2}
                      type="number"
                      name="vehicleYear"
                      id="vehicleYear"
                      placeholder="Enter Vehicle's Year"
                      className={inputStyle}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelStyle} htmlFor="vehImages">
                      Vehicle Images
                    </label>
                    <input
                      onChange={onChange2}
                      type="file"
                      name="vehImages"
                      id="vehImages"
                      className={inputStyle}
                      multiple={true}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelStyle} htmlFor="vehicleTypeId">
                      Vehicle Type
                    </label>
                    <Select
                      value={vehicle.vehicleTypeId}
                      onChange={(e) =>
                        setVehicle({ ...vehicle, vehicleTypeId: e })
                      }
                      options={options}
                      inputId="vehicleTypeId"
                    />
                  </div>
                  <div className="col-span-2 flex justify-end items-center mt-20">
                    <button
                      type="submit"
                      onClick={vehicleFunc}
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
                <h6 className="font-medium text-sm">Vehicle Make</h6>
                <p className="font-bold text-base text-black text-opacity-60">
                  {vehicle.vehicleMake === ""
                    ? "Enter Vehicle's Make"
                    : vehicle.vehicleMake}
                </p>
              </div>
              <hr className="border-none h-0.5 bg-black bg-opacity-10" />
              <div>
                <h6 className="font-medium text-sm">Vehicle Model</h6>
                <p className="font-bold text-base text-black text-opacity-60">
                  {vehicle.vehicleModel === ""
                    ? "Enter Vehicle's Model"
                    : vehicle.vehicleModel}
                </p>
              </div>
              <hr className="border-none h-0.5 bg-black bg-opacity-10" />
              <div>
                <h6 className="font-medium text-sm">Vehicle Color</h6>
                <p className="font-bold text-base text-black text-opacity-60">
                  {vehicle.vehicleColor === ""
                    ? "Enter Vehicle's Model"
                    : vehicle.vehicleColor}
                </p>
              </div>
              <hr className="border-none h-0.5 bg-black bg-opacity-10" />
              <div>
                <h6 className="font-medium text-sm">Registration Year</h6>
                <p className="font-bold text-base text-black text-opacity-60">
                  {vehicle.vehicleYear === ""
                    ? "Enter Vehicle's Registration Year"
                    : vehicle.vehicleYear}
                </p>
              </div>
            </div>
          </section>
        }
      />
    </>
  );
}
