/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import DropdownMessage from "./DropdownMessage";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";
import { CiSearch } from "react-icons/ci";
import { useEffect, useState } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import {
  fetchRestAdminId,
  fetchRestaurantTables,
} from "@/redux/restaurant/restaurantSlice";
import axios from "axios";
import { url } from "@/routes";
import { IRestaurant } from "@/types";
import { connectSocket } from "./global/socket";
import { Socket } from "socket.io-client";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const dispatch = useAppDispatch();
  const [restaurantChattedUsers, setRestaurantChattedUsers] = useState<any>([]);
  const [data, setData] = useState<IRestaurant>();
  const [allChat, setAllChat] = useState<any>([]);
  const [unseenNotifications, setUnseenNotifications] = useState<string>("");
  const [audio] = useState(new Audio("/audio/chatAayo.mp3"));

  const [sock, setSocket] = useState<Socket>();

  const { restAdminId } = useAppSelector(
    (state: RootState) => state.restaurant
  );

  const { role, token } = useAppSelector((state: RootState) => state.signin);
  const totalNewOrders = useAppSelector(
    (state: RootState) => state.order.totalOrders
  );

  useEffect(() => {
    dispatch(fetchRestAdminId(token));
  }, [dispatch, token]);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const res = await axios.get(`${url}/rararestaurant/info`, {
          headers: {
            Authorization: token,
          },
        });
        if (res.data.Data._id) {
          localStorage.setItem("resAdminId", res.data.Data._id);
        }

        setData(res.data?.Data);
      } catch (err) {
        throw err;
      }
    };
    if (role === "restaurant") getInfo();
  }, [token, role]);

  useEffect(() => {
    if (data?._id) dispatch(fetchRestaurantTables({ restaurantId: data._id }));
  }, [dispatch, data]);

  useEffect(() => {
    const getUserChatData = async (id: string | null) => {
      try {
        const res = await axios.get(`${url}/rarachat/${id}`);
        setRestaurantChattedUsers(res.data.Data);
        return res.data;
      } catch (err) {
        const customError = new Error(
          "An error occurred: " + (err as Error).message
        ) as Error;
        throw customError;
      }
    };
    if (restAdminId && restAdminId._id) getUserChatData(restAdminId._id);
  }, [restAdminId]);

  useEffect(() => {
    const fetchAllChat = async () => {
      try {
        const chatIds = restaurantChattedUsers.map(
          (chatData: any) => chatData.chatId
        );
        const promises = chatIds.map((chatId: string) =>
          axios.get(`${url}/raramessage/${chatId}`)
        );

        const res = await Promise.all(promises);

        const allData = res?.map((res) => res?.data);
        const latestMsg = allData.map((item) => item[item.length - 1]);
        setAllChat(latestMsg);
      } catch (err) {
        const customError = new Error(
          "An error occurred: " + (err as Error).message
        ) as Error;
        throw customError;
      }
    };
    if (role === "restaurant" && restaurantChattedUsers) {
      fetchAllChat();
    }
  }, [role, restaurantChattedUsers]);

  useEffect(() => {
    setSocket(connectSocket(token));
  }, [setSocket, connectSocket, token]);

  useEffect(() => {
    sock &&
      sock.on("ORDER_NOTIFICATION", (content) => {
        setUnseenNotifications(content.message);
      });
    return () => {
      sock && sock.disconnect();
    };
  }, [sock]);

  useEffect(() => {
    if (unseenNotifications) {
      audio.play();
    }
  }, [audio, unseenNotifications]);

  return (
    <header className="fixed top-0 left-0 z-99999 flex w-screen drop-shadow-1 bg-[rgb(255,255,255)] dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between py-4 px-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!w-full delay-300"
                  }`}
                ></span>
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "delay-400 !w-full"
                  }`}
                ></span>
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!w-full delay-500"
                  }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!h-0 !delay-[0]"
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!h-0 !delay-200"
                  }`}
                ></span>
              </span>
            </span>
          </button>
          <Link to="/dashboard">
            <img
              src="/logo.png"
              alt="rara"
              className="w-40 sm:w-40 h-10 md:w-[240px] r-2xl:w-[100px] md:h-[50px] object-cover md:object-contain"
            />
          </Link>
        </div>
        {/* <div className="w-[250px]">
          {role === "restaurant" && (
            <>
              {restaurantTables.length > 0 && (
                <div className="flex w-full justify-center items-center gap-5">
                  <h1
                    className={`form-control w-full py-3 pl-2 ml-10 text-gray-600 mr-[-50px]`}
                  >
                    Booking Open?
                  </h1>
                  <ToggleBtn
                    isOn={toggle}
                    onToggle={handleToggleChange}
                    toggleName="booking"
                  />
                </div>
              )}
              {(data?.hasDelivery === true || data?.userPickup) && (
                <div className="flex w-full justify-center items-center gap-5">
                  <h1
                    className={`form-control w-full py-3 pl-2 ml-10 text-gray-600 mr-[-50px]`}
                  >
                    Order accepting?
                  </h1>
                  <ToggleBtn
                    isOn={toggle2}
                    onToggle={handleToggleChange2}
                    toggleName="booking"
                  />
                </div>
              )}
            </>
          )}
        </div> */}
        <div className="hidden sm:block">
          <form action="https://formbold.com/s/unique_form_id" method="POST">
            <div className="relative">
              <button className="absolute top-1/2 left-0 -translate-y-1/2">
                <CiSearch size={30} />
              </button>

              <input
                type="text"
                placeholder="Type to search..."
                className="w-full bg-transparent pr-4 pl-9 focus:outline-none"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <DropdownNotification
              notification={unseenNotifications}
              orderLength={totalNewOrders}
            />
            <DropdownMessage
              message={allChat}
              chatUser={restaurantChattedUsers}
            />
          </ul>
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
