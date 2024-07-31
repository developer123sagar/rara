/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  fetchFoodCategory,
  fetchRestaurantFood,
} from "@/redux/foods/foodDetailSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { CustomIcon, Modal, Spinner } from "@/common";
import {
  AiFillStar,
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { baseImgUrl, google_map_api_key, url } from "@/routes";
import {
  addCart,
  removeMsg,
  setBanquetCartDatas,
} from "@/redux/cart/cartSliice";
import {
  Restaurant_Review,
  fetchIndvDietary,
  fetchIndvSpecialOffer,
  fetchRestaurant,
  fetchRestaurantTables,
} from "@/redux/restaurant/restaurantSlice";
import {
  IAddon,
  IBanquet,
  IComboOffers,
  IFoodItem,
  IFoodSpeciality,
  IRestaurant,
  plan,
} from "@/types";
import { IoLocationSharp } from "react-icons/io5";
import { BsFillClockFill } from "react-icons/bs";
import HeaderWithSearch from "@/components/HeaderWithSearch";
import Buttons from "@/common/Button";
import { truncateString } from "@/helpers";
import { fetchIndvComboOffer } from "@/redux/restaurant/restaurantSlice";
import ChatView from "@/common/chat/ChatView";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { RxCross1 } from "react-icons/rx";
import { FaCheck, FaStar } from "react-icons/fa";
import axios from "axios";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import toast from "react-hot-toast";
import { Footers } from "@/components";
import ScrollTopLayout from "@/layout/ScrollTopLayout";
import RestaurantSlider from "@/common/RestaurantSlider";

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

export default function FoodDetails(props: Search) {
  const [activeCategory, setActiveCategory] = useState("");
  const [dietaryPlans, setDietaryPlans] = useState<any>([]);
  const [isBanquet, setIsBanquet] = useState(false);
  const [banquetData, setBanquetData] = useState<IBanquet>();
  const [updatedBanquetData, setUpdatedBanquetData] = useState<plan[]>([]);
  const [hoverBanquetItem, setHoverBanquetItem] = useState<string | null>(null);
  const { id } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const isDietry = urlParams.get("isDietry") === "true" || false;

  const toggleActive = (categoryName: string) => {
    setActiveCategory(categoryName);
  };

  const { restaurantData, restaurantId, restaurantTables } = useAppSelector(
    (state: RootState) => state.restaurant
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeitModalOpen, setIsDeitModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  const [newData, setNewData] = useState<IFoodItem | any | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<{
    [key: string]: boolean;
  }>({});
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const filterRestaurant: IRestaurant[] = restaurantData?.filter(
    (item) => item._id === restaurantId
  );
  const [lat, setLat] = useState<number>(0);
  const [lon, setLon] = useState<number>(0);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: google_map_api_key,
  });
  const center = { lat: lat, lng: lon };

  useEffect(() => {
    if (
      filterRestaurant &&
      Array.isArray(filterRestaurant) &&
      filterRestaurant.length === 1
    )
      setLat(filterRestaurant[0]?.geo?.coordinates[0]);
    setLon(filterRestaurant[0]?.geo?.coordinates[1]);
  }, [filterRestaurant]);

  const dispatch = useAppDispatch();
  const { category, restaurantFood } = useAppSelector(
    (state: RootState) => state.foodDetails
  );
  const rating = useAppSelector((state: RootState) => state.restaurant.reviews);

  const Day = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const today = new Date().getDay();
  const { token, userToken } = useAppSelector(
    (state: RootState) => state.signin
  );

  const { message } = useAppSelector((state: RootState) => state.cart);
  const TodayOpenDate = filterRestaurant[0]?.openTime[Day[today]]?.startTime;

  const TodayCloseDate = filterRestaurant[0]?.openTime[Day[today]]?.endTime;
  const Minutes = new Date(TodayOpenDate).getUTCMinutes();
  const Hours = new Date(TodayOpenDate).getUTCHours();

  const closeMinutes = new Date(TodayCloseDate).getUTCMinutes();
  const closeHours = new Date(TodayCloseDate).getUTCHours();

  const Hoursperiod = Hours < 12 ? "am" : "pm";
  const Timeperiod = closeHours < 12 ? "am" : "pm";
  const OpenTime = `OpenTime: ${Hours}:${Minutes} ${Hoursperiod}`;
  const CloseTime = `CloseTime: ${closeHours}:${closeMinutes} ${Timeperiod}`;

  const currentMinutes = new Date().getMinutes();
  const currentHours = new Date().getHours();

  const isRestaurantOpen =
    // (currentHours > Hours ||
    //   (currentHours === Hours && currentMinutes >= Minutes)) &&
    currentHours < closeHours ||
    (currentHours === closeHours && currentMinutes < closeMinutes);

  const { indvComboOffer } = useAppSelector(
    (state: RootState) => state.restaurant
  );

  const { indvSpecialOffer } = useAppSelector(
    (state: RootState) => state.restaurant
  );

  const { dietaryRestro } = useAppSelector(
    (state: RootState) => state.restaurant
  );

  const { inddietaryRestro } = useAppSelector(
    (state: RootState) => state.restaurant
  );

  useEffect(() => {
    dispatch(fetchFoodCategory({}));
    dispatch(fetchRestaurantFood({ id: restaurantId }));
    dispatch(fetchRestaurant());
  }, [dispatch, restaurantId]);

  useEffect(() => {
    dispatch(fetchIndvSpecialOffer({ restaurantId: restaurantId }));
  }, [dispatch, restaurantId]);

  useEffect(() => {
    dispatch(Restaurant_Review({ restaurantId: restaurantId, token: token }));
  }, [dispatch, token, restaurantId]);

  const restroDietId = localStorage.getItem("restaurantId") || "";

  useEffect(() => {
    dispatch(
      fetchIndvDietary({
        latitude: props.latitude,
        longitude: props.longitude,
        restaurantId: restroDietId,
      })
    );
  }, [dispatch, props.latitude, props.longitude, restroDietId]);

  useEffect(() => {
    if (banquetData) {
      const vipPlan =
        banquetData?.VipPlan.map((plan) => ({
          ...plan,
          planName: "VIP Plan",
        })) || [];
      const basicPlan =
        banquetData?.basicPlan.map((plan) => ({
          ...plan,
          planName: "Basic Plan",
        })) || [];
      const premiumPlan =
        banquetData?.premiumPlan.map((plan) => ({
          ...plan,
          planName: "Premium Plan",
        })) || [];
      setUpdatedBanquetData([...vipPlan, ...basicPlan, ...premiumPlan]);
    }
  }, [banquetData]);

  // grouping food data based on category
  const groupedFoodData = category?.reduce<{
    [key: string]: IFoodItem[];
  }>((acc, categoryItem) => {
    const foodsInCategory = restaurantFood?.filter(
      (foodItem) => foodItem.foodCategory === categoryItem._id
    );
    if (foodsInCategory && foodsInCategory.length > 0) {
      acc[categoryItem.name] = foodsInCategory;
    }
    return acc;
  }, {});

  const openModal = (
    item: any,
    type?: "COMBO" | "SPECIALITY",
    planName?: string
  ) => {
    const restroId = item.restaurant || item.restaurants || item.restaurantId;

    const restaurant = restaurantData.find((restro) => restro._id === restroId);

    const transformedData = {
      ...(type === "COMBO"
        ? { activeImage: item?.image[0] }
        : { activeImage: item?.food?.activeImage }),
      activeStatus: true,
      addon: [],
      createdBy: new Date(),
      createdDateTime: new Date(),
      foodCategory: item.extra,
      foodMakingTime: { minutes: 20 },
      foodSpeciality: [],
      images: [item.image || ""],
      minQuantity: 1,
      name: item.name,
      price: item.amount,
      ...(type === "COMBO"
        ? { restaurant: item?.restaurants }
        : { restaurant: restroId }),
      subTitle: "",
      total: item.amount,
      _id: item._id,
      restaurantName: restaurant?.name,
      restaurantImage: restaurant?.mainImage,
      restaurantLogo: restaurant?.logo,
    };

    setIsModalOpen(true);
    if (type === "COMBO" || type === "SPECIALITY") {
      setNewData(transformedData);
    } else {
      setNewData({
        ...item,
        minQuantity: 1,
        total: item.price,
        planName: planName ? planName : undefined,
        restaurantName: restaurant?.name,
        restaurantImage: restaurant?.mainImage,
        restaurantLogo: restaurant?.logo,
      });
    }
  };

  const openDietryModal = (item: any) => {
    const restaurant = restaurantData.find(
      (restro) => restro._id === item.restaurant
    );

    const transformedData = {
      activeImage: item.image,
      activeStatus: item.activeStatus,
      addon: [],
      createdBy: new Date(),
      createdDateTime: new Date(),
      foodCategory: item.dietaryPlan,
      foodMakingTime: { minutes: item.dietaryMakingTimeinMinute },
      foodSpeciality: [],
      images: [item.image || ""],
      minQuantity: 1,
      name: item.foodName,
      price: item.price,
      restaurant: item.restaurantId,
      subTitle: "",
      total: item.price,
      _id: item._id,
      restaurantName: restaurant?.name,
      restaurantImage: restaurant?.mainImage,
      restaurantLogo: restaurant?.logo,
    };
    setIsDeitModalOpen(true);
    setNewData(transformedData);
  };

  const openDetailModal = () => {
    setIsDetailModalOpen(true);
  };
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);

    if (!isAddedToCart) {
      setSelectedAddons({});
    }
  };
  const closeModal2 = () => {
    setIsDeitModalOpen(false);
  };

  const handleAddon = (addonId: string) => {
    setSelectedAddons((prevSelectedAddons) => ({
      ...prevSelectedAddons,
      [addonId]: !prevSelectedAddons[addonId],
    }));
  };

  useEffect(() => {
    if (message && message.length > 0) {
      const timer = setTimeout(() => {
        dispatch(removeMsg());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handldeCart = () => {
    if (!filterRestaurant[0]?.isAcceptingOrder) {
      toast.error("This restaurant is not accepting any order");
      setIsModalOpen(false);
      return;
    }

    if (!isRestaurantOpen) {
      toast.error("This restaurant is close now !");
      setIsModalOpen(false);

      return;
    }

    const selectedAddonsData = newData?.addon.filter(
      (item: any) => selectedAddons[item.id]
    );

    const newDataWithSelectedAddons = {
      ...newData,
      addon: selectedAddonsData || [],
    };

    if (!userToken) {
      toast.error("Please login first");
      return navigate("/login");
    }

    dispatch(addCart(newDataWithSelectedAddons));
    setIsDeitModalOpen(false);
    setIsModalOpen(false);
    setIsAddedToCart(true);
  };

  const filteredCategories = category?.filter((item) => {
    const foodsInCategory = restaurantFood?.filter(
      (foodItem) => foodItem.foodCategory === item._id
    );
    return foodsInCategory && foodsInCategory.length > 0;
  });

  const handleQuantityChange = (quantity: number) => {
    if (newData && newData.minQuantity && newData.price) {
      if (quantity >= 1) {
        const updatedData = {
          ...newData,
          minQuantity: quantity,
          total: newData.price * quantity,
        };
        setNewData(updatedData);
      }
    }
  };

  useEffect(() => {
    if (dietaryRestro && dietaryRestro.dietPlans) {
      const arrayOfObjects = Object.entries(dietaryRestro.dietPlans).flatMap(
        ([restaurant, items]: [string, any]) =>
          items.map((item: any) => ({ restaurant, ...item }))
      );
      const uniqueDietaryPlans = [
        ...new Set(arrayOfObjects.map((item) => item.dietaryPlan)),
      ];
      setDietaryPlans(uniqueDietaryPlans);
    }
  }, [dietaryRestro]);

  useEffect(() => {
    dispatch(fetchIndvComboOffer(restaurantId));
  }, [dispatch, restaurantId]);

  const handleIncrement = () =>
    handleQuantityChange((newData?.minQuantity || 0) + 1);

  const handleDecrement = () =>
    handleQuantityChange((newData?.minQuantity || 0) - 1);

  const comboOfferRef = useRef<HTMLDivElement>(null);
  const specialPackageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.toComboOffer && comboOfferRef.current !== null) {
      const rect = comboOfferRef.current.getBoundingClientRect();
      const targetPosition = window.scrollY + rect.top;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  }, [props.toComboOffer]);

  useEffect(() => {
    if (props.toSpecialPackage && specialPackageRef.current !== null) {
      const rect = specialPackageRef.current.getBoundingClientRect();
      const targetPosition = window.scrollY + rect.top;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  }, [props.toSpecialPackage]);

  useEffect(() => {
    if (
      filterRestaurant &&
      Array.isArray(filterRestaurant) &&
      filterRestaurant.length > 0
    ) {
      dispatch(
        fetchRestaurantTables({ restaurantId: filterRestaurant[0]._id })
      );
    }
  }, [dispatch, token]);

  useEffect(() => {
    const getLunboxdetail = async () => {
      try {
        const res = await axios.get(
          `${url}/raraBanquet-Menu/get-banquetMenu/${id}`
        );
        if (res.status === 200) {
          setIsBanquet(true);
          setBanquetData(res.data.Data);
        }
      } catch (err) {
        throw err;
      }
    };
    getLunboxdetail();
  }, []);

  const navigate = useNavigate();

  const handleBanquetCartDatas = (banquet: plan) => {
    if (!userToken) {
      toast.error("Please login first");
      return navigate("/login");
    }
    if (!filterRestaurant[0]?.isAcceptingOrder) {
      toast.error("This restaurant is not accepting any order");
      return;
    }
    dispatch(
      setBanquetCartDatas({
        _id: banquet._id,
        plan: banquet.planName,
        restaurant: banquet.foods[0]?.restaurant,
        price: banquet.price,
      })
    );
  };

  return (
    <ScrollTopLayout>
      <div className="mb-5">
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
        <RestaurantSlider
          images={filterRestaurant[0]?.image || []}
          width={100}
        />
        <div className="relative w-full">
          {filterRestaurant[0] && filterRestaurant[0].vegetarian ? (
            <div className="absolute right-4 translate-y-8 bottom-0">
              <img
                loading="lazy"
                src="/img/veglogo.png"
                alt=""
                className="h-24 w-24"
              />
            </div>
          ) : null}
          {isRestaurantOpen ? (
            <img
              src="/open.svg"
              className="w-20 h-20 absolute left-[48%] rounded-full"
              alt="rara"
            />
          ) : (
            <img
              src="/close.svg"
              className="w-20 h-20 absolute left-[48%] rounded-full"
              alt="rara"
            />
          )}
          {filterRestaurant[0]?.isAcceptingOrder ? (
            <img
              src="/accpt.svg"
              alt="rara"
              className="w-12 h-12 absolute right-[5%] top-2"
            />
          ) : (
            <img
              src="/not-accpt.svg"
              alt="rara"
              className="w-12 h-12 absolute right-[5%] top-2"
            />
          )}
        </div>
        <div className="mt-2 mb-10 mx-4 r-2xl:mx-40">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-10">
              <h1 className=" text-black font-bold md:text-[20px] text-[16px] mb-2">
                {filterRestaurant[0]?.name}
              </h1>
              <img
                loading="lazy"
                src={`${baseImgUrl}/${filterRestaurant[0]?.logo}`}
                alt=""
                className="h-12 w-12  object-cover"
              />
            </div>

            <div className="flex flex-col gap-4 items-center mt-4">
              {restaurantTables && restaurantTables?.isBookingOpen && (
                <button
                  type="button"
                  className="w-full bg-[#26d318] py-2 text-white px-4"
                  onClick={() =>
                    navigate(`/book_details/${filterRestaurant[0]?._id}`)
                  }
                >
                  Book Now
                </button>
              )}
              {/* {isBanquet && banquetData && (
                <div className="relative w-full flex gap-4 items-center py-2 bg-gray-100 justify-center mb-10 px-3 cursor-pointer lg:fml-6">
                  <span className="text-sm md:text-lg">Banquet</span>
                  <img
                    src="/exclusive.png"
                    alt="exclusive"
                    className="w-12 sm:w-16"
                  />
                </div>
              )} */}
            </div>
          </div>
          <div className="flex gap-2">
            <p className="flex gap-2 items-center justify-center font-bold">
              <AiFillStar className="text-[#22c55e]  " />
              {rating && rating.toString()}
            </p>

            <h1
              className="font-bold pointer text-[12px] underline p-1  rounded-3xl pointer cursor-pointer hover:text-[#22c55e] transition duration-500 ease-in-out"
              onClick={() => openDetailModal()}
            >
              More Info
            </h1>
          </div>
          <p className="text-[#545454] w-full text-clip">
            {truncateString(filterRestaurant[0]?.description, 120)}
          </p>
          {/* <div className="flex justify-end mt-5 text-lg md:mt-0">
            {!filterRestaurant[0]?.isAcceptingOrder && (
              <p className="">
                This restaurant is currently not accepting any orders !
              </p>
            )}
          </div> */}
        </div>
        <div className="flex flex-col mx-2 overflow-x-hidden  gap-2 ">
          <div className="admin-header w-auto overflow-scroll flex">
            <ul className="mx-2 r-2xl:mx-40 h-fit flex justify-center  items-center  gap-10 mb-2">
              {!isDietry ? (
                filteredCategories?.map((item) => (
                  <div
                    key={`${item._id}`}
                    onClick={() => toggleActive(item.name)}
                  >
                    <li>
                      <p
                        className="  text-center font-bold p-4 md:p-0 text-[16px]"
                        onClick={() => toggleActive(item.name)}
                      >
                        {item.name}
                      </p>
                      {activeCategory === item.name && (
                        <hr className={` border border-red-300 `} />
                      )}
                    </li>
                  </div>
                ))
              ) : (
                <ul className="w-full mx-auto my-4 mt-5 mb-5 ml-5">
                  <div className="flex gap-5">
                    {dietaryPlans?.map((item: any, id: number) => (
                      <div
                        key={id}
                        className=" flex justify-center  items-center pt-2 pb-2 px-5 bg-[rgb(230,230,230)] cursor-pointer"
                      >
                        <h1> {item} </h1>
                      </div>
                    ))}
                  </div>
                </ul>
              )}
            </ul>
          </div>

          <div>
            <ChatView />
          </div>

          {!isDietry ? (
            <>
              {/* showing food data according to the category */}
              <main className="w-full  h-fit flex flex-col gap-10 md:mx-10 p-4 md:p-0 r-2xl:mx-40">
                {groupedFoodData &&
                  Object?.entries(groupedFoodData)?.map(
                    ([categoryName, categoryFoods], index) => (
                      <section key={categoryName} id={`${index}`}>
                        <h1
                          id={`${index}`}
                          className="text-xl font-bold  mb-3 "
                        >
                          <span>{categoryName}</span>
                        </h1>

                        <div className="w-full gap-y-4 h-full md:flex flex-row flex-wrap">
                          {categoryFoods.map((foodItem, index) => (
                            <div
                              onClick={() => openModal(foodItem)}
                              className="w-full sm:w-[200px] md:w-[250px] lg:w-[300px] h-[120px] md:h-[120px] inline-block cursor-pointer shadow-lg hover:cursor-pointer border-dashed hover:shadow-md border overflow-hidden border-black mr-5"
                              key={`${foodItem._id}.${index}`}
                            >
                              <div className="flex justify-between">
                                <div className="py-2 px-5 w-60 flex flex-col">
                                  <div className="h-[3.5rem] max-h-[3.5rem]">
                                    <h1 className="font-semibold mb-1">
                                      {truncateString(foodItem.name, 15)}
                                    </h1>
                                  </div>
                                  <em className="mt-6">AUD {foodItem.price}</em>
                                </div>
                                <div className="w-[300px]">
                                  <img
                                    src={`${baseImgUrl}/${foodItem.activeImage}`}
                                    alt={foodItem.name}
                                    className="w-full h-[120px] md:h-[120px]   object-cover"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )
                  )}
              </main>
              {/* showing combo food according to the restaurant */}
              <main className="w-full  h-fit flex flex-col md:mx-10 p-4  md:p-0  r-2xl:mx-40 mt-4">
                {indvComboOffer && indvComboOffer.length > 0 && (
                  <h1 className="text-xl font-bold  mb-3 ">
                    <span ref={comboOfferRef}>Combo offer</span>
                  </h1>
                )}

                <div className="w-full  gap-y-4 h-full md:flex flex-row flex-wrap">
                  {indvComboOffer.map((item: IComboOffers, index: number) => (
                    <div
                      className="w-full sm:w-[200px] md:w-[250px]  lg:w-[300px]  h-[120px] md:h-[120px]  inline-block cursor-pointer shadow-lg hover:cursor-pointer border-dashed hover:shadow-md border overflow-hidden border-black mr-5"
                      onClick={() => openModal(item, "COMBO")}
                      key={index}
                    >
                      <div className="flex justify-between  ">
                        <div className="py-2 px-5  flex  w-60  flex-col ">
                          <div className="h-12">
                            <h1 className="font-semibold  mb-1">{item.name}</h1>
                          </div>
                          <em className="mt-6 text-[12px] md:text-[16px] ">
                            AUD {item.amount}
                          </em>
                        </div>
                        <div className="w-[300px]">
                          <img
                            src={`${baseImgUrl}/${item.image}`}
                            className="w-full h-[140px] md:h-[120px]  object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </main>
              {/* showing foodspeciality according to the restaurant */}
              <main className="w-full  h-fit flex flex-col md:mx-10 p-4 md:p-0    r-2xl:mx-40 mt-4">
                {indvSpecialOffer && indvSpecialOffer.length > 0 && (
                  <h1 className="text-xl font-bold  mb-3 ">
                    <span>Food Speciality</span>
                  </h1>
                )}

                <div className="w-full   gap-y-4 h-full md:flex flex-row">
                  {indvSpecialOffer.map(
                    (item: IFoodSpeciality, index: number) => (
                      <div
                        className="w-full sm:w-[200px] md:w-[250px] lg:w-[300px]  h-[120px] md:h-[120px] inline-block cursor-pointer shadow-lg hover:cursor-pointer border-dashed hover:shadow-md border overflow-hidden border-black mr-5"
                        onClick={() => openModal(item, "SPECIALITY")}
                        key={index}
                      >
                        <div className="flex justify-between">
                          <div className="py-2 px-5  w-60 flex flex-col ">
                            <div>
                              <h1 className="font-semibold  mb-1">
                                {item.name}
                              </h1>
                            </div>
                            <em className="mt-6 text-[12px] md:text-[16px]">
                              AUD {item.amount}
                            </em>
                          </div>
                          <div className="w-[300px]">
                            <img
                              src={`${baseImgUrl}/${item?.food?.activeImage}`}
                              className="w-full h-[120px] md:h-[120px]  object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </main>

              {/* showing banquet data */}
              <main className="w-full h-fit flex flex-col gap-3 md:mx-10 p-4 md:p-0 mt-10 r-2xl:mx-40">
                {isBanquet && banquetData && (
                  <div className="flex items-center gap-3 border-b border-gray-300 pb-2">
                    <img src="/exclusive.png" alt="banquet" className="w-20" />
                    <h1 className="text-xl font-bold">Banquet</h1>
                  </div>
                )}
                <div className="flex gap-10 flex-col mt-4">
                  {updatedBanquetData &&
                    updatedBanquetData?.map((banquet, index) => (
                      <section
                        onMouseEnter={() => setHoverBanquetItem(banquet._id)}
                        onMouseLeave={() => setHoverBanquetItem(null)}
                        key={banquet?._id}
                        id={`${index}`}
                      >
                        <div
                          id={`${index}`}
                          className="mb-3 flex gap-6 items-center"
                        >
                          <div className="flex gap-3 items-center">
                            <span className="font-bold text-xl">
                              {banquet?.planName}
                            </span>{" "}
                            <em className="text-sm text-emerald-500">
                              AUD {banquet?.price}
                            </em>
                          </div>
                          <div className="h-16 flex items-center">
                            {hoverBanquetItem == banquet._id && (
                              <span
                                onClick={() => handleBanquetCartDatas(banquet)}
                                className="flex items-center gap-2 p-3 overflow-hidden cursor-pointer bg-emerald-500 text-white"
                              >
                                <AiOutlineShoppingCart /> Add to Cart
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="w-full  gap-y-4 h-full md:flex flex-row flex-wrap">
                          {banquet?.foods?.map((foodItem, index) => (
                            <div
                              key={`${foodItem._id}.${index}`}
                              className="w-full sm:w-[200px] relative md:w-[250px] lg:w-[300px] h-[120px] md:h-[120px] inline-block cursor-pointer shadow-lg hover:cursor-pointer border-dashed hover:shadow-md border overflow-hidden border-black mr-5"
                            >
                              <div className="flex justify-between">
                                <div className="py-2 px-5  flex flex-col ">
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
                      </section>
                    ))}
                </div>
              </main>
            </>
          ) : (
            <div className="w-full  h-fit flex flex-col md:mx-10 p-4 md:p-0  r-2xl:mx-40 mt-4">
              {inddietaryRestro?.map((item: any, index: number) => (
                <div
                  className="w-full sm:w-[200px] md:w-[250px] lg:w-[300px]  h-[120px] md:h-[120px] inline-block cursor-pointer shadow-lg hover:cursor-pointer border-dashed hover:shadow-md border overflow-hidden border-black mr-5"
                  key={index}
                  onClick={() => openDietryModal(item)}
                >
                  <div className="flex justify-between ">
                    <div className="py-2 px-5 flex flex-col ">
                      <div>
                        <h1 className="font-semibold  mb-1">
                          {item.dietaryPlan}
                        </h1>
                        <p className="text-gray-900  text-[14px]">
                          {truncateString(item.extra, 25)}
                        </p>
                      </div>
                      <em className="mt-4">{item.amount}</em>
                    </div>
                    <img
                      src={`${baseImgUrl}/${item.image}`}
                      className="w-[160px] h-[120px] md:h-[120px]  object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Modal
          isOpen={isModalOpen}
          setIsOpen={closeModal}
          maxWidth="sm:max-w-[42rem] relative"
        >
          <>
            <div className="w-full h-full flex flex-col md:flex-row gap-2 md:gap-5">
              <img
                src={`${baseImgUrl}/${newData?.activeImage}`}
                alt={newData?.name}
                className="w-[350px] md:h-[400px] sm:h-[160px] h-[120px] object-cover"
              />

              <div className="md:mt-2 w-full mx-4 md:mx-0 mr-4">
                <div className="flex justify-between md:mb-5 md:mr-2 mr-6">
                  <h1 className="md:text-2xl text-xl  font-bold">
                    {newData?.name}
                  </h1>
                  <span
                    onClick={closeModal}
                    className="w-[2rem] h-[2rem] absolute top-0 right-1 lg:relative rounded-full bg-[#fff] hover:bg-gray-600 transition duration-700 flex items-center justify-center shadow-xl cursor-pointer"
                  >
                    <div>
                      <RxCross1 size={20} />
                    </div>
                  </span>
                </div>
                <p className="text-sm  text-gray-500">{newData?.subTitle}</p>
                {newData?.addon[0]?.name != "" && (
                  <div className="mt-4">
                    <h2 className="text-xl font-bold">Add Something Extra</h2>
                    {newData?.addon
                      .filter((addon: IAddon) => addon.name)
                      .map((item: IAddon, id: number) => (
                        <div
                          className="w-full max-w-full border-b-[1px] border-gray-400 py-2 flex justify-between"
                          key={item.id + id}
                        >
                          <div>
                            <h3 className="text-gray-700">{item.name}</h3>
                            <h4 className="text-sm text-gray-500">
                              +AUD {item.extraPrice}
                            </h4>
                          </div>
                          <div className="flex items-center justify-center rounded-full w-12 h-12">
                            {selectedAddons[item.id] ? (
                              <span className="animate-addon-once">
                                <FaCheck size={20} />
                              </span>
                            ) : (
                              <span
                                onClick={() => handleAddon(item.id)}
                                className="w-[2rem] h-[2rem] rounded-full bg-[#fff] hover:bg-gray-400 transition duration-700 flex items-center justify-center shadow-xl cursor-pointer"
                              >
                                <CustomIcon
                                  icon={AiOutlinePlus}
                                  className="text-gray-500 hover:text-white transition duration-700"
                                  size={23}
                                />
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex md:flex-row  flex-col md:gap-4   justify-between">
              <div className="relative my-3 px-5 basis-[55%]">
                <span
                  onClick={handleDecrement}
                  className="w-[2rem] absolute top-2 left-8 h-[2rem] rounded-full bg-[#fff] hover:bg-gray-400 transition duration-700 flex items-center justify-center shadow-xl cursor-pointer"
                >
                  <CustomIcon
                    icon={AiOutlineMinus}
                    className="text-gray-500 hover:text-white transition duration-700"
                    size={23}
                  />
                </span>
                <input
                  type="text"
                  min={1}
                  className="w-full bg-[#ffff] text-center py-3  focus:outline-none rounded placeholder:text-gray-950 border border-gray-300"
                  value={newData?.minQuantity || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleQuantityChange(parseInt(e.target.value))
                  }
                  inputMode="numeric"
                  pattern="[0-9]*"
                />

                <span
                  onClick={handleIncrement}
                  className="w-[2rem] absolute top-2 right-8 h-[2rem] rounded-full bg-[#fff] hover:bg-gray-400 transition duration-700 flex items-center justify-center shadow-xl cursor-pointer"
                >
                  <CustomIcon
                    icon={AiOutlinePlus}
                    className="text-gray-500 hover:text-white transition duration-700"
                    size={23}
                  />
                </span>
              </div>

              <div className="flex gap-2   justify-end px-5 md:my-2 mb-4 ">
                <Buttons
                  onClick={handldeCart}
                  className="md:text-sm text-[10px]"
                >
                  Add Cart
                </Buttons>
                <Buttons
                  className="text-sm"
                  variant="destructive"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Buttons>
              </div>
            </div>
          </>
          {/* ) : (
          <div className="p-10">
            <h1> The restaurant is not accepting any orders at the moment </h1>
          </div>
        )} */}
        </Modal>
        <Modal
          isOpen={isDeitModalOpen}
          setIsOpen={closeModal2}
          maxWidth="max-w-[42rem]"
        >
          <div className="w-full h-full flex gap-5">
            <img
              src={`${baseImgUrl}/${newData?.activeImage}`}
              alt={newData?.name}
              className="w-[350px] h-[400px] object-cover"
            />

            <div className="mt-2 w-full">
              <div className="flex justify-between mb-5 mr-2">
                <h1 className="md:text-2xl font-bold">{newData?.name}</h1>
                <span
                  onClick={closeModal2}
                  className="w-[2rem] h-[2rem] rounded-full bg-[#fff] hover:bg-gray-600 transition duration-700 flex items-center justify-center shadow-xl cursor-pointer"
                >
                  <div>
                    <RxCross1 size={20} />
                  </div>
                </span>
              </div>
              <p className="text-sm  text-gray-500">{newData?.subTitle}</p>
              {newData?.addon[0]?.name != "" && (
                <div className="mt-4">
                  <h2 className="text-xl font-bold">Add Something Extra</h2>
                  {newData?.addon
                    .filter((addon: IAddon) => addon.name)
                    .map((item: IAddon, id: number) => (
                      <div
                        className="w-full max-w-full border-b-[1px] border-gray-400 py-2 flex justify-between"
                        key={item.id + id}
                      >
                        <div>
                          <h3 className="text-gray-700">{item.name}</h3>
                          <h4 className="text-sm text-gray-500">
                            +AUD {item.extraPrice}
                          </h4>
                        </div>
                        <div className="flex items-center justify-center rounded-full w-12 h-12">
                          {selectedAddons[item.id] ? (
                            <span className="animate-addon-once">
                              <FaCheck size={20} />
                            </span>
                          ) : (
                            <span
                              onClick={() => handleAddon(item.id)}
                              className="w-[2rem] h-[2rem] rounded-full bg-[#fff] hover:bg-gray-400 transition duration-700 flex items-center justify-center shadow-xl cursor-pointer"
                            >
                              <CustomIcon
                                icon={AiOutlinePlus}
                                className="text-gray-500 hover:text-white transition duration-700"
                                size={23}
                              />
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 justify-between">
            <div className="relative my-3 px-5 basis-[55%]">
              <span
                onClick={handleDecrement}
                className="w-[2rem] absolute top-2 left-8 h-[2rem] rounded-full bg-[#fff] hover:bg-gray-400 transition duration-700 flex items-center justify-center shadow-xl cursor-pointer"
              >
                <CustomIcon
                  icon={AiOutlineMinus}
                  className="text-gray-500 hover:text-white transition duration-700"
                  size={23}
                />
              </span>
              <input
                type="text"
                min={1}
                className="w-full bg-[#ffff] text-center py-3  focus:outline-none rounded placeholder:text-gray-950 border border-gray-300"
                value={newData?.minQuantity || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleQuantityChange(parseInt(e.target.value))
                }
                inputMode="numeric"
                pattern="[0-9]*"
              />

              <span
                onClick={handleIncrement}
                className="w-[2rem] absolute top-2 right-8 h-[2rem] rounded-full bg-[#fff] hover:bg-gray-400 transition duration-700 flex items-center justify-center shadow-xl cursor-pointer"
              >
                <CustomIcon
                  icon={AiOutlinePlus}
                  className="text-gray-500 hover:text-white transition duration-700"
                  size={23}
                />
              </span>
            </div>

            <div className="flex gap-2 justify-end px-5 my-2">
              <Buttons onClick={handldeCart} className="text-sm">
                Add Cart
              </Buttons>
              <Buttons
                className="text-sm"
                variant="destructive"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Buttons>
            </div>
          </div>
        </Modal>

        <AnimatePresence>
          {isDetailModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDetailModal}
              className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={(e) => e.stopPropagation()}
                transition={{ duration: 0.3 }}
                className={`bg-[#fefefefe] text-gray-900 rounded w-full min-h-[95%] max-h-[90%] max-w-[500px] overflow-scroll shadow-xl cursor-default relative`}
              >
                <div className="relative z-10 h-[100%] w-full sm:w-[500px]">
                  <div className="flex items-center justify-between py-3 px-5 bg-gray-300/30 bg-opacity-80">
                    <h1 className=" text-black font-bold text-[16px] sm:text-2xl text-center  w-full mb-2">
                      {filterRestaurant[0]?.name}
                    </h1>
                    <span
                      onClick={closeDetailModal}
                      className="sm:w-[2rem] sm:h-[2rem] h-[1rem] w-[1rem] rounded-full p-3 bg-[#fff] hover:bg-gray-600 transition duration-700 flex items-center justify-center shadow-xl cursor-pointer"
                    >
                      <div className=" p-1 rounded-full">
                        <RxCross1 />
                      </div>
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <div className="w-full  h-[200px]">
                      {isLoaded ? (
                        <>
                          <GoogleMap
                            center={center}
                            mapContainerStyle={{
                              width: "100%",
                              height: "100%",
                            }}
                            options={{
                              zoomControl: false,
                              streetViewControl: false,
                              mapTypeControl: false,
                            }}
                            zoom={15}
                          >
                            {<Marker position={center} />}
                          </GoogleMap>
                        </>
                      ) : (
                        <Spinner />
                      )}
                    </div>

                    <div className="py-4 text-center flex items-center gap-1 justify-center">
                      {rating} <FaStar className="text-emerald-500" />
                    </div>

                    <div className="sm:mx-4 w-[100%] flex flex-col justify-center  mt-1">
                      <hr />

                      <hr />
                      <div className="flex   gap-4 sm:gap-0 sm:justify-between p-4 ">
                        <h1 className="flex items-center   ">
                          <IoLocationSharp size="20" />
                        </h1>

                        <h1 className="justify-start  w-full basis-70">
                          {filterRestaurant[0]?.address}
                        </h1>
                      </div>
                      <hr />
                      <div className="flex   gap-4 sm:gap-0 sm:justify-between p-4 ">
                        <h1 className="flex items-center    ">
                          <BsFillClockFill size="20" />
                        </h1>
                        <h1 className="justify-start w-full basis-70">
                          {OpenTime}
                        </h1>
                      </div>

                      <hr />
                      <div className="flex gap-4 sm:gap-0 sm:justify-between p-4 ">
                        <h1>
                          <BsFillClockFill size="20" />
                        </h1>
                        <h1 className=" justify-start w-full basis-70">
                          {CloseTime}
                        </h1>
                      </div>
                      <hr />
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footers />
    </ScrollTopLayout>
  );
}
