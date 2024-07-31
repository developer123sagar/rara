import { IRestaurant } from "@/types";
import { fetchNearbyRestaurant } from "@/redux/restaurant/restaurantSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { Top_rated_restaurant_content } from "@/constants";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import SeeAll from "@/common/SeeAll";
import { CustomIcon } from "@/common";
import { GrNext, GrPrevious } from "react-icons/gr";
import RestroCard from "@/common/RestroCard";

interface TopRestaurant {
  latitude: string | null;
  longitude: string | null;
  permission: boolean;
  timeSort: (
    nearbyData: IRestaurant[],
    setData: React.Dispatch<React.SetStateAction<IRestaurant[]>>
  ) => void;
  ratingSort: (
    nearbyData: IRestaurant[],
    setData: React.Dispatch<React.SetStateAction<IRestaurant[]>>
  ) => void;
  seeAll?: boolean;
  showArrow: boolean;
  sortByTime?: boolean;
  isFounder?: boolean;
  sliderNumber?: number;
  priceValue?: string;
  setPriceValue?: Dispatch<SetStateAction<string>>;
  filterDataOnPrice?: boolean;
  setFilterOnPrice?: Dispatch<SetStateAction<boolean>>;
  setDataPresent?: Dispatch<SetStateAction<boolean>>;
}

export default function TopRestaurant(props: TopRestaurant) {
  const { title } = Top_rated_restaurant_content;
  const dispatch = useAppDispatch();

  const scrollRef = useRef<HTMLDivElement>(null);

  const { nearbyData } = useAppSelector((state: RootState) => state.restaurant);
  const [data, setData] = useState<IRestaurant[]>([]);

  useEffect(() => {
    if (props.latitude !== null && props.longitude !== null) {
      const body = {
        lat: props.latitude,
        long: props.longitude,
      };
      dispatch(fetchNearbyRestaurant(body));
    }
  }, [dispatch, props.latitude, props.longitude]);
  console.log(props.sliderNumber);

  useEffect(() => {
    if (props.sliderNumber === 0) {
      const dummy = [...nearbyData];
      const filteredData = dummy.filter((obj) => obj.dining === true);
      if (props.sortByTime) props.timeSort(filteredData, setData);
      else props.ratingSort(filteredData, setData);
      props.setFilterOnPrice && props.setFilterOnPrice(false);
      props.setPriceValue && props.setPriceValue("0");
    } else if (props.sliderNumber === 1) {
      const dummy = [...nearbyData];
      const filteredData = dummy.filter((obj) => obj.hasDelivery === true);
      if (props.sortByTime) props.timeSort(filteredData, setData);
      else props.ratingSort(filteredData, setData);
      props.setFilterOnPrice && props.setFilterOnPrice(false);
      props.setPriceValue && props.setPriceValue("0");
    } else {
      const dummy = [...nearbyData];
      const filteredData = dummy.filter((obj) => obj.userPickup === true);
      if (props.sortByTime) props.timeSort(filteredData, setData);
      else props.ratingSort(filteredData, setData);
      props.setFilterOnPrice && props.setFilterOnPrice(false);
      props.setPriceValue && props.setPriceValue("0");
    }
  }, [props.sliderNumber, nearbyData]);

  useEffect(() => {
    if (props.sortByTime) {
      props.timeSort(data, setData);
    } else props.ratingSort(data, setData);
  }, [props.sortByTime]);

  useEffect(() => {
    if (props.filterDataOnPrice && props.priceValue) {
      const dummy = [...nearbyData];
      const value = parseInt(props.priceValue);
      const filteredData = dummy.filter(
        (obj) => obj.minimumSpentToCheckout! <= value
      );

      if (props.sortByTime) props.timeSort(filteredData, setData);
      else props.ratingSort(filteredData, setData);
      props.setFilterOnPrice && props.setFilterOnPrice(false);
    }
  }, [props.filterDataOnPrice]);

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
    data && data.length > 0 && props.setDataPresent
      ? props.setDataPresent(true)
      : props.setDataPresent && props.setDataPresent(false);
  }, [data, props]);

  if (props.latitude === null || props.longitude === null) {
    return <Navigate to="/" />;
  } else {
    return (
      <>
        <div>
          {data && data.length > 0 ? (
            <div className="pt-5 ">
              <SeeAll
                title={title}
                data={data}
                link="/toprestaurant"
                scrollRef={scrollRef}
                seeAll={props.seeAll}
              />

              <ul
                className={`mt-4  ${
                  data.length == 1 &&
                  "w-full flex  items-center justify-center  sm:justify-start "
                }`}
              >
                <div className=" relative flex items-center group">
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
                        ? "flex flex-col sm:flex-row flex-wrap"
                        : "overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative pr-10 lg:grid lg:grid-cols-4 gap-6"
                    }`}
                  >
                    {data &&
                      Array.isArray(data) &&
                      data.map((item, id: number) => (
                        <RestroCard key={`${item._id}..${id}`} restro={item} />
                      ))}
                  </div>
                  <span
                    className={` ${
                      props.showArrow && data.length > 4 ? "md:block" : "hidden"
                    }`}
                  >
                    <CustomIcon
                      icon={GrNext}
                      className="bg-white rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block p-2 right-0"
                      size={36}
                      onClick={slideRight}
                    />
                  </span>
                </div>
              </ul>
            </div>
          ) : null}
        </div>
      </>
    );
  }
}
