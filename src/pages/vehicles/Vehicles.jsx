import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Select from "react-select";
import GetAPI from "../../utilities/GetAPI";
import { PostAPI } from "../../utilities/PostAPI";
import { PutAPI } from "../../utilities/PutAPI";
import MyDataTable from "../../components/MyDataTable";
import Loader, { MiniLoader } from "../../components/Loader";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../utilities/Toaster";
import AddButton, {
  DTDel,
  DTEdit,
  ModalButtons,
} from "../../utilities/Buttons";
import { inputStyle, labelStyle } from "../../utilities/Input";
import { BASE_URL2 } from "../../utilities/URL";
import Layout from "../../components/Layout";

export default function Vehicles() {
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const vehiclesFeatureId =
    featureData && featureData.find((ele) => ele.title === "Vehicle Types")?.id;
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(null);
  const { data, reFetch } = GetAPI("getallvehicle", vehiclesFeatureId);
  const unitType = GetAPI("unittypes", vehiclesFeatureId);
  const [loader, setLoader] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [addVehicle, setAddVehicle] = useState({
    title: "",
    image: "",
    baseRate: "",
    perUnitRate: "",
    weightCapacity: "",
    volumeCapacity: "",
    unitClassId: "",
  });
  const [updateVehicle, setUpdateVehicle] = useState({
    updateTitle: "",
    updateImage: "",
    updateBaseRate: "",
    updatePerUnitRate: "",
    updateWeightCapacity: "",
    updateVolumeCapacity: "",
    updateUnitClassId: "",
    vehicleId: "",
    uImage: false,
    currentImage: "",
  });
  const [addModal, setAddModal] = useState(false);
  const closeAddModal = () => {
    setAddModal(false);
    setAddVehicle({
      title: "",
      image: "",
      baseRate: "",
      perUnitRate: "",
      weightCapacity: "",
      volumeCapacity: "",
      unitClassId: "",
    });
  };
  const [updateModal, setUpdateModal] = useState(false);
  const closeUpdateModal = () => {
    setUpdateModal(false);
    setUpdateVehicle({
      updateTitle: "",
      updateImage: "",
      updateBaseRate: "",
      updatePerUnitRate: "",
      updateWeightCapacity: "",
      updateVolumeCapacity: "",
      updateUnitClassId: "",
      vehicleId: "",
      uImage: false,
      currentImage: "",
    });
  };
  const onChange = (e) => {
    setAddVehicle({ ...addVehicle, [e.target.name]: e.target.value });
  };
  const onChange2 = (e) => {
    setUpdateVehicle({ ...updateVehicle, [e.target.name]: e.target.value });
  };
  const addVehicleFunc = async (e) => {
    e.preventDefault();
    if (addVehicle.title === "") {
      info_toaster("Please enter your Vehicle's Title");
    } else if (addVehicle.baseRate === "") {
      info_toaster("Please enter your Vehicle's Base Rate");
    } else if (addVehicle.perUnitRate === "") {
      info_toaster("Please enter your Vehicle's Per Unit Rate");
    } else if (addVehicle.weightCapacity === "") {
      info_toaster("Please enter your Vehicle's Weight Capacity");
    } else if (addVehicle.volumeCapacity === "") {
      info_toaster("Please enter your Vehicle's Volume Capacity");
    } else if (addVehicle.unitClassId === "") {
      info_toaster("Please select your Vehicle's Unit Type");
    } else if (addVehicle.image === "") {
      info_toaster("Please enter your Vehicle's Image");
    } else {
      setLoader(true);
      const formData = new FormData();
      formData.append("title", addVehicle.title);
      formData.append("baseRate", addVehicle.baseRate);
      formData.append("perUnitRate", addVehicle.perUnitRate);
      formData.append("weightCapacity", addVehicle.weightCapacity);
      formData.append("volumeCapacity", addVehicle.volumeCapacity);
      formData.append("unitClassId", addVehicle.unitClassId.value);
      formData.append("image", addVehicle.image);
      let res = await PostAPI("addvehicle", vehiclesFeatureId, formData);
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setAddModal(false);
        setAddVehicle({
          title: "",
          image: "",
          baseRate: "",
          perUnitRate: "",
          weightCapacity: "",
          volumeCapacity: "",
          unitClassId: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const updateVehicleFunc = async (e) => {
    e.preventDefault();
    if (updateVehicle.updateTitle === "") {
      info_toaster("Please enter your Vehicle's Title");
    } else if (updateVehicle.updateBaseRate === "") {
      info_toaster("Please enter your Vehicle's Base Rate");
    } else if (updateVehicle.updatePerUnitRate === "") {
      info_toaster("Please enter your Vehicle's Per Unit Rate");
    } else if (updateVehicle.updateWeightCapacity === "") {
      info_toaster("Please enter your Vehicle's Weight Capacity");
    } else if (updateVehicle.updateVolumeCapacity === "") {
      info_toaster("Please enter your Vehicle's Volume Capacity");
    } else if (updateVehicle.updateUnitClassId === "") {
      info_toaster("Please select your Vehicle's Unit Type");
    } else if (updateVehicle.updateImage === "") {
      info_toaster("Please enter your Vehicle's Image");
    } else {
      setLoader(true);
      const formData = new FormData();
      formData.append("title", updateVehicle.updateTitle);
      formData.append("baseRate", updateVehicle.updateBaseRate);
      formData.append("perUnitRate", updateVehicle.updatePerUnitRate);
      formData.append("weightCapacity", updateVehicle.updateWeightCapacity);
      formData.append("volumeCapacity", updateVehicle.updateVolumeCapacity);
      formData.append("unitClassId", updateVehicle.updateUnitClassId.value);
      formData.append("image", updateVehicle.updateImage);
      formData.append("updateImage", updateVehicle.uImage);
      formData.append("vehicleId", updateVehicle.vehicleId);
      let res = await PutAPI("updatevehicle", vehiclesFeatureId, formData);
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setUpdateModal(false);
        setUpdateVehicle({
          updateTitle: "",
          updateImage: "",
          updateBaseRate: "",
          updatePerUnitRate: "",
          updateWeightCapacity: "",
          updateVolumeCapacity: "",
          updateUnitClassId: "",
          vehicleId: "",
          uImage: false,
          currentImage: "",
        });
      } else {
        setUpdateVehicle({ ...updateVehicle, uImage: false });
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const changeVehicleFunc = async (status, vehicleId) => {
    setDisabled(true);
    let res = await PutAPI("vehiclestatus", vehiclesFeatureId, {
      status: status,
      vehicleId: vehicleId,
    });
    if (res?.data?.status === "1") {
      reFetch();
      success_toaster(res?.data?.message);
      setDisabled(false);
    } else {
      error_toaster(res?.data?.message);
      setDisabled(false);
    }
  };
  const getVehicles = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.vehicleData?.filter(
            (veh) =>
              search === "" ||
              select === null ||
              ((veh?.title).toLowerCase().includes(search.toLowerCase()) &&
                select.value === "1") ||
              ((veh?.baseRate).toString().includes(search.toLowerCase()) &&
                select.value === "2") ||
              ((veh?.perUnitRate).toString().includes(search.toLowerCase()) &&
                select.value === "3") ||
              ((veh?.weightCapacity).toString().includes(search) &&
                select.value === "4") ||
              ((veh?.volumeCapacity).toString().includes(search) &&
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
    },
    {
      name: "Vehicle",
      selector: (row) => row.vehicle,
    },
    {
      name: "Image",
      selector: (row) => row.image,
    },
    {
      name: `Base Rate (${data?.data?.currencyUnit})`,
      selector: (row) => row.baseRate,
    },
    {
      name: `Base Rate/kilometers (${data?.data?.currencyUnit})`,
      selector: (row) => row.baseRateMile,
    },
    {
      name: "Weight Capacity",
      selector: (row) => row.weight,
    },
    {
      name: "Volume Capacity",
      selector: (row) => row.volume,
    },
  ];
  const options = [];
  unitType.data?.status === "1" &&
    unitType.data?.data?.map((unitType, index) =>
      options.push({
        value: unitType?.id,
        label: unitType?.title,
      })
    );
  const datas = [];
  getVehicles()?.map((veh, index) =>
    datas.push({
      id: index + 1,
      action: (
        <div className="flex gap-x-2">
          <DTEdit
            edit={() => {
              setUpdateModal(true);
              setUpdateVehicle({
                updateTitle: veh?.title,
                updateBaseRate: veh?.baseRate,
                updatePerUnitRate: veh?.perUnitRate,
                updateWeightCapacity: veh?.weightCapacity,
                updateVolumeCapacity: veh?.volumeCapacity,
                updateUnitClassId: {
                  value: veh?.weightUnitV?.unitClass?.id,
                  label: veh?.weightUnitV?.unitClass?.title,
                },
                vehicleId: veh?.id,
                currentImage: BASE_URL2 + veh?.image,
              });
            }}
          />
          <DTDel
            del={() => changeVehicleFunc(false, veh?.id)}
            disabled={disabled}
          />
        </div>
      ),
      vehicle: veh?.title,
      image: (
        <img
          src={BASE_URL2 + veh?.image}
          alt="vehicle"
          className="w-20 h-20 object-contain"
        />
      ),
      baseRate: veh?.baseRate,
      baseRateMile: veh?.perUnitRate,
      weight: veh?.weightCapacity + " " + veh?.weightUnitV?.symbol,
      volume: (
        <span>
          {veh?.volumeCapacity + " " + veh?.weightUnitV?.symbol}
          <sup>{3}</sup>
        </span>
      ),
    })
  );
  return data.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      search={true}
      value={search}
      onChange={(e) => setSearch(e.target.value.replace(/\+/g, ""))}
      options={[
        { value: "1", label: "Vehicle" },
        { value: "2", label: "Base Rate" },
        { value: "3", label: "Base Rate/mile" },
        { value: "4", label: "Weight Capacity" },
        { value: "5", label: "Volume Capacity" },
      ]}
      selectValue={select}
      selectOnChange={(e) => {
        setSelect(e);
        e === null && setSearch("");
      }}
      title="Vehicle Types"
      content={
        <>
          <Modal
            onClose={closeAddModal}
            isOpen={addModal}
            size="2xl"
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <form>
                <ModalHeader>
                  <h1 className="text-center">Add Vehicle</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-[446px]">
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 col-span-2">
                        <label className={labelStyle} htmlFor="title">
                          Vehicle Title
                        </label>
                        <input
                          value={addVehicle.title}
                          onChange={onChange}
                          type="text"
                          name="title"
                          id="title"
                          placeholder="Enter your Vehicle's Title"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="baseRate">
                          Base Rate
                        </label>
                        <input
                          value={addVehicle.baseRate}
                          onChange={onChange}
                          type="number"
                          name="baseRate"
                          id="baseRate"
                          placeholder="Enter your Vehicle's Base Rate"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="perUnitRate">
                          Per Unit Rate
                        </label>
                        <input
                          value={addVehicle.perUnitRate}
                          onChange={onChange}
                          type="number"
                          name="perUnitRate"
                          id="perUnitRate"
                          placeholder="Enter your Vehicle's Per Unit Rate"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="weightCapacity">
                          Weight Capacity
                        </label>
                        <input
                          value={addVehicle.weightCapacity}
                          onChange={onChange}
                          type="number"
                          name="weightCapacity"
                          id="weightCapacity"
                          placeholder="Enter your Vehicle's Weight Capacity"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="volumeCapacity">
                          Volume Capacity
                        </label>
                        <input
                          value={addVehicle.volumeCapacity}
                          onChange={onChange}
                          type="number"
                          name="volumeCapacity"
                          id="volumeCapacity"
                          placeholder="Enter your Vehicle's Volume Capacity"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className={labelStyle} htmlFor="unitClassId">
                          Unit Type
                        </label>
                        <Select
                          value={addVehicle.unitClassId}
                          onChange={(e) =>
                            setAddVehicle({ ...addVehicle, unitClassId: e })
                          }
                          options={options}
                          inputId="unitClassId"
                        />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className={labelStyle} htmlFor="image">
                          Vehicle Image
                        </label>
                        <input
                          onChange={(e) =>
                            setAddVehicle({
                              ...addVehicle,
                              [e.target.name]: e.target.files[0],
                            })
                          }
                          type="file"
                          name="image"
                          id="image"
                          className={inputStyle}
                        />
                      </div>
                    </div>
                  </ModalBody>
                )}
                <ModalFooter>
                  <ModalButtons
                    text="Add"
                    close={closeAddModal}
                    action={addVehicleFunc}
                  />
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <Modal
            onClose={closeUpdateModal}
            isOpen={updateModal}
            size="2xl"
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <form>
                <ModalHeader>
                  <h1 className="text-center">Update Vehicle</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div
                    className={updateVehicle.uImage ? "h-[658px]" : "h-[564px]"}
                  >
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 col-span-2">
                        <label className={labelStyle} htmlFor="updateTitle">
                          Vehicle Title
                        </label>
                        <input
                          value={updateVehicle.updateTitle}
                          onChange={onChange2}
                          type="text"
                          name="updateTitle"
                          id="updateTitle"
                          placeholder="Enter your Vehicle's Title"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateBaseRate">
                          Base Rate
                        </label>
                        <input
                          value={updateVehicle.updateBaseRate}
                          onChange={onChange2}
                          type="number"
                          name="updateBaseRate"
                          id="updateBaseRate"
                          placeholder="Enter your Vehicle's Base Rate"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          className={labelStyle}
                          htmlFor="updatePerUnitRate"
                        >
                          Per Unit Rate
                        </label>
                        <input
                          value={updateVehicle.updatePerUnitRate}
                          onChange={onChange2}
                          type="number"
                          name="updatePerUnitRate"
                          id="updatePerUnitRate"
                          placeholder="Enter your Vehicle's Per Unit Rate"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          className={labelStyle}
                          htmlFor="updateWeightCapacity"
                        >
                          Weight Capacity
                        </label>
                        <input
                          value={updateVehicle.updateWeightCapacity}
                          onChange={onChange2}
                          type="number"
                          name="updateWeightCapacity"
                          id="updateWeightCapacity"
                          placeholder="Enter your Vehicle's Weight Capacity"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          className={labelStyle}
                          htmlFor="updateVolumeCapacity"
                        >
                          Volume Capacity
                        </label>
                        <input
                          value={updateVehicle.updateVolumeCapacity}
                          onChange={onChange2}
                          type="number"
                          name="updateVolumeCapacity"
                          id="updateVolumeCapacity"
                          placeholder="Enter your Vehicle's Volume Capacity"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label
                          className={labelStyle}
                          htmlFor="updateUnitClassId"
                        >
                          Unit Type
                        </label>
                        <Select
                          value={updateVehicle.updateUnitClassId}
                          onChange={(e) =>
                            setUpdateVehicle({
                              ...updateVehicle,
                              updateUnitClassId: e,
                            })
                          }
                          options={options}
                          inputId="updateUnitClassId"
                        />
                      </div>
                      <div className="flex items-center gap-x-4 col-span-2">
                        <label className={labelStyle} htmlFor="uImage">
                          Do you want to upload new Image,?
                        </label>
                        <input
                          value={updateVehicle.uImage}
                          onChange={(e) =>
                            setUpdateVehicle({
                              ...updateVehicle,
                              uImage: !updateVehicle.uImage,
                            })
                          }
                          type="checkbox"
                          name="uImage"
                          id="uImage"
                        />
                      </div>
                      {updateVehicle.uImage && (
                        <div className="space-y-1 col-span-2">
                          <label className={labelStyle} htmlFor="updateImage">
                            Vehicle Image
                          </label>
                          <input
                            onChange={(e) =>
                              setUpdateVehicle({
                                ...updateVehicle,
                                [e.target.name]: e.target.files[0],
                              })
                            }
                            type="file"
                            name="updateImage"
                            id="updateImage"
                            className={inputStyle}
                          />
                        </div>
                      )}
                      <div className="col-span-2">
                        <img
                          src={updateVehicle.currentImage}
                          alt="Current"
                          className="block mx-auto w-1/2 h-40 object-contain rounded-md"
                        />
                      </div>
                    </div>
                  </ModalBody>
                )}
                <ModalFooter>
                  <ModalButtons
                    text="Update"
                    close={closeUpdateModal}
                    action={updateVehicleFunc}
                  />
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <section className="space-y-3">
            <div className="flex justify-end">
              <AddButton text="Vehicle" modal={setAddModal} />
            </div>
            <MyDataTable columns={columns} data={datas} dependancy={data} />
          </section>
        </>
      }
    />
  );
}
