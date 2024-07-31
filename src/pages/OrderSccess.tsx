/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { clearCart } from "@/redux/cart/cartSliice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { Dispatch, SetStateAction, useEffect } from "react";
import { connectSocket } from "@/common/global/socket";
import { Socket } from "socket.io-client";
import { useState } from "react";
import { fetchDashboardData } from "@/redux/dashboard/fetchApiData/fetchApiDataSlice";
import { IoMdCheckmark } from "react-icons/io";
import HeaderWithSearch from "@/components/HeaderWithSearch";
import { Footers } from "@/components";

interface Search {
  latitude: string | null;
  longitude: string | null;
  permission: boolean;
  setSearchParam: React.Dispatch<React.SetStateAction<string>>;
  currentDay: string;
  selectedTimeSlot: string;
  sliderNumber: number;
  setSliderNumber: Dispatch<SetStateAction<number>>;
  setLatitude: Dispatch<SetStateAction<string | null>>;
  setLongitude: Dispatch<SetStateAction<string | null>>;
  setPermission: Dispatch<SetStateAction<boolean>>;
  setScrollDown: Dispatch<SetStateAction<boolean>>;
  headerLocation?: boolean;
  toComboOffer?: boolean;
  toSpecialPackage?: boolean;
}

const OrderSccess = (props: Search) => {
  const dispatch = useAppDispatch();
  const { userToken } = useAppSelector((state: RootState) => state.signin);

  const data: any = useAppSelector(
    (state: RootState) => state.fetchDashData.data
  );

  useEffect(() => {
    dispatch(fetchDashboardData({ api: "raraclient/info", token: userToken! }));
  }, [dispatch, userToken]);

  const [sock, setSocket] = useState<Socket>();

  useEffect(() => {
    setSocket(connectSocket(userToken));
  }, [setSocket, connectSocket]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get("message");
    const orderId = urlParams.get("orderId") || "ORDER-909";

    if (data !== null) {
      if (message === "success") {
        dispatch(clearCart());

        const orderData = {
          userId: data._id,
          restaurantId: localStorage.getItem("restaurantId"),
          message: `A new order has been placed with order ${orderId}`,
        };
        sock && sock.emit("ORDER_NOTIFICATION", orderData);
      }
    }
  }, [dispatch, data]);

  useEffect(() => {
    return () => {
      sock && sock.disconnect();
    };
  }, []);

  return (
    <>
      <HeaderWithSearch
        sliderNumber={props.sliderNumber}
        setSliderNumber={props.setSliderNumber}
        setLongitude={props.setLongitude}
        setLatitude={props.setLatitude}
        setScrollDown={props.setScrollDown}
        setPermission={props.setPermission}
        latitude={props.latitude}
        longitude={props.longitude}
        hideSlider={true}
        headerLocation={true}
      />
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <IoMdCheckmark
          className="text-green-500 p-4 rounded-full shadow-inner bg-gray-100"
          size={100}
        />
        <h2 className="my-4 text-2xl font-bold">
          Your order has been successfully placed.
        </h2>
      </div>
      <Footers />
    </>
  );
};

export default OrderSccess;
