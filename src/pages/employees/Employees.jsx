import {
  Checkbox,
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
import "react-phone-input-2/lib/style.css";
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
import AddButton, {
  DTEdit,
  DTView,
  ModalButtons,
} from "../../utilities/Buttons";
import { inputStyle, labelStyle, style } from "../../utilities/Input";
import { BASE_URL } from "../../utilities/URL";
import Layout from "../../components/Layout";
import isValidEmail from "../../utilities/MailCheck";

export default function Employees() {
  const remover = (str) => {
    if (str[0] === "+") {
      var result = str.slice(1);
    } else {
      result = str;
    }
    return result;
  };
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const employeesFeatureId =
    featureData && featureData.find((ele) => ele.title === "Employees")?.id;
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(null);
  const [visible, setVisible] = useState(false);
  const { data, reFetch } = GetAPI("getallemployees", employeesFeatureId);
  const activeRoles = GetAPI("activeroles", employeesFeatureId);
  const [loader, setLoader] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [detData, setDetData] = useState([]);
  const [addEmployee, setAddEmployee] = useState({
    name: "",
    email: "",
    password: "",
    countryCode: "507",
    phoneNum: "",
    roleId: "",
  });
  const [updateEmployee, setupdateEmployee] = useState({
    updateName: "",
    updateEmail: "",
    updatePassword: "",
    updateCountryCode: "507",
    updatePhoneNum: "",
    updateRoleId: "",
    changePassword: false,
    emplId: "",
  });
  const [addModal, setAddModal] = useState(false);
  const closeAddModal = () => {
    setAddModal(false);
    setAddEmployee({
      name: "",
      email: "",
      password: "",
      countryCode: "92",
      phoneNum: "",
      roleId: "",
    });
  };
  const [updateModal, setUpdateModal] = useState(false);
  const closeUpdateModal = () => {
    setUpdateModal(false);
    setupdateEmployee({
      updateName: "",
      updateEmail: "",
      updatePassword: "",
      updateCountryCode: "92",
      updatePhoneNum: "",
      updateRoleId: "",
      changePassword: false,
      emplId: "",
    });
  };
  const [detModal, setDetModal] = useState(false);
  const closeDetModal = () => {
    setDetModal(false);
    setDetData([]);
  };
  const onChange = (e) => {
    setAddEmployee({ ...addEmployee, [e.target.name]: e.target.value });
  };
  const onChange2 = (e) => {
    setupdateEmployee({ ...updateEmployee, [e.target.name]: e.target.value });
  };
  const addEmployeeFunc = async (e) => {
    e.preventDefault();
    if (addEmployee.name === "") {
      info_toaster("Please enter your Employee's Name");
    } else if (addEmployee.email === "") {
      info_toaster("Please enter your Employee's Email");
    } else if (!isValidEmail(addEmployee.email)) {
      info_toaster("Please enter a valid email");
    } else if (addEmployee.phoneNum === "") {
      info_toaster("Please enter your Employee's Phone No.");
    } else if (addEmployee.password === "") {
      info_toaster("Please create your Employee's Password");
    } else if (addEmployee.roleId === "") {
      info_toaster("Please select the Role to be assigned");
    } else {
      setLoader(true);
      let res = await PostAPI("addemployee", employeesFeatureId, {
        name: addEmployee.name,
        email: addEmployee.email,
        password: addEmployee.password,
        countryCode: "+" + addEmployee.countryCode,
        phoneNum: addEmployee.phoneNum,
        roleId: addEmployee.roleId.value,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setAddModal(false);
        setAddEmployee({
          name: "",
          email: "",
          password: "",
          countryCode: "92",
          phoneNum: "",
          roleId: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const updateEmployeeFunc = async (e) => {
    e.preventDefault();
    if (updateEmployee.updateName === "") {
      info_toaster("Please enter your Employee's Name");
    } else if (updateEmployee.updateEmail === "") {
      info_toaster("Please enter your Employee's Email");
    } else if (!isValidEmail(updateEmployee.updateEmail)) {
      info_toaster("Please enter a valid email");
    } else if (updateEmployee.updatePhoneNum === "") {
      info_toaster("Please enter your Employee's Phone No.");
    } else if (updateEmployee.updatePassword === "") {
      info_toaster("Please create your Employee's Password");
    } else if (updateEmployee.updateRoleId === "") {
      info_toaster("Please select the Role to be assigned");
    } else {
      setLoader(true);
      let res = await PutAPI("employeeupdate", employeesFeatureId, {
        name: updateEmployee.updateName,
        email: updateEmployee.updateEmail,
        password: updateEmployee.updatePassword,
        countryCode: "+" + remover(updateEmployee.updateCountryCode),
        phoneNum: updateEmployee.updatePhoneNum,
        roleId: updateEmployee.updateRoleId.value,
        updatePassword: updateEmployee.changePassword,
        emplId: updateEmployee.emplId,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setUpdateModal(false);
        setupdateEmployee({
          updateName: "",
          updateEmail: "",
          updatePassword: "",
          updateCountryCode: "92",
          updatePhoneNum: "",
          updateRoleId: "",
          changePassword: false,
          emplId: "",
        });
      } else {
        setupdateEmployee({ ...updateEmployee, changePassword: false });
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const changeEmployeeStatus = async (status, emplId) => {
    setDisabled(true);
    let change = await PutAPI("changestatus", employeesFeatureId, {
      status: status,
      emplId: emplId,
    });
    if (change?.data?.status === "1") {
      reFetch();
      if (status) {
        success_toaster(change?.data?.message);
      } else {
        info_toaster(change?.data?.message);
      }
      setDisabled(false);
    } else {
      error_toaster(change?.data?.message);
      setDisabled(false);
    }
  };
  const employeeDetails = async (employeeId) => {
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
            `employeedetail?featureId=${employeesFeatureId}&employeeId=${employeeId}`,
          config
        )
        .then((dat) => {
          setDetData(dat.data);
          if (dat.data?.status === "1") {
            success_toaster(dat.data?.message);
            setDetModal(true);
          } else {
            error_toaster(detData?.message);
          }
          setDisabled(false);
        });
    } catch (err) {
      setDisabled(false);
    }
  };
  const getEmployees = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.filter(
            (emp) =>
              search === "" ||
              select === null ||
              ((emp?.name).toLowerCase().includes(search.toLowerCase()) &&
                select.value === "1") ||
              ((emp?.email).toLowerCase().includes(search.toLowerCase()) &&
                select.value === "2") ||
              ((emp?.countryCode + " " + emp?.phoneNum)
                .toString()
                .includes(search) &&
                select.value === "3") ||
              ((emp?.countryCode + emp?.phoneNum).toString().includes(search) &&
                select.value === "3") ||
              (emp?.role &&
                (emp?.role?.name).toLowerCase().match(search) &&
                select.value === "4") ||
              (emp?.status && search === "Active" && select.value === "5") ||
              (emp?.status === false &&
                search === "Inactive" &&
                select.value === "6")
          )
        : [];
    return filteredArray;
  };
  const options = [];
  activeRoles.data?.data?.map((role, index) =>
    options.push({
      value: role?.id,
      label: role?.name,
    })
  );
  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
    },
    {
      name: "Action",
      selector: (row) => row.action,
      minWidth: "160px",
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
      name: "Phone",
      selector: (row) => row.phone,
    },
    {
      name: "Role",
      selector: (row) => row.role,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      minWidth: "140px",
    },
  ];
  const datas = [];
  getEmployees()?.map((emp, index) => {
    return datas.push({
      id: index + 1,
      action: (
        <div className="flex gap-x-2">
          <DTView view={() => employeeDetails(emp?.id)} disabled={disabled} />
          <DTEdit
            edit={() => {
              setUpdateModal(true);
              setupdateEmployee({
                updateName: emp?.name,
                updateEmail: emp?.email,
                updateCountryCode: emp?.countryCode,
                updatePhoneNum: emp?.phoneNum,
                updateRoleId: { value: emp?.roleId, label: emp?.role?.name },
                emplId: emp?.id,
              });
            }}
          />
        </div>
      ),
      name: emp?.name,
      email: emp?.email,
      phone: emp?.countryCode + " " + emp?.phoneNum,
      role: emp?.role?.name,
      status: emp?.status ? (
        <button
          onClick={() => changeEmployeeStatus(false, emp?.id)}
          disabled={disabled}
          className={active}
        >
          Active
        </button>
      ) : (
        <button
          onClick={() => changeEmployeeStatus(true, emp?.id)}
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
        { value: "1", label: "Name" },
        { value: "2", label: "Email" },
        { value: "3", label: "Phone" },
        { value: "4", label: "Role" },
        { value: "5", label: "Active" },
        { value: "6", label: "Inactive" },
      ]}
      selectValue={select}
      selectOnChange={(e) => {
        setSelect(e);
        e === null && setSearch("");
        e && e.value === "5" && setSearch("Active");
        e && e.value === "6" && setSearch("Inactive");
      }}
      title="Employees"
      content={
        <>
          <style>{style}</style>
          <Modal
            onClose={closeDetModal}
            isOpen={detModal}
            size="3xl"
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                <h1 className="text-center">Employee Permissions</h1>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <section className="h-[540px] overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="font-semibold text-xl">
                        <td>Name</td>
                        <td className="text-center">Create</td>
                        <td className="text-center">Read</td>
                        <td className="text-center">Update</td>
                        <td className="text-center">Delete</td>
                      </tr>
                    </thead>
                    <tbody>
                      {detData?.data?.employeePermissions?.map(
                        (role, index) => (
                          <tr className="font-medium text-lg text-black text-opacity-60">
                            <td>{role?.title}</td>
                            <td className="text-center">
                              <Checkbox
                                defaultChecked={
                                  role?.permissions?.create ? true : false
                                }
                                isDisabled
                                id={`permission${index}`}
                              />
                            </td>
                            <td className="text-center">
                              <Checkbox
                                defaultChecked={
                                  role?.permissions?.read ? true : false
                                }
                                isDisabled
                                id={`permission${index}`}
                              />
                            </td>
                            <td className="text-center">
                              <Checkbox
                                defaultChecked={
                                  role?.permissions?.update ? true : false
                                }
                                isDisabled
                                id={`permission${index}`}
                              />
                            </td>
                            <td className="text-center">
                              <Checkbox
                                defaultChecked={
                                  role?.permissions?.delete ? true : false
                                }
                                isDisabled
                                id={`permission${index}`}
                              />
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </section>
              </ModalBody>
            </ModalContent>
          </Modal>
          <Modal onClose={closeAddModal} isOpen={addModal} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent>
              <form>
                <ModalHeader>
                  <h1 className="text-center">Add Employee</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-[442px]">
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="name">
                          Name
                        </label>
                        <input
                          value={addEmployee.name}
                          onChange={onChange}
                          type="text"
                          name="name"
                          id="name"
                          placeholder="Enter your Employee's Name"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="email">
                          Email
                        </label>
                        <input
                          value={addEmployee.email}
                          onChange={onChange}
                          type="email"
                          name="email"
                          id="email"
                          placeholder="Enter your Employee's Email"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="number">
                          Phone No.
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
                            value={addEmployee.countryCode}
                            onChange={(e) =>
                              setAddEmployee({ ...addEmployee, countryCode: e })
                            }
                          />
                          <input
                            value={addEmployee.phoneNum}
                            onChange={onChange}
                            type="number"
                            name="phoneNum"
                            id="phoneNum"
                            placeholder="Enter your Employee's Phone No."
                            className={inputStyle}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="password">
                          Create Password
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
                            value={addEmployee.password}
                            onChange={onChange}
                            type={visible ? "text" : "password"}
                            name="password"
                            id="password"
                            placeholder="Create your Employee's Password"
                            className={inputStyle}
                            autoComplete="off"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="roleId">
                          Role
                        </label>
                        <Select
                          value={addEmployee.roleId}
                          onChange={(e) =>
                            setAddEmployee({ ...addEmployee, roleId: e })
                          }
                          options={options}
                          inputId="roleId"
                          placeholder="Select the role"
                        />
                      </div>
                    </div>
                  </ModalBody>
                )}
                <ModalFooter>
                  <ModalButtons
                    text="Add"
                    close={closeAddModal}
                    action={addEmployeeFunc}
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
                  <h1 className="text-center">Update Employee</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div
                    className={
                      updateEmployee.changePassword ? "h-[478px]" : "h-[390px]"
                    }
                  >
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateName">
                          Name
                        </label>
                        <input
                          value={updateEmployee.updateName}
                          onChange={onChange2}
                          type="text"
                          name="updateName"
                          id="updateName"
                          placeholder="Enter your Employee's Name"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateEmail">
                          Email
                        </label>
                        <input
                          value={updateEmployee.updateEmail}
                          onChange={onChange2}
                          type="email"
                          name="updateEmail"
                          id="updateEmail"
                          placeholder="Enter your Employee's Email"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updatePhoneNum">
                          Phone No.
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
                            value={updateEmployee.updateCountryCode}
                            onChange={(e) =>
                              setupdateEmployee({
                                ...updateEmployee,
                                updateCountryCode: e,
                              })
                            }
                          />
                          <input
                            value={updateEmployee.updatePhoneNum}
                            onChange={onChange2}
                            type="number"
                            name="updatePhoneNum"
                            id="updatePhoneNum"
                            placeholder="Enter your Employee's Phone No."
                            className={inputStyle}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateRoleId">
                          Role
                        </label>
                        <Select
                          value={updateEmployee.updateRoleId}
                          onChange={(e) =>
                            setupdateEmployee({
                              ...updateEmployee,
                              updateRoleId: e,
                            })
                          }
                          options={options}
                          inputId="updateRoleId"
                          placeholder="Select the role"
                        />
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
                            value={updateEmployee.changePassword}
                            onChange={() =>
                              setupdateEmployee({
                                ...updateEmployee,
                                changePassword: !updateEmployee.changePassword,
                              })
                            }
                            type="checkbox"
                            name="changePassword"
                            id="changePassword"
                          />
                        </div>
                      </div>
                      {updateEmployee.changePassword && (
                        <div className="space-y-1">
                          <label
                            className={labelStyle}
                            htmlFor="updatePassword"
                          >
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
                              value={updateEmployee.updatePassword}
                              onChange={onChange2}
                              type={visible ? "text" : "password"}
                              name="updatePassword"
                              id="updatePassword"
                              placeholder="Change your Password"
                              className={inputStyle}
                              autoComplete="off"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </ModalBody>
                )}
                <ModalFooter>
                  <ModalButtons
                    text="Update"
                    close={closeUpdateModal}
                    action={updateEmployeeFunc}
                  />
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <section className="space-y-3">
            <div className="flex justify-end">
              <AddButton text="Employee" modal={setAddModal} />
            </div>
            <MyDataTable columns={columns} data={datas} dependancy={data} />
          </section>
        </>
      }
    />
  );
}
