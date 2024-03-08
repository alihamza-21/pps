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
  TabButton,
} from "../../utilities/Buttons";
import { inputStyle, labelStyle } from "../../utilities/Input";
import Layout from "../../components/Layout";

export default function ETA() {
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const etaFeatureId =
    featureData && featureData.find((ele) => ele.title === "ETA")?.id;
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(null);
  const [tab, setTab] = useState("Standard");
  const { data, reFetch } = GetAPI("getestbookingdays", etaFeatureId);
  const shipmentType = GetAPI("getactiveshipments", etaFeatureId);
  const [loader, setLoader] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [addETA, setAddETA] = useState({
    title: "",
    startValue: "",
    endValue: "",
    numOfDays: "",
    shipmentTypeId: "",
  });
  const [updateETA, setUpdateETA] = useState({
    updateTitle: "",
    updateStartValue: "",
    updateEndValue: "",
    updateNumOfDays: "",
    updateShipmentTypeId: "",
    estDaysId: "",
  });
  const [addModal, setAddModal] = useState(false);
  const closeAddModal = () => {
    setAddModal(false);
    setAddETA({
      title: "",
      startValue: "",
      endValue: "",
      numOfDays: "",
      shipmentTypeId: "",
    });
  };
  const [updateModal, setUpdateModal] = useState(false);
  const closeUpdateModal = () => {
    setUpdateModal(false);
    setUpdateETA({
      updateTitle: "",
      updateStartValue: "",
      updateEndValue: "",
      updateNumOfDays: "",
      updateShipmentTypeId: "",
      estDaysId: "",
    });
  };
  const onChange = (e) => {
    setAddETA({ ...addETA, [e.target.name]: e.target.value });
  };
  const onChange2 = (e) => {
    setUpdateETA({ ...updateETA, [e.target.name]: e.target.value });
  };
  const addETAFunc = async (e) => {
    e.preventDefault();
    if (addETA.title === "") {
      info_toaster("Please enter your ETA's Title");
    } else if (addETA.startValue === "") {
      info_toaster("Please enter your ETA's Minimum Range");
    } else if (addETA.endValue === "") {
      info_toaster("Please enter your ETA's Maximum Range");
    } else if (addETA.numOfDays === "") {
      info_toaster("Please enter Estimated Number of Days");
    } else if (addETA.shipmentTypeId === "") {
      info_toaster("Please select Shipment Type");
    } else {
      setLoader(true);
      let res = await PostAPI("addestdays", etaFeatureId, {
        title: addETA.title,
        startValue: addETA.startValue,
        endValue: addETA.endValue,
        numOfDays: addETA.numOfDays,
        shipmentTypeId: addETA.shipmentTypeId.value,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setAddModal(false);
        setAddETA({
          title: "",
          startValue: "",
          endValue: "",
          numOfDays: "",
          shipmentTypeId: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const updateETAFunc = async (e) => {
    e.preventDefault();
    if (updateETA.updateTitle === "") {
      info_toaster("Please enter your ETA's Title");
    } else if (updateETA.updateStartValue === "") {
      info_toaster("Please enter your ETA's Minimum Range");
    } else if (updateETA.updateEndValue === "") {
      info_toaster("Please enter your ETA's Maximum Range");
    } else if (updateETA.updateNumOfDays === "") {
      info_toaster("Please enter Estimated Number of Days");
    } else if (updateETA.updateShipmentTypeId === "") {
      info_toaster("Please select Shipment Type");
    } else {
      setLoader(true);
      let res = await PutAPI("updateestdays", etaFeatureId, {
        title: updateETA.updateTitle,
        startValue: updateETA.updateStartValue,
        endValue: updateETA.updateEndValue,
        numOfDays: updateETA.updateNumOfDays,
        shipmentTypeId: updateETA.updateShipmentTypeId.value,
        estDaysId: updateETA.estDaysId,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setUpdateModal(false);
        setUpdateETA({
          updateTitle: "",
          updateStartValue: "",
          updateEndValue: "",
          updateNumOfDays: "",
          updateShipmentTypeId: "",
          estDaysId: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const deleteETAFunc = async (estDaysId) => {
    setDisabled(true);
    let res = await PutAPI("deleteestdays", etaFeatureId, {
      estDaysId: estDaysId,
    });
    if (res?.data?.status === "1") {
      reFetch();
      info_toaster(res?.data?.message);
      setDisabled(false);
    } else {
      error_toaster(res?.data?.message);
      setDisabled(false);
    }
  };
  const stdETA = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.stdRanges?.filter(
            (eta) =>
              search === "" ||
              select === null ||
              ((eta?.title).toLowerCase().includes(search.toLowerCase()) &&
                select.value === "1") ||
              ((eta?.startValue).toString().includes(search) &&
                select.value === "2") ||
              ((eta?.endValue).toString().includes(search) &&
                select.value === "3") ||
              ((eta?.numOfDays).toString().includes(search) &&
                select.value === "4") ||
              ((eta?.unit).toLowerCase().includes(search.toLowerCase()) &&
                select.value === "5")
          )
        : [];
    return filteredArray;
  };
  const flashETA = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.FlashRanges?.filter(
            (cat) =>
              search === "" ||
              select === null ||
              ((cat?.title).toLowerCase().includes(search.toLowerCase()) &&
                select.value === "1") ||
              ((cat?.charge).toString().includes(search.toLowerCase()) &&
                select.value === "2")
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
      name: "Title",
      selector: (row) => row.title,
    },
    {
      name: "Min Value",
      selector: (row) => row.min,
    },
    {
      name: "Max Value",
      selector: (row) => row.max,
    },
    {
      name: "No. of Days",
      selector: (row) => row.days,
    },
    {
      name: "Unit",
      selector: (row) => row.unit,
    },
    {
      name: "Shipment Type",
      selector: (row) => row.shipment,
    },
  ];
  const options = [];
  shipmentType.data?.status === "1" &&
    shipmentType.data?.data?.map((shipmentType, index) =>
      options.push({
        value: shipmentType?.id,
        label: shipmentType?.title,
      })
    );
  const datas = [];
  if (tab === "Standard") {
    stdETA()?.map((eta, index) =>
      datas.push({
        id: index + 1,
        action: (
          <div className="flex gap-x-2">
            <DTEdit
              edit={() => {
                setUpdateModal(true);
                setUpdateETA({
                  updateTitle: eta?.title,
                  updateStartValue: eta?.startValue,
                  updateEndValue: eta?.endValue,
                  updateNumOfDays: eta?.numOfDays,
                  updateShipmentTypeId: {
                    label: eta?.shipmentType?.title,
                    value: eta?.shipmentTypeId,
                  },
                  estDaysId: eta?.id,
                });
              }}
            />
            <DTDel del={() => deleteETAFunc(eta?.id)} disabled={disabled} />
          </div>
        ),
        title: eta?.title,
        min: eta?.startValue,
        max: eta?.endValue,
        days: eta?.numOfDays,
        unit: eta?.unit,
        shipment: eta?.shipmentType?.title,
      })
    );
  } else if (tab === "Flash") {
    flashETA()?.map((eta, index) =>
      datas.push({
        id: index + 1,
        action: (
          <div className="flex gap-x-2">
            <DTEdit
              edit={() => {
                setUpdateModal(true);
                setUpdateETA({
                  updateTitle: eta?.title,
                  updateStartValue: eta?.startValue,
                  updateEndValue: eta?.endValue,
                  updateNumOfDays: eta?.numOfDays,
                  updateShipmentTypeId: {
                    label: eta?.shipmentType?.title,
                    value: eta?.shipmentTypeId,
                  },
                  estDaysId: eta?.id,
                });
              }}
            />
            <DTDel del={() => deleteETAFunc(eta?.id)} disabled={disabled} />
          </div>
        ),
        title: eta?.title,
        min: eta?.startValue,
        max: eta?.endValue,
        days: eta?.numOfDays,
        unit: eta?.unit,
        shipment: eta?.shipmentType?.title,
      })
    );
  }
  return data.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      search={true}
      value={search}
      onChange={(e) => setSearch(e.target.value.replace(/\+/g, ""))}
      options={[
        { value: "1", label: "Title" },
        { value: "2", label: "Min Value" },
        { value: "3", label: "Max Value" },
        { value: "4", label: "No. of Days" },
        { value: "5", label: "Unit" },
      ]}
      selectValue={select}
      selectOnChange={(e) => {
        setSelect(e);
        e === null && setSearch("");
      }}
      title="Estimated Days"
      content={
        <>
          <Modal onClose={closeAddModal} isOpen={addModal} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent>
              <form>
                <ModalHeader>
                  <h1 className="text-center">Add ETA</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-[440px]">
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="title">
                          Title
                        </label>
                        <input
                          value={addETA.title}
                          onChange={onChange}
                          type="text"
                          name="title"
                          id="title"
                          placeholder="Enter your ETA's Title"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="startValue">
                          Min Range
                        </label>
                        <input
                          value={addETA.startValue}
                          onChange={onChange}
                          type="number"
                          name="startValue"
                          id="startValue"
                          placeholder="Enter your ETA's Minimum Range"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="endValue">
                          Max Range
                        </label>
                        <input
                          value={addETA.endValue}
                          onChange={onChange}
                          type="number"
                          name="endValue"
                          id="endValue"
                          placeholder="Enter your ETA's Maximum Range"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="numOfDays">
                          No. of Days
                        </label>
                        <input
                          value={addETA.numOfDays}
                          onChange={onChange}
                          type="number"
                          name="numOfDays"
                          id="numOfDays"
                          placeholder="Enter Estimated Number of Days"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className={labelStyle} htmlFor="shipmentTypeId">
                          Shipment Type
                        </label>
                        <Select
                          value={addETA.shipmentTypeId}
                          onChange={(e) =>
                            setAddETA({ ...addETA, shipmentTypeId: e })
                          }
                          options={options}
                          inputId="shipmentTypeId"
                        />
                      </div>
                    </div>
                  </ModalBody>
                )}
                <ModalFooter>
                  <ModalButtons
                    text="Add"
                    close={closeAddModal}
                    action={addETAFunc}
                  />
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <Modal
            onClose={closeUpdateModal}
            isOpen={updateModal}
            size="xl"
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <form>
                <ModalHeader>
                  <h1 className="text-center">Update ETA</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-[440px]">
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateTitle">
                          Title
                        </label>
                        <input
                          value={updateETA.updateTitle}
                          onChange={onChange2}
                          type="text"
                          name="updateTitle"
                          id="updateTitle"
                          placeholder="Enter your ETA's Title"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          className={labelStyle}
                          htmlFor="updateStartValue"
                        >
                          Min Range
                        </label>
                        <input
                          value={updateETA.updateStartValue}
                          onChange={onChange2}
                          type="number"
                          name="updateStartValue"
                          id="updateStartValue"
                          placeholder="Enter your ETA's Minimum Range"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateEndValue">
                          Max Range
                        </label>
                        <input
                          value={updateETA.updateEndValue}
                          onChange={onChange2}
                          type="number"
                          name="updateEndValue"
                          id="updateEndValue"
                          placeholder="Enter your ETA's Maximum Range"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateNumOfDays">
                          No. of Days
                        </label>
                        <input
                          value={updateETA.updateNumOfDays}
                          onChange={onChange2}
                          type="number"
                          name="updateNumOfDays"
                          id="updateNumOfDays"
                          placeholder="Enter Estimated Number of Days"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label
                          className={labelStyle}
                          htmlFor="updateShipmentTypeId"
                        >
                          Shipment Type
                        </label>
                        <Select
                          value={updateETA.updateShipmentTypeId}
                          onChange={(e) =>
                            setUpdateETA({
                              ...updateETA,
                              updateShipmentTypeId: e,
                            })
                          }
                          options={options}
                          inputId="updateShipmentTypeId"
                        />
                      </div>
                    </div>
                  </ModalBody>
                )}
                <ModalFooter>
                  <ModalButtons
                    text="Update"
                    close={closeUpdateModal}
                    action={updateETAFunc}
                  />
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <section className="space-y-8">
            <div className="flex">
              <TabButton text="Standard" set={setTab} tab={tab} width="w-40" />
              <TabButton text="Flash" set={setTab} tab={tab} width="w-40" />
            </div>
            <div className="flex justify-end">
              <AddButton text="ETA" modal={setAddModal} />
            </div>
            <MyDataTable columns={columns} data={datas} dependancy={data} />
          </section>
        </>
      }
    />
  );
}
