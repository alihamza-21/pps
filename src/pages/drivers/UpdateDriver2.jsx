import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import GetAPI from "../../utilities/GetAPI";
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

export default function UpdateDriver2() {
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const driversFeatureId =
    featureData && featureData.find((ele) => ele.title === "Drivers")?.id;
  const navigate = useNavigate();
  const location = useLocation();
  const activeVeh = GetAPI("getactivevehicles", driversFeatureId);
  const [loader, setLoader] = useState(false);
  const driverId = localStorage.getItem("driverId");
  const driDetails = location?.state?.driDetails;
  const [vehicle, setVehicle] = useState({
    userId: driverId,
    vehicleMake: driDetails?.driverDetail?.vehicleMake,
    vehicleModel: driDetails?.driverDetail?.vehicleModel,
    vehicleYear: driDetails?.driverDetail?.vehicleYear,
    vehicleColor: driDetails?.driverDetail?.vehicleColor,
    vehicleTypeId: "",
    imageUpdated: false,
    vehImages: [],
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
    } else if (vehicle.vehicleTypeId === "") {
      info_toaster("Please select Vehicle Type");
    } else if (vehicle.imageUpdated && vehicle.vehImages.length === 0) {
      info_toaster("Please select at least one image for the vehicle");
    } else {
      setLoader(true);
      const formData = new FormData();
      formData.append("vehicleMake", vehicle.vehicleMake);
      formData.append("vehicleModel", vehicle.vehicleModel);
      formData.append("vehicleColor", vehicle.vehicleColor);
      formData.append("vehicleYear", vehicle.vehicleYear);
      formData.append("vehicleTypeId", vehicle.vehicleTypeId.value);
      formData.append("userId", vehicle.userId);
      formData.append("imageUpdated", vehicle.imageUpdated);
      vehicle.imageUpdated &&
        vehicle.vehImages.forEach((file) => {
          formData.append("vehImages", file);
        });
      let res = await PutAPI("updateVehData", driversFeatureId, formData);
      if (res?.data?.status === "1") {
        setVehicle({
          userId: "",
          vehicleMake: "",
          vehicleModel: "",
          vehicleYear: "",
          vehicleColor: "",
          vehicleTypeId: "",
          imageUpdated: false,
          vehImages: [],
        });
        navigate("/drivers");
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
          <section className="space-y-4">
            <div>
              <BackButton />
            </div>
            <section className="grid grid-cols-12 gap-5">
              <form className="col-span-8 grid grid-cols-2 gap-x-20 gap-y-5 bg-white rounded-md p-8 relative min-h-[659.61px]">
                {loader ? (
                  <MiniLoader />
                ) : (
                  <>
                    <div className="col-span-2 flex items-center text-lg my-4">
                      <h3 className="font-medium text-2xl">Vehicle Info</h3>
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
                        type="text"
                        name="vehicleYear"
                        id="vehicleYear"
                        placeholder="Enter Vehicle's Year"
                        className={inputStyle}
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
                    <div className="flex items-center gap-x-4 min-h-[79.61px]">
                      <label className={labelStyle} htmlFor="imageUpdated">
                        Do you want to upload new Image,?
                      </label>
                      <input
                        value={vehicle.imageUpdated}
                        onChange={(e) =>
                          setVehicle({
                            ...vehicle,
                            imageUpdated: !vehicle.imageUpdated,
                          })
                        }
                        type="checkbox"
                        name="imageUpdated"
                        id="imageUpdated"
                      />
                    </div>
                    <div
                      className={`space-y-1 ${
                        vehicle.imageUpdated ? "visible" : "invisible"
                      }`}
                    >
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
                    <div className="col-span-2 flex justify-end items-center mt-20">
                      <button
                        type="submit"
                        onClick={vehicleFunc}
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
          </section>
        }
      />
    </>
  );
}
