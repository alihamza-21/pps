import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import GetAPI from "../../utilities/GetAPI";
import { PutAPI } from "../../utilities/PutAPI";
import MyDataTable from "../../components/MyDataTable";
import Loader from "../../components/Loader";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../utilities/Toaster";
import {
  DTApprove,
  DTApproved,
  DTDel,
  DTEdit,
  DTPending,
  DTQuestion,
  DTReject,
  DTRejected,
  DTView,
  ModalButtons,
  TabButton,
} from "../../utilities/Buttons";
import { BASE_URL } from "../../utilities/URL";
import Layout from "../../components/Layout";
import { active, block } from "../../utilities/CustomStyles";
import { PostAPI } from "../../utilities/PostAPI";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

export default function Drivers() {
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const driversFeatureId =
    featureData && featureData.find((ele) => ele.title === "Drivers")?.id;
  const navigate = useNavigate();
  const [tab, setTab] = useState("Approved");
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(null);
  const [wareFilter, setWareFilter] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [loader, setLoader] = useState(false);
  const [driverId, setDriverId] = useState("");
  const { data, reFetch } = GetAPI("alldrivers", driversFeatureId);
  const activeWare = GetAPI("activewarehouse", driversFeatureId);
  const [approveModal, setApproveModal] = useState(false);
  const closeApproveModal = () => {
    setDriverId("");
    setApproveModal(false);
  };
  const [editModal, setEditModal] = useState(false);
  const closeEditModal = () => {
    localStorage.removeItem("driverId");
    setEditModal(false);
  };
  const [deleteModal, setDeleteModal] = useState(false);
  const closeDeleteModal = () => {
    setDriverId("");
    setDeleteModal(false);
  };
  const changeDriverStatus = async (status, userId) => {
    setDisabled(true);
    let change = await PutAPI("userstatus", driversFeatureId, {
      status: status,
      userId: userId,
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
  const approveDriver = async () => {
    setDisabled(true);
    let res = await PutAPI("approvedriver", driversFeatureId, {
      userId: driverId,
    });
    if (res?.data?.status === "1") {
      success_toaster(res?.data?.message);
      reFetch();
      setDisabled(false);
      setApproveModal(false);
    } else {
      error_toaster(res?.data?.message);
      setDisabled(false);
    }
  };
  const rejectDriver = async (userId) => {
    setDisabled(true);
    let res = await PutAPI("rejectdriver", driversFeatureId, {
      userId: userId,
    });
    if (res?.data?.status === "1") {
      success_toaster(res?.data?.message);
      reFetch();
      setDisabled(false);
    } else {
      error_toaster(res?.data?.message);
      setDisabled(false);
    }
  };
  const deleteDriver = async () => {
    setDisabled(true);
    let res = await PutAPI("deletedriver", driversFeatureId, {
      userId: driverId,
    });
    if (res?.data?.status === "1") {
      success_toaster(res?.data?.message);
      reFetch();
      setDisabled(false);
      setDeleteModal(false);
    } else {
      error_toaster(res?.data?.message);
      setDisabled(false);
    }
  };
  const checkDriverStep = async (driverId) => {
    setDisabled(true);
    let res = await PostAPI("checkregstep", driversFeatureId, {
      driverId: driverId,
    });
    if (res?.data?.status === "1") {
      success_toaster(res?.data?.message);
      setDisabled(false);
    } else if (res?.data?.status === "2") {
      navigate("/create-driver/step-two", {
        state: { userId: res?.data?.data?.id, featureId: driversFeatureId },
      });
      success_toaster(res?.data?.message);
      setDisabled(false);
    } else if (res?.data?.status === "3") {
      navigate("/create-driver/step-three", {
        state: { userId: res?.data?.data?.id, featureId: driversFeatureId },
      });
      success_toaster(res?.data?.message);
      setDisabled(false);
    } else {
      error_toaster(res?.data?.message);
      setDisabled(false);
    }
  };
  const driverDetails = async (id, path) => {
    setDisabled(true);
    setLoader(true);
    var config = {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    };
    try {
      axios
        .get(
          BASE_URL + `driverdetails?featureId=${driversFeatureId}&id=${id}`,
          config
        )
        .then((dat) => {
          if (dat.data?.status === "1") {
            if (path === "details") {
              navigate("/driver-details", {
                state: {
                  driDetails: dat?.data?.data,
                  driverId: id,
                  featureId: driversFeatureId,
                },
              });
              info_toaster(dat?.data?.message);
            } else if (path === "personal") {
              navigate("/update-driver/personal-info", {
                state: {
                  driDetails: dat?.data?.data,
                },
              });
            } else if (path === "vehicle") {
              navigate("/update-driver/vehicle-info", {
                state: {
                  driDetails: dat?.data?.data,
                },
              });
            } else if (path === "license") {
              navigate("/update-driver/license-info", {
                state: {
                  driDetails: dat?.data?.data,
                },
              });
            }
          } else {
            error_toaster(dat?.data?.message);
          }
          setDisabled(false);
          setLoader(false);
        });
    } catch (err) {
      setDisabled(false);
      setLoader(false);
    }
  };
  const wareOptions = [];
  activeWare.data?.data?.map((activeWare, index) =>
    wareOptions.push({
      value: activeWare?.id,
      label: activeWare?.name,
    })
  );
  const approvedDrivers = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.freeLance?.approved?.filter(
            (dri) =>
              search === "" ||
              select === null ||
              ((
                (dri?.firstName).toLowerCase() +
                " " +
                (dri?.lastName).toLowerCase()
              ).match(search.toLowerCase()) &&
                select.value === "1") ||
              ((dri?.email).toLowerCase().match(search.toLowerCase()) &&
                select.value === "2") ||
              ((dri?.countryCode + " " + dri?.phoneNum).match(
                search.toLowerCase()
              ) &&
                select.value === "3") ||
              ((dri?.countryCode + dri?.phoneNum).match(search.toLowerCase()) &&
                select.value === "3") ||
              (dri?.driverDetail?.vehicleType?.title &&
                (dri?.driverDetail?.vehicleType?.title)
                  .toLowerCase()
                  .match(search.toLowerCase()) &&
                select.value === "4") ||
              (dri?.driverDetail?.approvedByAdmin === "approved" &&
                search === "Approved" &&
                select.value === "5") ||
              (dri?.driverDetail?.approvedByAdmin === "pending" &&
                search === "Pending" &&
                select.value === "6") ||
              ((dri?.date).match(search) && select.value === "7")
          )
        : [];
    return filteredArray;
  };
  const pendingDrivers = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.freeLance?.awaitingApproval?.filter(
            (dri) =>
              search === "" ||
              select === null ||
              ((
                (dri?.firstName).toLowerCase() +
                " " +
                (dri?.lastName).toLowerCase()
              ).match(search.toLowerCase()) &&
                select.value === "1") ||
              ((dri?.email).toLowerCase().match(search.toLowerCase()) &&
                select.value === "2") ||
              ((dri?.countryCode + " " + dri?.phoneNum).match(
                search.toLowerCase()
              ) &&
                select.value === "3") ||
              ((dri?.countryCode + dri?.phoneNum).match(search.toLowerCase()) &&
                select.value === "3") ||
              (dri?.driverDetail?.vehicleType?.title &&
                (dri?.driverDetail?.vehicleType?.title)
                  .toLowerCase()
                  .match(search.toLowerCase()) &&
                select.value === "4") ||
              (dri?.driverDetail?.approvedByAdmin === "approved" &&
                search === "Approved" &&
                select.value === "5") ||
              (dri?.driverDetail?.approvedByAdmin === "pending" &&
                search === "Pending" &&
                select.value === "6") ||
              ((dri?.date).match(search) && select.value === "7")
          )
        : [];
    return filteredArray;
  };
  const associatedDrivers = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.associated?.filter(
            (dri) =>
              search === "" ||
              select === null ||
              ((
                (dri?.firstName).toLowerCase() +
                " " +
                (dri?.lastName).toLowerCase()
              ).match(search.toLowerCase()) &&
                select.value === "1") ||
              ((dri?.email).toLowerCase().match(search.toLowerCase()) &&
                select.value === "2") ||
              ((dri?.countryCode + " " + dri?.phoneNum).match(
                search.toLowerCase()
              ) &&
                select.value === "3") ||
              ((dri?.countryCode + dri?.phoneNum).match(search.toLowerCase()) &&
                select.value === "3") ||
              (dri?.driverDetail?.vehicleType?.title &&
                (dri?.driverDetail?.vehicleType?.title)
                  .toLowerCase()
                  .match(search.toLowerCase()) &&
                select.value === "4") ||
              (dri?.driverDetail?.approvedByAdmin === "approved" &&
                search === "Approved" &&
                select.value === "5") ||
              (dri?.driverDetail?.approvedByAdmin === "pending" &&
                search === "Pending" &&
                select.value === "6") ||
              ((dri?.date).match(search) && select.value === "7")
          )
        : [];
    const filteredArray2 = data?.data?.associated?.filter(
      (dri) =>
        wareFilter === null ||
        dri?.driverDetail?.warehouse?.id.toString() ===
          wareFilter.value.toString()
    );
    return wareFilter === null ? filteredArray : filteredArray2;
  };
  const incompleteDrivers = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.incompleteDriver?.filter(
            (dri) =>
              search === "" ||
              select === null ||
              ((
                (dri?.firstName).toLowerCase() +
                " " +
                (dri?.lastName).toLowerCase()
              ).match(search.toLowerCase()) &&
                select.value === "1") ||
              ((dri?.email).toLowerCase().match(search.toLowerCase()) &&
                select.value === "2") ||
              ((dri?.countryCode + " " + dri?.phoneNum).match(
                search.toLowerCase()
              ) &&
                select.value === "3") ||
              ((dri?.countryCode + dri?.phoneNum).match(search.toLowerCase()) &&
                select.value === "3") ||
              (dri?.driverDetail?.approvedByAdmin === "approved" &&
                search === "Approved" &&
                select.value === "5") ||
              (dri?.driverDetail?.approvedByAdmin === "pending" &&
                search === "Pending" &&
                select.value === "6") ||
              ((dri?.date).match(search) && select.value === "7")
          )
        : [];
    return filteredArray;
  };
  const rejectedDrivers = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.rejected?.filter(
            (dri) =>
              search === "" ||
              select === null ||
              ((
                (dri?.firstName).toLowerCase() +
                " " +
                (dri?.lastName).toLowerCase()
              ).match(search.toLowerCase()) &&
                select.value === "1") ||
              ((dri?.email).toLowerCase().match(search.toLowerCase()) &&
                select.value === "2") ||
              ((dri?.countryCode + " " + dri?.phoneNum).match(
                search.toLowerCase()
              ) &&
                select.value === "3") ||
              ((dri?.countryCode + dri?.phoneNum).match(search.toLowerCase()) &&
                select.value === "3") ||
              (dri?.driverDetail?.approvedByAdmin === "approved" &&
                search === "Approved" &&
                select.value === "5") ||
              (dri?.driverDetail?.approvedByAdmin === "pending" &&
                search === "Pending" &&
                select.value === "6") ||
              ((dri?.date).match(search) && select.value === "7")
          )
        : [];
    return filteredArray;
  };
  const columns = [];
  const datas = [];
  if (tab === "Approved") {
    columns.push(
      {
        name: "#",
        selector: (row) => row.id,
      },
      {
        name: "Action",
        selector: (row) => row.action,
        minWidth: "280px",
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
        name: "Vehicle",
        selector: (row) => row.vehicle,
      },
      {
        name: "Registered By",
        selector: (row) => row.registered,
      },
      {
        name: "Date",
        selector: (row) => row.date,
      },
      {
        name: "Bookings Completed",
        selector: (row) => row.completed,
      },
      {
        name: "Bookings Cancelled",
        selector: (row) => row.cancelled,
      },
      {
        name: "Approval Status",
        selector: (row) => row.approval,
        minWidth: "200px",
      },
      {
        name: "Status",
        selector: (row) => row.status,
        minWidth: "200px",
      }
    );
    approvedDrivers()?.map((dri, index) => {
      return datas.push({
        id: index + 1,
        action: (
          <div className="flex gap-x-2">
            <DTView
              view={() => driverDetails(dri?.id, "details")}
              disabled={disabled}
            />
            <DTEdit
              edit={() => {
                setEditModal(true);
                localStorage.setItem("driverId", dri?.id);
              }}
              disabled={disabled}
            />
            {dri?.driverDetail === null ||
            dri?.driverDetail?.approvedByAdmin === "approved" ? (
              <DTReject
                reject={() => rejectDriver(dri?.id)}
                disabled={disabled}
              />
            ) : dri?.driverDetail?.approvedByAdmin === "pending" ? (
              <>
                <DTApprove
                  approve={() => {
                    setDriverId(dri?.id);
                    setApproveModal(true);
                  }}
                  disabled={disabled}
                />
                <DTReject
                  reject={() => rejectDriver(dri?.id)}
                  disabled={disabled}
                />
              </>
            ) : dri?.driverDetail?.approvedByAdmin === "rejected" ? (
              <DTApprove
                approve={() => {
                  setDriverId(dri?.id);
                  setApproveModal(true);
                }}
                disabled={disabled}
              />
            ) : (
              ""
            )}
            <DTDel
              del={() => {
                setDriverId(dri?.id);
                setDeleteModal(true);
              }}
              disabled={disabled}
            />
          </div>
        ),
        name: dri?.firstName + " " + dri?.lastName,
        email: dri?.email,
        phone: dri?.countryCode + " " + dri?.phoneNum,
        vehicle: dri?.driverDetail?.vehicleType?.title,
        registered: <div className="capitalize">{dri?.registeredBy}</div>,
        date: dri?.date,
        completed: dri?.asRec + dri?.asDel,
        cancelled: dri?.bookingCancelled,
        approval:
          dri?.driverDetail?.approvedByAdmin === "approved" ? (
            <DTApproved />
          ) : dri?.driverDetail?.approvedByAdmin === "pending" ||
            dri?.driverDetail === null ? (
            <DTPending />
          ) : (
            <DTRejected />
          ),
        status: dri?.status ? (
          <button
            onClick={() => changeDriverStatus(false, dri?.id)}
            className={active}
            disabled={disabled}
          >
            Active
          </button>
        ) : (
          <button
            onClick={() => changeDriverStatus(true, dri?.id)}
            className={block}
            disabled={disabled}
          >
            Inactive
          </button>
        ),
      });
    });
  } else if (tab === "Pending") {
    columns.push(
      {
        name: "#",
        selector: (row) => row.id,
      },
      {
        name: "Action",
        selector: (row) => row.action,
        minWidth: "280px",
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
        name: "Vehicle",
        selector: (row) => row.vehicle,
      },
      {
        name: "Registered By",
        selector: (row) => row.registered,
      },
      {
        name: "Date",
        selector: (row) => row.date,
      },
      {
        name: "Bookings Completed",
        selector: (row) => row.completed,
      },
      {
        name: "Bookings Cancelled",
        selector: (row) => row.cancelled,
      },
      {
        name: "Approval Status",
        selector: (row) => row.approval,
        minWidth: "200px",
      },
      {
        name: "Status",
        selector: (row) => row.status,
        minWidth: "200px",
      }
    );
    pendingDrivers()?.map((dri, index) => {
      return datas.push({
        id: index + 1,
        action: (
          <div className="flex gap-x-2">
            <DTView
              view={() => driverDetails(dri?.id, "details")}
              disabled={disabled}
            />
            <DTEdit
              edit={() => {
                setEditModal(true);
                localStorage.setItem("driverId", dri?.id);
              }}
              disabled={disabled}
            />
            <DTQuestion
              question={() => checkDriverStep(dri?.id)}
              disabled={disabled}
            />
            {dri?.driverDetail === null ||
            dri?.driverDetail?.approvedByAdmin === "approved" ? (
              <DTReject
                reject={() => rejectDriver(dri?.id)}
                disabled={disabled}
              />
            ) : dri?.driverDetail?.approvedByAdmin === "pending" ? (
              <>
                <DTApprove
                  approve={() => {
                    setDriverId(dri?.id);
                    setApproveModal(true);
                  }}
                  disabled={disabled}
                />
                <DTReject
                  reject={() => rejectDriver(dri?.id)}
                  disabled={disabled}
                />
              </>
            ) : dri?.driverDetail?.approvedByAdmin === "rejected" ? (
              <DTApprove
                approve={() => {
                  setDriverId(dri?.id);
                  setApproveModal(true);
                }}
                disabled={disabled}
              />
            ) : (
              ""
            )}
            <DTDel
              del={() => {
                setDriverId(dri?.id);
                setDeleteModal(true);
              }}
              disabled={disabled}
            />
          </div>
        ),
        name: dri?.firstName + " " + dri?.lastName,
        email: dri?.email,
        phone: dri?.countryCode + " " + dri?.phoneNum,
        vehicle: dri?.driverDetail?.vehicleType?.title,
        registered: <div className="capitalize">{dri?.registeredBy}</div>,
        date: dri?.date,
        completed: dri?.asRec + dri?.asDel,
        cancelled: dri?.bookingCancelled,
        approval:
          dri?.driverDetail?.approvedByAdmin === "approved" ? (
            <DTApproved />
          ) : dri?.driverDetail?.approvedByAdmin === "pending" ||
            dri?.driverDetail === null ? (
            <DTPending />
          ) : (
            <DTRejected />
          ),
        status: dri?.status ? (
          <button
            onClick={() => changeDriverStatus(false, dri?.id)}
            className={active}
            disabled={disabled}
          >
            Active
          </button>
        ) : (
          <button
            onClick={() => changeDriverStatus(true, dri?.id)}
            className={block}
            disabled={disabled}
          >
            Inactive
          </button>
        ),
      });
    });
  } else if (tab === "Associated") {
    columns.push(
      {
        name: "#",
        selector: (row) => row.id,
      },
      {
        name: "Action",
        selector: (row) => row.action,
        minWidth: "280px",
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
        name: "Vehicle",
        selector: (row) => row.vehicle,
      },
      {
        name: "Registered By",
        selector: (row) => row.registered,
      },
      {
        name: "Date",
        selector: (row) => row.date,
      },
      {
        name: "Warehouse",
        selector: (row) => row.warehouse,
      },
      {
        name: "Bookings Completed",
        selector: (row) => row.completed,
      },
      {
        name: "Bookings Cancelled",
        selector: (row) => row.cancelled,
      },
      {
        name: "Approval Status",
        selector: (row) => row.approval,
        minWidth: "200px",
      },
      {
        name: "Status",
        selector: (row) => row.status,
        minWidth: "200px",
      }
    );
    associatedDrivers()?.map((dri, index) => {
      return datas.push({
        id: index + 1,
        action: (
          <div className="flex gap-x-2">
            <DTView
              view={() => driverDetails(dri?.id, "details")}
              disabled={disabled}
            />
            <DTEdit
              edit={() => {
                setEditModal(true);
                localStorage.setItem("driverId", dri?.id);
              }}
              disabled={disabled}
            />
            <DTQuestion
              question={() => checkDriverStep(dri?.id)}
              disabled={disabled}
            />
            {dri?.driverDetail === null ||
            dri?.driverDetail?.approvedByAdmin === "approved" ? (
              <DTReject
                reject={() => rejectDriver(dri?.id)}
                disabled={disabled}
              />
            ) : dri?.driverDetail?.approvedByAdmin === "pending" ? (
              <>
                <DTApprove
                  approve={() => {
                    setDriverId(dri?.id);
                    setApproveModal(true);
                  }}
                  disabled={disabled}
                />
                <DTReject
                  reject={() => rejectDriver(dri?.id)}
                  disabled={disabled}
                />
              </>
            ) : dri?.driverDetail?.approvedByAdmin === "rejected" ? (
              <DTApprove
                approve={() => {
                  setDriverId(dri?.id);
                  setApproveModal(true);
                }}
                disabled={disabled}
              />
            ) : (
              ""
            )}
            <DTDel
              del={() => {
                setDriverId(dri?.id);
                setDeleteModal(true);
              }}
              disabled={disabled}
            />
          </div>
        ),
        name: dri?.firstName + " " + dri?.lastName,
        email: dri?.email,
        phone: dri?.countryCode + " " + dri?.phoneNum,
        vehicle: dri?.driverDetail?.vehicleType?.title,
        registered: <div className="capitalize">{dri?.registeredBy}</div>,
        date: dri?.date,
        warehouse: dri?.driverDetail?.warehouse?.name,
        completed: dri?.asRec + dri?.asDel,
        cancelled: dri?.bookingCancelled,
        approval:
          dri?.driverDetail?.approvedByAdmin === "approved" ? (
            <DTApproved />
          ) : dri?.driverDetail?.approvedByAdmin === "pending" ||
            dri?.driverDetail === null ? (
            <DTPending />
          ) : (
            <DTRejected />
          ),
        status: dri?.status ? (
          <button
            onClick={() => changeDriverStatus(false, dri?.id)}
            className={active}
            disabled={disabled}
          >
            Active
          </button>
        ) : (
          <button
            onClick={() => changeDriverStatus(true, dri?.id)}
            className={block}
            disabled={disabled}
          >
            Inactive
          </button>
        ),
      });
    });
  } else if (tab === "Incomplete") {
    columns.push(
      {
        name: "#",
        selector: (row) => row.id,
      },
      {
        name: "Action",
        selector: (row) => row.action,
        minWidth: "280px",
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
        name: "Registered By",
        selector: (row) => row.registered,
      },
      {
        name: "Date",
        selector: (row) => row.date,
      }
    );
    incompleteDrivers()?.map((dri, index) => {
      return datas.push({
        id: index + 1,
        action: (
          <div className="flex gap-x-2">
            <DTQuestion
              question={() => checkDriverStep(dri?.id)}
              disabled={disabled}
            />
            <DTDel
              del={() => {
                setDriverId(dri?.id);
                setDeleteModal(true);
              }}
              disabled={disabled}
            />
          </div>
        ),
        name: dri?.firstName + " " + dri?.lastName,
        email: dri?.email,
        phone: dri?.countryCode + " " + dri?.phoneNum,
        registered: <div className="capitalize">{dri?.registeredBy}</div>,
        date: dri?.date,
      });
    });
  } else if (tab === "Rejected") {
    columns.push(
      {
        name: "#",
        selector: (row) => row.id,
      },
      {
        name: "Action",
        selector: (row) => row.action,
        minWidth: "280px",
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
        name: "Registered By",
        selector: (row) => row.registered,
      },
      {
        name: "Date",
        selector: (row) => row.date,
      },
      {
        name: "Approval Status",
        selector: (row) => row.approval,
        minWidth: "200px",
      },
      {
        name: "Status",
        selector: (row) => row.status,
        minWidth: "200px",
      }
    );
    rejectedDrivers()?.map((dri, index) => {
      return datas.push({
        id: index + 1,
        action: (
          <div className="flex gap-x-2">
            <DTView
              view={() => driverDetails(dri?.id, "details")}
              disabled={disabled}
            />
            <DTEdit
              edit={() => {
                setEditModal(true);
                localStorage.setItem("driverId", dri?.id);
              }}
              disabled={disabled}
            />
            <DTQuestion
              question={() => checkDriverStep(dri?.id)}
              disabled={disabled}
            />
            {dri?.driverDetail === null ||
            dri?.driverDetail?.approvedByAdmin === "approved" ? (
              <DTReject
                reject={() => rejectDriver(dri?.id)}
                disabled={disabled}
              />
            ) : dri?.driverDetail?.approvedByAdmin === "pending" ? (
              <>
                <DTApprove
                  approve={() => {
                    setDriverId(dri?.id);
                    setApproveModal(true);
                  }}
                  disabled={disabled}
                />
                <DTReject
                  reject={() => rejectDriver(dri?.id)}
                  disabled={disabled}
                />
              </>
            ) : dri?.driverDetail?.approvedByAdmin === "rejected" ? (
              <DTApprove
                approve={() => {
                  setDriverId(dri?.id);
                  setApproveModal(true);
                }}
                disabled={disabled}
              />
            ) : (
              ""
            )}
            <DTDel
              del={() => {
                setDriverId(dri?.id);
                setDeleteModal(true);
              }}
              disabled={disabled}
            />
          </div>
        ),
        name: dri?.firstName + " " + dri?.lastName,
        email: dri?.email,
        phone: dri?.countryCode + " " + dri?.phoneNum,
        registered: <div className="capitalize">{dri?.registeredBy}</div>,
        date: dri?.date,
        approval:
          dri?.driverDetail?.approvedByAdmin === "approved" ? (
            <DTApproved />
          ) : dri?.driverDetail?.approvedByAdmin === "pending" ||
            dri?.driverDetail === null ? (
            <DTPending />
          ) : (
            <DTRejected />
          ),
        status: dri?.status ? (
          <button
            onClick={() => changeDriverStatus(false, dri?.id)}
            className={active}
            disabled={disabled}
          >
            Active
          </button>
        ) : (
          <button
            onClick={() => changeDriverStatus(true, dri?.id)}
            className={block}
            disabled={disabled}
          >
            Inactive
          </button>
        ),
      });
    });
  }
  return data.length === 0 || loader ? (
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
        { value: "4", label: "Vehicle" },
        { value: "5", label: "Approved" },
        { value: "6", label: "Pending" },
        { value: "7", label: "Date" },
      ]}
      selectValue={select}
      selectOnChange={(e) => {
        setSelect(e);
        e === null && setSearch("");
        e && e.value === "5" && setSearch("Approved");
        e && e.value === "6" && setSearch("Pending");
      }}
      title="Drivers"
      content={
        <>
          <Modal
            onClose={closeApproveModal}
            isOpen={approveModal}
            size="xl"
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                <h1 className="text-center">Approve Driver</h1>
              </ModalHeader>
              <ModalBody>
                <p className="text-lg">
                  Are you sure, you want to approve this Driver?
                </p>
              </ModalBody>
              <ModalFooter>
                <ModalButtons
                  text="Approve"
                  close={closeApproveModal}
                  action={approveDriver}
                  disabled={disabled}
                />
              </ModalFooter>
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
                <h1 className="text-center">Delete Driver</h1>
              </ModalHeader>
              <ModalBody>
                <p className="text-lg">
                  Are you sure, you want to delete this Driver?
                </p>
              </ModalBody>
              <ModalFooter>
                <ModalButtons
                  text="Delete"
                  close={closeDeleteModal}
                  action={deleteDriver}
                  disabled={disabled}
                />
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Modal
            onClose={closeEditModal}
            isOpen={editModal}
            size="xl"
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton />
              <ModalBody>
                <div className="font-medium text-xl text-center mb-4 mt-10">
                  Select from following which info you want to edit
                </div>
                <div className="flex justify-center items-center gap-x-5 mb-10 [&>button]:bg-transparent [&>button]:py-2.5 [&>button]:px-5 [&>button]:font-medium [&>button]:text-base [&>button]:text-themePurple [&>button]:rounded [&>button]:border [&>button]:border-themePurple">
                  <button
                    onClick={() =>
                      driverDetails(
                        localStorage.getItem("driverId"),
                        "personal"
                      )
                    }
                    className="hover:bg-themePurple hover:text-white"
                  >
                    Personal info
                  </button>
                  <button
                    onClick={() =>
                      driverDetails(localStorage.getItem("driverId"), "vehicle")
                    }
                    className="hover:bg-themePurple hover:text-white"
                  >
                    Vehicle info
                  </button>
                  <button
                    onClick={() =>
                      driverDetails(localStorage.getItem("driverId"), "license")
                    }
                    className="hover:bg-themePurple hover:text-white"
                  >
                    License info
                  </button>
                </div>
              </ModalBody>
            </ModalContent>
          </Modal>
          <section className="space-y-3">
            <div className="flex">
              <TabButton text="Approved" set={setTab} tab={tab} width="w-40" />
              <TabButton text="Pending" set={setTab} tab={tab} width="w-40" />
              <TabButton
                text="Associated"
                set={setTab}
                tab={tab}
                width="w-40"
              />
              <TabButton
                text="Incomplete"
                set={setTab}
                tab={tab}
                width="w-40"
              />
              <TabButton text="Rejected" set={setTab} tab={tab} width="w-40" />
            </div>
            <div className="flex justify-end gap-x-5">
              {tab === "Associated" && (
                <div className="w-80 inner">
                  <Select
                    value={wareFilter}
                    onChange={(e) => {
                      setWareFilter(e);
                      setSearch("");
                      setSelect("");
                    }}
                    options={wareOptions}
                    isClearable
                  />
                </div>
              )}
              <Link
                to={"/create-driver/step-one"}
                className="py-2.5 px-12 rounded bg-themePurple font-medium text-base text-white border border-themePurple hover:bg-transparent hover:text-themePurple"
              >
                Create Driver
              </Link>
            </div>
            <MyDataTable columns={columns} data={datas} dependancy={data} />
          </section>
        </>
      }
    />
  );
}
