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
import Layout from "../../components/Layout";

export default function Districts() {
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const districtsFeatureId =
    featureData && featureData.find((ele) => ele.title === "Districts")?.id;
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(null);
  const { data, reFetch } = GetAPI("getdistricts", districtsFeatureId);
  const province = GetAPI("activeprovinces", districtsFeatureId);
  const [loader, setLoader] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [addDistrict, setAddDistrict] = useState({
    title: "",
    provinceId: "",
    key: "",
  });
  const [updateDistrict, setUpdateDistrict] = useState({
    updateTitle: "",
    updateProvinceId: "",
    updateKey: "",
    districtId: "",
  });
  const [addModal, setAddModal] = useState(false);
  const closeAddModal = () => {
    setAddModal(false);
    setAddDistrict({
      title: "",
      provinceId: "",
      key: "",
    });
  };
  const [updateModal, setUpdateModal] = useState(false);
  const closeUpdateModal = () => {
    setUpdateModal(false);
    setUpdateDistrict({
      updateTitle: "",
      updateProvinceId: "",
      updateKey: "",
      districtId: "",
    });
  };
  const onChange = (e) => {
    setAddDistrict({ ...addDistrict, [e.target.name]: e.target.value });
  };
  const onChange2 = (e) => {
    setUpdateDistrict({ ...updateDistrict, [e.target.name]: e.target.value });
  };
  const addDistrictFunc = async (e) => {
    e.preventDefault();
    if (addDistrict.title === "") {
      info_toaster("Please enter your District's Title");
    } else if (addDistrict.key === "") {
      info_toaster("Please enter your District's id");
    } else if (addDistrict.provinceId === "") {
      info_toaster("Please select your Province");
    } else {
      setLoader(true);
      let res = await PostAPI("adddistrict", districtsFeatureId, {
        title: addDistrict.title,
        provinceId: addDistrict.provinceId.value,
        key: addDistrict.key,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setAddModal(false);
        setAddDistrict({
          title: "",
          provinceId: "",
          key: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const updateDistrictFunc = async (e) => {
    e.preventDefault();
    if (updateDistrict.updateTitle === "") {
      info_toaster("Please enter your District's Name");
    } else if (updateDistrict.updateKey === "") {
      info_toaster("Please enter your District's id");
    } else if (updateDistrict.provinceId === "") {
      info_toaster("Please select your Province");
    } else {
      setLoader(true);
      let res = await PutAPI("updatedistrict", districtsFeatureId, {
        title: updateDistrict.updateTitle,
        provinceId: updateDistrict.updateProvinceId.value,
        key: updateDistrict?.updateKey,
        districtId: updateDistrict.districtId,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setUpdateModal(false);
        setUpdateDistrict({
          updateTitle: "",
          updateProvinceId: "",
          updateKey: "",
          districtId: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const deleteDistrictFunc = async (status, districtId) => {
    setDisabled(true);
    let res = await PutAPI("deletedistrict", districtsFeatureId, {
      status: status,
      districtId: districtId,
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
  const options = [];
  province.data?.status === "1" &&
    province.data?.data?.map((province, index) =>
      options.push({
        value: province?.id,
        label: province?.title,
      })
    );
  const getDistricts = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.filter(
            (dis) =>
              search === "" ||
              select === null ||
              ((dis?.title).toLowerCase().match(search.toLowerCase()) &&
                select.value === "1") ||
              (dis?.province?.title &&
                (dis?.province?.title)
                  .toLowerCase()
                  .match(search.toLowerCase()) &&
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
      name: "District's Name",
      selector: (row) => row.title,
    },
    {
      name: "Province",
      selector: (row) => row.province,
    },
    {
      name: "District Id",
      selector: (row) => row.key,
    },
    {
      name: "Status",
      selector: (row) => row.status,
    },
  ];
  const datas = [];
  getDistricts()?.map((dis, index) => {
    return datas.push({
      id: index + 1,
      action: (
        <div className="flex gap-x-2">
          <DTEdit
            edit={() => {
              setUpdateModal(true);
              setUpdateDistrict({
                updateTitle: dis?.title,
                updateProvinceId: {
                  value: dis?.provinceId,
                  label: dis?.province?.title,
                },
                updateKey: dis?.key,
                districtId: dis?.id,
              });
            }}
          />
        </div>
      ),
      title: dis?.title,
      province: dis?.province?.title,
      key: dis?.key,
      status: dis?.status ? (
        <button
          onClick={() => deleteDistrictFunc(false, dis?.id)}
          disabled={disabled}
          className={active}
        >
          Active
        </button>
      ) : (
        <button
          onClick={() => deleteDistrictFunc(true, dis?.id)}
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
        { value: "2", label: "Province" },
      ]}
      selectValue={select}
      selectOnChange={(e) => {
        setSelect(e);
        e === null && setSearch("");
      }}
      title="Districts"
      content={
        <>
          <Modal onClose={closeAddModal} isOpen={addModal} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent>
              <form>
                <ModalHeader>
                  <h1 className="text-center">Add District</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-[264px]">
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="title">
                          District Name
                        </label>
                        <input
                          value={addDistrict.title}
                          onChange={onChange}
                          type="text"
                          name="title"
                          id="title"
                          placeholder="Enter your District's Name"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="key">
                          District Id
                        </label>
                        <input
                          value={addDistrict.key}
                          onChange={onChange}
                          type="text"
                          name="key"
                          id="key"
                          placeholder="Enter your District's Key"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="provinceId">
                          Province
                        </label>
                        <Select
                          value={addDistrict.provinceId}
                          onChange={(e) =>
                            setAddDistrict({ ...addDistrict, provinceId: e })
                          }
                          options={options}
                          inputId="provinceId"
                        />
                      </div>
                    </div>
                  </ModalBody>
                )}
                <ModalFooter>
                  <ModalButtons
                    text="Add"
                    close={closeAddModal}
                    action={addDistrictFunc}
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
                  <h1 className="text-center">Update District</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-[264px]">
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
                          value={updateDistrict.updateTitle}
                          onChange={onChange2}
                          type="text"
                          name="updateTitle"
                          id="updateTitle"
                          placeholder="Enter your Province's Title"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateKey">
                          District Id
                        </label>
                        <input
                          value={updateDistrict.updateKey}
                          onChange={onChange2}
                          type="text"
                          name="updateKey"
                          id="updateKey"
                          placeholder="Enter your District's Key"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="provinceId">
                          Province
                        </label>
                        <Select
                          value={updateDistrict.updateProvinceId}
                          onChange={(e) =>
                            setUpdateDistrict({
                              ...updateDistrict,
                              updateProvinceId: e,
                            })
                          }
                          options={options}
                          inputId="updateProvinceId"
                        />
                      </div>
                    </div>
                  </ModalBody>
                )}
                <ModalFooter>
                  <ModalButtons
                    text="Update"
                    close={closeUpdateModal}
                    action={updateDistrictFunc}
                  />
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <section className="space-y-3">
            <div className="flex justify-end">
              <AddButton modal={setAddModal} text="District" />
            </div>
            <MyDataTable columns={columns} data={datas} dependancy={data} />
          </section>
        </>
      }
    />
  );
}
