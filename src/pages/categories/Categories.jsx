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
import Loader, { MiniLoader } from "../..//components/Loader";
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

export default function Categories() {
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const categoriesFeatureId =
    featureData && featureData.find((ele) => ele.title === "Categories")?.id;
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const { data, reFetch } = GetAPI("getallcategory", categoriesFeatureId);
  const [loader, setLoader] = useState(false);
  const [addCategory, setAddCategory] = useState({
    title: "",
    charge: "",
  });
  const [updateCategory, setUpdateCategory] = useState({
    updateTitle: "",
    updateCharge: "",
    categoryId: "",
  });
  const [addModal, setAddModal] = useState(false);
  const closeAddModal = () => {
    setAddModal(false);
    setAddCategory({ title: "", charge: "" });
  };
  const [updateModal, setUpdateModal] = useState(false);
  const closeUpdateModal = () => {
    setUpdateModal(false);
    setUpdateCategory({ updateTitle: "", updateCharge: "", categoryId: "" });
  };
  const onChange = (e) => {
    setAddCategory({ ...addCategory, [e.target.name]: e.target.value });
  };
  const onChange2 = (e) => {
    setUpdateCategory({ ...updateCategory, [e.target.name]: e.target.value });
  };
  const addCategoryFunc = async (e) => {
    e.preventDefault();
    if (addCategory.title === "") {
      info_toaster("Please enter your Category's Title");
    } else if (addCategory.charge === "") {
      info_toaster("Please enter your Category's Charge");
    } else {
      setLoader(true);
      let res = await PostAPI("addcategory", categoriesFeatureId, {
        title: addCategory.title,
        charge: addCategory.charge,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setAddModal(false);
        setAddCategory({ title: "", charge: "" });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const updateCategoryFunc = async (e) => {
    e.preventDefault();
    if (updateCategory.updateTitle === "") {
      info_toaster("Please enter your Category's Title");
    } else if (updateCategory.updateCharge === "") {
      info_toaster("Please enter your Category's Charge");
    } else {
      setLoader(true);
      let res = await PutAPI("updatecategory", categoriesFeatureId, {
        title: updateCategory.updateTitle,
        charge: updateCategory.updateCharge,
        categoryId: updateCategory.categoryId,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setUpdateModal(false);
        setUpdateCategory({
          updateTitle: "",
          updateCharge: "",
          categoryId: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const changeCategoryFunc = async (status, categoryId) => {
    setDisabled(true);
    let res = await PutAPI("categorystatus", categoriesFeatureId, {
      status: status,
      categoryId: categoryId,
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
  const getCategories = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.categoryData?.filter(
            (cat) =>
              search === "" ||
              select === null ||
              ((cat?.title).toLowerCase().includes(search.toLowerCase()) &&
                select.value === "1") ||
              ((cat?.charge).toString().includes(search.toLowerCase()) &&
                select.value === "2")
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
      name: `Charge(${data?.data?.currencyUnit})`,
      selector: (row) => row.charge,
    },
  ];
  const datas = [];
  getCategories()?.map((cat, index) =>
    datas.push({
      id: index + 1,
      action: (
        <div className="flex gap-x-2">
          <DTEdit
            edit={() => {
              setUpdateModal(true);
              setUpdateCategory({
                updateTitle: cat?.title,
                updateCharge: cat?.charge,
                categoryId: cat?.id,
              });
            }}
          />
          <DTDel
            del={() => changeCategoryFunc(false, cat?.id)}
            disabled={disabled}
          />
        </div>
      ),
      title: cat?.title,
      charge: cat?.charge,
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
        { value: "2", label: "Charge" },
      ]}
      selectValue={select}
      selectOnChange={(e) => {
        setSelect(e);
        e === null && setSearch("");
      }}
      title="Categories"
      content={
        <>
          <Modal onClose={closeAddModal} isOpen={addModal} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent>
              <form>
                <ModalHeader>
                  <h1 className="text-center">Add Category</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-44">
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="title">
                          Category Title
                        </label>
                        <input
                          value={addCategory.title}
                          onChange={onChange}
                          type="text"
                          name="title"
                          id="title"
                          placeholder="Enter your Category's Title"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="charge">
                          Category Charge
                        </label>
                        <input
                          value={addCategory.charge}
                          onChange={onChange}
                          type="number"
                          name="charge"
                          id="charge"
                          placeholder="Enter your Category's Charge"
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
                    action={addCategoryFunc}
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
                  <h1 className="text-center">Update Category</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-44">
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateTitle">
                          Category Title
                        </label>
                        <input
                          value={updateCategory.updateTitle}
                          onChange={onChange2}
                          type="text"
                          name="updateTitle"
                          id="updateTitle"
                          placeholder="Enter your Category's Title"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateCharge">
                          Category Charge
                        </label>
                        <input
                          value={updateCategory.updateCharge}
                          onChange={onChange2}
                          type="number"
                          name="updateCharge"
                          id="updateCharge"
                          rows="5"
                          placeholder="Enter your Category's Charge"
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
                    action={updateCategoryFunc}
                  />
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <section className="space-y-3">
            <div className="flex justify-end">
              <AddButton text="Category" modal={setAddModal} />
            </div>
            <MyDataTable columns={columns} data={datas} dependancy={data} />
          </section>
        </>
      }
    />
  );
}
