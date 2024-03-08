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
import csvtojson from "csvtojson";
import React, { useRef, useState } from "react";
import { FaCloudUploadAlt, FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import GetAPI from "../../utilities/GetAPI";
import { PostAPI } from "../../utilities/PostAPI";
import { PutAPI } from "../../utilities/PutAPI";
import { blue, gray } from "../../utilities/CustomStyles";
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
  DTVerify,
  DTView,
  ModalButtons,
} from "../../utilities/Buttons";
import { inputStyle, labelStyle } from "../../utilities/Input";
import { BASE_URL } from "../../utilities/URL";
import Layout from "../../components/Layout";

export default function DBS() {
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const dbsFeatureId =
    featureData && featureData.find((ele) => ele.title === "All Addresses")?.id;
  const navigate = useNavigate();
  const importRef = useRef(null);
  const { data, reFetch } = GetAPI("alladdresses", dbsFeatureId);
  const [bulkData, setBulkData] = useState([]);
  const [importData, setImportData] = useState(false);
  // const code = GetAPI("generatecode", dbsFeatureId);
  const structureType = GetAPI("getstructypes", dbsFeatureId);
  const province = GetAPI("getprovince", dbsFeatureId);
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(null);
  const [loader, setLoader] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [createDBS, setCreateDBS] = useState({
    structureTypeId: "",
    buildingName: "",
    question0: "",
    question1: "",
    question2: "",
    question0_input: "",
    question1_input: "",
    question2_input: "",
    lati: "",
    lngi: "",
    provinceId: "",
    districtId: "",
    corregimientoId: "",
  });
  const [approveDBS, setApproveDBS] = useState({
    lat: "",
    lng: "",
    secondPostalCode: "",
    addressId: "",
  });
  const [updateDBS, setUpdateDBS] = useState({
    latitude: "",
    longitude: "",
    addressId: "",
  });
  function splitLatLng(str, type) {
    const [lat, lng] = str.split(",").map((co) => co.trim());
    if (type === "Approve") {
      setApproveDBS({ ...approveDBS, lat: lat, lng: lng });
    } else if (type === "Add") {
      setCreateDBS({ ...createDBS, lati: lat, lngi: lng });
    } else if (type === "Update") {
      setUpdateDBS({ ...updateDBS, latitude: lat, longitude: lng });
    }
  }
  const [createModal, setCreateModal] = useState(false);
  const closeCreateModal = () => {
    setCreateModal(false);
    setDistrictRes([]);
    setCorregimientoRes([]);
    setCreateDBS({
      structureTypeId: "",
      buildingName: "",
      question0: "",
      question1: "",
      question2: "",
      question0_input: "",
      question1_input: "",
      question2_input: "",
      lati: "",
      lngi: "",
      provinceId: "",
      districtId: "",
      corregimientoId: "",
    });
  };
  const [approveModal, setApproveModal] = useState(false);
  const closeApproveModal = () => {
    setApproveModal(false);
    setApproveDBS({ lat: "", lng: "", secondPostalCode: "", addressId: "" });
  };
  const onChange = (e) => {
    setCreateDBS({ ...createDBS, [e.target.name]: e.target.value });
  };
  const [updateModal, setUpdateModal] = useState(false);
  const closeUpdateModal = () => {
    setUpdateModal(false);
    setUpdateDBS({ latitude: "", longitude: "", addressId: "" });
  };
  const resetImportField = () => {
    importRef.current.value = "";
  };
  const handleBulkData = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const csvData = e.target.result;
      const jsonData = await csvtojson().fromString(csvData);
      setBulkData(jsonData);
      setImportData(true);
      resetImportField();
    };
    reader.readAsText(file);
  };
  const DBSdetailsFunc = async (id) => {
    setDisabled(true);
    localStorage.setItem("dbsId", id);
    navigate("/dbs-details");
  };
  const createDBSfunc = async (e) => {
    e.preventDefault();
    if (createDBS.structureTypeId === "") {
      info_toaster("Please select Structure Type");
    }
    // else if (createDBS.buildingName === "") {
    //   info_toaster("Please enter Building's Name");
    // }
    else if (createDBS.provinceId === "") {
      info_toaster("Please select province");
    } else if (createDBS.districtId === "") {
      info_toaster("Please select District");
    } else if (createDBS.corregimientoId === "") {
      info_toaster("Please select Corregimiento");
    } else if (createDBS.lati === "") {
      info_toaster("Please enter your Address's Latitude");
    } else if (createDBS.lngi === "") {
      info_toaster("Please enter your Address's Longitude");
    } else {
      setLoader(true);
      let res = await PostAPI("createzip", dbsFeatureId, {
        structureTypeId: createDBS.structureTypeId.value,
        buildingName: createDBS.buildingName,
        provinceId: createDBS.provinceId.value,
        districtId: createDBS.districtId.value,
        corregimientoId: createDBS.corregimientoId.value,
        lat: createDBS.lati,
        lng: createDBS.lngi,
        questionOne:
          createDBS.question0 === "yes" ? createDBS.question0_input : "",
        questionTwo:
          createDBS.question1 === "yes" ? createDBS.question1_input : "",
        questionThree:
          createDBS.question2 === "yes" ? createDBS.question2_input : "",
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setCreateModal(false);
        setDistrictRes([]);
        setCorregimientoRes([]);
        setCreateDBS({
          structureTypeId: "",
          buildingName: "",
          question0: "",
          question1: "",
          question2: "",
          question0_input: "",
          question1_input: "",
          question2_input: "",
          lati: "",
          lngi: "",
          provinceId: "",
          districtId: "",
          corregimientoId: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const approveDBSfunc = async (e) => {
    e.preventDefault();
    if (approveDBS.lat === "" || approveDBS.lat === undefined) {
      info_toaster("Please enter your Address's Latitude");
    } else if (approveDBS.lng === "" || approveDBS.lng === undefined) {
      info_toaster("Please enter your Address's Longitude");
    } else {
      setLoader(true);
      let res = await PostAPI("approveaddress", dbsFeatureId, {
        lat: approveDBS.lat,
        lng: approveDBS.lng,
        secondPostalCode: approveDBS.secondPostalCode,
        addressId: approveDBS.addressId,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setApproveModal(false);
        setApproveDBS({
          lat: "",
          lng: "",
          secondPostalCode: "",
          addressId: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const updateDBSfunc = async (e) => {
    e.preventDefault();
    if (updateDBS.latitude === "" || updateDBS.latitude === undefined) {
      info_toaster("Please enter your Address's Latitude");
    } else if (
      updateDBS.longitude === "" ||
      updateDBS.longitude === undefined
    ) {
      info_toaster("Please enter your Address's Longitude");
    } else {
      setLoader(true);
      let res = await PutAPI("editaddress", dbsFeatureId, {
        addressId: updateDBS.addressId,
        lat: updateDBS.latitude,
        lng: updateDBS.longitude,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setUpdateModal(false);
        setUpdateDBS({
          addressId: "",
          lat: "",
          lng: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const deleteDBSFunc = async (addressId) => {
    setDisabled(true);
    let res = await PutAPI("deleteaddress", dbsFeatureId, {
      addressId: addressId,
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
  const bulkImportData = async () => {
    let dataArray = [];
    bulkData.forEach((bulkData) => {
      dataArray.push({
        provinceId: bulkData.provinceId,
        province_title: bulkData.province_title,
        province_key: bulkData.province_key,
        district_title: bulkData.district_title,
        district_key: bulkData.district_key,
        corregimiento_value: bulkData.corregimiento_value,
        corregimiento: bulkData.corregimiento,
      });
    });
    let res = await PostAPI("importdbsdata", dbsFeatureId, {
      data: dataArray,
    });
    if (res?.data?.status === "1") {
      success_toaster(res?.data?.message);
      setBulkData([]);
      setImportData(false);
    } else {
      error_toaster(res?.data?.message);
      setBulkData([]);
      setImportData(false);
    }
  };
  const strutureOptions = [];
  const provinceOptions = [];
  const districtOptions = [];
  const corregimientoOptions = [];
  const [districtRes, setDistrictRes] = useState([]);
  const [corregimientoRes, setCorregimientoRes] = useState([]);
  structureType.data?.data?.structureData?.map((structureType, index) =>
    strutureOptions.push({
      value: structureType?.id,
      label: structureType?.title,
    })
  );
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
          BASE_URL + `getdistrict?featureId=${dbsFeatureId}&id=${id}`,
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
  const corregimientoFunc = async (id) => {
    var config = {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    };
    try {
      axios
        .get(
          BASE_URL +
            `getcorregimientoofdistrict?featureId=${dbsFeatureId}&id=${id}`,
          config
        )
        .then((dat) => {
          if (dat.data?.status === "1") {
            setCorregimientoRes(dat.data?.data?.corregimientoData);
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
  corregimientoRes?.map((corregimiento, index) =>
    corregimientoOptions.push({
      value: corregimiento?.id,
      label: corregimiento?.title,
    })
  );
  const getDBS = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.filter(
            (dbs) =>
              search === "" ||
              select === null ||
              ((
                (dbs?.postalCode).toLowerCase() +
                " " +
                (dbs?.secondPostalCode).toLowerCase()
              ).match(search.toLowerCase()) &&
                select.value === "1") ||
              ((
                (dbs?.postalCode).toLowerCase() +
                (dbs?.secondPostalCode).toLowerCase()
              ).match(search.toLowerCase()) &&
                select.value === "1") ||
              ((dbs?.buildingName).toLowerCase().match(search.toLowerCase()) &&
                select.value === "3") ||
              (dbs?.structureType?.title &&
                (dbs?.structureType?.title)
                  .toLowerCase()
                  .match(search.toLowerCase()) &&
                select.value === "2") ||
              (dbs?.corregimiento?.title &&
                (dbs?.corregimiento?.title)
                  .toLowerCase()
                  .match(search.toLowerCase()) &&
                select.value === "4") ||
              (dbs?.province?.title &&
                (dbs?.province?.title)
                  .toLowerCase()
                  .match(search.toLowerCase()) &&
                select.value === "5") ||
              (dbs?.district?.title &&
                (dbs?.district?.title)
                  .toLowerCase()
                  .match(search.toLowerCase()) &&
                select.value === "6") ||
              (dbs?.verified &&
                search === "Verified" &&
                select.value === "7") ||
              (dbs?.verified === false &&
                search === "Pending" &&
                select.value === "8") ||
              ((dbs?.date).match(search) && select.value === "9")
          )
        : [];
    return filteredArray;
  };

  const dbsData = getDBS();
  const sortedDBSData = dbsData?.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    return dateA - dateB;
  });

  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
    },
    {
      name: "Action",
      selector: (row) => row.action,
      minWidth: "220px",
    },
    {
      name: "DBS",
      selector: (row) => row.dbs,
    },
    {
      name: "Building Name",
      selector: (row) => row.buildingName,
    },
    {
      name: "Building Type",
      selector: (row) => row.building,
    },
    {
      name: "Date",
      selector: (row) => row.date,
    },
    {
      name: "User Name",
      selector: (row) => row.name,
    },
    {
      name: "Corregimiento",
      selector: (row) => row.corregimiento,
    },
    {
      name: "Province",
      selector: (row) => row.province,
    },
    {
      name: "District",
      selector: (row) => row.district,
    },
    {
      name: "Status",
      selector: (row) => row.status,
    },
  ];
  const datas = [];
  sortedDBSData?.map((dbs, index) => {
    return datas.push({
      id: index + 1,
      action: (
        <div className="flex gap-x-2">
          <a
            href={`https://wa.me/${dbs?.user?.countryCode}${dbs?.user?.phoneNum}?text=Hello this is pps location team we are here to verify the direction of your house.`}
            target="_blank"
            rel="noreferrer"
          >
            <FaWhatsapp size={32} />
          </a>
          <DTView view={() => DBSdetailsFunc(dbs?.id)} disabled={disabled} />
          <DTEdit
            edit={() => {
              setUpdateDBS({
                ...updateDBS,
                addressId: dbs?.id,
                latitude: dbs?.lat,
                longitude: dbs?.lng,
              });
              setUpdateModal(true);
            }}
          />
          {dbs?.verified === false && (
            <DTVerify
              verify={() => {
                setApproveModal(true);
                setApproveDBS({
                  lat: "",
                  lng: "",
                  secondPostalCode:
                    dbs?.secondPostalCode === "Pendiente"
                      ? ""
                      : dbs?.secondPostalCode,
                  addressId: dbs?.id,
                });
              }}
            />
          )}
          <DTDel del={() => deleteDBSFunc(dbs?.id)} disabled={disabled} />
        </div>
      ),
      dbs: dbs?.postalCode + " " + dbs?.secondPostalCode,
      buildingName: dbs?.buildingName,
      building: dbs?.structureType?.title,
      name:
        dbs?.user && dbs?.user !== null ? (
          dbs?.user?.firstName + " " + dbs?.user?.lastName
        ) : dbs?.webUser && dbs?.webUser !== null ? (
          dbs?.webUser?.firstName + " " + dbs?.webUser?.lastName
        ) : dbs?.warehouse && dbs?.warehouse !== null ? (
          dbs?.warehouse?.name
        ) : (
          <></>
        ),
      date: dbs?.date,
      corregimiento: dbs?.corregimiento?.title,
      province: dbs?.province?.title,
      district: dbs?.district?.title,
      status: dbs?.verified ? (
        <button className={blue}>Verified</button>
      ) : (
        <button className={gray}>Pending</button>
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
        { value: "1", label: "DBS #" },
        { value: "3", label: "Building Name" },
        { value: "2", label: "Building Type" },
        { value: "4", label: "Corregimiento" },
        { value: "5", label: "Province" },
        { value: "6", label: "District" },
        { value: "7", label: "Verified" },
        { value: "8", label: "Pending" },
        { value: "9", label: "Date" },
      ]}
      selectValue={select}
      selectOnChange={(e) => {
        setSelect(e);
        e === null && setSearch("");
        e && e.value === "7" && setSearch("Verified");
        e && e.value === "8" && setSearch("Pending");
      }}
      title="DBS Addresses"
      content={
        <>
          <Modal
            onClose={closeCreateModal}
            isOpen={createModal}
            size="3xl"
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <form>
                <ModalHeader>
                  <h1 className="text-center">Create Address</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div
                    className={
                      structureType.data?.data?.structureData.length === 1
                        ? "h-[354px]"
                        : "h-[270px]"
                    }
                  >
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-3">
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="buildingName">
                          Building Name
                        </label>
                        <input
                          value={createDBS.buildingName}
                          onChange={onChange}
                          type="text"
                          name="buildingName"
                          id="buildingName"
                          placeholder="Enter Building's Name"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="structureTypeId">
                          Structure Type
                        </label>
                        <Select
                          value={createDBS.structureTypeId}
                          onChange={(e) => {
                            setCreateDBS({
                              ...createDBS,
                              structureTypeId: e,
                              question0: "",
                              question1: "",
                              question2: "",
                            });
                            structureType.reFetch();
                          }}
                          options={strutureOptions}
                          inputId="structureTypeId"
                        />
                      </div>
                      {createDBS.structureTypeId !== "" &&
                        structureType.data?.data?.structureData
                          .find(
                            (ele) => ele.id === createDBS.structureTypeId.value
                          )
                          ?.structQuestions.map((struc, index) => (
                            <div className="col-span-2" key={index}>
                              <label
                                className={labelStyle}
                                htmlFor={`question${index}`}
                              >
                                {struc?.question}
                              </label>
                              <div className="flex gap-x-5">
                                <div className="flex items-center gap-x-1">
                                  <input
                                    onChange={onChange}
                                    type="radio"
                                    name={`question${index}`}
                                    id={`question${index}-yes`}
                                    value="yes"
                                  />
                                  <label htmlFor={`question${index}-yes`}>
                                    Yes
                                  </label>
                                </div>
                                <div className="flex items-center gap-x-1">
                                  <input
                                    onChange={onChange}
                                    type="radio"
                                    name={`question${index}`}
                                    id={`question${index}-no`}
                                    value="no"
                                  />
                                  <label htmlFor={`question${index}-no`}>
                                    No
                                  </label>
                                </div>
                              </div>
                              {createDBS[`question${index}`] === "yes" && (
                                <input
                                  onChange={onChange}
                                  type="text"
                                  name={`question${index}_input`}
                                  id={`question${index}_input`}
                                  placeholder="Enter..."
                                  className={inputStyle}
                                />
                              )}
                            </div>
                          ))}
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="provinceId">
                          Province
                        </label>
                        <Select
                          value={createDBS.provinceId}
                          onChange={(e) =>
                            setCreateDBS(
                              { ...createDBS, provinceId: e },
                              districtFunc(e.value)
                            )
                          }
                          options={provinceOptions}
                          inputId="provinceId"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="districtId">
                          District
                        </label>
                        <Select
                          value={createDBS.districtId}
                          onChange={(e) =>
                            setCreateDBS(
                              { ...createDBS, districtId: e },
                              corregimientoFunc(e.value)
                            )
                          }
                          options={districtOptions}
                          inputId="districtId"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="corregimientoId">
                          Corregimiento
                        </label>
                        <Select
                          value={createDBS.corregimientoId}
                          onChange={(e) =>
                            setCreateDBS({ ...createDBS, corregimientoId: e })
                          }
                          options={corregimientoOptions}
                          inputId="corregimientoId"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="lat">
                          Address Coordinates
                        </label>
                        <input
                          onChange={(e) => {
                            splitLatLng(e.target.value, "Add");
                          }}
                          type="text"
                          id="lat"
                          placeholder="31.4931172,74.1985346"
                          className={inputStyle}
                        />
                      </div>
                    </div>
                  </ModalBody>
                )}
                <ModalFooter>
                  <ModalButtons
                    text="Create"
                    close={closeCreateModal}
                    action={createDBSfunc}
                  />
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <Modal
            onClose={closeApproveModal}
            isOpen={approveModal}
            size="xl"
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <form>
                <ModalHeader>
                  <h1 className="text-center">Approve Address</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-[176px]">
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="space-y-4 h-40 pt-5">
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="lat">
                          Address Coordinates
                        </label>
                        <input
                          onChange={(e) => {
                            splitLatLng(e.target.value, "Approve");
                          }}
                          type="text"
                          id="lat"
                          placeholder="31.4931172,74.1985346"
                          className={inputStyle}
                        />
                      </div>
                    </div>
                  </ModalBody>
                )}
                <ModalFooter>
                  <ModalButtons
                    text="Approve"
                    close={closeApproveModal}
                    action={approveDBSfunc}
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
                  <h1 className="text-center">Update Address</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-[176px]">
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="space-y-4 h-40 pt-5">
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateLatLng">
                          Address Coordinates
                        </label>
                        <input
                          value={`${updateDBS.latitude ?? ""},${
                            updateDBS.longitude ?? ""
                          }`}
                          onChange={(e) => {
                            splitLatLng(e.target.value, "Update");
                          }}
                          type="text"
                          id="updateLatLng"
                          placeholder="31.4931172,74.1985346"
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
                    action={updateDBSfunc}
                  />
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <section className="space-y-3">
            <div className="flex justify-end gap-x-2">
              <label
                htmlFor="bulk"
                className="py-2.5 px-12 rounded bg-themePurple font-medium text-base text-white border border-themePurple hover:bg-transparent hover:text-themePurple cursor-pointer"
              >
                Import Data
              </label>
              <input
                type="file"
                onChange={handleBulkData}
                ref={importRef}
                id="bulk"
                name="bulk"
                className="hidden"
              />
              {importData && (
                <button
                  className="py-2.5 px-4 rounded bg-themePurple font-medium text-base text-white border border-themePurple hover:bg-transparent hover:text-themePurple"
                  onClick={bulkImportData}
                >
                  <FaCloudUploadAlt />
                </button>
              )}
              <AddButton text="DBS" modal={setCreateModal} />
            </div>
            <MyDataTable columns={columns} data={datas} dependancy={data} />
          </section>
        </>
      }
    />
  );
}
