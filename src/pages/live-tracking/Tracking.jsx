import React, { useEffect, useRef } from "react";
import Layout from "../../components/Layout";
import { useState } from "react";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../utilities/Toaster";
import { useNavigate } from "react-router-dom";
import { TrackingAPI } from "../../utilities/PostAPI";

export default function Tracking() {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [trackId, setTrackId] = useState("");
  const trackButtonRef = useRef(null);
  const handleInputChange = (e) => {
    setTrackId(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault();
      trackingFunc();
    }
  };

  const trackingFunc = async () => {
    if (trackId === "") {
      info_toaster("Please Enter Tracking ID");
    } else {
      setDisabled(true);
      const res = await TrackingAPI("/trackorder", {
        trackingId: trackId,
      });
      if (res?.data.status === "1") {
        localStorage.setItem("orderId", res?.data?.data?.id);
        navigate("/booking-details");
        success_toaster(res?.data?.message);
        setDisabled(false);
      } else {
        error_toaster(res?.data?.message);
        setDisabled(false);
      }
    }
  };
  return (
    <Layout
      title="Track Order"
      content={
        <>
          <div className="flex items-center">
            <input
              value={trackId}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              type="text"
              name="trackingId"
              id="trackID"
              placeholder="Enter order id to track"
              className="text-base font-normal rounded-l-md border border-transparent w-96 px-4 py-3 focus:outline-none"
              autoFocus
            />
            <button
              ref={trackButtonRef}
              onClick={trackingFunc}
              disabled={disabled}
              className="text-lg font-light text-white bg-themeGreen2 rounded-r-md px-4 py-2.5 border border-themeGreen2"
            >
              Track
            </button>
          </div>
        </>
      }
    />
  );
}
