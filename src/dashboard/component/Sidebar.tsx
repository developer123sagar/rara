/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { CustomIcon, ToggleBtn } from "@/common";
import { Link, useLocation } from "react-router-dom";
import { Sidebar_data } from "@/data";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import {
  fetchIndvRestInfo,
  fetchRestaurantTables,
} from "@/redux/restaurant/restaurantSlice";
import axios from "axios";
import { url } from "@/routes";
import { UpdateDataWithUpdate } from "@/redux/dashboard/fetchApiData/fetchApiDataSlice";
import { IRestaurant } from "@/types";

export const Sidebar: React.FC = () => {
  const pathname = useLocation().pathname;
  const isInitialRender = useRef(true);
  const [data, setData] = useState<IRestaurant>();

  const isInitialRender2 = useRef(true);
  const [toggle, setToggle] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const [filteredSidebarData, setFilteredSidebarData] = useState<any>([]);
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState<number | null>(null);
  const { token } = useAppSelector((state: RootState) => state.signin);
  const { restInfo, restaurantTables } = useAppSelector(
    (state: RootState) => state.restaurant
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchIndvRestInfo(token));
  }, [dispatch, token]);

  const totalNewOrders = useSelector((state: RootState) => state.order);
  const businessType = localStorage.getItem("businessType") || "";

  const { role } = useAppSelector((state: RootState) => state.signin);

  useEffect(() => {
    if (restaurantTables?.isBookingOpen === true) setToggle(true);
    else if (restaurantTables?.isBookingOpen === false) setToggle(false);
  }, [restaurantTables]);

  useEffect(() => {
    if (data?.isAcceptingOrder === true) setToggle2(true);
    else if (data?.isAcceptingOrder === false) setToggle2(false);
  }, [data]);

  useEffect(() => {
    if (data?._id) dispatch(fetchRestaurantTables({ restaurantId: data._id }));
  }, [dispatch, data]);

  const handleToggleChange = () => {
    setToggle(!toggle);
  };

  const handleToggleChange2 = () => {
    setToggle2(!toggle2);
  };

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
          if (!businessType) {
            localStorage.setItem("businessType", res.data.Data.bussinessType);
          }
        }

        setData(res.data?.Data);
      } catch (err) {
        throw err;
      }
    };
    if (role === "restaurant") getInfo();
  }, [token, role]);

  const updateBookingStatus = async (value: boolean) => {
    try {
      await axios.put(
        `${url}/raratable/update_bookingstatus`,
        { isBookingOpen: value },
        {
          headers: {
            Authorization: token,
          },
        }
      );
    } catch (err) {
      throw err;
    }
  };
  const updateOrderStatus = async (value: boolean) => {
    await dispatch(
      UpdateDataWithUpdate({
        api: "rararestaurant/update",
        form: { isAcceptingOrder: value },
        token: token!,
      })
    );
  };

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (toggle === true) updateBookingStatus(true);
    else if (toggle === false) updateBookingStatus(false);
  }, [toggle]);

  useEffect(() => {
    if (isInitialRender2.current) {
      isInitialRender2.current = false;
      return;
    }

    if (toggle2 === true) updateOrderStatus(true);
    else if (toggle2 === false) updateOrderStatus(false);
  }, [toggle2]);

  useEffect(() => {
    const filteredData = Sidebar_data.map((item) => {
      const filteredSubmenu = item.submenu?.filter((submenuItem) =>
        submenuItem.role?.some((r) => role.includes(r))
      );
      return {
        ...item,
        submenu: filteredSubmenu,
      };
    }).filter((item) => item.role?.some((r) => role.includes(r)));

    const filteredSidebar = filteredData.filter((item) => {
      if (item.name === "Tables" || item.name === "Bookings") {
        return restInfo?.dining;
      }
      if (item.name === "Video" && restInfo?.bussinessType === "restaurant") {
        return false;
      } else {
        return true;
      }
    });

    setFilteredSidebarData(filteredSidebar);
  }, [
    dispatch,
    token,
    restInfo?.dining,
    role,
    restInfo.email,
    restInfo?.bussinessType,
  ]);

  const toggleSubMenu = (index: number) => {
    setOpenSubmenuIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const renderMenuItem = (item: any, index: number) => {
    const isSubmenuOpen = openSubmenuIndex === index;
    if (
      item.name === "Tables" &&
      businessType === "privateBussiness" &&
      !restInfo?.dining
    ) {
      return null;
    }
    if (
      item.name === "Bookings" &&
      businessType === "privateBussiness" &&
      !restInfo?.dining
    ) {
      return null;
    }

    return (
      <div
        key={index}
        className="leading-10 mt-4 hidden md:block sm:block h-auto"
      >
        {item.path ? (
          <Link to={item.path}>
            <div
              className={`group flex gap-3 pl-2 items-center hover:bg-gray-200 relative  transition duration-500 py-2  ${
                item.path === pathname && "bg-gray-200"
              }`}
            >
              <CustomIcon
                icon={item.icon}
                size={16}
                className={`text-black text-sm group-hover:text-[#e01f2d] font-semibold ${
                  item.path === pathname ? "text-[#e01f2d]" : ""
                }`}
              />
              <h1
                className={`text-black  group-hover:text-[#e01f2d] transition duration-500 text-sm font-semibold ${
                  item.path === pathname && "text-[#e01f2d]"
                }`}
              >
                {item.name}
              </h1>
            </div>
          </Link>
        ) : (
          <div
            onClick={() => toggleSubMenu(index)}
            style={{ cursor: "pointer" }}
          >
            <div className="group flex gap-3 pl-2 items-center w-full  hover:bg-gray-200 transition duration-500 py-2">
              <CustomIcon
                icon={item.icon}
                size={16}
                className={`text-black text-sm group-hover:text-[#e01f2d] font-semibold ${
                  item.path === pathname ? "text-[#e01f2d]" : ""
                }`}
              />
              <h1
                className={`text-black  group-hover:text-[#e01f2d] transition duration-500 text-sm  font-semibold ${
                  item.path === pathname && "text-[#e01f2d]"
                }`}
              >
                {item.name}
              </h1>

              {role == "admin" ? null : (
                <div>
                  {item.meter && (
                    <div
                      className={`h-[25px] w-[25px] rounded-full flex  justify-center items-center text-white bg-[#e01f2d] ${
                        totalNewOrders.totalOrders === 0 && "hidden"
                      }`}
                    >
                      <h1 className="text-[15px] ">
                        {" "}
                        {totalNewOrders.totalOrders}{" "}
                      </h1>
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginLeft: "auto" }}>
                {item.submenu && (
                  <>
                    {isSubmenuOpen ? (
                      <CustomIcon
                        icon={BsChevronUp}
                        color="gray"
                        size={14}
                        className="mr-2"
                      />
                    ) : (
                      <CustomIcon
                        icon={BsChevronDown}
                        color="gray"
                        size={14}
                        className="mr-2"
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {item.submenu && isSubmenuOpen && (
          <div>
            <ul className="list-none overflow-hidden">
              {item.submenu.map(
                (submenuItem: any, id: number) =>
                  (!submenuItem.role ||
                    submenuItem.role.some((r: any) => role.includes(r))) && (
                    <Link
                      to={submenuItem.path!}
                      key={`${submenuItem.name}-${id}`}
                    >
                      <li
                        className={`text-black  text-sm font-medium hover:text-[#e01f2d]  cursor-pointer flex gap-2 transition duration-500 py-2 px-2 ${
                          submenuItem.path === pathname &&
                          "text-[#e01f2d] bg-gray-200"
                        }`}
                      >
                        <CustomIcon
                          icon={submenuItem.icon}
                          size={16}
                          className={`text-black mr-1 text-sm font-semibold ${
                            submenuItem.path === pathname
                              ? "text-[#e01f2d]"
                              : ""
                          }`}
                        />
                        {submenuItem.name}
                      </li>
                    </Link>
                  )
              )}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="fixed px-4 left-0 bg-white top-0 flex h-screen w-64 flex-col overflow-y-hidden duration-300 ease-linear lg:static lg:translate-x-0f pt-2">
      <div className="mt-16 z-50 scrollbar-hide overflow-y-auto">
        {filteredSidebarData.map((item: any, index: number) =>
          renderMenuItem(item, index)
        )}
      </div>
      <div className="w-[80%]">
        {role === "restaurant" && restInfo?.dining && (
          <>
            {restaurantTables && restaurantTables.table?.length > 0 && (
              <div className="flex w-full justify-center items-center gap-5">
                <h1
                  className={`form-control w-full py-3 pl-2 text-gray-600 mr-[-50px]`}
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
            {(data?.hasDelivery === true || data?.userPickup) &&
              restInfo?.dining && (
                <div className="flex w-full justify-center items-center gap-5">
                  <h1
                    className={`form-control w-full py-3 pl-2 text-gray-600 mr-[-50px]`}
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
      </div>
    </aside>
  );
};
