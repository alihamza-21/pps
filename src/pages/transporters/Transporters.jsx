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
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import PhoneInput from "react-phone-input-2";
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
import { inputStyle, labelStyle, style } from "../../utilities/Input";
import { BASE_URL2 } from "../../utilities/URL";
import Layout from "../../components/Layout";
import isValidEmail from "../../utilities/MailCheck";

export default function Transporters() {
  const remover = (str) => {
    if (str[0] === "+") {
      var result = str.slice(1);
    } else {
      result = str;
    }
    return result;
  };
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const transportersFeatureId =
    featureData && featureData.find((ele) => ele.title === "Transporters")?.id;
  const { data, reFetch } = GetAPI("gettransporterguys", transportersFeatureId);
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(null);
  const [loader, setLoader] = useState(false);
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [addTransporter, setAddTransporter] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "507",
    phoneNum: "",
    password: "",
    profileImage: "",
  });
  const [updateTransporter, setUpdateTransporter] = useState({
    updateFirstName: "",
    updateLastName: "",
    updateEmail: "",
    updateCountryCode: "",
    updatePhoneNum: "",
    updatePassword: "",
    updateProfileImage: "",
    imageUpdate: false,
    passwordUpdate: false,
    transporterId: "",
    currentImage: "",
  });
  const [addModal, setAddModal] = useState(false);
  const closeAddModal = () => {
    setAddModal(false);
    setAddTransporter({
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "",
      phoneNum: "",
      password: "",
      profileImage: "",
    });
  };
  const [updateModal, setUpdateModal] = useState(false);
  const closeUpdateModal = () => {
    setUpdateModal(false);
    setUpdateTransporter({
      updateFirstName: "",
      updateLastName: "",
      updateEmail: "",
      updateCountryCode: "",
      updatePhoneNum: "",
      updatePassword: "",
      updateProfileImage: "",
      imageUpdate: false,
      passwordUpdate: false,
      transporterId: "",
      currentImage: "",
    });
  };
  const onChange = (e) => {
    setAddTransporter({ ...addTransporter, [e.target.name]: e.target.value });
  };
  const onChange2 = (e) => {
    setUpdateTransporter({
      ...updateTransporter,
      [e.target.name]: e.target.value,
    });
  };
  const addTransporterFunc = async (e) => {
    e.preventDefault();
    if (addTransporter.firstName === "") {
      info_toaster("Please enter Transporter's First Name");
    } else if (addTransporter.lastName === "") {
      info_toaster("Please enter Transporter's Last Name");
    } else if (addTransporter.email === "") {
      info_toaster("Please enter Transporter's Email");
    } else if (!isValidEmail(addTransporter.email)) {
      info_toaster("Please enter a valid email");
    } else if (addTransporter.phoneNum === "") {
      info_toaster("Please enter Transporter's Phone Number");
    } else if (addTransporter.password === "") {
      info_toaster("Please set Transporter's Password");
    } else if (addTransporter.profileImage === "") {
      info_toaster("Please enter Transporter's Profile Image");
    } else {
      setLoader(true);
      const formData = new FormData();
      formData.append("firstName", addTransporter.firstName);
      formData.append("lastName", addTransporter.lastName);
      formData.append("email", addTransporter.email);
      formData.append("countryCode", "+" + addTransporter.countryCode);
      formData.append("phoneNum", addTransporter.phoneNum);
      formData.append("password", addTransporter.password);
      formData.append("profileImage", addTransporter.profileImage);
      let res = await PostAPI(
        "addtransporter",
        transportersFeatureId,
        formData
      );
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setAddModal(false);
        setAddTransporter({
          firstName: "",
          lastName: "",
          email: "",
          countryCode: "",
          phoneNum: "",
          password: "",
          profileImage: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const updateTransporterFunc = async (e) => {
    e.preventDefault();
    if (updateTransporter.updateFirstName === "") {
      info_toaster("Please enter Transporter's First Name");
    } else if (updateTransporter.updateLastName === "") {
      info_toaster("Please enter Transporter's Last Name");
    } else if (updateTransporter.updateEmail === "") {
      info_toaster("Please enter Transporter's Email");
    } else if (!isValidEmail(updateTransporter.updateEmail)) {
      info_toaster("Please enter a valid email");
    } else if (updateTransporter.updatePhoneNum === "") {
      info_toaster("Please enter Transporter's Phone Number");
    } else {
      setLoader(true);
      const formData = new FormData();
      formData.append("firstName", updateTransporter.updateFirstName);
      formData.append("lastName", updateTransporter.updateLastName);
      formData.append("email", updateTransporter.updateEmail);
      formData.append(
        "countryCode",
        "+" + remover(updateTransporter.updateCountryCode)
      );
      formData.append("phoneNum", updateTransporter.updatePhoneNum);
      formData.append("password", updateTransporter.updatePassword);
      formData.append("profileImage", updateTransporter.updateProfileImage);
      formData.append("imageUpdate", updateTransporter.imageUpdate);
      formData.append("transporterId", updateTransporter.transporterId);
      let res = await PutAPI(
        "updatetransporter",
        transportersFeatureId,
        formData
      );
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setUpdateModal(false);
        setUpdateTransporter({
          updateFirstName: "",
          updateLastName: "",
          updateEmail: "",
          updateCountryCode: "",
          updatePhoneNum: "",
          updatePassword: "",
          updateProfileImage: "",
          imageUpdate: false,
          passwordUpdate: false,
          transporterId: "",
          currentImage: "",
        });
      } else {
        setUpdateTransporter({ ...updateTransporter, imageUpdate: false });
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const delTransporterFunc = async (transporterId) => {
    setDisabled(true);
    let res = await PutAPI("deletetransporter", transportersFeatureId, {
      transporterId: transporterId,
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
  const getTransporters = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.filter(
            (tran) =>
              search === "" ||
              select === null ||
              ((
                (tran?.firstName).toLowerCase() +
                " " +
                (tran?.lastName).toLowerCase()
              ).match(search.toLowerCase()) &&
                select.value === "1") ||
              ((tran?.email).toLowerCase().match(search.toLowerCase()) &&
                select.value === "2") ||
              ((tran?.countryCode + " " + tran?.phoneNum).match(
                search.toLowerCase()
              ) &&
                select.value === "3") ||
              ((tran?.countryCode + tran?.phoneNum).match(
                search.toLowerCase()
              ) &&
                select.value === "3")
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
      selector: (row) => row.name,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Phone #",
      selector: (row) => row.phone,
    },
    {
      name: "Image",
      selector: (row) => row.image,
    },
  ];
  const datas = [];
  getTransporters()?.map((tran, index) => {
    return datas.push({
      id: index + 1,
      action: (
        <div className="flex gap-x-2">
          <DTEdit
            edit={() => {
              setUpdateModal(true);
              setUpdateTransporter({
                updateFirstName: tran?.firstName,
                updateLastName: tran?.lastName,
                updateEmail: tran?.email,
                updateCountryCode: tran?.countryCode,
                updatePhoneNum: tran?.phoneNum,
                transporterId: tran?.id,
                currentImage: BASE_URL2 + tran?.image,
              });
            }}
          />
          <DTDel del={() => delTransporterFunc(tran?.id)} disabled={disabled} />
        </div>
      ),
      name: tran?.firstName + " " + tran?.lastName,
      email: tran?.email,
      phone: tran?.countryCode + " " + tran?.phoneNum,
      image: (
        <img
          src={BASE_URL2 + tran?.image}
          alt="img"
          className="w-20 h-20 object-contain"
        />
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
        { value: "1", label: "Name" },
        { value: "2", label: "Email" },
        { value: "3", label: "Phone #" },
      ]}
      selectValue={select}
      selectOnChange={(e) => {
        setSelect(e);
        e === null && setSearch("");
      }}
      title="Transporter Guys"
      content={
        <>
          <style>{style}</style>
          <Modal onClose={closeAddModal} isOpen={addModal} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent>
              <form>
                <ModalHeader>
                  <h1 className="text-center">Add Transporter</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-[534px]">
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="firstName">
                          First Name
                        </label>
                        <input
                          value={addTransporter.firstName}
                          onChange={onChange}
                          type="text"
                          name="firstName"
                          id="firstName"
                          placeholder="Enter Transporter's First Name"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="lastName">
                          Last Name
                        </label>
                        <input
                          value={addTransporter.lastName}
                          onChange={onChange}
                          type="text"
                          name="lastName"
                          id="lastName"
                          placeholder="Enter Transporter's Last Name"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="email">
                          Email
                        </label>
                        <input
                          value={addTransporter.email}
                          onChange={onChange}
                          type="email"
                          name="email"
                          id="email"
                          placeholder="Enter Transporter's Email"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="phoneNum">
                          Phone No
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
                            inputProps={{
                              id: "countryCode",
                              name: "countryCode",
                            }}
                            country="Panama"
                            value={addTransporter.countryCode}
                            onChange={(code) =>
                              setAddTransporter({
                                ...addTransporter,
                                countryCode: code,
                              })
                            }
                          />
                          <input
                            value={addTransporter.phoneNum}
                            onChange={onChange}
                            type="number"
                            name="phoneNum"
                            id="phoneNum"
                            placeholder="Enter Transporter's Phone Number"
                            className={inputStyle}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="password">
                          Password
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
                            value={addTransporter.password}
                            onChange={onChange}
                            type={visible ? "text" : "password"}
                            name="password"
                            id="password"
                            placeholder="Enter Transporter's Password"
                            className={inputStyle}
                            autoComplete="off"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="profileImage">
                          Profile Image
                        </label>
                        <input
                          onChange={(e) =>
                            setAddTransporter({
                              ...addTransporter,
                              [e.target.name]: e.target.files[0],
                            })
                          }
                          type="file"
                          name="profileImage"
                          id="profileImage"
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
                    action={addTransporterFunc}
                  />
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <Modal
            onClose={closeUpdateModal}
            isOpen={updateModal}
            size="3xl"
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <form>
                <ModalHeader>
                  <h1 className="text-center">Update Transporter</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div
                    className={
                      updateTransporter.passwordUpdate &&
                      updateTransporter.imageUpdate
                        ? "h-[598px]"
                        : updateTransporter.passwordUpdate
                        ? "h-[504px]"
                        : updateTransporter.imageUpdate
                        ? "h-[510px]"
                        : "h-[416px]"
                    }
                  >
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateFirstName">
                          First Name
                        </label>
                        <input
                          value={updateTransporter.updateFirstName}
                          onChange={onChange2}
                          type="text"
                          name="updateFirstName"
                          id="updateFirstName"
                          placeholder="Enter Transporter's First Name"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateLastName">
                          Last Name
                        </label>
                        <input
                          value={updateTransporter.updateLastName}
                          onChange={onChange2}
                          type="text"
                          name="updateLastName"
                          id="updateLastName"
                          placeholder="Enter Transporter's Last Name"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateEmail">
                          Email
                        </label>
                        <input
                          value={updateTransporter.updateEmail}
                          onChange={onChange2}
                          type="email"
                          name="updateEmail"
                          id="updateEmail"
                          placeholder="Enter Transporter's Email"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="phoneNum">
                          Phone No
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
                            inputProps={{
                              id: "updateCountryCode",
                              name: "updateCountryCode",
                            }}
                            country="Panama"
                            value={updateTransporter.updateCountryCode}
                            onChange={(code) =>
                              setUpdateTransporter({
                                ...updateTransporter,
                                updateCountryCode: code,
                              })
                            }
                          />
                          <input
                            value={updateTransporter.updatePhoneNum}
                            onChange={onChange2}
                            type="number"
                            name="phoneNum"
                            id="phoneNum"
                            placeholder="Enter Transporter's Phone Number"
                            className={inputStyle}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-x-4 col-span-2">
                          <label
                            className={labelStyle}
                            htmlFor="passwordUpdate"
                          >
                            Do you want to change Password,?
                          </label>
                          <input
                            value={updateTransporter.passwordUpdate}
                            onChange={() =>
                              setUpdateTransporter({
                                ...updateTransporter,
                                passwordUpdate:
                                  !updateTransporter.passwordUpdate,
                              })
                            }
                            type="checkbox"
                            name="passwordUpdate"
                            id="passwordUpdate"
                          />
                        </div>
                        <div className="flex items-center gap-x-4 col-span-2">
                          <label className={labelStyle} htmlFor="imageUpdate">
                            Do you want to upload new Image,?
                          </label>
                          <input
                            value={updateTransporter.imageUpdate}
                            onChange={() =>
                              setUpdateTransporter({
                                ...updateTransporter,
                                imageUpdate: !updateTransporter.imageUpdate,
                              })
                            }
                            type="checkbox"
                            name="imageUpdate"
                            id="imageUpdate"
                          />
                        </div>
                      </div>
                      {updateTransporter.passwordUpdate && (
                        <div className="space-y-1 col-span-2">
                          <label
                            className={labelStyle}
                            htmlFor="updatePassword"
                          >
                            Password
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
                              value={updateTransporter.updatePassword}
                              onChange={onChange2}
                              type={visible ? "text" : "password"}
                              name="updatePassword"
                              id="updatePassword"
                              placeholder="Enter Transporter's Password"
                              className={inputStyle}
                              autoComplete="off"
                            />
                          </div>
                        </div>
                      )}
                      {updateTransporter.imageUpdate && (
                        <div className="space-y-1 col-span-2">
                          <label
                            className={labelStyle}
                            htmlFor="updateProfileImage"
                          >
                            Profile Image
                          </label>
                          <input
                            onChange={(e) =>
                              setUpdateTransporter({
                                ...updateTransporter,
                                [e.target.name]: e.target.files[0],
                              })
                            }
                            type="file"
                            name="updateProfileImage"
                            id="updateProfileImage"
                            className={inputStyle}
                          />
                        </div>
                      )}
                      <div className="col-span-2">
                        <img
                          src={updateTransporter.currentImage}
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
                    action={updateTransporterFunc}
                  />
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <section className="space-y-3">
            <div className="flex justify-end">
              <AddButton text="Transporter" modal={setAddModal} />
            </div>
            <MyDataTable columns={columns} data={datas} dependancy={data} />
          </section>
        </>
      }
    />
  );
}
