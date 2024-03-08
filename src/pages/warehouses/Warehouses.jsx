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
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import PhoneInput from "react-phone-input-2";
import { Link, useNavigate } from "react-router-dom";
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
import { DTDel, DTEdit, DTView, ModalButtons } from "../../utilities/Buttons";
import { inputStyle, labelStyle, style } from "../../utilities/Input";
import { BASE_URL } from "../../utilities/URL";
import Layout from "../../components/Layout";

export default function Warehouses() {
  const remover = (str) => {
    if (str[0] === "+") {
      var result = str.slice(1);
    } else {
      result = str;
    }
    return result;
  };
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const warehousesFeatureId =
    featureData && featureData.find((ele) => ele.title === "Warehouses")?.id;
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(null);
  const { data, reFetch } = GetAPI("allwarehouses", warehousesFeatureId);
  const [loader, setLoader] = useState(false);
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [address, setAddress] = useState([]);
  const [text, setText] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [updateWarehouse, setupdateWarehouse] = useState({
    email: "",
    name: "",
    countryCode: "507",
    phoneNum: "",
    addressDBSId: "",
    password: "",
    warehouseId: "",
    changePassword: false,
    newDBS: false,
  });
  const [updateModal, setUpdateModal] = useState(false);
  const closeUpdateModal = () => {
    setUpdateModal(false);
    setupdateWarehouse({
      email: "",
      name: "",
      countryCode: "92",
      phoneNum: "",
      addressDBSId: "",
      password: "",
      warehouseId: "",
      changePassword: false,
      newDBS: false,
    });
  };
  const [deleteModal, setDeleteModal] = useState(false);
  const closeDeleteModal = () => {
    setWarehouseId("");
    setDeleteModal(false);
  };
  const onChange = (e) => {
    setupdateWarehouse({ ...updateWarehouse, [e.target.name]: e.target.value });
  };
  const searchAddress = async () => {
    let res = await PostAPI("getaddresses", warehousesFeatureId, {
      text: text,
    });
    if (res?.data?.status === "1") {
      setAddress(res?.data?.data?.addresses);
    } else {
      error_toaster(res?.data?.message);
    }
  };
  const options = [];
  address?.map((dbs, index) =>
    options.push({
      value: dbs?.id,
      label: dbs?.postalCode + " " + dbs?.secondPostalCode,
    })
  );
  const updateWarehouseFunc = async (e) => {
    e.preventDefault();
    if (updateWarehouse.name === "") {
      info_toaster("Please enter Warehouse's Name");
    } else if (updateWarehouse.phoneNum === "") {
      info_toaster("Please enter Warehouse's Phone");
    } else if (updateWarehouse.email === "") {
      info_toaster("Please enter Warehouse's Email");
    } else if (updateWarehouse.password === "") {
      info_toaster("Please create Warehouse's Password");
    } else {
      setLoader(true);
      let res = updateWarehouse.newDBS
        ? await PutAPI("updatewarehouse", warehousesFeatureId, {
            email: updateWarehouse.email,
            name: updateWarehouse.name,
            countryCode: "+" + remover(updateWarehouse.countryCode),
            phoneNum: updateWarehouse.phoneNum,
            addressDBSId: updateWarehouse.addressDBSId.value,
            changePassword: updateWarehouse.changePassword,
            password: updateWarehouse.password,
            warehouseId: updateWarehouse.warehouseId,
          })
        : await PutAPI("updatewarehouse", warehousesFeatureId, {
            email: updateWarehouse.email,
            name: updateWarehouse.name,
            countryCode: "+" + remover(updateWarehouse.countryCode),
            phoneNum: updateWarehouse.phoneNum,
            changePassword: updateWarehouse.changePassword,
            password: updateWarehouse.password,
            warehouseId: updateWarehouse.warehouseId,
          });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setUpdateModal(false);
        setupdateWarehouse({
          email: "",
          name: "",
          countryCode: "92",
          phoneNum: "",
          addressDBSId: "",
          password: "",
          warehouseId: "",
          changePassword: false,
          newDBS: false,
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const deleteWarehouseFunc = async () => {
    setDisabled(true);
    let res = await PutAPI("deletewarehouse", warehousesFeatureId, {
      warehouseId: warehouseId,
    });
    if (res?.data?.status === "1") {
      reFetch();
      setWarehouseId("");
      setDeleteModal(false);
      success_toaster(res?.data?.message);
      setDisabled(false);
    } else {
      error_toaster(res?.data?.message);
      setDisabled(false);
    }
  };
  const warehouseDetailsFunc = async (id) => {
    setDisabled(true);
    var config = {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    };
    try {
      axios
        .get(
          BASE_URL +
            `warehousedetails?featureId=${warehousesFeatureId}&id=${id}`,
          config
        )
        .then((dat) => {
          if (dat.data?.status === "1") {
            navigate("/warehouse-details", {
              state: { wareDetails: dat?.data?.data },
            });
            info_toaster(dat?.data?.message);
          } else {
            error_toaster(dat?.data?.message);
          }
          setDisabled(false);
        });
    } catch (err) {
      setDisabled(false);
    }
  };
  const getWarehouses = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.filter(
            (ware) =>
              search === "" ||
              select === null ||
              ((ware?.name).toLowerCase().match(search.toLowerCase()) &&
                select.value === "1") ||
              ((ware?.email).toLowerCase().match(search.toLowerCase()) &&
                select.value === "2") ||
              ((ware?.countryCode + " " + ware?.phoneNum)
                .toString()
                .match(search) &&
                select.value === "3") ||
              ((ware?.countryCode + ware?.phoneNum).match(search) &&
                select.value === "3") ||
              ((
                (ware?.addressDB?.postalCode).toLowerCase() +
                " " +
                (ware?.addressDB?.secondPostalCode).toLowerCase()
              ).match(search.toLowerCase()) &&
                select.value === "4") ||
              ((
                (ware?.addressDB?.postalCode).toLowerCase() +
                (ware?.addressDB?.secondPostalCode).toLowerCase()
              ).match(search.toLowerCase()) &&
                select.value === "4") ||
              ((ware?.addressDB?.district?.title)
                .toLowerCase()
                .match(search.toLowerCase()) &&
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
      name: "Warehouse Name",
      selector: (row) => row.name,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Phone # ",
      selector: (row) => row.phone,
    },
    {
      name: "DBS #",
      selector: (row) => row.dbs,
    },
    {
      name: "City",
      selector: (row) => row.city,
    },
  ];
  const datas = [];
  getWarehouses()?.map((ware, index) => {
    return datas.push({
      id: index + 1,
      action: (
        <div className="flex gap-x-2">
          <DTView
            view={() => warehouseDetailsFunc(ware?.id)}
            disabled={disabled}
          />
          <DTEdit
            edit={() => {
              setUpdateModal(true);
              setupdateWarehouse({
                name: ware?.name,
                countryCode: ware?.countryCode,
                phoneNum: ware?.phoneNum,
                email: ware?.email,
                warehouseId: ware?.id,
              });
            }}
          />
          <DTDel
            del={() => {
              setWarehouseId(ware?.id);
              setDeleteModal(true);
            }}
            disabled={disabled}
          />
        </div>
      ),
      name: ware?.name,
      email: ware?.email,
      phone: ware?.countryCode + " " + ware?.phoneNum,
      dbs:
        ware?.addressDB?.postalCode + " " + ware?.addressDB?.secondPostalCode,
      city: ware?.addressDB?.district?.title,
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
        { value: "1", label: "Name" },
        { value: "2", label: "Email" },
        { value: "3", label: "Phone #" },
        { value: "4", label: "DBS #" },
        { value: "5", label: "City" },
      ]}
      selectValue={select}
      selectOnChange={(e) => {
        setSelect(e);
        e === null && setSearch("");
      }}
      title="Warehouses"
      content={
        <>
          <style>{style}</style>
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
                  <h1 className="text-center">Update Warehouse</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div
                    className={
                      updateWarehouse.changePassword && updateWarehouse.newDBS
                        ? "h-[504px]"
                        : updateWarehouse.changePassword ||
                          updateWarehouse.newDBS
                        ? "h-[416px]"
                        : "h-[328px]"
                    }
                  >
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="name">
                          Warehouse Name
                        </label>
                        <input
                          value={updateWarehouse.name}
                          onChange={onChange}
                          type="text"
                          name="name"
                          id="name"
                          placeholder="Enter your Warehouse's Name"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="email">
                          Warehouse Email
                        </label>
                        <input
                          value={updateWarehouse.email}
                          onChange={onChange}
                          type="email"
                          name="email"
                          id="email"
                          placeholder="Enter your Warehouse's Email"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="phoneNum">
                          Warehouse Phone
                        </label>
                        <div className="flex gap-x-1">
                          <PhoneInput
                            inputStyle={{
                              display: "block",
                              width: "88px",
                              paddingTop: "22px",
                              paddingBottom: "22px",
                              background: "#F4F5FA",
                              color: "black",
                              border: "none",
                            }}
                            inputProps={{ id: "code", name: "code" }}
                            value={updateWarehouse.countryCode}
                            onChange={(e) =>
                              setupdateWarehouse({
                                ...updateWarehouse,
                                countryCode: e,
                              })
                            }
                          />
                          <input
                            value={updateWarehouse.phoneNum}
                            onChange={onChange}
                            type="text"
                            name="phoneNum"
                            id="phoneNum"
                            placeholder="Enter your Warehouse's phoneNum"
                            className={inputStyle}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-x-4">
                          <label
                            className={labelStyle}
                            htmlFor="changePassword"
                          >
                            Do you want change Password,?
                          </label>
                          <input
                            value={updateWarehouse.changePassword}
                            onChange={() =>
                              setupdateWarehouse({
                                ...updateWarehouse,
                                changePassword: !updateWarehouse.changePassword,
                              })
                            }
                            type="checkbox"
                            name="changePassword"
                            id="changePassword"
                          />
                        </div>
                        <div className="flex items-center gap-x-4">
                          <label className={labelStyle} htmlFor="newDBS">
                            Do you want change Address,?
                          </label>
                          <input
                            value={updateWarehouse.newDBS}
                            onChange={() =>
                              setupdateWarehouse({
                                ...updateWarehouse,
                                newDBS: !updateWarehouse.newDBS,
                              })
                            }
                            type="checkbox"
                            name="newDBS"
                            id="newDBS"
                          />
                        </div>
                      </div>
                      {updateWarehouse.changePassword && (
                        <div className="space-y-1">
                          <label className={labelStyle} htmlFor="password">
                            Change Password
                          </label>
                          <div className="relative">
                            <button
                              onClick={() => setVisible(!visible)}
                              type="button"
                              className="text-black text-opacity-40 absolute right-4 top-1/2 -translate-y-1/2"
                            >
                              {visible ? (
                                <AiOutlineEye size={20} />
                              ) : (
                                <AiOutlineEyeInvisible size={20} />
                              )}
                            </button>
                            <input
                              value={updateWarehouse.password}
                              onChange={onChange}
                              type={visible ? "text" : "password"}
                              name="password"
                              id="password"
                              placeholder="Change your Password"
                              className={inputStyle}
                              autoComplete="off"
                            />
                          </div>
                        </div>
                      )}
                      {updateWarehouse.newDBS && (
                        <div className="space-y-1">
                          <label className={labelStyle} htmlFor="dbs">
                            DBS code of Warehouse
                          </label>
                          <Select
                            inputValue={text}
                            onInputChange={(text) => {
                              setText(text);
                              text === "" ? setAddress([]) : searchAddress();
                            }}
                            value={updateWarehouse.addressDBSId}
                            onChange={(e) =>
                              setupdateWarehouse({
                                ...updateWarehouse,
                                addressDBSId: e,
                              })
                            }
                            options={options}
                          />
                        </div>
                      )}
                    </div>
                  </ModalBody>
                )}
                <ModalFooter>
                  <ModalButtons
                    text="Update"
                    close={closeUpdateModal}
                    action={updateWarehouseFunc}
                  />
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <Modal
            onClose={closeDeleteModal}
            isOpen={deleteModal}
            size="xl"
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                <h1 className="text-center">Delete Warehouse</h1>
              </ModalHeader>
              <ModalBody>
                <p className="text-lg">
                  Are you sure, you want to delete Warehouse?
                </p>
              </ModalBody>
              <ModalFooter>
                <ModalButtons
                  text="Delete"
                  close={closeDeleteModal}
                  action={deleteWarehouseFunc}
                  disabled={disabled}
                />
              </ModalFooter>
            </ModalContent>
          </Modal>
          <section className="space-y-3">
            <div className="flex justify-end">
              <Link
                to={"/create-warehouse"}
                className="py-2.5 px-12 rounded bg-themePurple font-medium text-base text-white border border-themePurple hover:bg-transparent hover:text-themePurple"
              >
                Create Warehouse
              </Link>
            </div>
            <MyDataTable columns={columns} data={datas} dependancy={data} />
          </section>
        </>
      }
    />
  );
}
