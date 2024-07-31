/* eslint-disable @typescript-eslint/no-explicit-any */
import { Special_Package } from "@/constants";
import { fetchFoodApiData } from "@/redux/foods/foodDetailSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { useEffect, useRef, useState } from "react";
import { IRestaurant } from "@/types";

import SeeAll from "@/common/SeeAll";
import RestroCard from "@/common/RestroCard";

export default function SpecialPackages({
  seeAll,
  latitude,
  longitude,
  setDataPresent,
  sliderNumber,
  sortByTime,
  timeSort,
  ratingSort,
  priceValue,
  setPriceValue,
  filterDataOnPrice,
  setFilterOnPrice,
}: {
  seeAll?: boolean;
  latitude: string | null;
  longitude: string | null;
  setDataPresent?: React.Dispatch<React.SetStateAction<boolean>>;
  sliderNumber?: number;
  sortByTime?: boolean;
  timeSort?: (
    nearbyData: IRestaurant[],
    setData: React.Dispatch<React.SetStateAction<IRestaurant[]>>
  ) => void;
  ratingSort?: (
    nearbyData: IRestaurant[],
    setData: React.Dispatch<React.SetStateAction<IRestaurant[]>>
  ) => void;
  priceValue?: string;
  setPriceValue?: React.Dispatch<React.SetStateAction<string>>;
  filterDataOnPrice?: boolean;
  setFilterOnPrice?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { title } = Special_Package;
  const dispatch = useAppDispatch();
  const [data, setData] = useState<Array<any>>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const dynamicFoodData = useAppSelector(
    (state: RootState) => state.foodDetails.dynamicFoodData
  );

  console.log(dynamicFoodData)
  
  useEffect(() => {
    if (latitude && longitude) {
      // const correctedLat = latitude > "0" ? longitude : latitude;
      // const correctedLong = latitude > "0" ? latitude : longitude;
      dispatch(
        fetchFoodApiData({
          // api: `rarafood-speciality/nearByfood-speciality/${correctedLong}/${correctedLat}`,
          api: `rarafood-speciality/nearByfood-speciality/${longitude}/${latitude}`,
        })
      );
    }
  }, [dispatch, latitude, longitude]);

  useEffect(() => {
    if (dynamicFoodData && !seeAll) {
      if (sliderNumber === 0) {
        const dummy = [...dynamicFoodData];
        const filteredData = dummy.filter((obj) => obj.dining === true);
        if (sortByTime && timeSort) timeSort(filteredData, setData);
        else if (ratingSort) ratingSort(filteredData, setData);
        setFilterOnPrice && setFilterOnPrice(false);
        setPriceValue && setPriceValue("0");
      } else if (sliderNumber === 1) {
        const dummy = [...dynamicFoodData];
        const filteredData = dummy.filter((obj) => obj.hasDelivery === true);
        if (sortByTime && timeSort) timeSort(filteredData, setData);
        else if (ratingSort) ratingSort(filteredData, setData);
        setFilterOnPrice && setFilterOnPrice(false);
        setPriceValue && setPriceValue("0");
      } else {
        const dummy = [...dynamicFoodData];

        const filteredData = dummy.filter((obj) => obj.userPickup === true);
        if (sortByTime && timeSort) timeSort(filteredData, setData);
        else if (ratingSort) ratingSort(filteredData, setData);
        setFilterOnPrice && setFilterOnPrice(false);
        setPriceValue && setPriceValue("0");
      }
    }
  }, [sliderNumber, dynamicFoodData, seeAll]);

  useEffect(() => {
    if (!seeAll) {
      if (sortByTime && timeSort) {
        timeSort(data, setData);
      } else if (ratingSort) ratingSort(data, setData);
    }
  }, [sortByTime, seeAll]);

  useEffect(() => {
    if (dynamicFoodData && filterDataOnPrice && priceValue && !seeAll) {
      const dummy = [...dynamicFoodData];
      const value = parseInt(priceValue);
      const filteredData = dummy.filter(
        (obj) => obj.minimumSpentToCheckout! <= value
      );

      if (sortByTime && timeSort) timeSort(filteredData, setData);
      else if (ratingSort) ratingSort(filteredData, setData);
      setFilterOnPrice && setFilterOnPrice(false);
    }
  }, [filterDataOnPrice, seeAll]);

  useEffect(() => {
    dynamicFoodData && dynamicFoodData.length > 0 && setDataPresent
      ? setDataPresent(true)
      : setDataPresent && setDataPresent(false);
  }, [dynamicFoodData]);

  return (
    <div className="mt-5">
      {Array.isArray(dynamicFoodData) && dynamicFoodData.length > 0 ? (
        <div>
          <SeeAll
            data={dynamicFoodData}
            link="/specialpackages"
            title={title}
            scrollRef={scrollRef}
            seeAll={seeAll}
          />

          <ul
            className={`mt-4    ${
              dynamicFoodData.length == 1 &&
              "w-full flex  items-center justify-center sm:justify-start "
            }`}
          >
            <div className="  relative flex items-center group">
              <div
                ref={scrollRef}
                className="overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative pr-10"
              >
                {Array.isArray(dynamicFoodData) &&
                  dynamicFoodData.length > 0 &&
                  dynamicFoodData.map((item: any) => (
                    <RestroCard key={item._id} restro={item} />
                  ))}
              </div>
            </div>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
