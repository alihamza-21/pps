import React, { useContext } from "react";
import { AiOutlineFontSize, AiOutlinePoweroff } from "react-icons/ai";
import { BiPlusMedical } from "react-icons/bi";
import { BsBookHalf, BsCoin } from "react-icons/bs";
import { CgSandClock } from "react-icons/cg";
import {
  FaAddressBook,
  FaCar,
  FaCity,
  FaQuestion,
  FaUnity,
  FaUserNurse,
  FaUserTie,
  FaWarehouse,
} from "react-icons/fa";
import { GiModernCity, GiPriceTag } from "react-icons/gi";
import { HiUsers } from "react-icons/hi";
import { FiUserX } from "react-icons/fi";
import { MdCategory, MdLocationCity } from "react-icons/md";
import {
  RiCheckboxMultipleFill,
  RiCoupon4Fill,
  RiDashboardFill,
  RiFlag2Fill,
  RiUserReceivedLine,
} from "react-icons/ri";
import { TbBellRinging, TbCapture } from "react-icons/tb";
import { VscSymbolStructure } from "react-icons/vsc";
import { MdOutlinePayment } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ModeContext } from "../App";
import { info_toaster } from "../utilities/Toaster";
import { imgURL } from "../utilities/URL";
import { LayoutContext } from "./Layout";
import ListHead from "./ListHead";
import ListItem from "./ListItem";

export default function LeftBar() {
  const navigate = useNavigate();
  const { expand, setLoader } = useContext(LayoutContext);
  const { dark } = useContext(ModeContext);
  const location = useLocation().pathname;
  const logoutFunc = (e) => {
    e.preventDefault();
    setLoader(true);
    setTimeout(() => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("loginStatus");
      localStorage.removeItem("featureData");
      localStorage.removeItem("userName");
      localStorage.removeItem("orderId");
      localStorage.removeItem("driverId");
      navigate("/sign-in");
      info_toaster("Successfully Logged out!");
    }, 400);
  };
  return (
    <div
      className={`w-64 fixed h-full py-7 xl:pl-6 pl-3 ${
        expand ? "hidden" : "flex"
      } ${
        dark ? "bg-themeBlack border-white" : "bg-white border-black"
      } flex-col justify-between border-r border-opacity-10`}
    >
      <div>
        <Link to={"/"}>
          <img
            src={`${imgURL}${dark ? "logoD" : "logo"}.webp`}
            alt="logo"
            className="w-40 h-32 object-contain"
          />
        </Link>
      </div>
      <ul className="flex flex-col gap-y-5 h-3/4 overflow-auto sidebar xl:pr-2 pr-1">
        <div className="space-y-3">
          <div className="space-y-1">
            <ListHead title="Dashboard" />
          </div>
          <ListItem to={"/"} Icon={RiDashboardFill} title="Home" />
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <ListHead title="Address DBS" />
          </div>
          <ListItem
            to={"/dbs"}
            Icon={FaAddressBook}
            title="All Addresses"
            active={location === "/dbs-details" ? true : false}
          />
          <ListItem to={"/provinces"} Icon={FaCity} title="Provinces" />
          <ListItem to={"/districts"} Icon={GiModernCity} title="Districts" />
          <ListItem
            to={"/corregimientos"}
            Icon={MdLocationCity}
            title="Corregimientos"
          />
          <ListItem
            to={"/structures"}
            Icon={VscSymbolStructure}
            title="Structure System"
          />
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <ListHead title="Live Tracking" />
          </div>
          <ListItem to={"/track-order"} Icon={TbCapture} title="Track Order" />
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <ListHead title="User Management" />
          </div>
          <ListItem
            to={"/customers"}
            Icon={HiUsers}
            title="Customers"
            active={location === "/customer-details" && true}
          />
          <ListItem
            to={"/drivers"}
            Icon={FaUserNurse}
            title="Drivers"
            active={
              location === "/create_driver" ||
              location === "/driver-details" ||
              location === "/create-driver/step-one" ||
              location === "/create-driver/step-two" ||
              (location === "/create-driver/step-three" && true)
            }
          />
          <ListItem
            to={"/expired-drivers"}
            Icon={FiUserX}
            title="Expired Drivers"
          />
          <ListItem
            to={"/payment-requests"}
            Icon={MdOutlinePayment}
            title="Payment Requests"
          />
          <ListItem
            to={"/transporters"}
            Icon={RiUserReceivedLine}
            title="Transporters"
          />
          <ListItem to={"/employees"} Icon={FaUserTie} title="Employees" />
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <ListHead title="Warehouse" />
          </div>
          <ListItem
            to={"/warehouses"}
            Icon={FaWarehouse}
            title="Warehouses"
            active={
              location === "/create-warehouse" ||
              (location === "/warehouse-details" && true)
            }
          />
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <ListHead title="Application" />
          </div>
          <ListItem to={"/charges"} Icon={GiPriceTag} title="Charges" />
          <ListItem to={"/categories"} Icon={MdCategory} title="Categories" />
          <ListItem to={"/coupons"} Icon={RiCoupon4Fill} title="Coupons" />
          <ListItem
            to={"/sizes"}
            Icon={AiOutlineFontSize}
            title="Size System"
          />
          <ListItem to={"/units"} Icon={FaUnity} title="Unit System" />
          <ListItem to={"/payments"} Icon={BsCoin} title="Payment System" />
          <ListItem to={"/vehicles"} Icon={FaCar} title="Vehicle Types" />
          <ListItem to={"/eta"} Icon={CgSandClock} title="ETA" />
          <ListItem to={"/banners"} Icon={RiFlag2Fill} title="Banners" />
          <ListItem
            to={"/notifications"}
            Icon={TbBellRinging}
            title="Notifications"
          />
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <ListHead title="Roles" />
          </div>
          <ListItem
            to={"/roles"}
            Icon={RiCheckboxMultipleFill}
            title="Roles & Permission"
          />
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <ListHead title="Bookings" />
          </div>
          <ListItem
            to={"/bookings"}
            Icon={BsBookHalf}
            title="Bookings"
            active={location === "/booking-details" && true}
          />
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <ListHead title="General Settings" />
          </div>
          <ListItem to={"/support"} Icon={BiPlusMedical} title="Support" />
          <ListItem to={"/faqs"} Icon={FaQuestion} title="FAQ's" />
        </div>
      </ul>
      <ul className="xl:pr-2 pr-1 relative">
        <li>
          <button
            onClick={logoutFunc}
            className={`w-full flex items-center gap-x-4 px-4 py-2 rounded ${
              dark ? "text-white" : "text-black text-opacity-40"
            } font-medium xl:text-lg text-base focus:bg-themePurple focus:text-themeOrange focus:text-opacity-100`}
          >
            <AiOutlinePoweroff size={24} />
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
