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
import { inputStyle, labelStyle } from "../../utilities/Input";
import Layout from "../../components/Layout";

export default function FAQ() {
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const faqFeatureId =
    featureData && featureData.find((ele) => ele.title === "FAQ's")?.id;
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(null);
  const { data, reFetch } = GetAPI("allfaqs", faqFeatureId);
  const [loader, setLoader] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [modalType, setModalType] = useState("");
  const [addFAQ, setAddFAQ] = useState({
    title: "",
    answer: "",
  });
  const [updateFAQ, setUpdateFAQ] = useState({
    updateTitle: "",
    updateAnswer: "",
    faqId: "",
  });
  const [addModal, setAddModal] = useState(false);
  const closeAddModal = () => {
    setAddModal(false);
    setAddFAQ({ title: "", answer: "" });
  };
  const [updateModal, setUpdateModal] = useState(false);
  const closeUpdateModal = () => {
    setUpdateModal(false);
    setModalType("");
    setUpdateFAQ({ updateTitle: "", updateAnswer: "", faqId: "" });
  };
  const onChange = (e) => {
    setAddFAQ({ ...addFAQ, [e.target.name]: e.target.value });
  };
  const onChange2 = (e) => {
    setUpdateFAQ({ ...updateFAQ, [e.target.name]: e.target.value });
  };
  const addFAQFunc = async (e) => {
    e.preventDefault();
    if (addFAQ.title === "") {
      info_toaster("Please enter your FAQ's title");
    } else if (addFAQ.answer === "") {
      info_toaster("Please enter your FAQ's answer");
    } else {
      setLoader(true);
      let res = await PostAPI("addfaq", faqFeatureId, {
        title: addFAQ.title,
        answer: addFAQ.answer,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setAddModal(false);
        setAddFAQ({ title: "", answer: "" });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const updateFAQFunc = async (e) => {
    e.preventDefault();
    if (updateFAQ.updateTitle === "") {
      info_toaster("Please enter your FAQ's title");
    } else if (updateFAQ.updateAnswer === "") {
      info_toaster("Please enter your FAQ's answer");
    } else {
      setLoader(true);
      let res = await PutAPI("updatefaq", faqFeatureId, {
        title: updateFAQ.updateTitle,
        answer: updateFAQ.updateAnswer,
        faqId: updateFAQ.faqId,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setUpdateModal(false);
        setUpdateFAQ({ updateTitle: "", updateAnswer: "", faqId: "" });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const changeFAQfunc = async (status, faqId) => {
    setDisabled(true);
    let res = await PutAPI("changefaqstatus", faqFeatureId, {
      status: status,
      faqId: faqId,
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
  const getFAQ = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.filter(
            (faq) =>
              search === "" ||
              select === null ||
              ((faq?.title).toLowerCase().includes(search.toLowerCase()) &&
                select.value === "1") ||
              ((faq?.answer).toLowerCase().includes(search.toLowerCase()) &&
                select.value === "2")
          )
        : [];
    return filteredArray;
  };
  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
      maxWidth: "100px",
    },
    {
      name: "Action",
      selector: (row) => row.action,
    },
    {
      name: "Title",
      selector: (row) => row.title,
      wrap: true,
      minWidth: "320px",
    },
    {
      name: "Answer",
      selector: (row) => row.answer,
      minWidth: "600px",
    },
    {
      name: "Status",
      selector: (row) => row.status,
    },
  ];
  const datas = [];
  getFAQ()?.map((faq, index) =>
    datas.push({
      id: index + 1,
      action: (
        <div className="flex gap-x-2">
          <DTView
            view={() => {
              setUpdateModal(true);
              setModalType("view");
              setUpdateFAQ({
                updateTitle: faq?.title,
                updateAnswer: faq?.answer,
                faqId: faq?.id,
              });
            }}
          />
          <DTEdit
            edit={() => {
              setUpdateModal(true);
              setModalType("update");
              setUpdateFAQ({
                updateTitle: faq?.title,
                updateAnswer: faq?.answer,
                faqId: faq?.id,
              });
            }}
          />
        </div>
      ),
      title: faq?.title,
      answer: <div className="w-96">{faq?.answer}</div>,
      status: faq?.status ? (
        <button
          onClick={() => changeFAQfunc(false, faq?.id)}
          disabled={disabled}
          className={active}
        >
          Active
        </button>
      ) : (
        <button
          onClick={() => changeFAQfunc(true, faq?.id)}
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
        { value: "1", label: "Title" },
        { value: "2", label: "Answer" },
      ]}
      selectValue={select}
      selectOnChange={(e) => {
        setSelect(e);
        e === null && setSearch("");
      }}
      title="FAQ's"
      content={
        <>
          <Modal onClose={closeAddModal} isOpen={addModal} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent>
              <form>
                <ModalHeader>
                  <h1 className="text-center">Add FAQ</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-[278px]">
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="title">
                          FAQ Title
                        </label>
                        <input
                          value={addFAQ.title}
                          onChange={onChange}
                          type="text"
                          name="title"
                          id="title"
                          placeholder="Enter your FAQ's title"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="answer">
                          FAQ Answer
                        </label>
                        <textarea
                          value={addFAQ.answer}
                          onChange={onChange}
                          name="answer"
                          id="answer"
                          rows={5}
                          placeholder="Enter your FAQ's answer"
                          className={inputStyle}
                        ></textarea>
                      </div>
                    </div>
                  </ModalBody>
                )}
                <ModalFooter>
                  <ModalButtons
                    text="Add"
                    close={closeAddModal}
                    action={addFAQFunc}
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
                  <h1 className="text-center">
                    {modalType === "update" ? "Update FAQ" : "FAQ Details"}
                  </h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-[278px]">
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateTitle">
                          FAQ Title
                        </label>
                        <input
                          value={updateFAQ.updateTitle}
                          onChange={onChange2}
                          type="text"
                          name="updateTitle"
                          id="updateTitle"
                          readOnly={modalType === "view" ? true : false}
                          placeholder="Enter your FAQ's title"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateAnswer">
                          FAQ Answer
                        </label>
                        <textarea
                          value={updateFAQ.updateAnswer}
                          onChange={onChange2}
                          name="updateAnswer"
                          id="updateAnswer"
                          rows={modalType === "view" ? 10 : 5}
                          readOnly={modalType === "view" ? true : false}
                          placeholder="Enter your FAQ's answer"
                          className={inputStyle}
                        ></textarea>
                      </div>
                    </div>
                  </ModalBody>
                )}
                {modalType === "update" && (
                  <ModalFooter>
                    <ModalButtons
                      text="Update"
                      close={closeUpdateModal}
                      action={updateFAQFunc}
                    />
                  </ModalFooter>
                )}
              </form>
            </ModalContent>
          </Modal>
          <section className="space-y-3">
            <div className="flex justify-end">
              <AddButton text="FAQ" modal={setAddModal} />
            </div>
            <MyDataTable columns={columns} data={datas} dependancy={data} />
          </section>
        </>
      }
    />
  );
}
