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
import Select from "react-select";
import GetAPI from "../../utilities/GetAPI";
import { PostAPI } from "../../utilities/PostAPI";
import MyDataTable from "../../components/MyDataTable";
import Loader, { MiniLoader } from "../../components/Loader";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../utilities/Toaster";
import { DTDel, DTResend, ModalButtons } from "../../utilities/Buttons";
import { inputStyle, labelStyle } from "../../utilities/Input";
import Layout from "../../components/Layout";
import { PutAPI } from "../../utilities/PutAPI";

export default function Notifications() {
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const notificationsFeatureId =
    featureData && featureData.find((ele) => ele.title === "Notifications")?.id;
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(null);
  const { data, reFetch } = GetAPI("getnotdata", notificationsFeatureId);
  const [loader, setLoader] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [sendNotification, setSendNotification] = useState({
    sendTo: "",
    title: "",
    body: "",
  });
  const [sendModal, setSendModal] = useState(false);
  const closeSendModal = () => {
    setSendModal(false);
    setSendNotification({
      sendTo: "",
      title: "",
      body: "",
    });
  };
  const onChange = (e) => {
    setSendNotification({
      ...sendNotification,
      [e.target.name]: e.target.value,
    });
  };
  const sendNotificationFunc = async (e) => {
    e.preventDefault();
    if (sendNotification.title === "") {
      info_toaster("Please enter your Notification's Title");
    } else if (sendNotification.body === "") {
      info_toaster("Please enter your Notification's Mesage");
    } else if (sendNotification.sendTo === "") {
      info_toaster("Please select to whom you wanna send your notification");
    } else {
      setLoader(true);
      let res = await PostAPI("pushnotifications", notificationsFeatureId, {
        sendTo: sendNotification.sendTo.value,
        title: sendNotification.title,
        body: sendNotification.body,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setSendModal(false);
        setSendNotification({
          sendTo: "",
          title: "",
          body: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const options = [
    { value: "all", label: "All" },
    { value: "customers", label: "Customers" },
    { value: "drivers", label: "Drivers" },
  ];
  const resendNotificationFunc = async (notId) => {
    setDisabled(true);
    let res = await PostAPI("resendnotification", notificationsFeatureId, {
      notId: notId,
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
  const deleteNotificationFunc = async (notId) => {
    setDisabled(true);
    let res = await PutAPI("deletenotification", notificationsFeatureId, {
      notId: notId,
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
  const getNotifications = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.filter(
            (not) =>
              search === "" ||
              select === null ||
              ((not?.title).toLowerCase().includes(search.toLowerCase()) &&
                select.value === "1") ||
              ((not?.body).toLowerCase().includes(search.toLowerCase()) &&
                select.value === "2") ||
              ((not?.to).toLowerCase().includes(search.toLowerCase()) &&
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
      name: "Title",
      selector: (row) => row.title,
    },
    {
      name: "Message",
      selector: (row) => row.message,
    },
    {
      name: "Sent To",
      selector: (row) => row.to,
    },
    {
      name: "Sent At",
      selector: (row) => row.at,
    },
  ];
  const datas = [];
  getNotifications()?.map((not, index) =>
    datas.push({
      id: index + 1,
      action: (
        <div className="flex gap-x-2">
          <DTResend
            resend={() => resendNotificationFunc(not?.id)}
            disabled={disabled}
          />
          <DTDel
            del={() => deleteNotificationFunc(not?.id)}
            disabled={disabled}
          />
        </div>
      ),
      title: not?.title,
      message: not?.body,
      to: <span className="capitalize">{not?.to}</span>,
      at: not?.at,
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
        { value: "1", label: "Title" },
        { value: "2", label: "Message" },
        { value: "3", label: "Sent To" },
      ]}
      selectValue={select}
      selectOnChange={(e) => {
        setSelect(e);
        e === null && setSearch("");
      }}
      title="Notifications"
      content={
        <>
          <Modal
            onClose={closeSendModal}
            isOpen={sendModal}
            size="xl"
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <form>
                <ModalHeader>
                  <h1 className="text-center">Send Notification</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-[350px]">
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 col-span-2">
                        <div className="space-y-1 col-span-2">
                          <label className={labelStyle} htmlFor="sendTo">
                            Send To
                          </label>
                          <Select
                            value={sendNotification.sendTo}
                            onChange={(e) =>
                              setSendNotification({
                                ...sendNotification,
                                sendTo: e,
                              })
                            }
                            options={options}
                            inputId="sendTo"
                          />
                        </div>
                        <label className={labelStyle} htmlFor="title">
                          Title
                        </label>
                        <input
                          value={sendNotification.title}
                          onChange={onChange}
                          type="text"
                          name="title"
                          id="title"
                          placeholder="Enter your Notification's Title"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className={labelStyle} htmlFor="title">
                          Message
                        </label>
                        <textarea
                          value={sendNotification.body}
                          onChange={onChange}
                          name="body"
                          id="body"
                          placeholder="Enter your Notification's Message"
                          className={inputStyle}
                          rows="5"
                        ></textarea>
                      </div>
                    </div>
                  </ModalBody>
                )}
                <ModalFooter>
                  <ModalButtons
                    text="Send"
                    close={closeSendModal}
                    action={sendNotificationFunc}
                  />
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <section className="space-y-3">
            <div className="flex justify-end">
              <button
                onClick={() => setSendModal(true)}
                className="py-2.5 px-12 rounded bg-themePurple font-medium text-base text-white border border-themePurple hover:bg-transparent hover:text-themePurple"
              >
                Send Notification
              </button>
            </div>
            <MyDataTable columns={columns} data={datas} dependancy={data} />
          </section>
        </>
      }
    />
  );
}
