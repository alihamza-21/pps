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
import { DTEdit, DTView, ModalButtons } from "../../utilities/Buttons";
import { inputStyle, labelStyle } from "../../utilities/Input";
import { BASE_URL } from "../../utilities/URL";
import Layout from "../../components/Layout";

export default function Roles() {
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const rolesFeatureId =
    featureData &&
    featureData.find((ele) => ele.title === "Roles & Permission")?.id;
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(null);
  const { data, reFetch } = GetAPI("allroles", rolesFeatureId);
  const activeFeatures = GetAPI("activefeatures", rolesFeatureId);
  const [loader, setLoader] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [detData, setDetData] = useState([]);
  const [addName, setAddName] = useState("");
  const [addRole, setAddRole] = useState([]);
  const [updateRole, setUpdateRole] = useState([]);
  const [updateObj, setUpdateObj] = useState({
    name: "",
    roleId: "",
  });
  const activeFeaturesFunc = () => {
    const data = [];
    activeFeatures?.data?.data?.map((feat, index) => {
      return data.push({
        id: feat?.id,
        title: feat?.title,
        permissions: {
          create: false,
          read: false,
          update: false,
          delete: false,
        },
      });
    });
    setAddRole(data);
  };
  const [addModal, setAddModal] = useState(false);
  const closeAddModal = () => {
    setAddModal(false);
    setAddName("");
    setAddRole([]);
  };
  const [updateModal, setUpdateModal] = useState(false);
  const closeUpdateModal = () => {
    setUpdateModal(false);
    setUpdateRole([]);
  };
  const [detModal, setDetModal] = useState(false);
  const closeDetModal = () => {
    setDetModal(false);
    setDetData([]);
  };
  const onChange = (feat, key) => {
    const updatedAddRole = addRole?.map((role, index) => {
      if (role.title === feat?.title) {
        if (key === 0) {
          return {
            ...role,
            permissions: {
              ...role.permissions,
              [Object.keys(role.permissions)[key]]: !role.permissions.create,
            },
          };
        } else if (key === 1) {
          return {
            ...role,
            permissions: {
              ...role.permissions,
              [Object.keys(role.permissions)[key]]: !role.permissions.read,
            },
          };
        } else if (key === 2) {
          return {
            ...role,
            permissions: {
              ...role.permissions,
              [Object.keys(role.permissions)[key]]: !role.permissions.update,
            },
          };
        } else if (key === 3) {
          return {
            ...role,
            permissions: {
              ...role.permissions,
              [Object.keys(role.permissions)[key]]: !role.permissions.delete,
            },
          };
        }
      }
      return role;
    });
    setAddRole(updatedAddRole);
  };
  const onChange2 = (feat, key) => {
    const updatedAddRole = updateRole?.map((role, index) => {
      if (role.title === feat?.title) {
        if (key === 0) {
          return {
            ...role,
            permissions: {
              ...role.permissions,
              [Object.keys(role.permissions)[key]]: !role.permissions.create,
            },
          };
        } else if (key === 1) {
          return {
            ...role,
            permissions: {
              ...role.permissions,
              [Object.keys(role.permissions)[key]]: !role.permissions.read,
            },
          };
        } else if (key === 2) {
          return {
            ...role,
            permissions: {
              ...role.permissions,
              [Object.keys(role.permissions)[key]]: !role.permissions.update,
            },
          };
        } else if (key === 3) {
          return {
            ...role,
            permissions: {
              ...role.permissions,
              [Object.keys(role.permissions)[key]]: !role.permissions.delete,
            },
          };
        }
      }
      return role;
    });
    setUpdateRole(updatedAddRole);
  };
  const addRoleFunc = async (e) => {
    e.preventDefault();
    if (addName === "") {
      info_toaster("Please enter Role's Title");
    } else {
      setLoader(true);
      let res = await PostAPI("addrole", rolesFeatureId, {
        name: addName,
        permissionRole: addRole,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setAddModal(false);
        setAddName("");
        setAddRole([]);
      } else {
        error_toaster(res?.data?.message);
        setLoader(false);
      }
    }
  };
  const updateRoleFunc = async (e) => {
    e.preventDefault();
    if (updateObj.name === "") {
      info_toaster("Please enter Role's Title");
    } else {
      setLoader(true);
      let res = await PutAPI("updaterole", rolesFeatureId, {
        name: updateObj.name,
        roleId: updateObj.roleId,
        permissionRole: updateRole,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setUpdateModal(false);
        setUpdateObj({
          name: "",
          roleId: "",
        });
        setUpdateRole([]);
      } else {
        error_toaster(res?.data?.message);
        setLoader(false);
      }
    }
  };
  const changeRoleStatus = async (status, roleId) => {
    let change = await PutAPI("updatestatusrole", rolesFeatureId, {
      status: status,
      roleId: roleId,
    });
    if (change?.data?.status === "1") {
      reFetch();
      if (status) {
        success_toaster(change?.data?.message);
      } else {
        info_toaster(change?.data?.message);
      }
    } else {
      error_toaster(change?.data?.message);
    }
  };
  const roleDetails = async (roleId, role) => {
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
            `rolepermissions?featureId=${rolesFeatureId}&roleId=${roleId}`,
          config
        )
        .then((dat) => {
          if (role === "details") {
            setDetData(dat.data);
          } else {
            setUpdateRole(dat.data.data);
          }
          if (dat.data?.status === "1") {
            if (role === "details") {
              success_toaster(dat.data?.message);
              setDetModal(true);
            } else if (role === "update") {
              setUpdateModal(true);
            }
          } else {
            error_toaster(detData?.message);
          }
          setDisabled(false);
        });
    } catch (err) {
      setDisabled(false);
    }
  };
  const getRoles = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.filter(
            (role) =>
              search === "" ||
              select === null ||
              ((role?.name).toLowerCase().includes(search.toLowerCase()) &&
                select.value === "1")
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
      minWidth: "160px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      minWidth: "140px",
    },
  ];
  const datas = [];
  getRoles()?.map((role, index) => {
    return datas.push({
      id: index + 1,
      action: (
        <div className="flex gap-x-2">
          <DTView
            view={() => roleDetails(role?.id, "details")}
            disabled={disabled}
          />
          <DTEdit
            edit={() => {
              roleDetails(role?.id, "update");
              setUpdateObj({
                name: role?.name,
                roleId: role?.id,
              });
            }}
          />
        </div>
      ),
      name: role?.name,
      status: role?.status ? (
        <button
          onClick={() => changeRoleStatus(false, role?.id)}
          className={active}
        >
          Active
        </button>
      ) : (
        <button
          onClick={() => changeRoleStatus(true, role?.id)}
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
      options={[{ value: "1", label: "Name" }]}
      selectValue={select}
      selectOnChange={(e) => {
        setSelect(e);
        e === null && setSearch("");
      }}
      title="Roles & Permissions"
      content={
        <>
          <Modal
            onClose={closeDetModal}
            isOpen={detModal}
            size="3xl"
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                <h1 className="text-center">Role Permissions</h1>
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
                      {detData?.data?.map((role, index) => (
                        <tr className="font-medium text-lg text-black text-opacity-60">
                          <td>{role?.title}</td>
                          <td className="text-center">
                            <Checkbox
                              defaultChecked={
                                role?.permissions?.create ? true : false
                              }
                              isDisabled
                              id={`detail${index}`}
                            />
                          </td>
                          <td className="text-center">
                            <Checkbox
                              defaultChecked={
                                role?.permissions?.read ? true : false
                              }
                              isDisabled
                              id={`detail${index}`}
                            />
                          </td>
                          <td className="text-center">
                            <Checkbox
                              defaultChecked={
                                role?.permissions?.update ? true : false
                              }
                              isDisabled
                              id={`detail${index}`}
                            />
                          </td>
                          <td className="text-center">
                            <Checkbox
                              defaultChecked={
                                role?.permissions?.delete ? true : false
                              }
                              isDisabled
                              id={`detail${index}`}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              </ModalBody>
            </ModalContent>
          </Modal>
          <Modal
            onClose={closeAddModal}
            isOpen={addModal}
            size="3xl"
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <form>
                <ModalHeader>
                  <h1 className="text-center">Add Role</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-[556px]">
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <section className="h-[540px] overflow-auto">
                      <div className="space-y-1 mb-3 pr-4">
                        <label className={labelStyle} htmlFor="name">
                          Role Title
                        </label>
                        <input
                          value={addName}
                          onChange={(e) => setAddName(e.target.value)}
                          type="text"
                          name="name"
                          id="name"
                          placeholder="Enter your Role's Title"
                          className={inputStyle}
                        />
                      </div>
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
                          {activeFeatures?.data?.data?.map((feat, index) => (
                            <>
                              <tr className="font-medium text-lg text-black text-opacity-60">
                                <td>{feat?.title}</td>
                                <td className="text-center">
                                  <Checkbox
                                    onChange={() => onChange(feat, 0)}
                                    checked={
                                      addRole.find(
                                        (ele) => ele.title === feat?.title
                                      )?.permissions.create
                                    }
                                    id={`add${index}`}
                                  />
                                </td>
                                <td className="text-center">
                                  <Checkbox
                                    onChange={() => onChange(feat, 1)}
                                    checked={
                                      addRole.find(
                                        (ele) => ele.title === feat?.title
                                      )?.permissions.read
                                    }
                                    id={`add${index}`}
                                  />
                                </td>
                                <td className="text-center">
                                  <Checkbox
                                    onChange={() => onChange(feat, 2)}
                                    checked={
                                      addRole.find(
                                        (ele) => ele.title === feat?.title
                                      )?.permissions.update
                                    }
                                    id={`add${index}`}
                                  />
                                </td>
                                <td className="text-center">
                                  <Checkbox
                                    onChange={() => onChange(feat, 3)}
                                    checked={
                                      addRole.find(
                                        (ele) => ele.title === feat?.title
                                      )?.permissions.delete
                                    }
                                    id={`add${index}`}
                                  />
                                </td>
                              </tr>
                            </>
                          ))}
                        </tbody>
                      </table>
                    </section>
                  </ModalBody>
                )}
                <ModalFooter>
                  <ModalButtons
                    text="Add"
                    close={closeAddModal}
                    action={addRoleFunc}
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
                  <h1 className="text-center">Update Role</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-[556px]">
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <section className="h-[540px] overflow-auto">
                      <div className="space-y-1 mb-3 pr-4">
                        <label className={labelStyle} htmlFor="updateName">
                          Role Title
                        </label>
                        <input
                          value={updateObj.name}
                          onChange={(e) =>
                            setUpdateObj({ ...updateObj, name: e.target.value })
                          }
                          type="text"
                          name="updateName"
                          id="updateName"
                          placeholder="Enter your Role's Title"
                          className={inputStyle}
                        />
                      </div>
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
                          {updateRole?.map((role, index) => (
                            <tr className="font-medium text-lg text-black text-opacity-60">
                              <td>{role?.title}</td>
                              <td className="text-center">
                                <Checkbox
                                  onChange={() => onChange2(role, 0)}
                                  defaultChecked={
                                    role?.permissions?.create ? true : false
                                  }
                                  id={`update${index}`}
                                />
                              </td>
                              <td className="text-center">
                                <Checkbox
                                  onChange={() => onChange2(role, 1)}
                                  defaultChecked={
                                    role?.permissions?.read ? true : false
                                  }
                                  id={`update${index}`}
                                />
                              </td>
                              <td className="text-center">
                                <Checkbox
                                  onChange={() => onChange2(role, 2)}
                                  defaultChecked={
                                    role?.permissions?.update ? true : false
                                  }
                                  id={`update${index}`}
                                />
                              </td>
                              <td className="text-center">
                                <Checkbox
                                  onChange={() => onChange2(role, 3)}
                                  defaultChecked={
                                    role?.permissions?.delete ? true : false
                                  }
                                  id={`update${index}`}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </section>
                  </ModalBody>
                )}
                <ModalFooter>
                  <ModalButtons
                    text="Update"
                    close={closeUpdateModal}
                    action={updateRoleFunc}
                  />
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <section className="space-y-3">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setAddModal(true);
                  activeFeaturesFunc();
                }}
                className="py-2.5 px-12 rounded bg-themePurple font-medium text-base text-white border border-themePurple hover:bg-transparent hover:text-themePurple"
              >
                Add Roles
              </button>
            </div>
            <MyDataTable columns={columns} data={datas} dependancy={data} />
          </section>
        </>
      }
    />
  );
}
