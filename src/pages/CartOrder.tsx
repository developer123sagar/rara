/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable no-useless-catch */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { baseImgUrl, url } from "@/routes";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CustomIcon, Spinner } from "@/common";
import { formattedDates, timeSlots } from "@/data/dates";
import {
  decrementItem,
  incrementItem,
  removeItem,
} from "@/redux/cart/cartSliice";
import { IBanquet, IcartDatas, IDeliveryForm, plan } from "@/types";
import { Navigate, useNavigate } from "react-router-dom";
import {
  payment,
  setSelectedPaymentMethod,
} from "@/redux/checkout-payment/paymentSlice";
import { fetchDashboardData } from "@/redux/dashboard/fetchApiData/fetchApiDataSlice";
import Buttons from "@/common/Button";
import { AiFillDelete, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import CartStepper from "@/components/CartStepper";
import StripeContainer from "@/components/StripeContainer";
import toast from "react-hot-toast";
import { fetchRestaurant } from "@/redux/restaurant/restaurantSlice";
import { truncateString } from "@/helpers";
import { Footers } from "@/components";
import HeaderWithSearch from "@/components/HeaderWithSearch";

interface ICalculation {
  distanceAmount: number;
  discount: number;
  tax: number;
  foodPreparing: string;
  TotalAmount: number | null;
  foodAmount: number;
  AddonsubTotal: number | null;
}
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

interface CartOrderProp extends Search {
  currentDay: string;
  selectedTimeSlot: string;
  setCurrentDay: Dispatch<SetStateAction<string>>;
  setSelectedTimeSlot: Dispatch<SetStateAction<string>>;
}

export default function CartOrder(props: CartOrderProp): any {
  const [specialNote, setSpecialNote] = useState("");
  const [addressLocation, setAddressLocation] = useState<[number, number]>([
    0, 0,
  ]);
  const [showEditPopUp, setShowEditPopUp] = useState(false);
  const [updatedBanquetData, setUpdatedBanquetData] = useState<plan>();
  const [filterCheckoutCartDatas, setFilterCheckoutCartDatas] =
    useState<any>(null);
  const { checkoutCartDatas, checkoutBanquetCartDatas } = useAppSelector(
    (state: RootState) => state.cart
  );
  const { restaurantData } = useAppSelector(
    (state: RootState) => state.restaurant
  );
  const { userToken } = useAppSelector((state: RootState) => state.signin);
  const [calculation, setCalculation] = useState<ICalculation | null>(null);
  const [cuponCode, setCuponCode] = useState("");
  const [banquetData, setBanquetData] = useState<IBanquet>();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const loading = useAppSelector(
    (state: RootState) => state.fetchDashData.loading
  );

  console.log(loading)

  const { selectedPaymentMethod } = useAppSelector(
    (state: RootState) => state.payment
  );

  const data: IDeliveryForm[] = useAppSelector(
    (state: RootState) => state.fetchDashData.data
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const totalQuantity = checkoutCartDatas?.reduce<number>(
    (acc, food) => acc + food.minQuantity,
    0
  );

  const urlParams = new URLSearchParams(window.location.search);
  const isBanquet = urlParams.get("isBanquet") === "true";

  const product_details = checkoutCartDatas?.map((item) => ({
    identity: isBanquet ? updatedBanquetData?._id : item._id,
    quantity: item.minQuantity,
    name: item.name,
    unit_price: item.price,
    total_price: item.total,
    restaurant: item.restaurant,
    image: item.activeImage,
    addon: [
      ...item.addon.map((item) => ({
        addon_identity: item._id,
        addon_name: item.name,
        addon_price: item.extraPrice,
        addon_quantity: item.quantity,
      })),
    ],
    ...(selectedPaymentMethod === "CASH_ON_DEVLIVERY" && {
      specialNote: specialNote,
    }),
  }));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSchedule = () => {
    openModal();
  };

  useEffect(() => {
    dispatch(
      fetchDashboardData({ api: "raradeliveryAddress/user", token: userToken! })
    );
  }, []);
  console.log(data);

  useEffect(() => {
    const storedCurrentDay = localStorage.getItem("currentDay");
    const storedSelectedSlot = localStorage.getItem("selectedTimeSlot");

    if (storedCurrentDay && storedSelectedSlot) {
      props.setCurrentDay(storedCurrentDay);
      props.setSelectedTimeSlot(storedSelectedSlot);
    }
  }, []);

  const resultString = checkoutCartDatas
    .map((item) => `${item.name}:${item.minQuantity}`)
    .join(",");

  const COD_Payload: any = {
    deliveryType: localStorage.getItem("deliveryType") || "",
    location: addressLocation,
    paymentMode: "CASH_ON_DELIVERY",
    product_details: product_details,
    isScheduledForLater: false,
  };

  const banquetProductDetails = [
    {
      identity: updatedBanquetData?._id,
      name: updatedBanquetData?.planName,
      quantity: 1,
      unit_price: updatedBanquetData?.price,
      total_price: updatedBanquetData?.price,
      restaurant: updatedBanquetData?.foods[0]?.restaurant,
    },
  ];

  const Stripe_Payload: any = {
    purchase_order_name: isBanquet
      ? updatedBanquetData?.planName.replace(/\s/g, "")
      : resultString,
    deliveryType: localStorage.getItem("deliveryType") || "",
    specialNote: specialNote,
    location: addressLocation,
    paymentMode: "STRIPE",
    ...(isBanquet && { isScheduledForLater: true }),
    ...(isBanquet && { scheduleTime: selectedTime }),
    ...(isBanquet && { scheduledDate: selectedDate }),

    product_details: isBanquet ? banquetProductDetails : product_details,
    ...(isBanquet && { banquetMenu: true }),
  };

  const handleProceedToCheckout = async () => {
    if (userToken) {
      if (selectedPaymentMethod) {
        if (
          data &&
          Array.isArray(data) &&
          (data[0]?.home.address || data[0]?.work.address)
        ) {
          if (props.currentDay !== "" && props.selectedTimeSlot !== "") {
            COD_Payload.isScheduledForLater = true;

            const dateString = props.currentDay;

            // Extract the date string
            const dateArray = dateString.split(", ");
            const monthDayYear = dateArray[2].split(" ");
            const month = monthDayYear[0];
            const day = parseInt(monthDayYear[1], 10);
            const year = parseInt(dateArray[3], 10);

            // Create a new Date object
            const newDate = new Date(`${month} ${day}, ${year}`);

            COD_Payload.scheduledDate = newDate;
            COD_Payload.scheduleTime = props.selectedTimeSlot;
          }

          if (
            specialNote === "" ||
            addressLocation[0] === 0 ||
            addressLocation[1] === 0
          ) {
            toast("Please fill up extra details also");
            return;
          }
          try {
            if (selectedPaymentMethod === "CASH_ON_DEVLIVERY") {
              await dispatch(
                payment({
                  api: "raraorder/placing-order",
                  paymentMode: "CASH_ON_DEVLIVERY",
                  token: userToken,
                  data: COD_Payload,
                })
              ).then((res) => {
                if (payment.rejected.match(res)) {
                  toast.error(res.error.message || "something went wrong");
                }
                if (payment.fulfilled.match(res)) {
                  toast.success("Thank you for your order");

                  navigate("/order/success?message=success");
                }
              });
            }
            if (selectedPaymentMethod === "STRIPE") {
              makePaymentStripe();
            }
          } catch (error) {
            throw error;
          }
        } else {
          toast.error("Please fill up the delivery address");

          navigate("/delivery");
        }
      } else {
        toast("Please choose payment method");
      }
    } else {
      toast("Please Login first");
      navigate("/login");
    }
  };

  function calculateTotalPrice(foodItem: IcartDatas) {
    const foodPrice = foodItem.price * foodItem.minQuantity || 0;
    const addonPrices = foodItem.addon
      ? foodItem.addon.map((addon) => addon.extraPrice * addon.quantity || 0)
      : [];
    const totalAddonPrice = addonPrices.reduce((sum, price) => sum + price, 0);
    return foodPrice + totalAddonPrice;
  }

  const totalPriceOfCart = checkoutCartDatas.reduce(
    (sum, item) => sum + calculateTotalPrice(item),
    0
  );

  const handleCalculation = async (cupon?: boolean) => {
    if (
      data &&
      Array.isArray(data) &&
      (data[0]?.home.address || data[0]?.work.address)
    ) {
      const updatedform: any = { ...Stripe_Payload };
      if (cupon) {
        updatedform.discount_code = cuponCode;
      } else {
        updatedform.discount_code = undefined;
      }
      try {
        const res = await axios.post(
          `${url}/raradata/calculation`,
          updatedform,
          {
            headers: {
              Authorization: userToken,
            },
          }
        );
        setCalculation(res.data);
      } catch (err: any) {
        toast.error(err.response.data.message || "error");
      }
    } else {
      navigate("/delivery");
    }
  };

  const makePaymentStripe = async (token?: string) => {
    const updatedPayload = { ...Stripe_Payload };
    setLoadingPayment(true);
    if (
      data &&
      Array.isArray(data) &&
      (data[0]?.home.address || data[0]?.work.address)
    ) {
      if (token) updatedPayload.paymentToken = token;
      if (
        specialNote === "" ||
        addressLocation[0] === 0 ||
        addressLocation[1] === 0
      ) {
        toast("Please fill up extra details also");
        return;
      }
      try {
        const res = await axios.post(
          `${url}/raraorder/placing-order`,
          updatedPayload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: userToken,
            },
          }
        );
        if (res.status === 200) {
          toast.success(res.data.message || "Success");
          navigate("/order/success?message=success");
        }
      } catch (err: any) {
        toast.error(err.response.data.error || "Something went wrong");
      } finally {
        setLoadingPayment(false);
      }
    } else {
      toast("Please fill up the delivery address");
      navigate("/delivery");
    }
  };

  if (totalQuantity === 0 && !isBanquet) {
    return navigate("/rest_details/noId");
  }

  useEffect(() => {
    dispatch(fetchRestaurant());
  }, []);

  useEffect(() => {
    const getLunboxdetail = async () => {
      try {
        const res = await axios.get(
          `${url}/raraBanquet-Menu/get-banquetMenu/${checkoutBanquetCartDatas?.restaurant}`
        );
        if (res.status === 200) {
          setBanquetData(res.data.Data);
        }
      } catch (err) {
        throw err;
      }
    };
    getLunboxdetail();
  }, []);

  useEffect(() => {
    if (isBanquet && restaurantData) {
      const filterBanquetRestro = restaurantData?.find(
        (restro) => restro?._id === checkoutBanquetCartDatas?.restaurant
      );
      setFilterCheckoutCartDatas(filterBanquetRestro);
    } else {
      setFilterCheckoutCartDatas(checkoutCartDatas[0]);
    }
  }, [isBanquet, restaurantData]);

  useEffect(() => {
    if (banquetData && checkoutBanquetCartDatas?.plan) {
      let updatedPlan: any = null;

      if (checkoutBanquetCartDatas.plan === "Basic Plan") {
        updatedPlan = banquetData.basicPlan.map((plan) => ({
          ...plan,
          planName: "Basic Plan",
        }));
      } else if (checkoutBanquetCartDatas.plan === "VIP Plan") {
        updatedPlan = banquetData.VipPlan.map((plan) => ({
          ...plan,
          planName: "VIP Plan",
        }));
      } else if (checkoutBanquetCartDatas.plan === "Premium Plan") {
        updatedPlan = banquetData.premiumPlan.map((plan) => ({
          ...plan,
          planName: "Premium Plan",
        }));
      }

      setUpdatedBanquetData(updatedPlan[0]);
    }
  }, [banquetData, checkoutBanquetCartDatas?.plan]);

  const logo =
    filterCheckoutCartDatas?.logo || filterCheckoutCartDatas?.restaurantLogo;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = new Date(e.target.value);
    setSelectedDate(dateValue);
  };

  if (Array.isArray(data) && data?.length === 0) {
    return <Navigate to={"/delivery"} />;
  }

  // if (deliveryUserLoading) {
  //   return (
  //     <div className="w-screen h-screen">
  //       <Spinner />
  //     </div>
  //   );
  // }

  console.log(loading);

  return (
    <>
      {!loading ? (
        <div>
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
          <>
            <CartStepper
              imgSrc={
                filterCheckoutCartDatas?.restaurantImage ||
                filterCheckoutCartDatas?.mainImage!
              }
              logoImgSrc={
                filterCheckoutCartDatas?.restaurantLogo ||
                filterCheckoutCartDatas?.logo!
              }
              restroName={
                filterCheckoutCartDatas?.restaurantName ||
                filterCheckoutCartDatas?.name!
              }
            />

            {(totalQuantity > 0 || isBanquet) && (
              <div className="flex justify-between items-center">
                <div className="inline-flex pb-2 items-center gap-32 mx-5 mt-3 mb-5 border-b border-gray-200">
                  <div className="flex gap-2">
                    <span className="text-xl">You are ordering from</span>
                    <div className="font-bold flex gap-1 items-center">
                      <img
                        src={`${baseImgUrl}/${logo}`}
                        alt={
                          filterCheckoutCartDatas?.restaurantName ||
                          filterCheckoutCartDatas?.name
                        }
                        className="w-8 h-8 object-cover rounded-full"
                      />{" "}
                      <span className="text-lg underline text-emerald-500">
                        {filterCheckoutCartDatas?.restaurantName ||
                          filterCheckoutCartDatas?.name}
                      </span>
                    </div>
                  </div>
                  <div>
                    {isBanquet && (
                      <div>
                        <button
                          onClick={handleSchedule}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Schedule
                        </button>
                      </div>
                    )}
                    {isModalOpen && (
                      <div className="fixed inset-0 flex items-center z-50 justify-center bg-gray-900/60 backdrop-blur">
                        <div className="bg-white p-8 rounded-lg">
                          <h2 className="text-xl font-bold mb-4">
                            Select Date and Time
                          </h2>
                          <input
                            type="date"
                            className="border border-gray-300 rounded px-4 py-2 mb-4"
                            value={selectedDate.toISOString().split("T")[0]}
                            onChange={handleDateChange}
                          />
                          <input
                            type="time"
                            className="border border-gray-300 rounded px-4 py-2 mb-4"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                          />
                          <div className="flex justify-end">
                            <button
                              onClick={closeModal}
                              className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
                            >
                              Cancel
                            </button>
                            <button
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                              onClick={closeModal}
                            >
                              Schedule
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {isBanquet && (
                  <div className="relative mt-4 flex gap-4 items-center py-2  justify-center mb-10 px-3">
                    <span className="text-sm md:text-lg">Banquet</span>
                    <img
                      src="/exclusive.png"
                      alt="exclusive"
                      className="w-12 sm:w-16"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-8 mx-auto md:mx-5">
              <div className="basis-[70%]">
                {props.currentDay !== "" && props.selectedTimeSlot !== "" && (
                  <>
                    <h1 className="font-bold mb-10">
                      {" "}
                      Your order has been placed at {props.currentDay}{" "}
                      {props.selectedTimeSlot}{" "}
                      <span
                        className=" underline text-blue-400 cursor-pointer"
                        onClick={() => setShowEditPopUp(!showEditPopUp)}
                      >
                        {" "}
                        Change{" "}
                      </span>
                    </h1>

                    <div
                      className={`${
                        !showEditPopUp && "hidden"
                      } absolute left-[40%] top-[40%] bg-white  z-10 overflow-y-auto`}
                    >
                      <div className="hr  b5">
                        <div className="do hs dn ht bc">Pick a time</div>
                        <div className="be d1 dv dw">
                          <div className="ct ak">
                            <select
                              aria-label="Select delivery date"
                              className="hz aj cursor-pointer"
                              onChange={(e) =>
                                props.setCurrentDay(e.target.value)
                              }
                            >
                              {formattedDates.map((dt, i) => (
                                <option value={dt} key={i} className="gk">
                                  {dt}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="be d1 dv dw">
                          <div className="ct ak">
                            <select
                              aria-label="Select delivery date"
                              className="hz aj cursor-pointer"
                              onChange={(e) =>
                                props.setSelectedTimeSlot(e.target.value)
                              }
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
                          className="ej dw be bg  cl ek  ct al cd d4 af d5 em dd de df dg da db bb"
                          onClick={() => {
                            if (props.currentDay === "") {
                              props.setCurrentDay(formattedDates[0]);
                            }
                            if (props.selectedTimeSlot === "") {
                              props.setSelectedTimeSlot(timeSlots[0]);
                            }
                            localStorage.setItem(
                              "currentDay",
                              props.currentDay
                            );
                            localStorage.setItem(
                              "selectedTimeSlot",
                              props.selectedTimeSlot
                            );
                            setShowEditPopUp(false);
                          }}
                        >
                          Schedule
                        </button>
                      </div>
                    </div>
                  </>
                )}
                {totalQuantity > 0 && !isBanquet && (
                  <div>
                    <div className="md:w-[35rem] overflow-auto  flex flex-col mt-3 gap-2">
                      {checkoutCartDatas?.map((item) => (
                        <div
                          key={item._id}
                          className="relative flex gap-2 w-full bg-gray-50 py-2 px-1 "
                        >
                          <div className="flex   ">
                            <img
                              src={`${baseImgUrl}/${item.activeImage}`}
                              alt={item.name}
                              className="h-24 w-24 object-cover"
                            />
                          </div>

                          <div className="flex gap-4  flex-col md:flex-row   justify-between">
                            <ul className="text-xs  w-40 flex flex-col gap-2 h-fit">
                              <p className="text-base font-bold">
                                {item.name}{" "}
                                <span className="text-gray-900 text-xs">
                                  ( AUD {item.price.toFixed(2)})
                                </span>
                              </p>
                              {item?.addon?.map((item) => (
                                <div key={item._id}>
                                  <li>
                                    <span className="text-gray-600">
                                      {item.quantity} {item.name} &nbsp;{" "}
                                    </span>
                                    <span className="font-bold text-gray-600">
                                      +(AUD{item.extraPrice.toFixed(2)})
                                    </span>
                                  </li>
                                </div>
                              ))}
                            </ul>
                            <div className="flex gap-2  w-56">
                              <div className="flex flex-col  w-40 gap-1">
                                <h1>Quantity</h1>
                                <div className="relative">
                                  <span
                                    onClick={() =>
                                      dispatch(decrementItem(item._id))
                                    }
                                    className="w-[3rem] absolute top-0 left-0 h-[3rem] border-[1px] bg-gray-100 transition duration-700 flex items-center justify-center cursor-pointer"
                                  >
                                    <CustomIcon
                                      icon={AiOutlineMinus}
                                      className="text-gray-500  hover:text-blue-500 transition duration-700"
                                      size={23}
                                    />
                                  </span>
                                  <input
                                    type="text"
                                    min={1}
                                    disabled
                                    className="w-[9rem] bg-gray-100 text-center h-[3rem] focus:outline-none rounded placeholder:text-gray-950 border border-gray-300"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={item.minQuantity}
                                  />

                                  <span
                                    onClick={() =>
                                      dispatch(incrementItem(item._id))
                                    }
                                    className="w-[3rem] absolute top-0 right-0 h-[3rem] bg-gray-100 border border-gray-200 transition duration-700 flex items-center justify-center cursor-pointer"
                                  >
                                    <CustomIcon
                                      icon={AiOutlinePlus}
                                      className="text-gray-500 hover:text-blue-500 transition duration-700"
                                      size={23}
                                    />
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-col h-[80%] absolute top-2 right-2 justify-between items-end">
                                <CustomIcon
                                  icon={AiFillDelete}
                                  onClick={() => dispatch(removeItem(item))}
                                  className="hover:cursor-pointer hover:text-red-500"
                                  size={16}
                                />
                                <p className="mt-4">
                                  AUD
                                  {(
                                    item.total +
                                    (item?.addon?.reduce(
                                      (acc, currentAddon) =>
                                        acc +
                                        currentAddon.extraPrice *
                                          currentAddon.quantity,
                                      0
                                    ) || 0)
                                  ).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {isBanquet && updatedBanquetData && (
                  <div className="md:w-[35rem] overflow-auto  flex flex-col mt-3 gap-2">
                    <div className="mb-3 flex gap-6 items-center">
                      <div className="flex gap-3 items-center">
                        <span className="font-bold text-xl">
                          {updatedBanquetData?.planName}
                        </span>{" "}
                        <em className="text-sm text-emerald-500">
                          AUD {updatedBanquetData?.price.toFixed(2)}
                        </em>
                      </div>
                    </div>
                    <div className="w-full  gap-y-4 h-full md:flex flex-row flex-wrap">
                      {updatedBanquetData?.foods?.map((foodItem, index) => (
                        <div
                          key={`${foodItem._id}.${index}`}
                          className="w-full sm:w-[200px] relative md:w-[250px] lg:w-[300px] h-[120px] md:h-[120px] inline-block cursor-pointer shadow-lg hover:cursor-pointer hover:shadow-md border overflow-hidden border-black mr-5"
                        >
                          <div className="flex justify-between">
                            <div className="py-2 px-5 flex flex-col ">
                              <div>
                                <h1 className="font-semibold mb-1">
                                  {truncateString(foodItem.name, 15)}
                                </h1>
                              </div>
                            </div>
                            <img
                              src={`${baseImgUrl}/${foodItem.activeImage}`}
                              alt={foodItem.name}
                              className="w-[160px] h-[120px] md:h-[120px]   object-cover"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {data &&
                  Array.isArray(data) &&
                  (data[0]?.home.address || data[0]?.work.address) && (
                    <div className="mx-6 flex flex-col gap-3 mt-10">
                      <div className=" flex flex-col gap2">
                        <h1 className="text--[16px] md:text-xl  mb-2  tracking-tighter ">
                          Please fill up the extra details also (* required)
                        </h1>
                        <label className="mb-1" htmlFor="special note">
                          Write your special note
                        </label>
                        <input
                          placeholder="I need urgently..."
                          type="text"
                          onChange={(e) => setSpecialNote(e.target.value)}
                          value={specialNote}
                          className="md:w-[450px] w-[100%] form-control  bg-slate-50 py-3 pl-5 rounded placeholder:text-gray-500 border border-gray-200"
                        />
                      </div>

                      <div>
                        <label className="mb-1">Choose Delivery Address</label>
                        {Array.isArray(data)
                          ? [
                              {
                                label: "Home Address",
                                value: "home",
                                address: data[0]?.home,
                              },
                              {
                                label: "Work Address",
                                value: "work",
                                address: data[0]?.work,
                              },
                            ].map((item) => (
                              <div
                                key={`${item.value}`}
                                className="py-1"
                                id={item.value}
                                onClick={() => handleCalculation()}
                              >
                                <label className="container_radio">
                                  {item?.address?.geoLocation
                                    ?.coordinates[0] !== 0 && item.label}
                                  <input
                                    type="radio"
                                    required
                                    value={item.value}
                                    name="deilivery address"
                                    onClick={() =>
                                      setAddressLocation(
                                        item?.address?.geoLocation?.coordinates
                                      )
                                    }
                                  />
                                  {item?.address?.geoLocation
                                    ?.coordinates[0] !== 0 && (
                                    <span className="checkmark" />
                                  )}
                                </label>
                              </div>
                            ))
                          : null}
                      </div>
                    </div>
                  )}
              </div>
              <div className="basis-[40%] flex flex-col md:mr-20">
                <div className="w-full justify-end">
                  <div className="bg-slate-50 sticky top-[6rem] h-fit py-5">
                    {calculation ? (
                      <div className="px-5">
                        <div className="flex justify-between">
                          <h1 className="text-lg">Food Amount</h1>
                          <p>AUD {calculation.foodAmount.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between">
                          <h1 className="text-lg">Tax Price</h1>
                          <p>AUD {calculation.tax.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between">
                          <h1 className="text-lg">Distance Amount</h1>
                          <p>AUD {calculation.distanceAmount.toFixed(2)}</p>
                        </div>

                        {calculation.discount && calculation.discount > 1 ? (
                          <div className="flex justify-between">
                            <h1 className="text-lg">Discount</h1>
                            <p>AUD {calculation.discount.toFixed(2)}</p>
                          </div>
                        ) : null}

                        <div className="flex justify-between border-t-gray-500 border-t-[1px] py-2 text-xl font-bold">
                          <h1 className="text-lg">Total Price</h1>
                          <p>
                            AUD{" "}
                            {calculation.TotalAmount?.toFixed(2) ||
                              (
                                calculation.foodAmount +
                                calculation.tax +
                                calculation.distanceAmount -
                                calculation.discount
                              ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between border-b-[1px] border-gray-100 px-5 py-2">
                        <span className="text-2xl">Total</span>{" "}
                        <span className="text-2xl">
                          AUD{" "}
                          {isBanquet
                            ? updatedBanquetData?.price.toFixed(2)
                            : totalPriceOfCart.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between sm:flex-col lg:flex-row items-center  px-5 ">
                      <input
                        type="text"
                        onChange={(e) => setCuponCode(e.target.value)}
                        placeholder="Enter your coupon code"
                        className="form-control basis-[55%] text-sm w-full py-3 pl-1 rounded placeholder:text-gray-400/50 border border-gray-200 my-1"
                      />
                      <button
                        onClick={() => handleCalculation(true)}
                        type="button"
                        className="lg:basis-[40%] md:w-full font-bold border rounded px-2 sm:py-3 py-[10px] bg-[#26d318] text-white text-center"
                      >
                        Apply Cupon
                      </button>
                    </div>
                  </div>
                </div>

                <h1 className="bg-white rounded text-lg font-semibold text-black text-center mt-4  p-3 mb-2">
                  Pay With
                </h1>
                <section className="overflow-hide w-full  flex items-center gap-5 justify-between">
                  {[
                    { label: "Stripe", value: "STRIPE", img: "/stripe.png" },
                    {
                      label: "Cash On Delivery",
                      value: "CASH_ON_DEVLIVERY",
                      img: "/cod-icon.svg",
                    },
                  ].map((item) => (
                    <div
                      key={`${item.value}`}
                      className="h-20 px-6 rounded mb-2  flex items-center gap-2"
                      id={item.value}
                    >
                      <label className="container_radio">
                        {!item.img && item.label}
                        <input
                          type="radio"
                          value={item.value}
                          name="payment_method"
                          onClick={() =>
                            dispatch(setSelectedPaymentMethod(item.value))
                          }
                        />
                        <span className="checkmark" />
                      </label>
                      {item.img && (
                        <img
                          src={item.img}
                          alt={item.label}
                          className="w-full  h-20 object-contain"
                        />
                      )}
                    </div>
                  ))}
                </section>
                {selectedPaymentMethod === "STRIPE" && (
                  <StripeContainer
                    handleSubmit={makePaymentStripe}
                    lodingStripePayment={paymentLoading || loadingPayment}
                    setLoadingStripePayment={
                      setPaymentLoading || setLoadingPayment
                    }
                  />
                )}
                {selectedPaymentMethod === "CASH_ON_DEVLIVERY" && (
                  <Buttons
                    onClick={handleProceedToCheckout}
                    className="flex justify-center items-center w-full"
                  >
                    {paymentLoading ? <Spinner btn /> : "Pay Now"}
                  </Buttons>
                )}
              </div>
            </div>
          </>
          <Footers />
        </div>
      ) : (
        <div className="w-screen h-screen">
          <Spinner />
        </div>
      )}
    </>
  );
}
