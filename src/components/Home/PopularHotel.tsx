import { PopularHotels } from "@/constants";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { fetchPopularRestaurant } from "@/redux/restaurant/restaurantSlice";
import { IRestaurant } from "@/types";
import { useState } from "react";

import SeeAll from "@/common/SeeAll";
import { CustomIcon } from "@/common";
import { GrNext, GrPrevious } from "react-icons/gr";
import RestroCard from "@/common/RestroCard";

interface PopularHotel {
  latitude: string | null;
  longitude: string | null;
  permission: boolean;
  showArrow: boolean;
  sliderNumber: number;
  priceValue?: string;
  seeAll?: boolean;
  setPriceValue?: Dispatch<SetStateAction<string>>;
  filterDataOnPrice?: boolean;
  setFilterOnPrice?: Dispatch<SetStateAction<boolean>>;
  setDataPresent?: Dispatch<SetStateAction<boolean>>;
}

export default function PopularHotel(props: PopularHotel) {
  const { title } = PopularHotels;
  const [data, setData] = useState<IRestaurant[]>([]);
  const dispatch = useAppDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { popularData } = useAppSelector(
    (state: RootState) => state.restaurant
  );

  useEffect(() => {
    if (props.latitude !== null && props.longitude !== null) {
      const body = {
        lat: props.latitude,
        long: props.longitude,
      };
      dispatch(fetchPopularRestaurant(body));
    }
  }, [dispatch, props.latitude, props.longitude]);
  const slideLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= 1160;
    }
  };

  const slideRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += 1160;
    }
  };

  useEffect(() => {
    if (props.sliderNumber === 0) {
      const dummy = [...popularData];
      const filteredData = dummy.filter((obj) => obj.dining === true);
      setData(filteredData);
      props.setFilterOnPrice && props.setFilterOnPrice(false);
      props.setPriceValue && props.setPriceValue("0");
    } else if (props.sliderNumber === 1) {
      const dummy = [...popularData];
      const filteredData = dummy.filter((obj) => obj.hasDelivery === true);
      setData(filteredData);
      props.setFilterOnPrice && props.setFilterOnPrice(false);
      props.setPriceValue && props.setPriceValue("0");
    } else {
      const dummy = [...popularData];
      const filteredData = dummy.filter((obj) => obj.userPickup === true);
      setData(filteredData);
      props.setFilterOnPrice && props.setFilterOnPrice(false);
      props.setPriceValue && props.setPriceValue("0");
    }
  }, [props.sliderNumber, popularData]);

  useEffect(() => {
    const unfilteredData = popularData.filter((obj) => obj.dining === true);
    setData(unfilteredData);
  }, [popularData]);

  useEffect(() => {
    if (props.filterDataOnPrice && props.priceValue) {
      const dummy = [...popularData];
      const value = parseInt(props.priceValue);
      const filteredData = dummy.filter(
        (obj) => obj.minimumSpentToCheckout! <= value
      );
      setData(filteredData);
      props.setFilterOnPrice && props.setFilterOnPrice(false);
    }
  }, [props.filterDataOnPrice]);

  useEffect(() => {
    data && data.length > 0 && props.setDataPresent
      ? props.setDataPresent(true)
      : props.setDataPresent && props.setDataPresent(false);
  }, [data]);

  return (
    <>
      <div>
        {data && data.length > 0 ? (
          <div className="pt-5  ">
            <SeeAll
              data={popularData}
              link="/popularhotel"
              title={title}
              scrollRef={scrollRef}
              seeAll={props.seeAll}
            />

            <ul
              className={`mt-4    ${
                data.length == 1 &&
                "w-full flex  items-center  justify-center sm:justify-start "
              }`}
            >
              <div>
                <div className="  relative flex  items-center group">
                  <span
                    className={` ${
                      props.showArrow && data.length > 4 ? "md:block" : "hidden"
                    }`}
                  >
                    <CustomIcon
                      icon={GrPrevious}
                      className="bg-white rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block left-0 p-2"
                      size={36}
                      onClick={slideLeft}
                    />
                  </span>
                  <div
                    ref={scrollRef}
                    className={`${
                      props.seeAll === true
                        ? "flex flex-col   sm:flex-row flex-wrap"
                        : "overflow-x-scroll whitespace-nowrap scroll-smooth  scrollbar-hide relative  pr-10 lg:grid lg:grid-cols-4 gap-6"
                    }`}
                  >
                    {data &&
                      Array.isArray(data) &&
                      data?.map((item, id: number) => (
                        <RestroCard
                          slideno={props.sliderNumber as number}
                          key={`${item}..${id}`}
                          restro={item}
                        />
                      ))}
                  </div>
                  <div>
                    <span
                      className={` ${
                        props.showArrow && data.length > 4
                          ? "md:block"
                          : "hidden"
                      }`}
                    >
                      <CustomIcon
                        icon={GrNext}
                        className="bg-white rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block right-0 p-2 "
                        size={36}
                        onClick={slideRight}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </ul>
          </div>
        ) : null}
      </div>
    </>
  );
}
