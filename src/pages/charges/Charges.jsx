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
import ChargesCard from "../../components/ChargesCard";

export default function Charges() {
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const chargesFeatureId =
    featureData && featureData.find((ele) => ele.title === "Charges")?.id;
  const [tab, setTab] = useState("General");
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(null);
  const [loader, setLoader] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const gen = GetAPI("getgencharges", chargesFeatureId);
  const dist = GetAPI("getdistancecharge", chargesFeatureId);
  const weight = GetAPI("getweightcharge", chargesFeatureId);
  const vol = GetAPI("getvolweicharge", chargesFeatureId);
  const [genCharge, setGenCharge] = useState({
    value: "",
    cId: "",
  });
  const [addCharge, setAddCharge] = useState({
    title: "",
    startValue: "",
    endValue: "",
    price: "",
  });
  const [updateCharge, setUpdateCharge] = useState({
    updateTitle: "",
    updateStartValue: "",
    updateEndValue: "",
    updatePrice: "",
    chargeId: "",
  });
  const [genModal, setGenModal] = useState(false);
  const closeGenModal = () => {
    setGenModal(false);
    setGenCharge({
      value: "",
      cId: "",
    });
  };
  const [addModal, setAddModal] = useState(false);
  const closeAddModal = () => {
    setAddModal(false);
    setAddCharge({
      title: "",
      startValue: "",
      endValue: "",
      price: "",
    });
  };
  const [updateModal, setUpdateModal] = useState(false);
  const closeUpdateModal = () => {
    setUpdateModal(false);
    setUpdateCharge({
      updateTitle: "",
      updateStartValue: "",
      updateEndValue: "",
      updatePrice: "",
      chargeId: "",
    });
  };
  const onChange = (e) => {
    setAddCharge({ ...addCharge, [e.target.name]: e.target.value });
  };
  const onChange2 = (e) => {
    setUpdateCharge({ ...updateCharge, [e.target.name]: e.target.value });
  };
  const addChargeFunc = async (e) => {
    e.preventDefault();
    if (addCharge.title === "") {
      info_toaster("Please enter your Charge's Title");
    } else if (addCharge.startValue === "") {
      info_toaster("Please enter your Charge's Min Range");
    } else if (addCharge.endValue === "") {
      info_toaster("Please enter your Charge's Max Range");
    } else if (addCharge.price === "") {
      info_toaster("Please enter your Charge's Price");
    } else {
      setLoader(true);
      let res = await PostAPI(
        tab === "Distance"
          ? "adddistancecharge"
          : tab === "Weight"
          ? "addweightcharge"
          : tab === "Vol-Weight"
          ? "addvolweicharge"
          : "",
        chargesFeatureId,
        {
          title: addCharge.title,
          startValue: addCharge.startValue,
          endValue: addCharge.endValue,
          price: addCharge.price,
        }
      );
      if (res?.data?.status === "1") {
        if (tab === "Distance") {
          dist.reFetch();
        } else if (tab === "Weight") {
          weight.reFetch();
        } else if (tab === "Vol-Weight") {
          vol.reFetch();
        }
        setLoader(false);
        success_toaster(res?.data?.message);
        setAddModal(false);
        setAddCharge({
          title: "",
          startValue: "",
          endValue: "",
          price: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const updateGenChargeFunc = async (e) => {
    e.preventDefault();
    if (genCharge.value === "") {
      info_toaster("Please enter your Charge's Value");
    } else {
      setLoader(true);
      let res = await PutAPI("updategencharges", chargesFeatureId, {
        value: genCharge.value,
        cId: genCharge.cId,
      });
      if (res?.data?.status === "1") {
        gen.reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setGenModal(false);
        setGenCharge({
          value: "genCharge.",
          cId: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const updateChargeFunc = async (e) => {
    e.preventDefault();
    if (updateCharge.updateTitle === "") {
      info_toaster("Please enter your Charge's Title");
    } else if (updateCharge.updateStartValue === "") {
      info_toaster("Please enter your Charge's Min Range");
    } else if (updateCharge.updateEndValue === "") {
      info_toaster("Please enter your Charge's Max Range");
    } else if (updateCharge.updatePrice === "") {
      info_toaster("Please enter your Charge's Price");
    } else {
      setLoader(true);
      let res = await PutAPI(
        tab === "Distance"
          ? "updatedistancecharge"
          : tab === "Weight"
          ? "updateweightcharge"
          : tab === "Vol-Weight"
          ? "updatevolweicharge"
          : "",
        chargesFeatureId,
        {
          title: updateCharge.updateTitle,
          startValue: updateCharge.updateStartValue,
          endValue: updateCharge.updateEndValue,
          price: updateCharge.updatePrice,
          chargeId: updateCharge.chargeId,
        }
      );
      if (res?.data?.status === "1") {
        if (tab === "Distance") {
          dist.reFetch();
        } else if (tab === "Weight") {
          weight.reFetch();
        } else if (tab === "Vol-Weight") {
          vol.reFetch();
        }
        setLoader(false);
        success_toaster(res?.data?.message);
        setUpdateModal(false);
        setUpdateCharge({
          updateTitle: "",
          updateStartValue: "",
          updateEndValue: "",
          updatePrice: "",
          chargeId: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const deleteChargeFunc = async (url, chargeId) => {
    setDisabled(true);
    let res = await PutAPI(url, chargesFeatureId, {
      chargeId: chargeId,
    });
    if (res?.data?.status === "1") {
      if (url === "deletedistancecharge") {
        dist.reFetch();
      } else if (url === "deleteweightcharge") {
        weight.reFetch();
      } else if (url === "deletevolweicharge") {
        vol.reFetch();
      }
      success_toaster(res?.data?.message);
      setDisabled(false);
    } else {
      error_toaster(res?.data?.message);
      setDisabled(false);
    }
  };
  const distCharges = () => {
    const filteredArray =
      dist?.data?.status === "1"
        ? dist?.data?.data?.distCharData?.filter(
            (dist) =>
              search === "" ||
              select === null ||
              ((dist?.title).toLowerCase().includes(search.toLowerCase()) &&
                select.value === "1") ||
              ((dist?.startValue).toString().includes(search.toLowerCase()) &&
                select.value === "2") ||
              ((dist?.endValue).toString().includes(search.toLowerCase()) &&
                select.value === "3") ||
              ((dist?.price).includes(search.toLowerCase()) &&
                select.value === "4") ||
              ((dist?.unit).includes(search.toLowerCase()) &&
                select.value === "5")
          )
        : [];
    return filteredArray;
  };
  const weightCharges = () => {
    const filteredArray =
      weight?.data?.status === "1"
        ? weight?.data?.data?.weightCharData?.filter(
            (weight) =>
              search === "" ||
              select === null ||
              ((weight?.title).toLowerCase().includes(search.toLowerCase()) &&
                select.value === "1") ||
              ((weight?.startValue).toString().includes(search.toLowerCase()) &&
                select.value === "2") ||
              ((weight?.endValue).toString().includes(search.toLowerCase()) &&
                select.value === "3") ||
              ((weight?.price).includes(search.toLowerCase()) &&
                select.value === "4") ||
              ((weight?.unit).includes(search.toLowerCase()) &&
                select.value === "5")
          )
        : [];
    return filteredArray;
  };
  const volCharges = () => {
    const filteredArray =
      vol?.data?.status === "1"
        ? vol?.data?.data?.weightCharData?.filter(
            (vol) =>
              search === "" ||
              select === null ||
              ((vol?.title).toLowerCase().includes(search.toLowerCase()) &&
                select.value === "1") ||
              ((vol?.startValue).toString().includes(search.toLowerCase()) &&
                select.value === "2") ||
              ((vol?.endValue).toString().includes(search.toLowerCase()) &&
                select.value === "3") ||
              ((vol?.price).includes(search.toLowerCase()) &&
                select.value === "4") ||
              ((vol?.unit).includes(search.toLowerCase()) &&
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
      name: "Title",
      selector: (row) => row.title,
    },
    {
      name: "Min Value",
      selector: (row) => row.min,
    },
    {
      name: "Max Value",
      selector: (row) => row.max,
    },
    {
      name: `Price(${dist?.data?.data?.currencyUnit})`,
      selector: (row) => row.price,
    },
    {
      name: "Unit",
      selector: (row) => row.unit,
    },
  ];
  const datas = [];
  if (tab === "Distance") {
    distCharges()?.map((dist, index) =>
      datas.push({
        id: index + 1,
        action: (
          <div className="flex gap-x-2">
            <DTEdit
              edit={() => {
                setUpdateModal(true);
                setUpdateCharge({
                  updateTitle: dist?.title,
                  updateStartValue: dist?.startValue,
                  updateEndValue: dist?.endValue,
                  updatePrice: dist?.price,
                  chargeId: dist?.id,
                });
              }}
            />
            <DTDel
              del={() => deleteChargeFunc("deletedistancecharge", dist?.id)}
              disabled={disabled}
            />
          </div>
        ),
        title: dist?.title,
        min: dist?.startValue,
        max: dist?.endValue,
        price: dist?.price,
        unit: dist?.unit,
      })
    );
  } else if (tab === "Weight") {
    weightCharges()?.map((weight, index) =>
      datas.push({
        id: index + 1,
        action: (
          <div className="flex gap-x-2">
            <DTEdit
              edit={() => {
                setUpdateModal(true);
                setUpdateCharge({
                  updateTitle: weight?.title,
                  updateStartValue: weight?.startValue,
                  updateEndValue: weight?.endValue,
                  updatePrice: weight?.price,
                  chargeId: weight?.id,
                });
              }}
            />
            <DTDel
              del={() => deleteChargeFunc("deleteweightcharge", weight?.id)}
              disabled={disabled}
            />
          </div>
        ),
        title: weight?.title,
        min: weight?.startValue,
        max: weight?.endValue,
        price: weight?.price,
        unit: weight?.unit,
      })
    );
  } else if (tab === "Vol-Weight") {
    volCharges()?.map((vol, index) =>
      datas.push({
        id: index + 1,
        action: (
          <div className="flex gap-x-2">
            <DTEdit
              edit={() => {
                setUpdateModal(true);
                setUpdateCharge({
                  updateTitle: vol?.title,
                  updateStartValue: vol?.startValue,
                  updateEndValue: vol?.endValue,
                  updatePrice: vol?.price,
                  chargeId: vol?.id,
                });
              }}
            />
            <DTDel
              del={() => deleteChargeFunc("deletevolweicharge", vol?.id)}
              disabled={disabled}
            />
          </div>
        ),
        title: vol?.title,
        min: vol?.startValue,
        max: vol?.endValue,
        price: vol?.price,
        unit: vol?.unit,
      })
    );
  }
  return gen?.data.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      search={true}
      value={search}
      onChange={(e) => setSearch(e.target.value.replace(/\+/g, ""))}
      options={[
        { value: "1", label: "Title" },
        { value: "2", label: "Min Value" },
        { value: "3", label: "Max Value" },
        { value: "4", label: "Price" },
        { value: "5", label: "Unit" },
      ]}
      selectValue={select}
      selectOnChange={(e) => {
        setSelect(e);
        e === null && setSearch("");
      }}
      title="Charges Management"
      content={
        <>
          <Modal onClose={closeGenModal} isOpen={genModal} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent>
              <form>
                <ModalHeader>
                  <h1 className="text-center">Update Charge</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-[176px]">
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="h-40 pt-5">
                      <label className={labelStyle} htmlFor="value">
                        Value
                      </label>
                      <input
                        value={genCharge.value}
                        onChange={(e) =>
                          setGenCharge({
                            ...genCharge,
                            [e.target.name]: e.target.value,
                          })
                        }
                        type="text"
                        name="value"
                        id="value"
                        placeholder="Enter your Charge's Value"
                        className={inputStyle}
                      />
                    </div>
                  </ModalBody>
                )}
                <ModalFooter>
                  <ModalButtons
                    text="Update"
                    close={closeGenModal}
                    action={updateGenChargeFunc}
                  />
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <Modal onClose={closeAddModal} isOpen={addModal} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent>
              <form>
                <ModalHeader>
                  <h1 className="text-center">Add Charge</h1>
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
                          Title
                        </label>
                        <input
                          value={addCharge.title}
                          onChange={onChange}
                          type="text"
                          name="title"
                          id="title"
                          placeholder="Enter your Charge's Title"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="startValue">
                          Min Range
                        </label>
                        <input
                          value={addCharge.startValue}
                          onChange={onChange}
                          type="number"
                          name="startValue"
                          id="startValue"
                          placeholder="Enter your Charge's Min Range"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="endValue">
                          Max Range
                        </label>
                        <input
                          value={addCharge.endValue}
                          onChange={onChange}
                          type="number"
                          name="endValue"
                          id="endValue"
                          placeholder="Enter your Charge's Max Range"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="endVapricelue">
                          Price
                        </label>
                        <input
                          value={addCharge.price}
                          onChange={onChange}
                          type="number"
                          name="price"
                          id="price"
                          placeholder="Enter your Charge's Price"
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
                    action={addChargeFunc}
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
                  <h1 className="text-center">Update Charge</h1>
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
                          Title
                        </label>
                        <input
                          value={updateCharge.updateTitle}
                          onChange={onChange2}
                          type="text"
                          name="updateTitle"
                          id="updateTitle"
                          placeholder="Enter your Charge's Title"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          className={labelStyle}
                          htmlFor="updateStartValue"
                        >
                          Min Range
                        </label>
                        <input
                          value={updateCharge.updateStartValue}
                          onChange={onChange2}
                          type="number"
                          name="updateStartValue"
                          id="updateStartValue"
                          placeholder="Enter your Charge's Min Range"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateEndValue">
                          Max Range
                        </label>
                        <input
                          value={updateCharge.updateEndValue}
                          onChange={onChange2}
                          type="number"
                          name="updateEndValue"
                          id="updateEndValue"
                          placeholder="Enter your Charge's Max Range"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updatePrice">
                          Price
                        </label>
                        <input
                          value={updateCharge.updatePrice}
                          onChange={onChange2}
                          type="number"
                          name="updatePrice"
                          id="updatePrice"
                          placeholder="Enter your Charge's Price"
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
                    action={updateChargeFunc}
                  />
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <section className="space-y-12">
            <div className="flex">
              <TabButton text="General" set={setTab} tab={tab} width="w-40" />
              <TabButton text="Distance" set={setTab} tab={tab} width="w-40" />
              <TabButton text="Weight" set={setTab} tab={tab} width="w-40" />
              <TabButton
                text="Vol-Weight"
                set={setTab}
                tab={tab}
                width="w-40"
              />
            </div>
            {tab === "General" ? (
              gen?.data?.status === "1" ? (
                <section className="grid grid-cols-4 gap-x-8">
                  <ChargesCard
                    info={gen?.data?.data?.volmetricConversion?.information}
                    value={gen?.data?.data?.volmetricConversion?.value}
                    textColor="text-purple-400"
                    onClick={() => {
                      setGenModal(true);
                      setGenCharge({
                        value: gen?.data?.data?.volmetricConversion?.value,
                        cId: gen?.data?.data?.volmetricConversion?.id,
                      });
                    }}
                  />
                  <ChargesCard
                    info={gen?.data?.data?.VAT?.information}
                    value={gen?.data?.data?.VAT?.value}
                    textColor="text-purple-700"
                    onClick={() => {
                      setGenModal(true);
                      setGenCharge({
                        value: gen?.data?.data?.VAT?.value,
                        cId: gen?.data?.data?.VAT?.id,
                      });
                    }}
                  />
                  <ChargesCard
                    info={gen?.data?.data?.packing?.information}
                    value={
                      gen?.data?.data?.currencyUnit +
                      "" +
                      gen?.data?.data?.packing?.value
                    }
                    textColor="text-blue-400"
                    onClick={() => {
                      setGenModal(true);
                      setGenCharge({
                        value: gen?.data?.data?.packing?.value,
                        cId: gen?.data?.data?.packing?.id,
                      });
                    }}
                  />
                  <ChargesCard
                    info={gen?.data?.data?.service?.information}
                    value={
                      gen?.data?.data?.currencyUnit +
                      "" +
                      gen?.data?.data?.service?.value
                    }
                    textColor="text-blue-700"
                    onClick={() => {
                      setGenModal(true);
                      setGenCharge({
                        value: gen?.data?.data?.service?.value,
                        cId: gen?.data?.data?.service?.id,
                      });
                    }}
                  />
                </section>
              ) : (
                <h1 className="my-4 text-center">
                  You are not authorized to access it
                </h1>
              )
            ) : (
              <section className="space-y-3">
                <div className="flex justify-end">
                  <AddButton text="Charge" modal={setAddModal} />
                </div>
                <MyDataTable
                  columns={columns}
                  data={datas}
                  dependancy={
                    tab === "Distance"
                      ? dist?.data
                      : tab === "Weight"
                      ? weight?.data
                      : vol?.data
                  }
                />
              </section>
            )}
          </section>
        </>
      }
    />
  );
}
