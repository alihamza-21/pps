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
import { PutAPI } from "../../utilities/PutAPI";
import MyDataTable from "../../components/MyDataTable";
import Loader, { MiniLoader } from "../../components/Loader";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../utilities/Toaster";
import { DTEdit, ModalButtons } from "../../utilities/Buttons";
import { inputStyle, labelStyle } from "../../utilities/Input";
import { BASE_URL2 } from "../../utilities/URL";
import Layout from "../../components/Layout";

export default function Structures() {
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const structuresFeatureId =
    featureData &&
    featureData.find((ele) => ele.title === "Structure System")?.id;
  const { data, reFetch } = GetAPI("getallstruct", structuresFeatureId);
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(null);
  const [loader, setLoader] = useState(false);
  // const [addStructure, setAddStructure] = useState({
  //   title: "",
  //   image: "",
  // });
  const [updateStructure, setUpdateStructure] = useState({
    updateTitle: "",
    updateImage: "",
    structId: "",
    uImage: false,
    currentImage: "",
  });
  // const [addModal, setAddModal] = useState(false);
  // const closeAddModal = () => {
  //   setAddModal(false);
  //   setAddStructure({ title: "", image: "" });
  // };
  const [updateModal, setUpdateModal] = useState(false);
  const closeUpdateModal = () => {
    setUpdateModal(false);
    setUpdateStructure({
      updateTitle: "",
      updateImage: "",
      structId: "",
      uImage: false,
      currentImage: "",
    });
  };
  // const addStructureFunc = async (e) => {
  //   e.preventDefault();
  //   if (addStructure.title === "") {
  //     info_toaster("Please enter your Structure's Title");
  //   } else if (addStructure.image === "") {
  //     info_toaster("Please enter your Structure's Image");
  //   } else {
  //     setLoader(true);
  //     const formData = new FormData();
  //     formData.append("title", addStructure.title);
  //     formData.append("image", addStructure.image);
  //     let res = await PostAPI("addstruct", structuresFeatureId, formData);
  //     if (res?.data?.status === "1") {
  //       reFetch();
  //       setLoader(false);
  //       success_toaster(res?.data?.message);
  //       setAddModal(false);
  //       setAddStructure({ title: "", image: "" });
  //     } else {
  //       setLoader(false);
  //       error_toaster(res?.data?.message);
  //     }
  //   }
  // };
  const updateStructureFunc = async (e) => {
    e.preventDefault();
    if (updateStructure.updateTitle === "") {
      info_toaster("Please enter your Structures's Title");
    } else {
      setLoader(true);
      const formData = new FormData();
      formData.append("title", updateStructure.updateTitle);
      formData.append("image", updateStructure.updateImage);
      formData.append("structId", updateStructure.structId);
      formData.append("updateImage", updateStructure.uImage);
      let res = await PutAPI("updatestruct", structuresFeatureId, formData);
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setUpdateModal(false);
        setUpdateStructure({
          updateTitle: "",
          updateImage: "",
          structId: "",
          uImage: false,
          currentImage: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  // const changeStructureFunc = async (status, structId) => {
  //   let res = await PutAPI("structstatus", structuresFeatureId, {
  //     status: status,
  //     structId: structId,
  //   });
  //   if (res?.data?.status === "1") {
  //     reFetch();
  //     success_toaster(res?.data?.message);
  //   } else {
  //     error_toaster(res?.data?.message);
  //   }
  // };
  const getStructures = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.filter(
            (struc) =>
              search === "" ||
              select === null ||
              ((struc?.title).toLowerCase().includes(search.toLowerCase()) &&
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
    },
    {
      name: "Title",
      selector: (row) => row.title,
    },
    {
      name: "Image",
      selector: (row) => row.image,
    },
  ];
  const datas = [];
  getStructures()?.map((struc, index) =>
    datas.push({
      id: index + 1,
      action: (
        <div className="flex gap-x-2">
          <DTEdit
            edit={() => {
              setUpdateModal(true);
              setUpdateStructure({
                updateTitle: struc?.title,
                structId: struc?.id,
                currentImage: BASE_URL2 + struc?.icon,
                uImage: false,
              });
            }}
          />
          {/* <DTDel del={() => changeStructureFunc(false, struc?.id)} /> */}
        </div>
      ),
      title: struc?.title,
      image: (
        <img
          src={BASE_URL2 + struc?.icon}
          alt="img"
          className="w-20 h-20 object-contain"
        />
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
      options={[{ value: "1", label: "Title" }]}
      selectValue={select}
      selectOnChange={(e) => {
        setSelect(e);
        e === null && setSearch("");
      }}
      title="Structure System"
      content={
        <>
          {/* <Modal onClose={closeAddModal} isOpen={addModal} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent>
              <form>
                <ModalHeader>
                  <h1 className="text-center">Add Structure</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-[182px]">
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="title">
                          Structure Title
                        </label>
                        <input
                          value={addStructure.title}
                          onChange={(e) =>
                            setAddStructure({
                              ...addStructure,
                              [e.target.name]: e.target.value,
                            })
                          }
                          type="text"
                          name="title"
                          id="title"
                          placeholder="Enter your Structure's Title"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="image">
                          Structure Image
                        </label>
                        <input
                          onChange={(e) =>
                            setAddStructure({
                              ...addStructure,
                              [e.target.name]: e.target.files[0],
                            })
                          }
                          type="file"
                          name="image"
                          id="image"
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
                    action={addStructureFunc}
                  />
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal> */}
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
                  <h1 className="text-center">Update Structure</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div
                    className={
                      updateStructure.uImage ? "h-[394px]" : "h-[300px]"
                    }
                  >
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateTitle">
                          Structure Title
                        </label>
                        <input
                          value={updateStructure.updateTitle}
                          onChange={(e) =>
                            setUpdateStructure({
                              ...updateStructure,
                              [e.target.name]: e.target.value,
                            })
                          }
                          type="text"
                          name="updateTitle"
                          id="updateTitle"
                          placeholder="Enter your Structure's Title"
                          className={inputStyle}
                        />
                      </div>
                      <div className="flex items-center gap-x-4">
                        <label className={labelStyle} htmlFor="uImage">
                          Do you want to upload new Image,?
                        </label>
                        <input
                          value={updateStructure.uImage}
                          onChange={(e) =>
                            setUpdateStructure({
                              ...updateStructure,
                              uImage: !updateStructure.uImage,
                            })
                          }
                          type="checkbox"
                          name="uImage"
                          id="uImage"
                        />
                      </div>
                      {updateStructure.uImage && (
                        <div className="space-y-1">
                          <label className={labelStyle} htmlFor="updateImage">
                            Structure Image
                          </label>
                          <input
                            onChange={(e) =>
                              setUpdateStructure({
                                ...updateStructure,
                                [e.target.name]: e.target.files[0],
                              })
                            }
                            type="file"
                            name="updateImage"
                            id="updateImage"
                            className={inputStyle}
                          />
                        </div>
                      )}
                      <div>
                        <img
                          src={updateStructure.currentImage}
                          alt="Current"
                          className="block mx-auto w-1/2 h-40 object-contain rounded-md"
                        />
                      </div>
                    </div>
                  </ModalBody>
                )}
                <ModalFooter>
                  <ModalButtons
                    text="Update"
                    close={closeUpdateModal}
                    action={updateStructureFunc}
                  />
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          {/* <section className="space-y-3">
            <div className="flex justify-end">
              <AddButton text="Structure" modal={setAddModal} />
            </div> */}
          <MyDataTable columns={columns} data={datas} dependancy={data} />
          {/* </section> */}
        </>
      }
    />
  );
}
