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

export default function Units() {
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const unitsFeatureId =
    featureData && featureData.find((ele) => ele.title === "Unit System")?.id;
  const [tab, setTab] = useState("Reference");
  const { data, reFetch } = GetAPI("allunits", unitsFeatureId);
  const unitType = GetAPI("unittypes", unitsFeatureId);
  const [loader, setLoader] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [addUnit, setAddUnit] = useState({
    name: "",
    symbol: "",
    type: "",
    conversionRate: "",
    unitClassId: "",
  });
  const [updateUnit, setUpdateUnit] = useState({
    updateConversionRate: "",
    unitId: "",
  });
  const [addModal, setAddModal] = useState(false);
  const closeAddModal = () => {
    setAddModal(false);
    setAddUnit({
      name: "",
      symbol: "",
      type: "",
      conversionRate: "",
      unitClassId: "",
    });
  };
  const [updateModal, setUpdateModal] = useState(false);
  const closeUpdateModal = () => {
    setUpdateModal(false);
    setUpdateUnit({
      updateConversionRate: "",
      unitId: "",
    });
  };
  const onChange = (e) => {
    setAddUnit({ ...addUnit, [e.target.name]: e.target.value });
  };
  const addUnitFunc = async (e) => {
    e.preventDefault();
    if (addUnit.name === "") {
      info_toaster("Please enter your Unit's Name");
    } else if (addUnit.symbol === "") {
      info_toaster("Please enter your Unit's Symbol");
    } else if (addUnit.type === "") {
      info_toaster("Please enter your Unit's Type");
    } else if (addUnit.conversionRate === "") {
      info_toaster("Please enter your Unit's Conversion Rate");
    } else if (addUnit.unitClassId === "") {
      info_toaster("Please select your Unit's Class");
    } else {
      setLoader(true);
      let res = await PostAPI("addunit", unitsFeatureId, {
        name: addUnit.name,
        symbol: addUnit.symbol,
        type: addUnit.type,
        conversionRate: addUnit.conversionRate,
        unitClassId: addUnit.unitClassId.value,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setAddModal(false);
        setAddUnit({
          name: "",
          symbol: "",
          type: "",
          conversionRate: "",
          unitClassId: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const updateUnitFunc = async (e) => {
    e.preventDefault();
    if (updateUnit.updateConversionRate === "") {
      info_toaster("Please enter your Unit's Conversion Rate");
    } else {
      setLoader(true);
      let res = await PutAPI("updateunit", unitsFeatureId, {
        conversionRate: updateUnit.updateConversionRate,
        unitId: updateUnit.unitId,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setUpdateModal(false);
        setUpdateUnit({
          updateConversionRate: "",
          unitId: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const changeUnitFunc = async (status, unitId) => {
    setDisabled(true);
    let res = await PutAPI("changeunitstatus", unitsFeatureId, {
      status: status,
      unitId: unitId,
    });
    if (res?.data?.status === "1") {
      reFetch();
      success_toaster(res?.data?.message);
      setDisabled(false);
    } else {
      info_toaster(res?.data?.message);
      setDisabled(false);
    }
  };
  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
    },
    tab === "Custom" && {
      name: "Action",
      selector: (row) => row.action,
    },
    {
      name: "Unit Name",
      selector: (row) => row.name,
    },
    {
      name: "Unit Symbol",
      selector: (row) => row.symbol,
    },
    {
      name: "Unit Type",
      selector: (row) => row.type,
    },
    {
      name: "Conversion Rate",
      selector: (row) => row.conversion,
    },
  ];
  const refUnits = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.refernceUnits?.filter((unit) => unit)
        : [];
    return filteredArray;
  };
  const cusUnits = () => {
    const filteredArray =
      data?.status === "1" ? data?.data?.unitData?.filter((unit) => unit) : [];
    return filteredArray;
  };
  const options = [];
  unitType.data?.status === "1" &&
    unitType.data?.data?.map((unitType, index) =>
      options.push({
        value: unitType?.id,
        label: unitType?.title,
      })
    );
  const datas = [];
  if (tab === "Reference") {
    refUnits()?.map((unit, key) =>
      unit?.units?.map((unit, index) =>
        datas.push({
          id: key + index + 1,
          name: unit?.name,
          symbol: unit?.symbol,
          type: unit?.type,
          conversion: unit?.conversionRate,
        })
      )
    );
  } else if (tab === "Custom") {
    cusUnits()?.map((units, key) =>
      units?.units?.map((unit, index) =>
        datas.push({
          id: key + index + 1,
          action: (
            <div className="flex gap-x-2">
              <DTEdit
                edit={() => {
                  setUpdateModal(true);
                  setUpdateUnit({
                    updateConversionRate: unit?.conversionRate,
                    unitId: unit?.id,
                  });
                }}
              />
              <DTDel
                del={() => changeUnitFunc(false, unit?.id)}
                disabled={disabled}
              />
            </div>
          ),
          name: unit?.name,
          symbol: unit?.symbol,
          type: unit?.type,
          conversion: unit?.conversionRate,
        })
      )
    );
  }
  return data.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      title="Unit System"
      content={
        <>
          <Modal onClose={closeAddModal} isOpen={addModal} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent>
              <form>
                <ModalHeader>
                  <h1 className="text-center">Add Unit</h1>
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
                        <label className={labelStyle} htmlFor="name">
                          Unit Name
                        </label>
                        <input
                          value={addUnit.name}
                          onChange={onChange}
                          type="text"
                          name="name"
                          id="name"
                          placeholder="Enter your Unit's Name"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="symbol">
                          Unit Symbol
                        </label>
                        <input
                          value={addUnit.symbol}
                          onChange={onChange}
                          type="text"
                          name="symbol"
                          id="symbol"
                          placeholder="Enter your Unit's Symbol"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="type">
                          Unit Type
                        </label>
                        <input
                          value={addUnit.type}
                          onChange={onChange}
                          type="text"
                          name="type"
                          id="type"
                          placeholder="Enter your Unit's Type"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="conversionRate">
                          Conversion Rate
                        </label>
                        <input
                          value={addUnit.conversionRate}
                          onChange={onChange}
                          type="number"
                          name="conversionRate"
                          id="conversionRate"
                          placeholder="Enter your Unit's Conversion Rate"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className={labelStyle} htmlFor="unitClassId">
                          Unit Class
                        </label>
                        <Select
                          value={addUnit.unitClassId}
                          onChange={(e) =>
                            setAddUnit({ ...addUnit, unitClassId: e })
                          }
                          options={options}
                          inputId="unitClassId"
                        />
                      </div>
                    </div>
                  </ModalBody>
                )}
                <ModalFooter>
                  <ModalButtons
                    text="Add"
                    close={closeAddModal}
                    action={addUnitFunc}
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
                  <h1 className="text-center">Update Unit</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-[176px]">
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="h-40 pt-5">
                      <label
                        className={labelStyle}
                        htmlFor="updateConversionRate"
                      >
                        Conversion Rate
                      </label>
                      <input
                        value={updateUnit.updateConversionRate}
                        onChange={(e) =>
                          setUpdateUnit({
                            ...updateUnit,
                            [e.target.name]: e.target.value,
                          })
                        }
                        type="number"
                        name="updateConversionRate"
                        id="updateConversionRate"
                        placeholder="Enter your Unit's Conversion Rate"
                        className={inputStyle}
                      />
                    </div>
                  </ModalBody>
                )}
                <ModalFooter>
                  <ModalButtons
                    text="Update"
                    close={closeUpdateModal}
                    action={updateUnitFunc}
                  />
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <section className="space-y-8">
            <div className="flex">
              <TabButton text="Reference" set={setTab} tab={tab} width="w-40" />
              <TabButton text="Custom" set={setTab} tab={tab} width="w-40" />
            </div>
            <div className="flex justify-end">
              <AddButton text="Unit" modal={setAddModal} />
            </div>
            <MyDataTable columns={columns} data={datas} dependancy={data} />
          </section>
        </>
      }
    />
  );
}
