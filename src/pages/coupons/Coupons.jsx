import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import moment from "moment/moment";
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
import AddButton, {
  DTDel,
  DTEdit,
  ModalButtons,
} from "../../utilities/Buttons";
import { inputStyle, labelStyle } from "../../utilities/Input";
import Layout from "../../components/Layout";

export default function Coupons() {
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const couponsFeatureId =
    featureData && featureData.find((ele) => ele.title === "Coupons")?.id;
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(null);
  const { data, reFetch } = GetAPI("getallcoupon", couponsFeatureId);
  const [loader, setLoader] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [addCoupon, setAddCoupon] = useState({
    code: "",
    value: "",
    from: "",
    to: "",
    type: "",
    condAmount: "",
  });
  const [updateCoupon, setUpdateCoupon] = useState({
    updateValue: "",
    updateFrom: "",
    updateTo: "",
    couponId: "",
  });
  const [addModal, setAddModal] = useState(false);
  const closeAddModal = () => {
    setAddModal(false);
    setAddCoupon({
      code: "",
      value: "",
      from: "",
      to: "",
      type: "",
      condAmount: "",
    });
  };
  const [updateModal, setUpdateModal] = useState(false);
  const closeUpdateModal = () => {
    setUpdateModal(false);
    setUpdateCoupon({
      updateValue: "",
      updateFrom: "",
      updateTo: "",
      couponId: "",
    });
  };
  const onChange = (e) => {
    setAddCoupon({ ...addCoupon, [e.target.name]: e.target.value });
  };
  const onChange2 = (e) => {
    setUpdateCoupon({ ...updateCoupon, [e.target.name]: e.target.value });
  };
  const addCouponFunc = async (e) => {
    e.preventDefault();
    if (addCoupon.code === "") {
      info_toaster("Please enter your Coupon's Code");
    } else if (addCoupon.value === "") {
      info_toaster("Please enter your Coupon's Value");
    } else if (addCoupon.from === "") {
      info_toaster("Please enter your Coupon's Start Date");
    } else if (addCoupon.to === "") {
      info_toaster("Please enter your Coupon's End Date");
    } else if (addCoupon.type === "") {
      info_toaster("Please enter your Coupon's Type");
    } else if (addCoupon.condAmount === "") {
      info_toaster("Please enter your Coupon's Amount");
    } else {
      setLoader(true);
      let res = await PostAPI("addcoupon", couponsFeatureId, {
        code: addCoupon.code,
        value: addCoupon.value,
        from: moment(addCoupon.from).format("MM-DD-YYYY"),
        to: moment(addCoupon.to).format("MM-DD-YYYY"),
        type: addCoupon.type,
        condAmount: addCoupon.condAmount,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setAddModal(false);
        setAddCoupon({
          code: "",
          value: "",
          from: "",
          to: "",
          type: "",
          condAmount: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const updateCouponFunc = async (e) => {
    e.preventDefault();
    if (updateCoupon.updateValue === "") {
      info_toaster("Please enter your Coupon's Value");
    } else if (updateCoupon.updateFrom === "") {
      info_toaster("Please enter your Coupon's Start Date");
    } else if (updateCoupon.updateTo === "") {
      info_toaster("Please enter your Coupon's End Date");
    } else {
      setLoader(true);
      let res = await PutAPI("updatecoupon", couponsFeatureId, {
        value: updateCoupon.updateValue,
        from: moment(updateCoupon.updateFrom).format("MM-DD-YYYY"),
        to: moment(updateCoupon.updateTo).format("MM-DD-YYYY"),
        couponId: updateCoupon.couponId,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setUpdateModal(false);
        setUpdateCoupon({
          updateValue: "",
          updateFrom: "",
          updateTo: "",
          couponId: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const changeCouponFunc = async (status, couponId) => {
    setDisabled(true);
    let res = await PutAPI("couponstatus", couponsFeatureId, {
      status: status,
      couponId: couponId,
    });
    if (res?.data?.status === "1") {
      reFetch();
      if (status) {
        success_toaster(res?.data?.message);
      } else {
        info_toaster(res?.data?.message);
      }
      setDisabled(false);
    } else {
      error_toaster(res?.data?.message);
      setDisabled(false);
    }
  };
  const deleteCouponFunc = async (couponId) => {
    setDisabled(true);
    let res = await PutAPI("deletecoupon", couponsFeatureId, {
      couponId: couponId,
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
  const getCoupons = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.couponData?.filter(
            (coup) =>
              search === "" ||
              select === null ||
              ((coup?.code).toLowerCase().includes(search.toLowerCase()) &&
                select.value === "1") ||
              ((coup?.value).toString().includes(search.toLowerCase()) &&
                select.value === "2") ||
              ((coup?.type).toLowerCase().includes(search.toLowerCase()) &&
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
      name: "Coupon Code",
      selector: (row) => row.code,
    },
    {
      name: `Amount(${data?.data?.currencyUnit})`,
      selector: (row) => row.value,
    },
    {
      name: "Valid from",
      selector: (row) => row.from,
    },
    {
      name: "Valid till",
      selector: (row) => row.till,
    },
    {
      name: "Type",
      selector: (row) => row.type,
    },
    {
      name: `Conditional Amount(${data?.data?.currencyUnit})`,
      selector: (row) => row.amount,
    },
    {
      name: "Status",
      selector: (row) => row.status,
    },
  ];
  const datas = [];
  getCoupons()?.map((coup, index) =>
    datas.push({
      id: index + 1,
      action: (
        <div className="flex gap-x-2">
          <DTEdit
            edit={() => {
              setUpdateModal(true);
              setUpdateCoupon({
                ...updateCoupon,
                updateValue: coup?.value,
                updateFrom: moment(coup?.from, "DD/MM/YYYY").format(
                  "YYYY-MM-DD"
                ),
                updateTo: moment(coup?.to, "DD/MM/YYYY").format("YYYY-MM-DD"),
                couponId: coup?.id,
              });
            }}
          />
          <DTDel del={() => deleteCouponFunc(coup?.id)} disabled={disabled} />
        </div>
      ),
      code: coup?.code,
      value: coup?.value,
      from: coup?.from,
      till: coup?.to,
      type: coup?.type,
      amount: coup?.condAMount,
      status: coup?.status ? (
        <button
          onClick={() => changeCouponFunc(false, coup?.id)}
          disabled={disabled}
          className={active}
        >
          Active
        </button>
      ) : (
        <button
          onClick={() => changeCouponFunc(true, coup?.id)}
          disabled={disabled}
          className={block}
        >
          Inactive
        </button>
      ),
    })
  );
  return data.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      search={true}
      value={search}
      onChange={(e) => setSearch(e.target.value.replace(/\+/g, ""))}
      options={[
        { value: "1", label: "Code" },
        { value: "2", label: "Amount" },
        { value: "3", label: "Type" },
      ]}
      selectValue={select}
      selectOnChange={(e) => {
        setSelect(e);
        e === null && setSearch("");
      }}
      title="Coupons"
      content={
        <>
          <Modal onClose={closeAddModal} isOpen={addModal} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent>
              <form>
                <ModalHeader>
                  <h1 className="text-center">Add Coupon</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-[532px]">
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="code">
                          Coupon Code
                        </label>
                        <input
                          value={addCoupon.code}
                          onChange={onChange}
                          type="text"
                          name="code"
                          id="code"
                          placeholder="Enter your Coupon's Code"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="value">
                          Coupon Value
                        </label>
                        <input
                          value={addCoupon.value}
                          onChange={onChange}
                          type="number"
                          name="value"
                          id="value"
                          placeholder="Enter your Coupon's Value"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="from">
                          Coupon Valid From
                        </label>
                        <input
                          value={addCoupon.from}
                          onChange={onChange}
                          type="date"
                          name="from"
                          id="from"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="to">
                          Coupon Valid To
                        </label>
                        <input
                          value={addCoupon.to}
                          onChange={onChange}
                          type="date"
                          name="to"
                          id="to"
                          className={inputStyle}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="type">
                          Coupon Type
                        </label>
                        <input
                          value={addCoupon.type}
                          onChange={onChange}
                          type="text"
                          name="type"
                          id="type"
                          placeholder="Enter your Coupon's Type"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="condAmount">
                          Coupon Amount
                        </label>
                        <input
                          value={addCoupon.condAmount}
                          onChange={onChange}
                          type="number"
                          name="condAmount"
                          id="condAmount"
                          placeholder="Enter your Coupon's Amount"
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
                    action={addCouponFunc}
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
                  <h1 className="text-center">Update Coupon</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-[268px]">
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateValue">
                          Coupon Value
                        </label>
                        <input
                          value={updateCoupon.updateValue}
                          onChange={onChange2}
                          type="text"
                          name="updateValue"
                          id="updateValue"
                          placeholder="Enter your Coupon's Value"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateFrom">
                          Coupon Valid From
                        </label>
                        <input
                          value={updateCoupon.updateFrom}
                          onChange={onChange2}
                          type="date"
                          name="updateFrom"
                          id="updateFrom"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateTo">
                          Coupon Valid To
                        </label>
                        <input
                          value={updateCoupon.updateTo}
                          onChange={onChange2}
                          type="date"
                          name="updateTo"
                          id="updateTo"
                          className={inputStyle}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </div>
                  </ModalBody>
                )}
                <ModalFooter>
                  <ModalButtons
                    text="Update"
                    close={closeUpdateModal}
                    action={updateCouponFunc}
                  />
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <section className="space-y-3">
            <div className="flex justify-end">
              <AddButton text="Coupon" modal={setAddModal} />
            </div>
            <MyDataTable columns={columns} data={datas} dependancy={data} />
          </section>
        </>
      }
    />
  );
}
