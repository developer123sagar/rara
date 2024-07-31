import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { performSearch } from "@/redux/dashboard/fetchApiData/fetchApiDataSlice";
import { Footers, PopularCategory } from "@/components";
import { Navigate, useParams } from "react-router-dom";
import { IRestaurant } from "@/types";
import { TopRestaurant } from "@/components";
import { useRef } from "react";
import { fetchClientDetails } from "@/redux/dashboard/fetchApiData/fetchApiDataSlice";
import { fetchNoticeBanners } from "@/redux/restaurant/restaurantSlice";
import PopularHotel from "@/components/Home/PopularHotel";
import ComboOffers from "@/components/Home/ComboOffers";
import SpecialPackages from "@/components/Home/SpecialPackages";
import HeaderWithSearch from "@/components/HeaderWithSearch";
import ChatView from "@/common/chat/ChatView";
import Dietaries from "@/components/Home/Dietaries";
import SponsoredRestaurant from "@/components/Home/Sponsored";
import StoryFormat from "@/components/Home/StoryFormat";
import Filter from "@/common/Filter";
import Cart from "@/common/Cart";

interface Search {
  searchParam: string;
  latitude: string | null;
  longitude: string | null;
  permission: boolean;
  setSearchParam: Dispatch<SetStateAction<string>>;
  currentDay: string;
  selectedTimeSlot: string;
  sliderNumber: number;
  setSliderNumber: Dispatch<SetStateAction<number>>;
  setLongitude: Dispatch<SetStateAction<string | null>>;
  setLatitude: Dispatch<SetStateAction<string | null>>;
  setScrollDown: React.Dispatch<React.SetStateAction<boolean>>;
  setPermission: React.Dispatch<React.SetStateAction<boolean>>;
  openSmlFilter: boolean;
  setOpenSmlFilter: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Search(props: Search) {
  const [sortByTime, setSortByTime] = useState(true);
  const [selectedOption, setSelectedOption] = useState(0);
  const [showComboOffers, setShowComboOffers] = useState(false);
  const [showSpecialPackage, setShowSpecialPackage] = useState(false);
  const [priceValue, setPriceValue] = useState("0");
  const [filterDataOnPrice, setFilterOnPrice] = useState(false);
  const [, setDataPresent] = useState(true);
  const { userToken } = useAppSelector((state: RootState) => state.signin);

  const sortByAverageDeliveryTimeAscending = (
    a: IRestaurant,
    b: IRestaurant
  ) => {
    return (
      (parseInt(a.averageDeliveryTime) || 0) -
      (parseInt(b.averageDeliveryTime) || 0)
    );
  };

  const sortByRating = (a: IRestaurant, b: IRestaurant) => {
    return (a.averageRating || 0) - (b.averageRating || 0);
  };

  const timeSort = (
    nearbyData: IRestaurant[],
    setData: Dispatch<SetStateAction<IRestaurant[]>>
  ) => {
    const sortedData = [...nearbyData].sort(sortByAverageDeliveryTimeAscending);
    setData(sortedData);
  };
  const ratingSort = (
    nearbyData: IRestaurant[],
    setData: Dispatch<SetStateAction<IRestaurant[]>>
  ) => {
    const sortedData = [...nearbyData].sort(sortByRating);
    setData(sortedData);
  };

  const { catName } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (catName === "noId")
      dispatch(performSearch({ data: props.searchParam }));
    else dispatch(performSearch({ data: catName! }));
  }, [catName, dispatch, props.searchParam]);

  const comboOfferRef = useRef<HTMLDivElement>(null);
  const specialPackageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const deliverytype = localStorage.getItem("deliveryType") || "";
    if (!deliverytype) {
      localStorage.setItem("deliveryType", "homedelivery");
    }
  }, []);

  useEffect(() => {
    dispatch(fetchNoticeBanners());
  }, [dispatch]);

  useEffect(() => {
    if (userToken) dispatch(fetchClientDetails(userToken));
  }, [dispatch, userToken]);

  if (!props.longitude || !props.latitude) {
    return <Navigate to="/" />;
  } else {
    localStorage.setItem("latitude", props.latitude);
    localStorage.setItem("longitude", props.longitude);
    return (
      <>
        <div className="relative md:mt-4 lg:mt-16">
          <div className="overflow-x-hidden md:mt-10">
            <HeaderWithSearch
              showHamburgerr={true}
              sliderNumber={props.sliderNumber}
              setSliderNumber={props.setSliderNumber}
              setLongitude={props.setLongitude}
              setLatitude={props.setLatitude}
              setScrollDown={props.setScrollDown}
              setPermission={props.setPermission}
              latitude={props.latitude}
              longitude={props.longitude}
              redirect={true}
              openSmlFilter={props.openSmlFilter}
              setOpenSmlFilter={props.setOpenSmlFilter}
            />
            <div />
            <div className="w-fit fixed bottom-5 right-5 z-50 md:hidden">
              <Cart />
            </div>
            <div
              className="r-2xl:grid r-2xl:grid-cols-5 r-2xl:gap-10 flex"
              onClick={() => props.setOpenSmlFilter(false)}
            >
              <div className="w-[300px] hidden r-2xl:block">
                <div
                  className={`addTransition px-4 h-screen overflow-auto w-[300px] fixed z-0 mt-1
              }`}
                >
                  <div className="relative flex gap-4 items-center py-2  bg-gray-100 justify-center mb-10 px-5 cursor-pointer">
                    <span className="text-lg">Banquet</span>
                    <img
                      src="/exclusive.png"
                      alt="exclusive"
                      className="w-16 "
                    />
                  </div>
                  <Filter
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                    showComboOffers={showComboOffers}
                    showSpecialPackage={showSpecialPackage}
                    setShowComboOffers={setShowComboOffers}
                    setShowSpecialPackage={setShowSpecialPackage}
                    comboOfferRef={comboOfferRef}
                    specialPackageRef={specialPackageRef}
                    setSortByTime={setSortByTime}
                    priceValue={priceValue}
                    setPriceValue={setPriceValue}
                    setFilterOnPrice={setFilterOnPrice}
                  />
                </div>
              </div>

              <div className="flex-1 flex-wrap r-2xl:pl-0 col-span-4">
                <div className="relative ">
                  <StoryFormat />
                  <div className="w-[100vw] text-center r-2xl:w-full r-2xl:text-left">
                    <SponsoredRestaurant
                      latitude={props.latitude}
                      longitude={props.longitude}
                      permission={props.permission}
                      sortByTime={sortByTime}
                      timeSort={timeSort}
                      ratingSort={ratingSort}
                      sliderNumber={props.sliderNumber}
                      priceValue={priceValue}
                      setPriceValue={setPriceValue}
                      filterDataOnPrice={filterDataOnPrice}
                      setFilterOnPrice={setFilterOnPrice}
                      seeAll={true}
                      showArrow={true}
                      setDataPresent={setDataPresent}
                    />
                  </div>
                  <div className="w-[100vw] text-center r-2xl:w-full r-2xl:text-left">
                    <TopRestaurant
                      latitude={props.latitude}
                      longitude={props.longitude}
                      permission={props.permission}
                      sortByTime={sortByTime}
                      timeSort={timeSort}
                      ratingSort={ratingSort}
                      sliderNumber={props.sliderNumber}
                      priceValue={priceValue}
                      setPriceValue={setPriceValue}
                      filterDataOnPrice={filterDataOnPrice}
                      setFilterOnPrice={setFilterOnPrice}
                      seeAll={false}
                      setDataPresent={setDataPresent}
                      showArrow={true}
                    />
                  </div>
                  <div className="w-[100vw] text-center  r-2xl:w-full r-2xl:text-left">
                    <PopularHotel
                      latitude={props.latitude}
                      longitude={props.longitude}
                      permission={props.permission}
                      sliderNumber={props.sliderNumber}
                      priceValue={priceValue}
                      setPriceValue={setPriceValue}
                      filterDataOnPrice={filterDataOnPrice}
                      setFilterOnPrice={setFilterOnPrice}
                      seeAll={false}
                      setDataPresent={setDataPresent}
                      showArrow={true}
                    />
                  </div>
                  <PopularCategory noTitle={true} />
                  <div ref={comboOfferRef}>
                    <div className="w-[100vw] text-center r-2xl:w-full r-2xl:text-left">
                      <ComboOffers
                        seeAll={false}
                        latitude={props.latitude}
                        longitude={props.longitude}
                        setDataPresent={setDataPresent}
                        sliderNumber={props.sliderNumber}
                        sortByTime={sortByTime}
                        timeSort={timeSort}
                        ratingSort={ratingSort}
                        priceValue={priceValue}
                        setPriceValue={setPriceValue}
                        filterDataOnPrice={filterDataOnPrice}
                        setFilterOnPrice={setFilterOnPrice}
                      />
                    </div>
                  </div>
                  <div ref={specialPackageRef}>
                    <div className="w-[100vw] text-center r-2xl:w-full r-2xl:text-left">
                      <SpecialPackages
                        seeAll={false}
                        latitude={props.latitude}
                        longitude={props.longitude}
                        setDataPresent={setDataPresent}
                        sliderNumber={props.sliderNumber}
                        sortByTime={sortByTime}
                        timeSort={timeSort}
                        ratingSort={ratingSort}
                        priceValue={priceValue}
                        setPriceValue={setPriceValue}
                        filterDataOnPrice={filterDataOnPrice}
                        setFilterOnPrice={setFilterOnPrice}
                      />
                    </div>
                  </div>
                  <div className="w-[100vw] text-center r-2xl:w-full r-2xl:text-left">
                    <Dietaries
                      latitude={props.latitude}
                      longitude={props.longitude}
                      sliderNumber={props.sliderNumber}
                      seeAll={false}
                      isDietry
                    />
                  </div>
                </div>
              </div>

              <div>
                <ChatView />
              </div>
            </div>
          </div>
          <div
            className={`fixed bg-white right-0 top-[120px] z-99 shadow p-5 ${
              props.openSmlFilter ? "r-2xl:hidden block" : "hidden"
            }`}
          >
            <Filter
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              showComboOffers={showComboOffers}
              showSpecialPackage={showSpecialPackage}
              setShowComboOffers={setShowComboOffers}
              setShowSpecialPackage={setShowSpecialPackage}
              comboOfferRef={comboOfferRef}
              specialPackageRef={specialPackageRef}
              setSortByTime={setSortByTime}
              priceValue={priceValue}
              setPriceValue={setPriceValue}
              setFilterOnPrice={setFilterOnPrice}
            />
          </div>
        </div>
        <Footers />
      </>
    );
  }
}
