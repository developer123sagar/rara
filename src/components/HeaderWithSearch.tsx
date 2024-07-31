import { Header_content } from "@/constants";
import { Link, useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { FaLocationDot } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import { FaBars, FaExchangeAlt, FaSearch } from "react-icons/fa";
import { CustomIcon, Drawer } from "@/common";
import { BiHeart, BiTag } from "react-icons/bi";
import { clientLogout } from "@/redux/auth/loginSlice";
import { motion } from "framer-motion";
import { baseImgUrl } from "@/routes";
import getAddressFromLatLng, {
  getShortAddressFromLatLng,
} from "@/nonRedux/apiCall";
import Buttons from "@/common/Button";
import { MdDinnerDining } from "react-icons/md";
import { GiCardPickup } from "react-icons/gi";
import AutoComplete from "@/common/AutoComplete";
import { setShowPopUp } from "@/redux/map/mapSlice";
import { IoMdLogOut } from "react-icons/io";
import { ImCross } from "react-icons/im";
import { HiClock } from "react-icons/hi2";
import Cart from "@/common/Cart";

interface HeaderProp {
  sliderNumber: number;
  setSliderNumber: Dispatch<SetStateAction<number>>;
  hideSlider?: boolean;
  showHamburgerr?: boolean;
  setLatitude: React.Dispatch<React.SetStateAction<string | null>>;
  setLongitude: React.Dispatch<React.SetStateAction<string | null>>;
  setScrollDown: React.Dispatch<React.SetStateAction<boolean>>;
  setPermission: React.Dispatch<React.SetStateAction<boolean>>;
  latitude: string | null;
  longitude: string | null;
  redirect?: boolean;
  openSmlFilter?: boolean;
  headerLocation?: boolean;
  setOpenSmlFilter?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function HeaderWithSearch(prop: HeaderProp) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [, setLocationData] = useState("");
  const [showlocation, setshowLocation] = useState(false);
  const [showSchedule] = useState(false);
  const [shortLocationData, setShortLocationData] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeButton, setActiveButton] = useState("Delivery");
  const [buttons, setbuttons] = useState("Dining");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleRegister = () => {
    navigate("/register");
  };
  useEffect(() => {
    const fetchLocation = async () => {
      const data = await getShortAddressFromLatLng(
        prop.latitude,
        prop.longitude,
        "AIzaSyC2Lx7yy5DsOhjhjUI-_DlimiTrCBBqYFg"
      );
      if (prop.latitude !== null && prop.longitude !== null)
        setShortLocationData(data);
    };
    fetchLocation();
  }, [prop.latitude, prop.longitude]);

  useEffect(() => {
    const fetchLocation = async () => {
      const data = await getAddressFromLatLng(
        prop.latitude,
        prop.longitude,
        "AIzaSyC2Lx7yy5DsOhjhjUI-_DlimiTrCBBqYFg"
      );
      setLocationData(data);
    };
    if (prop.latitude && prop.longitude) fetchLocation();
  }, [prop.latitude, prop.longitude]);

  const { clientDetails } = useAppSelector(
    (state: RootState) => state.fetchDashData
  );
  const { userToken } = useAppSelector((state: RootState) => state.signin);
  const { showPopUp } = useAppSelector((state: RootState) => state.map);

  const [searchParam, setSearchParam] = useState("");

  const { icons } = Header_content;

  const handleScroll = () => {
    const scrollY = window.scrollY;
    setIsScrolled(scrollY > 70);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
    }
  }, []);

  const handleSearch = () => {
    if (searchParam.trim().length > 0) {
      navigate(`/filteredSearch/noId/${searchParam}`);
    }
  };

  const handleDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleLogout = () => {
    // setIsMenuOpen(false);
    dispatch(clientLogout());
    localStorage.removeItem("longitude");

    navigate("/");
  };
  const handleLogin = () => {
    navigate("/login");
  };
  const handleImageClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const button = [
    { icon: MdDinnerDining, value: "Delivery" },
    { icon: GiCardPickup, value: "Pickup" },
  ];

  const handleActiveBtn = (btn: string) => {
    setActiveButton(btn);
    if (btn === "Pickup") {
      localStorage.setItem("deliveryType", "pickup");
      prop.setSliderNumber(2);
    } else {
      localStorage.setItem("deliveryType", "homedelivery");
      prop.setSliderNumber(1);
    }
  };

  const handleButton = (btn: string) => {
    setbuttons(btn);
    if (btn === "Pickup") {
      localStorage.setItem("deliveryType", "pickup");
      prop.setSliderNumber(2);
    } else {
      localStorage.setItem("deliveryType", "homedelivery");
      prop.setSliderNumber(1);
    }
  };
  useEffect(() => {
    const deliverytype = localStorage.getItem("deliveryType") || "";
    if (deliverytype) {
      handleButton("Delivery");
    }
  }, []);

  return (
    <>
      <header>
        <div
          className={`fixed  top-0 left-0  px-2 w-full  h-[50px] bg-white   flex items-center z-[30] ${
            isScrolled && "shadow-lg  shadow-slate-200 "
          } `}
        >
          <div className="basis-full flex justify-between sm:basis-[300px]">
            <div className="flex  items-center gap-2 mx-2 mr-4">
              {userToken ? (
                <FaBars
                  onClick={handleDrawer}
                  className="cursor-pointer sm:h-3 sm:w-12 md:h-6 h-4 w-8"
                />
              ) : (
                <div>
                  <FaBars
                    className="cursor-pointer sm:h-3 sm:w-2 md:w-6 lg:w-8 h-4 w-8 md:h-8 "
                    onClick={handleDrawer}
                  />
                </div>
              )}

              <div className="w-full relative">
                <figure
                  className={`h-full w-fit ml-8  ${
                    isScrolled && "hidden md:block "
                  }`}
                >
                  {prop.redirect ? (
                    <Link to="/" onClick={handleImageClick}>
                      <img
                        src="/logo.png"
                        alt="rara"
                        className="sm:w-40 h-8   md:w-[240px]  r-2xl:w-[100px] sm:h-[50px] md:h-[50px] object-cover sm:object-contain  md:object-contain lg:object-contain"
                      />
                    </Link>
                  ) : (
                    <Link to="/">
                      <img
                        src="/logo.png"
                        alt="rara"
                        className="w-20 md:w-[140px] md:h-[36px] object-cover sm:object-contain   lg:object-contain md:object-contain"
                      />
                    </Link>
                  )}
                </figure>
                <div className="relative bg-gray-200/90 w-[280px]">
                  {isScrolled ? (
                    <div className=" flex w-full ">
                      <div className="flex items-center justify-center  md:hidden  overflow-hidden ">
                        <input
                          type="text"
                          className="flex-grow flex-shrink-0  bg-gray-200/90 placeholder:font-bold  placeholder:text-gray-600 placeholder:text-[12px]  md:placeholder:text-base pl-5 pt-2 pb-3 w-fit  outline-none"
                          placeholder="Search your restaurants"
                          onChange={(e) => setSearchParam(e.target.value)}
                          onKeyPress={handleKeyPress}
                        />
                        <div
                          className="absolute right-2 "
                          onClick={() => {
                            if (searchParam.trim().length > 0)
                              navigate(`/filteredSearch/noId/${searchParam}`);
                          }}
                        >
                          <FaSearch size={16} className="text-gray-600   " />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <div className="lg:p-0   md:p-2 sm:block  md:w-fit ">
              <div
                className="hidden md:flex flex-1 r-2xl:px-2  bg-[#dc3545]  text-white h-[50px] r-2xl:flex overflow-hidden  cursor-pointer  gap-2 justify-center items-center r-2xl:mr-3"
                onClick={() => dispatch(setShowPopUp(true))}
              >
                <div className="flex gap-2 items-center p-2  justify-center">
                  <div className=" ">
                    <FaLocationDot size={12} className=" h-full " />
                  </div>

                  <div className="md:text-[12px]  lg:text-[15px] font-bold  ">
                    {shortLocationData}
                  </div>
                </div>
              </div>

              <div
                className={`bg-white border-2  border-[#e6e6e6]  w-[20rem]  md:w-[26rem] fixed top-[22%] sm:top-[120px] left-[2%] sm:left-[35%] transform [-translate-x-1/2 -translate-y-1/2] r-2xl:left-[30%] r-2xl:right-[30%] p-5 z-999999 flex flex-col items-center justify-center shadow-lg
  ${showlocation && "hidden"}
  ${showSchedule && "hidden"}
  ${!showPopUp && "hidden"}`}
              >
                <div className=" w-full mt-[6px] ">
                  <div
                    className=" flex justify-end"
                    onClick={() => dispatch(setShowPopUp(false))}
                  >
                    <ImCross className=" text-red-600  mb-[10px]" />
                  </div>
                  <h1 className="font-bold text-[24px] "> Delivery details</h1>
                  <div className="flex   gap- flex-col">
                    <div className="items-center  flex justify-between">
                      <div className="flex flex-row  items-center gap-4">
                        <FaLocationDot />
                        <h1 className="font-bold text-[12px] sm:text-[16px]">
                          {" "}
                          {shortLocationData}{" "}
                        </h1>
                      </div>
                      <button
                        className="bg-gray-100 p-2 rounded-[18px] text-[12px] sm:text-[16px] font-bold"
                        onClick={() => {
                          setshowLocation(true);
                        }}
                      >
                        Change
                      </button>
                    </div>
                    <hr className="mt-2 mb-2" />
                    <div className="items-center  text-[12px] sm:text-[16px] flex justify-between">
                      {localStorage.getItem("selectedTimeSlot") && (
                        <div className="flex flex-row items-center gap-4">
                          <HiClock />
                          <h1 className="font-bold">
                            {localStorage.getItem("selectedTimeSlot")}
                          </h1>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className=" flex  text-[12px] md:text-[20px] ">
                  <Buttons
                    className={`  ${!showPopUp && "hidden  bg-red-600"}  `}
                    onClick={() => dispatch(setShowPopUp(false))}
                  >
                    {" "}
                    Done
                  </Buttons>
                </div>
              </div>

              {showlocation && (
                <div
                  className={`bg-white border-2 rounded-md   max-w-[900px] sm:h-[18rem] h-[280px] border-[#e6e6e6] w-[20rem] md:w-[30rem]  fixed top-[10%] sm:top-[120px] left-[2%] sm:left-[35%] transform [-translate-x-1/2 -translate-y-1/2] r-2xl:left-[30%]  r-2xl:right-[30%] p-5 z-999999 flex flex-col items-center  shadow-lg 
              ${!showPopUp && "hidden"}`}
                >
                  <div className=" w-full  ">
                    <div
                      className=" justify-end flex"
                      onClick={() => dispatch(setShowPopUp(false))}
                    >
                      <ImCross className="text-red-600" />
                    </div>
                    <h1 className="text-[12px] sm:text-[24px] mb-6  font-bold  ">
                      Change Your Location
                    </h1>

                    <div className="flex gap-4  items-center">
                      <FaLocationDot size={24} />
                      <h1 className="text-[12px]  sm:text-[20px] font-bold   max-w-full truncate">
                        {" "}
                        {shortLocationData}{" "}
                      </h1>
                    </div>
                    <div className="flex items-center gap-4 ">
                      <div className="w-full">
                        <AutoComplete
                          setLongitude={prop.setLongitude}
                          setLatitude={prop.setLatitude}
                          setScrollDown={prop.setScrollDown}
                          setPermission={prop.setPermission}
                          latitude={prop.latitude}
                          longitude={prop.longitude}
                          isSetLatLong={true}
                        />
                      </div>
                    </div>
                    <hr className=" mt-3 mb-1" />

                    <div className="flex gap-4 items-center justify-center ">
                      <Buttons
                        onClick={() => {
                          dispatch(setShowPopUp(false));
                        }}
                        className={`
                   ${!showPopUp && "hidden"}`}
                      >
                        Done
                      </Buttons>
                    </div>
                  </div>
                </div>
              )}
              {showSchedule && (
                <div
                  className={`bg-white border-2 rounded-md    max-w-[900px] sm:h-[24rem]  h-[655px] border-[#e6e6e6] w-[20rem] md:w-[30rem]  fixed top-[10%] sm:top-[120px] left-[2%] sm:left-[35%] transform [-translate-x-1/2 -translate-y-1/2] r-2xl:left-[30%]  r-2xl:right-[30%] p-5 z-999999 flex flex-col items-center  shadow-lg 
             ${!showPopUp && "hidden"}`}
                >
                  {/* <div className="md:p-[24px] p-[12px] w-[16rem]  md:w-[410px] ">
              <ImCross onClick={() => dispatch(setShowPopUp(false))} />
              <div className="do text-[12px] md:text-[32px] font-bold  ht mb-2px md:mb-[24px]">
                Pick a time
              </div>
              <div className="be md:text-[16px] text-[10px] leading-[12px] md:leading-[24px]">
                <div className="ct  ak">
                  <select
                    aria-label="Select delivery date"
                    className="hz aj cursor-pointer"
                    onChange={(e) => prop.setCurrentDay(e.target.value)}
                  >
                    {formattedDates.map((dt, i) => (
                      <option value={dt} key={i} className="gk">
                        {dt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="be md:text-[16px] text-[10px] leading-[12px] md:leading-[24px]">
                <div className="ct ak">
                  <select
                    aria-label="Select delivery date"
                    className="hz aj cursor-pointer"
                    onChange={(e) => prop.setSelectedTimeSlot(e.target.value)}
                  >
                    {timeSlots.map((ts, i) => (
                      <option value={ts} key={i} className="gk">
                        {ts}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                aria-label="Save scheduled delivery preference"
                className="  bg-black text-white rounded md:p-4 p-2 ct  mt-[10px] md:mt-[24px]"
                onClick={() => {
                  // if (prop.latitude !== null || prop.longitude !== null) {
                    prop.setSliderNumber(1);
                    if (prop.currentDay === "") {
                      prop.setCurrentDay(formattedDates[0]);
                    }
                    if (prop.selectedTimeSlot === "") {
                      prop.setSelectedTimeSlot(timeSlots[0]);
                    }
                    localStorage.setItem("currentDay", prop.currentDay);
                    localStorage.setItem(
                      "selectedTimeSlot",
                      prop.selectedTimeSlot
                    );
                    alert(prop.currentDay); 
                    // if (!userToken) navigate("/rest_details/noId");
                    // else navigate("/rest_details/noId");
                  // } else alert("You need to enter the address first");
                }}
              >
                Schedule
              </button>
              <button
                onClick={() => {
                  if (prop.latitude !== null || prop.longitude !== null) {
                    prop.setSliderNumber(0);
                    if (!userToken) navigate("/rest_details/noId");
                    else {
                      if (clientDetails.phone) navigate("/rest_details/noId");
                      else navigate("/manageAccount");
                    }
                  }
                }}
                className=" bg-gray-100 text-black rounded md:p-4 p-2 ct  mt-[10px] md:mt-[24px] "
              >
                Deliver now
              </button>
            </div> */}
                </div>
              )}
            </div>
          </div>

          <div className="r-2xl:flex-1  w-full relative h-[50px] hidden md:flex r-2xl:flex items-center">
            <input
              type="text"
              className="bg-gray-200/90 mr-3 placeholder:font-bold placeholder:text-gray-600   placeholder:sm:hidden placeholder:md:text-[12px] placeholder:text-base pl-5 pt-2 pb-2 w-full h-[100%] outline-none"
              placeholder="Search your restaurants"
              onChange={(e) => setSearchParam(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <div
              className="absolute   sm:hidden lg:block right-4"
              onClick={() => {
                if (searchParam.trim().length > 0)
                  navigate(`/filteredSearch/noId/${searchParam}`);
              }}
            >
              <FaSearch size={20} className="text-gray-600 mr-4" />
            </div>
          </div>

          <div className="hidden md:flex md:gap-3">
            <ul
              className={`w-[170px] py-[1px] px-[3px] h-[50px] border border-gray-200 bg-slate-200 shadow-inner rounded-full flex items-center justify-between cursor-pointer overflow-hidden`}
            >
              {button.map((item) => (
                <li
                  key={`${item.value}`}
                  className="relative px-4  py-2 pr-3"
                  onClick={() => handleActiveBtn(item.value)}
                >
                  {item.value === activeButton && (
                    <motion.div
                      layoutId="active-url"
                      style={{ borderRadius: 9999 }}
                      transition={{ type: "spring", duration: 0.8 }}
                      className="absolute inset-0 bg-slate-50  overflow-hidden shadow-inner"
                    />
                  )}
                  <span className={"relative z-10 text-gray-900"}>
                    {item.value}
                  </span>
                </li>
              ))}
            </ul>

            <Cart />
          </div>

          {/* navLinks */}
          <div className="flex items-center  ">
            {/* nav icons */}
            <div className="flex  gap-4">
              {!userToken ? (
                <div className={`  gap-6 hidden `}>
                  <Link to={"/login"}>
                    <button
                      className={`text-[12px] r-2xl:text-[15px] h-[50px] w-20 
                      bg-[#e01f2d] text-white font-bold flex items-center  justify-center gap-2 text-center `}
                    >
                      <img src="/profile.png" alt="user" className="w-4" />{" "}
                      Login{" "}
                    </button>
                  </Link>
                  <Link to={"/register"}>
                    <button
                      className={` text-[12px] r-2xl:text-[15px] w-20 h-[50px]  pb-2 pt-1
                    bg-[#27d119] text-white font-bold flex items-center justify-center gap-2 text-center`}
                    >
                      Register
                    </button>
                  </Link>
                </div>
              ) : (
                <div className=" items-center  hidden mx-2">
                  {icons.map((item, id) => (
                    <div className="relative  " key={`${item.img}...${id}`}>
                      {item.path ? (
                        <Link to={item.path}>
                          <img
                            src={item.img}
                            alt={item.img}
                            className="w-8 hover:cursor-pointer   hidden"
                          />
                        </Link>
                      ) : (
                        <img
                          src={item.img}
                          alt={item.img}
                          className="r-2xl:w-11 w-6 hover:cursor-pointer mx-3 "
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className={`r-2xl:hidden md:hidden top-0 md:top-12 left-0 right-0  z-99 ${
            isScrolled && ""
          } ${prop.headerLocation && " hidden"}`}
        >
          <div className=" sm:flex sm:gap-2 sm:mt-16 -mt-16 w-full  sm:ml-4 sm:mr-4 ">
            <div className="relative h-[50px] md:mt-20 mt-16 sm:mt-0 gap-1   sm:w-full flex items-center   ">
              <div className="flex-1  flex relative h-[50px]   items-center">
                <input
                  type="text"
                  className="bg-gray-200/90 placeholder:font-bold   md:mr-7 ml-[2px]  placeholder:text-gray-600 placeholder:text-[14px] md:placeholder:text-base pl-5   pb-2 w-full   h-[100%] outline-none"
                  placeholder="Search restaurants"
                  onChange={(e) => setSearchParam(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <div
                  className="absolute  right-3"
                  onClick={() => {
                    if (searchParam.trim().length > 0)
                      navigate(`/filteredSearch/noId/${searchParam}`);
                  }}
                >
                  <FaSearch size={12} className="text-gray-600 md:mr-4    " />
                </div>
              </div>
              {prop.openSmlFilter !== undefined &&
                prop.setOpenSmlFilter !== undefined && (
                  <button
                    className="bg-[rgb(230,230,230)] h-[50px] pl-5 r-2xl:pr-5 pt-2 pb-2  ml-1 r-2xl:mr-10 flex gap-2  justify-center items-center"
                    onClick={() => {
                      prop.setOpenSmlFilter &&
                        prop.setOpenSmlFilter(!prop.openSmlFilter);
                    }}
                  >
                    {" "}
                    Filter <FaChevronDown className=" mx-2" />
                  </button>
                )}
            </div>

            <div className="flex sm:mr-4 w-full justify-center gap-3  mt-2 sm:mt-0 md:mt-0 md:p-4     ">
              <div className="lg:hidden block  ">
                <ul
                  className={`w-[150px] py-[1px] px-[3px] h-full border  border-gray-200 bg-slate-200 shadow-inner rounded-full flex items-center justify-between cursor-pointer overflow-hidden`}
                >
                  {button.map((item) => (
                    <li
                      key={`${item.value}`}
                      className="relative px-4 py-2 pr-2"
                      onClick={() => handleButton(item.value)}
                    >
                      {item.value === buttons && (
                        <motion.div
                          layoutId="active-url"
                          style={{ borderRadius: 9999 }}
                          transition={{ type: "spring", duration: 0.8 }}
                          className="absolute inset-0 bg-slate-50  overflow-hidden shadow-inner"
                        />
                      )}
                      <span
                        className={"relative z-10 text-[14px] text-gray-900"}
                      >
                        {item.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className=" md:pr-10 bg-[#171717]  md:w-auto w-full sm:w-auto sm:p-4  text-white h-[50px] flex overflow-hidden   cursor-pointer gap-2 sm:justify-end justify-center items-center mr-1"
                onClick={() => dispatch(setShowPopUp(true))}
              >
                <div className="flex gap-2 r-2xl:items-center   r-2xl:justify-center">
                  <div className=" ">
                    <FaLocationDot size={12} className=" h-full" />
                  </div>

                  <p className="text-[10px] md:text-[15px] font-bold    w-full">
                    {shortLocationData}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <Drawer
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
        position="left"
        xValue={-400}
        width="300px"
      >
        {userToken ? (
          <div className="mx-2">
            <div className="flex w-full  mt-4">
              <div>
                <aside className="">
                  <div className="ml-1  ">
                    <div className=" flex">
                      {" "}
                      <img
                        src="/logo.png"
                        alt=""
                        className=" w-20  h-12 r-2xl:w-[140px] r-2xl:h-[50px] object-contain lg:object-cover"
                      />
                    </div>
                    <div className="flex w-full items-center gap-2  mb-1">
                      <div className="w-12 h-20   ">
                        <img
                          src={
                            clientDetails?.isGoogleLinked
                              ? clientDetails?.uploadPhoto
                                ? `${baseImgUrl}/${clientDetails?.photo}`
                                : `${clientDetails?.photo}`
                              : `${baseImgUrl}/${clientDetails?.photo}`
                          }
                          alt="user"
                          className="rounded-full bg-blue-300 w-12 h-12 object-cover   mb-2 mt-4"
                        />
                      </div>
                      <div className="flex-col ">
                        <h1 className="font-bold  text-[16px]">
                          {clientDetails?.name}
                        </h1>
                        <Link to="/manageaccount">
                          {" "}
                          <h1 className="font-bold  text-green-500">
                            Manage Account
                          </h1>
                        </Link>
                      </div>
                    </div>
                    <ul className="w-full  flex-col   text-[16px] scroll text-black font-bold">
                      {[
                        { name: "Orders", path: "/myorders", icon: BiTag },
                        {
                          name: "Wishlist",
                          path: "/wishlist",
                          icon: BiHeart,
                        },

                        {
                          name: "Change Address",
                          path: "/delivery",
                          icon: FaExchangeAlt,
                        },
                      ].map((item) => (
                        <Link
                          to={item.path}
                          key={item.name}
                          className="flex items-center hover:bg-[#ffffff38]  mb-3  gap-6 px-2 "
                        >
                          <CustomIcon
                            icon={item.icon}
                            size={20}
                            className="w-4 text-black h-8 "
                          />
                          <li className=" text-[16px]">{item.name}</li>
                        </Link>
                      ))}

                      {userToken ? (
                        <div
                          className="flex items-center gap-5 cursor-pointer mt-[0.15rem] py-1 transition duration-500 px-2 "
                          onClick={handleLogout}
                        >
                          <IoMdLogOut size={20} />

                          <span className="text-[16px]    font-bold">
                            Log out
                          </span>
                        </div>
                      ) : (
                        <div
                          className="flex items-center gap-5 cursor-pointer mt-[0.15rem] py-1  transition duration-500 px-2 "
                          onClick={handleLogin}
                        >
                          <img
                            src={"/logout.png"}
                            alt={"profile"}
                            className="w-5 h-5 object-contain hover:cursor-pointer"
                          />
                          <span className="text-[16px] font-bold">Log in</span>
                        </div>
                      )}
                    </ul>
                    <hr />
                    <div className="flex flex-col gap-4  mt-6 mx-2  ">
                      <Link to="/restaurant/add">
                        <h1 className="w-full  cursor-pointer   text-[16px]  text-black font-bold">
                          Add Your Restaurant
                        </h1>
                      </Link>
                      <Link to="/rider/add">
                        <h1 className="w-full  cursor-pointer   text-[16px]  text-black font-bold">
                          Add Your Rider
                        </h1>
                      </Link>
                    </div>

                    <div className="flex gap-2  mt-6  ">
                      <figure className="w-16 h-16 mt-3 ">
                        <img
                          src="/applogo.png"
                          alt="applogo"
                          className="w-full h-full object-contain "
                        />
                      </figure>

                      <h1 className="font-bold items-center  mt-4 ">
                        More Features on <br /> the app
                      </h1>
                    </div>
                    <div className="flex gap-2 items-center justify-center mt-6">
                      <button className="px-2 flex items-center  gap-3 h-12 w-[110px] bg-white admin-header opacity-90 text-black font-bold rounded">
                        <img
                          src="/img/Home/GooglePlay.png"
                          alt="googleplay"
                          className="w-6 "
                        />

                        <span className="flex flex-col ">
                          <span className="text-[10px]">Google Play</span>
                        </span>
                      </button>
                      <button className="px-2 flex items-center gap-3 h-12 w-[140px] admin-header opacity-90 text-black bg-white font-bold rounded">
                        <span className="icon">
                          <svg
                            fill="currentcolor"
                            viewBox="-52.01 0 560.035 560.035"
                            xmlns="http://www.w3.org/2000/svg"
                            stroke="#ffffff"
                          >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                              id="SVGRepo_tracerCarrier"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                              <path d="M380.844 297.529c.787 84.752 74.349 112.955 75.164 113.314-.622 1.988-11.754 40.191-38.756 79.652-23.343 34.117-47.568 68.107-85.731 68.811-37.499.691-49.557-22.236-92.429-22.236-42.859 0-56.256 21.533-91.753 22.928-36.837 1.395-64.889-36.891-88.424-70.883-48.093-69.53-84.846-196.475-35.496-282.165 24.516-42.554 68.328-69.501 115.882-70.192 36.173-.69 70.315 24.336 92.429 24.336 22.1 0 63.59-30.096 107.208-25.676 18.26.76 69.517 7.376 102.429 55.552-2.652 1.644-61.159 35.704-60.523 106.559M310.369 89.418C329.926 65.745 343.089 32.79 339.498 0 311.308 1.133 277.22 18.785 257 42.445c-18.121 20.952-33.991 54.487-29.709 86.628 31.421 2.431 63.52-15.967 83.078-39.655"></path>
                            </g>
                          </svg>
                        </span>

                        <span className="flex flex-col">
                          <span className="text-[10px]">App Store</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        ) : (
          <div className=" flex-col items-center justify-center  mx-6">
            <div className=" flex   justify-center ">
              {" "}
              <img
                src="/logo.png"
                alt="rara"
                className="w-40 r-2xl:w-[140px]  r-2xl:h-[50px] object-cover"
              />
            </div>
            <div className="r-2xl:mt-10 mt-2  mb-4 r-2xl:mb-72 ">
              <Buttons
                variant="destructive"
                className="flex gap-5 cursor-pointer mt-[0.15rem] items-center w-full   py-1 transition duration-500 px-2 "
                onClick={handleRegister}
              >
                <span className="text-[16px]   w-full   font-bold">
                  Register
                </span>
              </Buttons>
              <Buttons
                className="flex items-center gap-5 cursor-pointer mt-[0.15rem] py-1 w-full   transition duration-500 px-2 "
                onClick={handleLogin}
              >
                <span className="text-[16px]  w-full font-bold">Log in</span>
              </Buttons>
            </div>

            <hr className=" r-2xl:mt-10  mb-4"></hr>

            <div className="flex flex-col gap-4   ">
              <Link to="/rider/add">
                <h1 className="w-full  cursor-pointer    text-[16px]  text-black font-bold">
                  Add Your Rider
                </h1>
              </Link>
              <Link to="/restaurant/add">
                <h1 className="w-full  cursor-pointer  text-[16px]  text-black font-bold">
                  Add Your Restaurant
                </h1>
              </Link>
            </div>

            <div className="flex gap-2  mt-6  ">
              <figure className="w-16 h-16 mt-3 ">
                <img
                  src="/applogo.png"
                  alt="applogo"
                  className="w-full h-full object-contain "
                />
              </figure>

              <h1 className="font-bold items-center mt-4 ">
                More Features on <br /> the app
              </h1>
            </div>
            <div className="flex gap-2 items-center justify-center mt-6">
              <button className="px-2 flex items-center  gap-3 h-12 w-[110px] bg-white admin-header opacity-90 text-black font-bold rounded">
                <img
                  src="/img/Home/GooglePlay.png"
                  alt="googleplay"
                  className="w-6 "
                />

                <span className="flex flex-col ">
                  <span className="text-[10px]">Get it on</span>
                  <span className="text-[10px]">Google Play</span>
                </span>
              </button>
              <button className="px-2 flex items-center gap-3 h-12 w-[140px] admin-header opacity-90 text-black bg-white font-bold rounded">
                <span className="icon">
                  <svg
                    fill="currentcolor"
                    viewBox="-52.01 0 560.035 560.035"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#ffffff"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path d="M380.844 297.529c.787 84.752 74.349 112.955 75.164 113.314-.622 1.988-11.754 40.191-38.756 79.652-23.343 34.117-47.568 68.107-85.731 68.811-37.499.691-49.557-22.236-92.429-22.236-42.859 0-56.256 21.533-91.753 22.928-36.837 1.395-64.889-36.891-88.424-70.883-48.093-69.53-84.846-196.475-35.496-282.165 24.516-42.554 68.328-69.501 115.882-70.192 36.173-.69 70.315 24.336 92.429 24.336 22.1 0 63.59-30.096 107.208-25.676 18.26.76 69.517 7.376 102.429 55.552-2.652 1.644-61.159 35.704-60.523 106.559M310.369 89.418C329.926 65.745 343.089 32.79 339.498 0 311.308 1.133 277.22 18.785 257 42.445c-18.121 20.952-33.991 54.487-29.709 86.628 31.421 2.431 63.52-15.967 83.078-39.655"></path>
                    </g>
                  </svg>
                </span>

                <span className="flex flex-col">
                  <span className="text-[10px]">Download from</span>
                  <span className="text-[10px]">App Store</span>
                </span>
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}
