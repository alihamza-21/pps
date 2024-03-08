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
} from "../../utilities/Buttons";
import { inputStyle, labelStyle } from "../../utilities/Input";
import { BASE_URL2 } from "../../utilities/URL";
import Layout from "../../components/Layout";

export default function Sizes() {
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const sizesFeatureId =
    featureData && featureData.find((ele) => ele.title === "Size System")?.id;
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(null);
  const { data, reFetch } = GetAPI("getallsize", sizesFeatureId);
  const unitType = GetAPI("unittypes", sizesFeatureId);
  const [loader, setLoader] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [addSize, setAddSize] = useState({
    title: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    order: "",
    unitClassId: "",
    image: "",
  });
  const [updateSize, setUpdateSize] = useState({
    updateTitle: "",
    updateWeight: "",
    updateLength: "",
    updateWidth: "",
    updateHeight: "",
    updateOrder: "",
    updateUnitClassId: "",
    updateImage: "",
    sizeId: "",
    uImage: false,
    currentImage: "",
  });
  const [addModal, setAddModal] = useState(false);
  const closeAddModal = () => {
    setAddModal(false);
    setAddSize({
      title: "",
      weight: "",
      length: "",
      width: "",
      height: "",
      order: "",
      unitClassId: "",
      image: "",
    });
  };
  const [updateModal, setUpdateModal] = useState(false);
  const closeUpdateModal = () => {
    setUpdateModal(false);
    setUpdateSize({
      updateTitle: "",
      updateWeight: "",
      updateLength: "",
      updateWidth: "",
      updateHeight: "",
      updateOrder: "",
      updateUnitClassId: "",
      updateImage: "",
      sizeId: "",
      uImage: false,
      currentImage: "",
    });
  };
  const onChange = (e) => {
    setAddSize({ ...addSize, [e.target.name]: e.target.value });
  };
  const onChange2 = (e) => {
    setUpdateSize({ ...updateSize, [e.target.name]: e.target.value });
  };
  const addSizeFunc = async (e) => {
    e.preventDefault();
    if (addSize.title === "") {
      info_toaster("Please enter your Size's Title");
    } else if (addSize.weight === "") {
      info_toaster("Please enter your Size's Weight");
    } else if (addSize.length === "") {
      info_toaster("Please enter your Size's Length");
    } else if (addSize.width === "") {
      info_toaster("Please enter your Size's Width");
    } else if (addSize.height === "") {
      info_toaster("Please enter your Size's Height");
    } else if (addSize.order === "") {
      info_toaster("Please enter your Size's Order");
    } else if (addSize.unitClassId === "") {
      info_toaster("Please select your Size's Unit Type");
    } else if (addSize.image === "") {
      info_toaster("Please enter your Size's Image");
    } else {
      setLoader(true);
      const formData = new FormData();
      formData.append("title", addSize.title);
      formData.append("weight", addSize.weight);
      formData.append("length", addSize.length);
      formData.append("width", addSize.width);
      formData.append("height", addSize.height);
      formData.append("order", addSize.order);
      formData.append("image", addSize.image);
      formData.append("unitClassId", addSize.unitClassId.value);
      let res = await PostAPI("addsize", sizesFeatureId, formData);
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setAddModal(false);
        setAddSize({
          title: "",
          weight: "",
          length: "",
          width: "",
          height: "",
          order: "",
          unitClassId: "",
          image: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const updateSizeFunc = async (e) => {
    e.preventDefault();
    if (updateSize.updateTitle === "") {
      info_toaster("Please enter your Size's Title");
    } else if (updateSize.updateWeight === "") {
      info_toaster("Please enter your Size's Weight");
    } else if (updateSize.updateLength === "") {
      info_toaster("Please enter your Size's Length");
    } else if (updateSize.updateWidth === "") {
      info_toaster("Please enter your Size's Width");
    } else if (updateSize.updateHeight === "") {
      info_toaster("Please enter your Size's Height");
    } else if (updateSize.updateOrder === "") {
      info_toaster("Please enter your Size's Order");
    } else if (updateSize.updateUnitClassId === "") {
      info_toaster("Please select your Size's Unit Type");
    } else {
      setLoader(true);
      const formData = new FormData();
      formData.append("title", updateSize.updateTitle);
      formData.append("weight", updateSize.updateWeight);
      formData.append("length", updateSize.updateLength);
      formData.append("width", updateSize.updateWidth);
      formData.append("height", updateSize.updateHeight);
      formData.append("order", updateSize.updateOrder);
      formData.append("updateImage", updateSize.uImage);
      formData.append("image", updateSize.updateImage);
      formData.append("sizeId", updateSize.sizeId);
      formData.append("unitClassId", updateSize.updateUnitClassId.value);
      let res = await PutAPI("updatesize", sizesFeatureId, formData);
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setUpdateModal(false);
        setUpdateSize({
          updateTitle: "",
          updateWeight: "",
          updateLength: "",
          updateWidth: "",
          updateHeight: "",
          updateOrder: "",
          updateUnitClassId: "",
          updateImage: "",
          sizeId: "",
          uImage: false,
          currentImage: "",
        });
      } else {
        setUpdateSize({ ...updateSize, uImage: false });
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const changeSizeFunc = async (status, sizeId) => {
    setDisabled(true);
    let res = await PutAPI("sizestatus", sizesFeatureId, {
      status: status,
      sizeId: sizeId,
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
  const getSizes = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.rawSizes?.filter(
            (size) =>
              search === "" ||
              select === null ||
              ((size?.title).toLowerCase().includes(search.toLowerCase()) &&
                select.value === "1") ||
              ((size?.weight).toString().includes(search.toLowerCase()) &&
                select.value === "2")
          )
        : [];
    return filteredArray;
  };
  const options = [];
  unitType?.data?.status === "1" &&
    unitType.data?.data?.map((unitType, index) =>
      options.push({
        value: unitType?.id,
        label: unitType?.title,
      })
    );
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
      name: "Size",
      selector: (row) => row.size,
    },
    {
      name: "Weight",
      selector: (row) => row.weight,
    },
    {
      name: "Order",
      selector: (row) => row.order,
    },
    {
      name: "Image",
      selector: (row) => row.image,
    },
  ];
  const datas = [];
  getSizes()?.map((size, index) =>
    datas.push({
      id: index + 1,
      action: (
        <div className="flex gap-x-2">
          <DTEdit
            edit={() => {
              setUpdateModal(true);
              setUpdateSize({
                updateTitle: size?.title,
                updateWeight: size?.weight,
                updateLength: size?.length,
                updateWidth: size?.width,
                updateHeight: size?.height,
                updateOrder: size?.order,
                updateUnitClassId: {
                  value: size?.weightUnitS?.unitClass?.id,
                  label: size?.weightUnitS?.unitClass?.title,
                },
                sizeId: size?.id,
                currentImage: BASE_URL2 + size?.image,
              });
            }}
          />
          <DTDel
            del={() => changeSizeFunc(false, size?.id)}
            disabled={disabled}
          />
        </div>
      ),
      title: size?.title,
      size:
        size?.length +
        "*" +
        size?.width +
        "*" +
        size?.height +
        " " +
        size?.lengthUnitS?.symbol,
      weight: size?.weight + " " + size?.weightUnitS?.symbol,
      order: size?.order,
      image: (
        <img
          src={BASE_URL2 + size?.image}
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
      options={[
        { value: "1", label: "Title" },
        { value: "2", label: "Weight" },
      ]}
      selectValue={select}
      selectOnChange={(e) => {
        setSelect(e);
        e === null && setSearch("");
      }}
      title="Size System"
      content={
        <>
          <Modal
            onClose={closeAddModal}
            isOpen={addModal}
            size="2xl"
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <form>
                <ModalHeader>
                  <h1 className="text-center">Add Size</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div className="h-[446px]">
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 col-span-2">
                        <label className={labelStyle} htmlFor="title">
                          Title
                        </label>
                        <input
                          value={addSize.title}
                          onChange={onChange}
                          type="text"
                          name="title"
                          id="title"
                          placeholder="Enter your Size's Title"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="weight">
                          Weight
                        </label>
                        <input
                          value={addSize.weight}
                          onChange={onChange}
                          type="number"
                          name="weight"
                          id="weight"
                          placeholder="Enter your Size's Weight"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="length">
                          Length
                        </label>
                        <input
                          value={addSize.length}
                          onChange={onChange}
                          type="number"
                          name="length"
                          id="length"
                          placeholder="Enter your Size's Length"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="width">
                          Width
                        </label>
                        <input
                          value={addSize.width}
                          onChange={onChange}
                          type="number"
                          name="width"
                          id="width"
                          placeholder="Enter your Size's Width"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="height">
                          Height
                        </label>
                        <input
                          value={addSize.height}
                          onChange={onChange}
                          type="number"
                          name="height"
                          id="height"
                          placeholder="Enter your Size's Height"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="order">
                          Order
                        </label>
                        <input
                          value={addSize.order}
                          onChange={onChange}
                          type="number"
                          name="order"
                          id="order"
                          placeholder="Enter your Size's Order"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="unitClassId">
                          Unit Type
                        </label>
                        <Select
                          value={addSize.unitClassId}
                          onChange={(e) =>
                            setAddSize({ ...addSize, unitClassId: e })
                          }
                          options={options}
                          inputId="unitClassId"
                        />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className={labelStyle} htmlFor="image">
                          Image
                        </label>
                        <input
                          onChange={(e) =>
                            setAddSize({
                              ...addSize,
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
                    action={addSizeFunc}
                  />
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <Modal
            onClose={closeUpdateModal}
            isOpen={updateModal}
            size="2xl"
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <form>
                <ModalHeader>
                  <h1 className="text-center">Update Size</h1>
                </ModalHeader>
                <ModalCloseButton />
                {loader ? (
                  <div
                    className={updateSize.uImage ? "h-[658px]" : "h-[564px]"}
                  >
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 col-span-2">
                        <label className={labelStyle} htmlFor="updateTitle">
                          Title
                        </label>
                        <input
                          value={updateSize.updateTitle}
                          onChange={onChange2}
                          type="text"
                          name="updateTitle"
                          id="updateTitle"
                          placeholder="Enter your Size's Title"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateWeight">
                          Weight
                        </label>
                        <input
                          value={updateSize.updateWeight}
                          onChange={onChange2}
                          type="number"
                          name="updateWeight"
                          id="updateWeight"
                          placeholder="Enter your Size's Weight"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateLength">
                          Length
                        </label>
                        <input
                          value={updateSize.updateLength}
                          onChange={onChange2}
                          type="number"
                          name="updateLength"
                          id="updateLength"
                          placeholder="Enter your Size's Length"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateWidth">
                          Width
                        </label>
                        <input
                          value={updateSize.updateWidth}
                          onChange={onChange2}
                          type="number"
                          name="updateWidth"
                          id="updateWidth"
                          placeholder="Enter your Size's Width"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateHeight">
                          Height
                        </label>
                        <input
                          value={updateSize.updateHeight}
                          onChange={onChange2}
                          type="number"
                          name="updateHeight"
                          id="updateHeight"
                          placeholder="Enter your Size's Height"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelStyle} htmlFor="updateOrder">
                          Order
                        </label>
                        <input
                          value={updateSize.updateOrder}
                          onChange={onChange2}
                          type="number"
                          name="updateOrder"
                          id="updateOrder"
                          placeholder="Enter your Size's Order"
                          className={inputStyle}
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          className={labelStyle}
                          htmlFor="updateUnitClassId"
                        >
                          Unit Type
                        </label>
                        <Select
                          value={updateSize.updateUnitClassId}
                          onChange={(e) =>
                            setUpdateSize({
                              ...updateSize,
                              updateUnitClassId: e,
                            })
                          }
                          options={options}
                          inputId="updateUnitClassId"
                        />
                      </div>
                      <div className="flex items-center gap-x-4 col-span-2">
                        <label className={labelStyle} htmlFor="uImage">
                          Do you want to upload new Image,?
                        </label>
                        <input
                          value={updateSize.uImage}
                          onChange={(e) =>
                            setUpdateSize({
                              ...updateSize,
                              uImage: !updateSize.uImage,
                            })
                          }
                          type="checkbox"
                          name="uImage"
                          id="uImage"
                        />
                      </div>
                      {updateSize.uImage && (
                        <div className="space-y-1 col-span-2">
                          <label className={labelStyle} htmlFor="updateImage">
                            Image
                          </label>
                          <input
                            onChange={(e) =>
                              setUpdateSize({
                                ...updateSize,
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
                      <div className="col-span-2">
                        <img
                          src={updateSize.currentImage}
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
                    action={updateSizeFunc}
                  />
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <section className="space-y-3">
            <div className="flex justify-end">
              <AddButton text="Size" modal={setAddModal} />
            </div>
            <div className="space-y-20">
              <div className="flex items-center gap-5 flex-wrap mt-4">
                {data?.data?.arrangedSizes?.map((size, index) => (
                  <div className="bg-white py-4 px-7 rounded shadow w-fit">
                    <h6 className="font-semibold text-xl">{size?.title}</h6>
                    <p className="font-medium text-sm">
                      Weight:{" "}
                      {`${size?.weight} ${
                        size?.weightUnitS && size?.weightUnitS?.symbol
                      }`}
                    </p>
                    <p className="font-medium text-sm">
                      Size:{" "}
                      {`${size?.length} x ${size?.width} x ${size?.height}`}
                    </p>
                  </div>
                ))}
              </div>
              <MyDataTable columns={columns} data={datas} dependancy={data} />
            </div>
          </section>
        </>
      }
    />
  );
}
