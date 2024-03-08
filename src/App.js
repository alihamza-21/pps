import { ChakraProvider } from "@chakra-ui/react";
import React, { createContext, useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import Login from "./pages/auth/Login";
import Banners from "./pages/banners/Banners";
import Bookings from "./pages/bookings/Bookings";
import Categories from "./pages/categories/Categories";
import Charges from "./pages/charges/Charges";
import Corregimientos from "./pages/corregimientos/Corregimientos";
import Coupons from "./pages/coupons/Coupons";
import BookingDetails from "./pages/bookings/BookingDetails";
import CustomerDetails from "./pages/customers/CustomerDetails";
import Customers from "./pages/customers/Customers";
import DBS from "./pages/dbs/DBS";
import DBSdetails from "./pages/dbs/DBSdetails";
import Districts from "./pages/districts/Districts";
import CreateDriver1 from "./pages/drivers/CreateDriver1";
import CreateDriver2 from "./pages/drivers/CreateDriver2";
import CreateDriver3 from "./pages/drivers/CreateDriver3";
import DriverDetails from "./pages/drivers/DriverDetails";
import Drivers from "./pages/drivers/Drivers";
import Employees from "./pages/employees/Employees";
import ETA from "./pages/eta/ETA";
import FAQ from "./pages/faq/FAQ";
import Home from "./pages/home/Home";
import Notifications from "./pages/notifications/Notifications";
import Payments from "./pages/payments/Payments";
import Provinces from "./pages/provinces/Provinces";
import Roles from "./pages/roles/Roles";
import Sizes from "./pages/sizes/Sizes";
import Structures from "./pages/structures/Structures";
import Support from "./pages/support/Support";
import Transporters from "./pages/transporters/Transporters";
import Units from "./pages/units/Units";
import Vehicles from "./pages/vehicles/Vehicles";
import CreateWarehouse from "./pages/warehouses/CreateWarehouse";
import WarehouseDetails from "./pages/warehouses/WarehouseDetails";
import Warehouses from "./pages/warehouses/Warehouses";
import ProtectedRoute from "./utilities/ProtectedRoute";
import Tracking from "./pages/live-tracking/Tracking";
import NoInternet from "./pages/errors/NoInternet";
import ExpiredDrivers from "./pages/drivers/ExpiredDrivers";
import UpdateDriver1 from "./pages/drivers/UpdateDriver1";
import UpdateDriver2 from "./pages/drivers/UpdateDriver2";
import UpdateDriver3 from "./pages/drivers/UpdateDriver3";
import PaymentRequests from "./pages/drivers/PaymentRequests";

export const ModeContext = createContext(null);
export default function App() {
  const [dark, setDark] = useState(false);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  useEffect(() => {
    function handleOnlineStatusChange() {
      setIsOnline(window.navigator.onLine);
    }

    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, []);
  return (
    <>
      {isOnline ? (
        <section className="font-fiexen">
          <ModeContext.Provider value={{ dark, setDark }}>
            <ToastContainer />
            <ChakraProvider>
              <Router>
                <Routes>
                  <Route exact path="/sign-in" element={<Login />} />
                  <Route
                    exact
                    path="/"
                    element={<ProtectedRoute Component={Home} />}
                  />
                  <Route
                    exact
                    path="/track-order"
                    element={<ProtectedRoute Component={Tracking} />}
                  />
                  <Route
                    exact
                    path="/customers"
                    element={<ProtectedRoute Component={Customers} />}
                  />
                  <Route
                    exact
                    path="/customer-details"
                    element={<ProtectedRoute Component={CustomerDetails} />}
                  />
                  <Route
                    exact
                    path="/drivers"
                    element={<ProtectedRoute Component={Drivers} />}
                  />
                  <Route
                    exact
                    path="/expired-drivers"
                    element={<ProtectedRoute Component={ExpiredDrivers} />}
                  />
                  <Route
                    exact
                    path="/payment-requests"
                    element={<ProtectedRoute Component={PaymentRequests} />}
                  />
                  <Route
                    exact
                    path="/create-driver/step-one"
                    element={<ProtectedRoute Component={CreateDriver1} />}
                  />
                  <Route
                    exact
                    path="/create-driver/step-two"
                    element={<ProtectedRoute Component={CreateDriver2} />}
                  />
                  <Route
                    exact
                    path="/create-driver/step-three"
                    element={<ProtectedRoute Component={CreateDriver3} />}
                  />
                  <Route
                    exact
                    path="/update-driver/personal-info"
                    element={<ProtectedRoute Component={UpdateDriver1} />}
                  />
                  <Route
                    exact
                    path="/update-driver/vehicle-info"
                    element={<ProtectedRoute Component={UpdateDriver2} />}
                  />
                  <Route
                    exact
                    path="/update-driver/license-info"
                    element={<ProtectedRoute Component={UpdateDriver3} />}
                  />
                  <Route
                    exact
                    path="/driver-details"
                    element={<ProtectedRoute Component={DriverDetails} />}
                  />
                  <Route
                    exact
                    path="/bookings"
                    element={<ProtectedRoute Component={Bookings} />}
                  />
                  <Route
                    exact
                    path="/booking-details"
                    element={<ProtectedRoute Component={BookingDetails} />}
                  />
                  <Route
                    exact
                    path="/transporters"
                    element={<ProtectedRoute Component={Transporters} />}
                  />
                  <Route
                    exact
                    path="/employees"
                    element={<ProtectedRoute Component={Employees} />}
                  />
                  <Route
                    exact
                    path="/warehouses"
                    element={<ProtectedRoute Component={Warehouses} />}
                  />
                  <Route
                    exact
                    path="/create-warehouse"
                    element={<ProtectedRoute Component={CreateWarehouse} />}
                  />
                  <Route
                    exact
                    path="/warehouse-details"
                    element={<ProtectedRoute Component={WarehouseDetails} />}
                  />
                  <Route
                    exact
                    path="/charges"
                    element={<ProtectedRoute Component={Charges} />}
                  />
                  <Route
                    exact
                    path="/dbs"
                    element={<ProtectedRoute Component={DBS} />}
                  />
                  <Route
                    exact
                    path="/dbs-details"
                    element={<ProtectedRoute Component={DBSdetails} />}
                  />
                  <Route
                    exact
                    path="/provinces"
                    element={<ProtectedRoute Component={Provinces} />}
                  />
                  <Route
                    exact
                    path="/districts"
                    element={<ProtectedRoute Component={Districts} />}
                  />
                  <Route
                    exact
                    path="/corregimientos"
                    element={<ProtectedRoute Component={Corregimientos} />}
                  />
                  <Route
                    exact
                    path="/banners"
                    element={<ProtectedRoute Component={Banners} />}
                  />
                  <Route
                    exact
                    path="/categories"
                    element={<ProtectedRoute Component={Categories} />}
                  />
                  <Route
                    exact
                    path="/coupons"
                    element={<ProtectedRoute Component={Coupons} />}
                  />
                  <Route
                    exact
                    path="/units"
                    element={<ProtectedRoute Component={Units} />}
                  />
                  <Route
                    exact
                    path="/sizes"
                    element={<ProtectedRoute Component={Sizes} />}
                  />
                  <Route
                    exact
                    path="/payments"
                    element={<ProtectedRoute Component={Payments} />}
                  />
                  <Route
                    exact
                    path="/structures"
                    element={<ProtectedRoute Component={Structures} />}
                  />
                  <Route
                    exact
                    path="/vehicles"
                    element={<ProtectedRoute Component={Vehicles} />}
                  />
                  <Route
                    exact
                    path="/support"
                    element={<ProtectedRoute Component={Support} />}
                  />
                  <Route
                    exact
                    path="/faqs"
                    element={<ProtectedRoute Component={FAQ} />}
                  />
                  <Route
                    exact
                    path="/eta"
                    element={<ProtectedRoute Component={ETA} />}
                  />
                  <Route
                    exact
                    path="/notifications"
                    element={<ProtectedRoute Component={Notifications} />}
                  />
                  <Route
                    exact
                    path="/roles"
                    element={<ProtectedRoute Component={Roles} />}
                  />
                </Routes>
              </Router>
            </ChakraProvider>
          </ModeContext.Provider>
        </section>
      ) : (
        <NoInternet />
      )}
    </>
  );
}
