/* eslint-disable @typescript-eslint/no-explicit-any */
import { Popular_Category } from "@/constants";
import {
  fetchComboOffer,
  fetchRestaurant,
} from "@/redux/restaurant/restaurantSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { SetStateAction, useEffect, useRef, useState } from "react";
import SeeAll from "@/common/SeeAll";
import { IRestaurant } from "@/types";
import RestroCard from "@/common/RestroCard";

export default function ComboOffers({
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
  setDataPresent?: React.Dispatch<SetStateAction<boolean>>;
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
  setPriceValue?: React.Dispatch<SetStateAction<string>>;
  filterDataOnPrice?: boolean;
  setFilterOnPrice?: React.Dispatch<SetStateAction<boolean>>;
}) {
  const { title } = Popular_Category;
  const dispatch = useAppDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<Array<any>>([]);

  const { comboOffers } = useAppSelector(
    (state: RootState) => state.restaurant
  );

  useEffect(() => {
    dispatch(fetchRestaurant());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchComboOffer({ longitude: longitude, latitude: latitude }));
  }, [dispatch, latitude, longitude]);

  useEffect(() => {
    comboOffers && comboOffers.length > 0 && setDataPresent
      ? setDataPresent(true)
      : setDataPresent && setDataPresent(false);
  }, [comboOffers, setDataPresent]);

  useEffect(() => {
    if (comboOffers) {
      if (sliderNumber === 0) {
        const dummy = [...comboOffers];
        const filteredData = dummy.filter((obj) => obj.dining === true);
        if (sortByTime && timeSort) timeSort(filteredData, setData);
        else if (ratingSort) ratingSort(filteredData, setData);
        setFilterOnPrice && setFilterOnPrice(false);
        setPriceValue && setPriceValue("0");
      } else if (sliderNumber === 1) {
        const dummy = [...comboOffers];
        const filteredData = dummy.filter((obj) => obj.hasDelivery === true);

        setData(filteredData);
        if (sortByTime && timeSort) timeSort(filteredData, setData);
        else if (ratingSort) ratingSort(filteredData, setData);
        setFilterOnPrice && setFilterOnPrice(false);
        setPriceValue && setPriceValue("0");
      } else {
        const dummy = [...comboOffers];
        const filteredData = dummy.filter((obj) => obj.userPickup === true);
        console.log(filteredData?.length);
        setData(filteredData);

        if (sortByTime && timeSort) timeSort(filteredData, setData);
        else if (ratingSort) ratingSort(filteredData, setData);
        setFilterOnPrice && setFilterOnPrice(false);
        setPriceValue && setPriceValue("0");
      }
    }
  }, [sliderNumber, comboOffers]);

  useEffect(() => {
    if (sortByTime && timeSort) {
      timeSort(data, setData);
    } else if (ratingSort) ratingSort(data, setData);
  }, [sortByTime]);

  useEffect(() => {
    if (comboOffers && filterDataOnPrice && priceValue) {
      const dummy = [...comboOffers];
      const value = parseInt(priceValue);
      const filteredData = dummy.filter(
        (obj) => obj.minimumSpentToCheckout! <= value
      );

      if (sortByTime && timeSort) timeSort(filteredData, setData);
      else if (ratingSort) ratingSort(filteredData, setData);
      setFilterOnPrice && setFilterOnPrice(false);
    }
  }, [
    comboOffers,
    filterDataOnPrice,
    priceValue,
    ratingSort,
    setFilterOnPrice,
    sortByTime,
    timeSort,
  ]);

  return (
    <>
      {data && data.length > 0 ? (
        <div className="pt-5">
          <SeeAll
            data={data}
            link="/comboOffers"
            title={title}
            scrollRef={scrollRef}
            seeAll={seeAll}
          />
          <ul
            className={`mt-4    ${
              data.length == 1 &&
              "w-full flex  items-center justify-center  sm:justify-start "
            }`}
          >
            <div className="  relative flex items-center group">
              <div
                className="overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative pr-10 lg:grid lg:grid-cols-4 gap-6"
                ref={scrollRef}
              >
                {data.length > 0 &&
                  data.map((item: any, id) => (
                    <RestroCard key={item._id + id} restro={item} />
                  ))}
              </div>
            </div>
          </ul>
        </div>
      ) : null}
    </>
  );
}
