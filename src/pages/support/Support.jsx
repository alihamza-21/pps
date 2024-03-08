import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { PutAPI } from "../../utilities/PutAPI";
import GetAPI from "../../utilities/GetAPI";
import Loader from "../../components/Loader";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../utilities/Toaster";
import { inputStyle, labelStyle } from "../../utilities/Input";
import Layout from "../../components/Layout";
import isValidEmail from "../../utilities/MailCheck";

export default function Support() {
  const remover = (str) => {
    if (str[0] === "+") {
      var result = str.slice(1);
    } else {
      result = str;
    }
    return result;
  };
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const supportFeatureId =
    featureData && featureData.find((ele) => ele.title === "Support")?.id;
  const { data, reFetch } = GetAPI("getsupport", supportFeatureId);
  const [disabled, setDisabled] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const updateSupport = async (value, supportId, fill) => {
    setDisabled(true);
    if (value === "") {
      info_toaster("Please fill the " + fill + " field!");
    } else if (fill === "email" && !isValidEmail(value)) {
      info_toaster("Please enter a valid email");
    } else {
      let res = await PutAPI("updatesupport", supportFeatureId, {
        value: fill === "phone" ? "+" + remover(value) : value,
        supportId: supportId,
      });
      if (res?.data?.status === "1") {
        if (value === email) {
          setEditEmail(false);
          setEmail("");
        } else {
          setEditPhone(false);
          setPhone("");
        }
        success_toaster(res?.data?.message);
        reFetch();
        setDisabled(false);
      } else {
        if (value === email) {
          setEditEmail(false);
          setEmail("");
        } else {
          setEditPhone(false);
          setPhone("");
        }
        error_toaster(res?.data?.message);
        setDisabled(false);
      }
    }
  };
  return data.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      title="Support"
      content={
        <section className="bg-white p-12 rounded-xl space-y-5">
          <form className="space-y-1">
            <label htmlFor="email" className={labelStyle}>
              Email
            </label>
            <div className="flex gap-x-5">
              <div className="w-fit relative">
                {editEmail ? (
                  <>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      id="email"
                      name="email"
                      className={inputStyle}
                      style={{ width: "384px" }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setEditEmail(false);
                        setEmail("");
                      }}
                      className="absolute top-1/2 right-2 -translate-y-1/2"
                    >
                      <IoMdClose size={20} />
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      value={
                        data?.status === "1" ? data?.data?.email?.value : ""
                      }
                      type="email"
                      id="email"
                      className={inputStyle}
                      style={{ width: "384px" }}
                      placeholder="Enter email"
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setEditEmail(true);
                        setEmail(data?.data?.email?.value);
                      }}
                      className="absolute top-1/2 right-2 -translate-y-1/2"
                    >
                      <FaEdit size={20} />
                    </button>
                  </>
                )}
              </div>
              {editEmail && (
                <button
                  type="submit"
                  disabled={disabled}
                  onClick={(e) => {
                    e.preventDefault();
                    updateSupport(email, data?.data?.email?.id, "email");
                  }}
                  className="py-2 px-6 bg-themePurple text-white rounded border border-themePurple hover:bg-transparent hover:text-themePurple"
                >
                  Save
                </button>
              )}
            </div>
          </form>
          <form className="space-y-1">
            <label htmlFor="phone" className={labelStyle}>
              Phone
            </label>
            <div className="flex gap-x-5">
              <div className="w-fit relative [&>div]:border-none">
                {editPhone ? (
                  <>
                    <PhoneInput
                      inputStyle={{
                        display: "block",
                        width: "384px",
                        paddingTop: "24px",
                        paddingBottom: "24px",
                        background: "#F4F7FF",
                        color: "black",
                        border: "none",
                      }}
                      inputProps={{ id: "phone", name: "phone" }}
                      country="Panama"
                      value={phone}
                      onChange={(phone) => setPhone(phone)}
                      onEnterKeyPress={(e) => {
                        e.preventDefault();
                        updateSupport(phone, data?.data?.phone?.id, "phone");
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setEditPhone(false);
                        setPhone("");
                      }}
                      className="absolute top-1/2 right-2 -translate-y-1/2"
                    >
                      <IoMdClose size={20} />
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      value={
                        data?.status === "1" ? data?.data?.phone?.value : ""
                      }
                      type="text"
                      id="phone"
                      className={inputStyle}
                      style={{ width: "384px" }}
                      placeholder="Enter phone no"
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setEditPhone(true);
                        setPhone(data?.data?.phone?.value);
                      }}
                      className="absolute top-1/2 right-2 -translate-y-1/2"
                    >
                      <FaEdit size={20} />
                    </button>
                  </>
                )}
              </div>
              {editPhone && (
                <button
                  type="submit"
                  disabled={disabled}
                  onClick={(e) => {
                    e.preventDefault();
                    updateSupport(phone, data?.data?.phone?.id, "phone");
                  }}
                  className="py-2 px-6 bg-themePurple text-white rounded border border-themePurple hover:bg-transparent hover:text-themePurple"
                >
                  Save
                </button>
              )}
            </div>
          </form>
        </section>
      }
    />
  );
}
