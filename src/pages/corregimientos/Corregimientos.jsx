import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import Select from "react-select";
import GetAPI from "../../utilities/GetAPI";
import { PostAPI } from "../../utilities/PostAPI";
import { PutAPI } from "../../utilities/PutAPI";
import { active, block } from "../../utilities/CustomStyles";
import MyDataTable from "../../components/MyDataTable";
import Loader, { MiniLoader } from "../../components/Loader";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../utilities/Toaster";
import AddButton, { DTEdit, ModalButtons } from "../../utilities/Buttons";
import { inputStyle, labelStyle } from "../../utilities/Input";
import { BASE_URL } from "../../utilities/URL";
import Layout from "../../components/Layout";

export default function Corregimientos() {
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const corregimientosFeatureId =
    featureData &&
    featureData.find((ele) => ele.title === "Corregimientos")?.id;
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(null);
  const { data, reFetch } = GetAPI("getcorregimiento", corregimientosFeatureId);
  const province = GetAPI("getprovince", corregimientosFeatureId);
  const [loader, setLoader] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [addCorregimiento, setAddCorregimiento] = useState({
    title: "",
    value: "",
    districtId: "",
    provinceId: "",
  });
  const [updateCorregimiento, setUpdateCorregimiento] = useState({
    updateTitle: "",
    updateValue: "",
    updateProvinceId: "",
    updateDistrictId: "",
    corregimientoId: "",
  });
  const [addModal, setAddModal] = useState(false);
  const closeAddModal = () => {
    setAddModal(false);
    setDistrictRes([]);
    setAddCorregimiento({
      title: "",
      value: "",
      districtId: "",
      provinceId: "",
    });
  };
  const [updateModal, setUpdateModal] = useState(false);
  const closeUpdateModal = () => {
    setUpdateModal(false);
    setDistrictRes([]);
    setUpdateCorregimiento({
      updateTitle: "",
      updateValue: "",
      updateProvinceId: "",
      updateDistrictId: "",
      corregimientoId: "",
    });
  };
  const onChange = (e) => {
    setAddCorregimiento({
      ...addCorregimiento,
      [e.target.name]: e.target.value,
    });
  };
  const onChange2 = (e) => {
    setUpdateCorregimiento({
      ...updateCorregimiento,
      [e.target.name]: e.target.value,
    });
  };
  const addCorregimientoFunc = async (e) => {
    e.preventDefault();
    if (addCorregimiento.title === "") {
      info_toaster("Please enter your Corregimiento's Name");
    } else if (addCorregimiento.value === "") {
      info_toaster("Please enter your Corregimiento's Value");
    } else if (addCorregimiento.provinceId === "") {
      info_toaster("Please select your Province");
    } else if (addCorregimiento.districtId === "") {
      info_toaster("Please select your District");
    } else {
      setLoader(true);
      let res = await PostAPI("addcorregimiento", corregimientosFeatureId, {
        title: addCorregimiento.title,
        value: addCorregimiento.value,
        districtId: addCorregimiento.districtId.value,
        provinceId: addCorregimiento.provinceId.value,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setAddModal(false);
        setDistrictRes([]);
        setAddCorregimiento({
          title: "",
          value: "",
          districtId: "",
          provinceId: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const updateCorregimientoFunc = async (e) => {
    e.preventDefault();
    if (updateCorregimiento.updateTitle === "") {
      info_toaster("Please enter your Corregimiento's Name");
    } else if (updateCorregimiento.updateValue === "") {
      info_toaster("Please enter your Corregimiento's Value");
    } else if (updateCorregimiento.updateProvinceId === "") {
      info_toaster("Please select your Province");
    } else if (updateCorregimiento.updateDistrictId === "") {
      info_toaster("Please select your District");
    } else {
      setLoader(true);
      let res = await PutAPI("updatecorregimiento", corregimientosFeatureId, {
        title: updateCorregimiento.updateTitle,
        value: updateCorregimiento.updateValue,
        districtId: updateCorregimiento.updateDistrictId.value,
        provinceId: updateCorregimiento.updateProvinceId.value,
        corregimientoId: updateCorregimiento.corregimientoId,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setUpdateModal(false);
        setDistrictRes([]);
        setUpdateCorregimiento({
          updateTitle: "",
          updateValue: "",
          updateProvinceId: "",
          updateDistrictId: "",
          corregimientoId: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const deleteCorregimientoFunc = async (status, corregimientoId) => {
    setDisabled(true);
    let res = await PutAPI("deletecorregimiento", corregimientosFeatureId, {
      status: status,
      corregimientoId: corregimientoId,
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
  const provinceOptions = [];
  const districtOptions = [];
  const [districtRes, setDistrictRes] = useState([]);
  province.data?.data?.provinceData?.map((province, index) =>
    provinceOptions.push({
      value: province?.id,
      label: province?.title,
    })
  );
  const districtFunc = async (id) => {
    var config = {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    };
    try {
      axios
        .get(
          BASE_URL +
            `getdistrict?featureId=${corregimientosFeatureId}&id=${id}`,
          config
        )
        .then((dat) => {
          if (dat.data?.status === "1") {
            setDistrictRes(dat.data?.data?.districtData);
          } else {
            error_toaster(dat?.data?.message);
          }
        });
    } catch (err) {}
  };
  districtRes?.map((district, index) =>
    districtOptions.push({
      value: district?.id,
      label: district?.title,
    })
  );
  const getCorregimientos = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.filter(
            (cor) =>
              search === "" ||
              select === null ||
              ((cor?.title).toLowerCase().match(search.toLowerCase()) &&
                select.value === "1") ||
              ((cor?.key).toLowerCase().match(search.toLowerCase()) &&
                select.value === "2") ||
              ((cor?.nomenclature).toLowerCase().match(search.toLowerCase()) &&
                select.value === "3") ||
              (cor?.district?.title &&
                (cor?.district?.title)
                  .toLowerCase()
                  .match(search.toLowerCase()) &&
                select.value === "4")
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
      name: "Name",
      selector: (row) => row.title,
    },
    {
      name: "Key",
      selector: (row) => row.key,
    },
    {
      name: "Value",
      selector: (row) => row.value,
    },
    {
      name: "Nomenclature",
      selector: (row) => row.nomenclature,
    },
    {
      name: "District",
      selector: (row) => row.district,
    },
    {
      name: "Province",
      selector: (row) => row.province,
    },
    {
      name: "Status",
      selector: (row) => row.status,
    },
  ];
  const datas = [];
  getCorregimientos()?.map((cor, index) => {
    return datas.push({
      id: index + 1,
      action: (
        <div className="flex gap-x-2">
          <DTEdit
            edit={() => {
              setUpdateModal(true);
              districtFunc(cor?.district?.province?.id);
              setUpdateCorregimiento({
                updateTitle: cor?.title,
                updateValue: cor?.value,
                updateProvinceId: {
                  value: cor?.district?.province?.id,
                  label: cor?.district?.province?.title,
                },
                updateDistrictId: {
                  value: cor?.districtId,
                  label: cor?.district?.title,
                },
                corregimientoId: cor?.id,
              });
            }}
          />
        </div>
      ),
      title: cor?.title,
      key: cor?.key,
      value: cor?.value,
      nomenclature: cor?.nomenclature,
      district: cor?.district?.title,
      province: cor?.district?.province?.title,
      status: cor?.status ? (
        <button
          onClick={() => deleteCorregimientoFunc(false, cor?.id)}
          disabled={disabled}
          className={active}
        >
          Active
        </button>
      ) : (
        <button
          onClick={() => deleteCorregimientoFunc(true, cor?.id)}
          disabled={disabled}
          className={block}
        >
          Inactive
        </button>
      ),
    });
  });
  return data.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      search={true}
      value={search}
      onChange={(e) => setSearch(e.target.value.replace(/\+/g, ""))}
      options={[
        { value: "1", label: "Title" },
        { value: "2", label: "Key" },
        { value: "3", label: "Nomenclature" },
        { value: "4", label: "District" },
      ]}
      selectValue={select}
      selectOnChange={(e) => {
        setSelect(e);
        e === null && setSearch("");
      }}
      title="Corregimientos"
      content={
        <>
          <Modal onClose={closeAddModal} isOpen={addModal} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent>
              <form>
                <ModalHeader>
                  <h1 className="text-center">Add Corregimiento</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-[352px]">
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="title">
                          Corregimiento's Name
                        </label>
                        <input
                          value={addCorregimiento.title}
                          onChange={onChange}
                          type="text"
                          name="title"
                          id="title"
                          placeholder="Enter your Corregimiento's Name"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="value">
                          Value
                        </label>
                        <input
                          value={addCorregimiento.value}
                          onChange={onChange}
                          type="text"
                          name="value"
                          id="value"
                          placeholder="Enter your Corregimiento's Value"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="provinceId">
                          Province
                        </label>
                        <Select
                          value={addCorregimiento.provinceId}
                          onChange={(e) =>
                            setAddCorregimiento(
                              {
                                ...addCorregimiento,
                                provinceId: e,
                              },
                              districtFunc(e.value)
                            )
                          }
                          options={provinceOptions}
                          inputId="provinceId"
                          placeholder="Select Province"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="districtId">
                          District
                        </label>
                        <Select
                          value={addCorregimiento.districtId}
                          onChange={(e) =>
                            setAddCorregimiento({
                              ...addCorregimiento,
                              districtId: e,
                            })
                          }
                          options={districtOptions}
                          inputId="districtId"
                          placeholder="Select District"
                        />
                      </div>
                    </div>
                  </ModalBody>
                )}
                <ModalFooter>
                  <ModalButtons
                    text="Add"
                    close={closeAddModal}
                    action={addCorregimientoFunc}
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
                  <h1 className="text-center">Update Corregimiento</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-[352px]">
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateTitle">
                          Corregimiento's Name
                        </label>
                        <input
                          value={updateCorregimiento.updateTitle}
                          onChange={onChange2}
                          type="text"
                          name="updateTitle"
                          id="updateTitle"
                          placeholder="Enter your Corregimiento's Name"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateValue">
                          Value
                        </label>
                        <input
                          value={updateCorregimiento.updateValue}
                          onChange={onChange2}
                          type="text"
                          name="updateValue"
                          id="updateValue"
                          placeholder="Enter your Corregimiento's Value"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          className={labelStyle}
                          htmlFor="updateProvinceId"
                        >
                          Province
                        </label>
                        <Select
                          value={updateCorregimiento.updateProvinceId}
                          onChange={(e) =>
                            setUpdateCorregimiento(
                              {
                                ...updateCorregimiento,
                                updateProvinceId: e,
                                updateDistrictId: "",
                              },
                              districtFunc(e.value)
                            )
                          }
                          options={provinceOptions}
                          inputId="updateProvinceId"
                          placeholder="Select Province"
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          className={labelStyle}
                          htmlFor="updateDistrictId"
                        >
                          District
                        </label>
                        <Select
                          value={updateCorregimiento.updateDistrictId}
                          onChange={(e) =>
                            setUpdateCorregimiento({
                              ...updateCorregimiento,
                              updateDistrictId: e,
                            })
                          }
                          options={districtOptions}
                          inputId="updateDistrictId"
                          placeholder="Select District"
                        />
                      </div>
                    </div>
                  </ModalBody>
                )}
                <ModalFooter>
                  <ModalButtons
                    text="Update"
                    close={closeUpdateModal}
                    action={updateCorregimientoFunc}
                  />
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <section className="space-y-3">
            <div className="flex justify-end">
              <AddButton modal={setAddModal} text="Corregimiento" />
            </div>
            <MyDataTable columns={columns} data={datas} dependancy={data} />
          </section>
        </>
      }
    />
  );
}
