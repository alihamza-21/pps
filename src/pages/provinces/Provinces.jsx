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

export default function Provinces() {
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const provincesFeatureId =
    featureData && featureData.find((ele) => ele.title === "Provinces")?.id;
  const { data, reFetch } = GetAPI("getprovinces", provincesFeatureId);
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(null);
  const [loader, setLoader] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [addProvince, setAddProvince] = useState({
    title: "",
    key: "",
  });
  const [updateProvince, setUpdateProvince] = useState({
    updateTitle: "",
    updateKey: "",
    provinceId: "",
  });
  const [addModal, setAddModal] = useState(false);
  const closeAddModal = () => {
    setAddModal(false);
    setAddProvince({
      title: "",
      key: "",
    });
  };
  const [updateModal, setUpdateModal] = useState(false);
  const closeUpdateModal = () => {
    setUpdateModal(false);
    setUpdateProvince({
      updateTitle: "",
      updateKey: "",
      provinceId: "",
    });
  };
  const onChange = (e) => {
    setAddProvince({ ...addProvince, [e.target.name]: e.target.value });
  };
  const onChange2 = (e) => {
    setUpdateProvince({ ...updateProvince, [e.target.name]: e.target.value });
  };
  const addProvinceFunc = async (e) => {
    e.preventDefault();
    if (addProvince.title === "") {
      info_toaster("Please enter your Province's Title");
    } else if (addProvince.key === "") {
      info_toaster("Please enter your Province's Image");
    } else {
      setLoader(true);
      let res = await PostAPI("addprovince", provincesFeatureId, {
        title: addProvince.title,
        key: addProvince.key,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setAddModal(false);
        setAddProvince({
          title: "",
          key: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const updateProvinceFunc = async (e) => {
    e.preventDefault();
    if (updateProvince.updateTitle === "") {
      info_toaster("Please enter your Province's Title");
    } else if (updateProvince.updateKey === "") {
      info_toaster("Please enter your Province's Image");
    } else {
      setLoader(true);
      let res = await PutAPI("updateprovince", provincesFeatureId, {
        title: updateProvince.updateTitle,
        key: updateProvince.updateKey,
        provinceId: updateProvince.provinceId,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setUpdateModal(false);
        setUpdateProvince({
          updateTitle: "",
          updateKey: "",
          provinceId: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const deleteProvinceFunc = async (status, provinceId) => {
    setDisabled(true);
    let res = await PutAPI("deleteprovince", provincesFeatureId, {
      status: status,
      provinceId: provinceId,
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
  const getProvinces = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.filter(
            (pro) =>
              search === "" ||
              select === null ||
              ((pro?.title).toLowerCase().match(search.toLowerCase()) &&
                select.value === "1") ||
              ((pro?.key).toLowerCase().match(search.toLowerCase()) &&
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
      name: "Key",
      selector: (row) => row.key,
    },
    {
      name: "Status",
      selector: (row) => row.status,
    },
  ];
  const datas = [];
  getProvinces()?.map((pro, index) => {
    return datas.push({
      id: index + 1,
      action: (
        <div className="flex gap-x-2">
          <DTEdit
            edit={() => {
              setUpdateModal(true);
              setUpdateProvince({
                updateTitle: pro?.title,
                updateKey: pro?.key,
                provinceId: pro?.id,
              });
            }}
          />
        </div>
      ),
      title: pro?.title,
      key: pro?.key,
      status: pro?.status ? (
        <button
          onClick={() => deleteProvinceFunc(false, pro?.id)}
          disabled={disabled}
          className={active}
        >
          Active
        </button>
      ) : (
        <button
          onClick={() => deleteProvinceFunc(true, pro?.id)}
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
      ]}
      selectValue={select}
      selectOnChange={(e) => {
        setSelect(e);
        e === null && setSearch("");
      }}
      title="Provinces"
      content={
        <>
          <Modal onClose={closeAddModal} isOpen={addModal} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent>
              <form>
                <ModalHeader>
                  <h1 className="text-center">Add Province</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-44">
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
                          value={addProvince.title}
                          onChange={onChange}
                          type="text"
                          name="title"
                          id="title"
                          placeholder="Enter your Province's Title"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="key">
                          Key
                        </label>
                        <input
                          value={addProvince.key}
                          onChange={onChange}
                          type="text"
                          name="key"
                          id="key"
                          placeholder="Enter your Province's Key"
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
                    action={addProvinceFunc}
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
                  <h1 className="text-center">Update Province</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-44">
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
                          value={updateProvince.updateTitle}
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
                          Key
                        </label>
                        <input
                          value={updateProvince.updateKey}
                          onChange={onChange2}
                          type="text"
                          name="updateKey"
                          id="updateKey"
                          placeholder="Enter your Province's Key"
                          className={inputStyle}
                        />
                      </div>
                    </div>
                  </ModalBody>
                )}
                <ModalFooter>
                  <ModalButtons
                    text="Update"
                    close={closeUpdateModal}
                    action={updateProvinceFunc}
                  />
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <section className="space-y-3">
            <div className="flex justify-end">
              <AddButton modal={setAddModal} text="Province" />
            </div>
            <MyDataTable columns={columns} data={datas} dependancy={data} />
          </section>
        </>
      }
    />
  );
}
