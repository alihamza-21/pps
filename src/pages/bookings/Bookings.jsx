import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GetAPI from "../../utilities/GetAPI";
import MyDataTable from "../../components/MyDataTable";
import Loader from "../../components/Loader";
import { error_toaster, info_toaster } from "../../utilities/Toaster";
import { DTView, TabButton } from "../../utilities/Buttons";
import { BASE_URL } from "../../utilities/URL";
import Layout from "../../components/Layout";
import moment from "moment";
import Select from "react-select";

export default function Bookings() {
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const bookingsFeatureId =
    featureData && featureData.find((ele) => ele.title === "Bookings")?.id;
  const [tab, setTab] = useState("Ongoing");
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(null);
  const [wareFilter, setWareFilter] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const { data } = GetAPI("allbookings", bookingsFeatureId);
  const activeWare = GetAPI("activewarehouse", bookingsFeatureId);
  const bookingDetails = async (id) => {
    setDisabled(true);
    var config = {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    };
    try {
      axios
        .get(
          BASE_URL + `bookingdetails?featureId=${bookingsFeatureId}&id=${id}`,
          config
        )
        .then((dat) => {
          if (dat.data?.status === "1") {
            localStorage.setItem("orderId", dat?.data?.data?.id);
            navigate("/booking-details");
            info_toaster(dat?.data?.message);
          } else {
            error_toaster(dat?.data?.message);
          }
          setDisabled(false);
        });
    } catch (err) {
      setDisabled(false);
    }
  };
  const wareOptions = [];
  activeWare.data?.data?.map((activeWare, index) =>
    wareOptions.push({
      value: activeWare?.id,
      label: activeWare?.name,
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
      minWidth: "160px",
    },
    {
      name: "Order #",
      selector: (row) => row.orderId,
    },
    {
      name: "Pickup DBS #",
      selector: (row) => row.pickUp,
    },
    {
      name: "Drop off DBS #",
      selector: (row) => row.dropOff,
    },
    {
      name: "Delivery Warehouse",
      selector: (row) => row.warehouse,
    },
    {
      name: "Created at",
      selector: (row) => row.date,
    },
    {
      name: "Status",
      selector: (row) => row.status,
    },
  ];
  const ongoingBookings = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.ongoing?.filter(
            (det) =>
              search === "" ||
              select === null ||
              ((det?.trackingId).toLowerCase().match(search.toLowerCase()) &&
                select.value === "1") ||
              ((
                (det?.pickupAddress?.postalCode).toLowerCase() +
                " " +
                (det?.pickupAddress?.secondPostalCode).toLowerCase()
              ).match(search.toLowerCase()) &&
                select.value === "2") ||
              ((
                (det?.pickupAddress?.postalCode).toLowerCase() +
                (det?.pickupAddress?.secondPostalCode).toLowerCase()
              ).match(search.toLowerCase()) &&
                select.value === "2") ||
              ((
                (det?.dropoffAddress?.postalCode).toLowerCase() +
                " " +
                (det?.dropoffAddress?.secondPostalCode).toLowerCase()
              ).match(search.toLowerCase()) &&
                select.value === "3") ||
              ((
                (det?.dropoffAddress?.postalCode).toLowerCase() +
                (det?.dropoffAddress?.secondPostalCode).toLowerCase()
              ).match(search.toLowerCase()) &&
                select.value === "3")
          )
        : [];
    const filteredArray2 = data?.data?.ongoing?.filter(
      (det) =>
        wareFilter === null ||
        det?.deliveryWarehouseId?.toString() === wareFilter.value.toString()
    );
    return wareFilter === null ? filteredArray : filteredArray2;
  };
  const intransitBookings = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.inTransit?.filter(
            (det) =>
              search === "" ||
              select === null ||
              ((det?.trackingId).toLowerCase().match(search.toLowerCase()) &&
                select.value === "1") ||
              ((
                (det?.pickupAddress?.postalCode).toLowerCase() +
                " " +
                (det?.pickupAddress?.secondPostalCode).toLowerCase()
              ).match(search.toLowerCase()) &&
                select.value === "2") ||
              ((
                (det?.pickupAddress?.postalCode).toLowerCase() +
                (det?.pickupAddress?.secondPostalCode).toLowerCase()
              ).match(search.toLowerCase()) &&
                select.value === "2") ||
              ((
                (det?.dropoffAddress?.postalCode).toLowerCase() +
                " " +
                (det?.dropoffAddress?.secondPostalCode).toLowerCase()
              ).match(search.toLowerCase()) &&
                select.value === "3") ||
              ((
                (det?.dropoffAddress?.postalCode).toLowerCase() +
                (det?.dropoffAddress?.secondPostalCode).toLowerCase()
              ).match(search.toLowerCase()) &&
                select.value === "3")
          )
        : [];
    const filteredArray2 = data?.data?.inTransit?.filter(
      (det) =>
        wareFilter === null ||
        det?.deliveryWarehouseId?.toString() === wareFilter.value.toString()
    );
    return wareFilter === null ? filteredArray : filteredArray2;
  };
  const completedBookings = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.completed?.filter(
            (det) =>
              search === "" ||
              select === null ||
              ((det?.trackingId).toLowerCase().match(search.toLowerCase()) &&
                select.value === "1") ||
              ((
                (det?.pickupAddress?.postalCode).toLowerCase() +
                " " +
                (det?.pickupAddress?.secondPostalCode).toLowerCase()
              ).match(search.toLowerCase()) &&
                select.value === "2") ||
              ((
                (det?.pickupAddress?.postalCode).toLowerCase() +
                (det?.pickupAddress?.secondPostalCode).toLowerCase()
              ).match(search.toLowerCase()) &&
                select.value === "2") ||
              ((
                (det?.dropoffAddress?.postalCode).toLowerCase() +
                " " +
                (det?.dropoffAddress?.secondPostalCode).toLowerCase()
              ).match(search.toLowerCase()) &&
                select.value === "3") ||
              ((
                (det?.dropoffAddress?.postalCode).toLowerCase() +
                (det?.dropoffAddress?.secondPostalCode).toLowerCase()
              ).match(search.toLowerCase()) &&
                select.value === "3")
          )
        : [];
    const filteredArray2 = data?.data?.completed?.filter(
      (det) =>
        wareFilter === null ||
        det?.deliveryWarehouseId?.toString() === wareFilter.value.toString()
    );
    return wareFilter === null ? filteredArray : filteredArray2;
  };
  const cancelledBookings = () => {
    const filteredArray =
      data?.status === "1"
        ? data?.data?.cancelled?.filter(
            (det) =>
              search === "" ||
              select === null ||
              ((det?.trackingId).toLowerCase().match(search.toLowerCase()) &&
                select.value === "1") ||
              ((
                (det?.pickupAddress?.postalCode).toLowerCase() +
                " " +
                (det?.pickupAddress?.secondPostalCode).toLowerCase()
              ).match(search.toLowerCase()) &&
                select.value === "2") ||
              ((
                (det?.pickupAddress?.postalCode).toLowerCase() +
                (det?.pickupAddress?.secondPostalCode).toLowerCase()
              ).match(search.toLowerCase()) &&
                select.value === "2")
          )
        : [];
    const filteredArray2 = data?.data?.cancelled?.filter(
      (det) =>
        wareFilter === null ||
        det?.deliveryWarehouseId?.toString() === wareFilter.value.toString()
    );
    return wareFilter === null ? filteredArray : filteredArray2;
  };
  const datas = [];
  if (tab === "Ongoing") {
    ongoingBookings()?.map((det, index) => {
      return datas.push({
        id: index + 1,
        action: (
          <DTView view={() => bookingDetails(det?.id)} disabled={disabled} />
        ),
        orderId: det?.trackingId,
        pickUp:
          det?.pickupAddress?.postalCode +
          " " +
          det?.pickupAddress?.secondPostalCode,
        dropOff:
          det?.dropoffAddress?.postalCode +
          " " +
          det?.dropoffAddress?.secondPostalCode,
        warehouse: det?.deliveryWarehouse && det?.deliveryWarehouse?.name,
        date: (
          <div className="flex flex-col">
            <span>{moment(det?.createdAt).format("DD-MM-YYYY")}</span>
            <span>{moment(det?.createdAt).format("hh:mm A")}</span>
          </div>
        ),
        status: det?.bookingStatus?.title,
      });
    });
  } else if (tab === "InTransit") {
    intransitBookings()?.map((det, index) => {
      return datas.push({
        id: index + 1,
        action: (
          <DTView view={() => bookingDetails(det?.id)} disabled={disabled} />
        ),
        orderId: det?.trackingId,
        pickUp:
          det?.pickupAddress?.postalCode +
          " " +
          det?.pickupAddress?.secondPostalCode,
        dropOff:
          det?.dropoffAddress?.postalCode +
          " " +
          det?.dropoffAddress?.secondPostalCode,
        warehouse: det?.deliveryWarehouse && det?.deliveryWarehouse?.name,
        date: (
          <div className="flex flex-col">
            <span>{moment(det?.createdAt).format("DD-MM-YYYY")}</span>
            <span>{moment(det?.createdAt).format("hh:mm A")}</span>
          </div>
        ),
        status: det?.bookingStatus?.title,
      });
    });
  } else if (tab === "Completed") {
    completedBookings()?.map((det, index) => {
      return datas.push({
        id: index + 1,
        action: (
          <DTView view={() => bookingDetails(det?.id)} disabled={disabled} />
        ),
        orderId: det?.trackingId,
        pickUp:
          det?.pickupAddress?.postalCode +
          " " +
          det?.pickupAddress?.secondPostalCode,
        dropOff:
          det?.dropoffAddress?.postalCode +
          " " +
          det?.dropoffAddress?.secondPostalCode,
        warehouse: det?.deliveryWarehouse && det?.deliveryWarehouse?.name,
        date: (
          <div className="flex flex-col">
            <span>{moment(det?.createdAt).format("DD-MM-YYYY")}</span>
            <span>{moment(det?.createdAt).format("hh:mm A")}</span>
          </div>
        ),
        status: det?.bookingStatus?.title,
      });
    });
  } else if (tab === "Cancelled") {
    cancelledBookings()?.map((det, index) => {
      return datas.push({
        id: index + 1,
        action: (
          <DTView view={() => bookingDetails(det?.id)} disabled={disabled} />
        ),
        pickUp:
          det?.pickupAddress?.postalCode +
          " " +
          det?.pickupAddress?.secondPostalCode,
        dropOff:
          det?.dropoffAddress?.postalCode +
          " " +
          det?.dropoffAddress?.secondPostalCode,
        warehouse: det?.deliveryWarehouse && det?.deliveryWarehouse?.name,
        orderId: det?.trackingId,
        date: (
          <div className="flex flex-col">
            <span>{moment(det?.createdAt).format("DD-MM-YYYY")}</span>
            <span>{moment(det?.createdAt).format("hh:mm A")}</span>
          </div>
        ),
        status: det?.bookingStatus?.title,
      });
    });
  }
  return data.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      search={true}
      value={search}
      onChange={(e) => setSearch(e.target.value.replace(/\+/g, ""))}
      options={[
        { value: "1", label: "Order #" },
        { value: "2", label: "Pickup DBS #" },
        { value: "3", label: "Drop off DBS #" },
      ]}
      selectValue={select}
      selectOnChange={(e) => {
        setSelect(e);
        e === null && setSearch("");
      }}
      title="Bookings"
      content={
        <>
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex">
                <TabButton text="Ongoing" set={setTab} tab={tab} width="w-40" />
                <TabButton
                  text="InTransit"
                  set={setTab}
                  tab={tab}
                  width="w-40"
                />
                <TabButton
                  text="Completed"
                  set={setTab}
                  tab={tab}
                  width="w-40"
                />
                <TabButton
                  text="Cancelled"
                  set={setTab}
                  tab={tab}
                  width="w-40"
                />
              </div>
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
            </div>
            <MyDataTable columns={columns} data={datas} dependancy={data} />
          </section>
        </>
      }
    />
  );
}
