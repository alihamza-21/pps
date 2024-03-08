import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React from "react";
import { Line } from "react-chartjs-2";
import GetAPI from "../../utilities/GetAPI";
import Loader from "../../components/Loader";
import Layout from "../../components/Layout";
import HomeCard from "../../components/HomeCard";

export default function Home() {
  const featureData = JSON.parse(localStorage.getItem("featureData"));
  const homeFeatureId =
    featureData && featureData.find((ele) => ele.title === "Home")?.id;
  const { data } = GetAPI("dashboard/general", homeFeatureId);
  const graphAPI = GetAPI("dashboard/graph", homeFeatureId);
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Growth Rate per Month",
      },
    },
  };
  const labels = graphAPI?.data?.body?.months;
  const graphData1 = {
    labels,
    datasets: [
      {
        label: "Users",
        data: graphAPI?.data?.body?.usersWithMonths,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Bookings",
        data: graphAPI?.data?.body?.bookingsWithMonths,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  const graphData2 = {
    labels,
    datasets: [
      {
        label: "Earnings",
        data: graphAPI?.data?.body?.earningsWithMonths,
        borderColor: "rgb(255, 159, 64)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
      },
    ],
  };
  return !localStorage.getItem("loginStatus") || data.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      title="Dashboard"
      content={
        <section className="grid gap-y-12">
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-5">
            <HomeCard
              icon="1"
              title="All Users"
              quantity={
                data?.data?.numOfUsers ?? (
                  <div className="text-lg">No Data Available</div>
                )
              }
            />
            <HomeCard
              icon="2"
              title="All Warehouses"
              quantity={
                data?.data?.numOfWarehouses ?? (
                  <div className="text-lg">No Data Available</div>
                )
              }
            />
            <HomeCard
              icon="3"
              title="All Drivers"
              quantity={
                data?.data?.numOfDrivers ?? (
                  <div className="text-lg">No Data Available</div>
                )
              }
            />
            <HomeCard
              icon="4"
              title="All Orders"
              quantity={
                data?.data?.numOfBookings ?? (
                  <div className="text-lg">No Data Available</div>
                )
              }
            />
            <HomeCard
              icon="5"
              title="Total Earnings"
              quantity={
                data?.data?.earnings ? (
                  data?.data?.currencyUnit + data?.data?.earnings
                ) : (
                  <div className="text-lg">No Data Available</div>
                )
              }
            />
            <HomeCard
              icon="6"
              title="Available Balance"
              quantity={
                data?.data?.balance ? (
                  data?.data?.currencyUnit + data?.data?.balance
                ) : (
                  <div className="text-lg">No Data Available</div>
                )
              }
            />
            <HomeCard
              icon="7"
              title="Driver's Earnings"
              quantity={
                data?.data?.currencyUnit + data?.data?.driverEarnings ?? (
                  <div className="text-lg">No Data Available</div>
                )
              }
            />
            <HomeCard
              icon="8"
              title="Today's Earnings"
              quantity={
                data?.data?.currencyUnit + data?.data?.todayEarnings ?? (
                  <div className="text-lg">No Data Available</div>
                )
              }
            />
          </div>
          {/* <div
            className={`${
              dark ? "bg-themeBlack2" : "bg-white"
            } flex flex-col gap-y-4 rounded-lg px-5 py-8`}
          >
            <h2
              className={`font-bold text-xl ${
                dark ? "text-white" : "text-themePurple"
              }`}
            >
              Recent Activities
            </h2>
            <hr />
            <div className="flex items-center gap-x-3">
              <img
                src={`${imgURL}logo-4${dark ? "D" : ""}.webp`}
                alt="logo"
                className="w-10"
              />
              <span
                className={`font-bold text-base ${
                  dark ? "text-themeWhite" : "text-black text-opacity-40"
                }`}
              >
                1 New Order is created
              </span>
            </div>
            <hr />
            <div className="flex items-center gap-x-3">
              <img
                src={`${imgURL}logo-1${dark ? "D" : ""}.webp`}
                alt="logo"
                className="w-10"
              />
              <span
                className={`font-bold text-base ${
                  dark ? "text-themeWhite" : "text-black text-opacity-40"
                }`}
              >
                2 New users Login the PPS
              </span>
            </div>
            <hr />
            <div className="flex items-center gap-x-3">
              <img
                src={`${imgURL}logo-6${dark ? "D" : ""}.webp`}
                alt="logo"
                className="w-10"
              />
              <span
                className={`font-bold text-base ${
                  dark ? "text-themeWhite" : "text-black text-opacity-40"
                }`}
              >
                $25 Received by you
              </span>
            </div>
          </div> */}
          <div className="grid xl:grid-cols-2 gap-x-10">
            <div className="w-11/12 mx-auto h-96">
              <Line options={options} data={graphData1} />
            </div>
            <div className="w-11/12 mx-auto h-96">
              <Line options={options} data={graphData2} />
            </div>
          </div>
        </section>
      }
    />
  );
}
