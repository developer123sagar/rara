/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRestaurant } from "@/types";
import { fetchSponsoredRestro } from "@/redux/restaurant/restaurantSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import SeeAll from "@/common/SeeAll";
import RestroCard from "@/common/RestroCard";

interface TopRestaurant {
  latitude: string | null;
  longitude: string | null;
  permission: boolean;
  showArrow: boolean;
  sortByTime: boolean;
  isFounder?: boolean;
  timeSort: (
    sponsoredRestro: IRestaurant[],
    setData: React.Dispatch<React.SetStateAction<IRestaurant[]>>
  ) => void;
  ratingSort: (
    sponsoredRestro: IRestaurant[],
    setData: React.Dispatch<React.SetStateAction<IRestaurant[]>>
  ) => void;
  sliderNumber: number;
  priceValue: string;
  setPriceValue: Dispatch<SetStateAction<string>>;
  filterDataOnPrice: boolean;
  setFilterOnPrice: Dispatch<SetStateAction<boolean>>;
  seeAll?: boolean;
  setDataPresent: Dispatch<SetStateAction<boolean>>;
}

export default function SponsoredRestaurant(props: TopRestaurant) {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<Array<any>>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { sponsoredRestro } = useAppSelector(
    (state: RootState) => state.restaurant
  );

  useEffect(() => {
    dispatch(
      fetchSponsoredRestro({
        latitude: props.latitude,
        longitude: props.longitude,
      })
    );
  }, [dispatch, props.latitude, props.longitude]);

  useEffect(() => {
    if (props.sliderNumber === 0) {
      const dummy = [...sponsoredRestro];
      const filteredData = dummy.filter(
        (obj) => obj.restaurantdetails.dining === true
      );
      setData(filteredData);
    } else if (props.sliderNumber === 1) {
      const dummy = [...sponsoredRestro];
      const filteredData = dummy.filter(
        (obj) => obj.restaurantdetails.userPickup === true
      );
      setData(filteredData);
    } else {
      const dummy = [...sponsoredRestro];
      const filteredData = dummy.filter(
        (obj) => obj.restaurantdetails.hasDelivery === true
      );
      setData(filteredData);
    }
  }, [props.sliderNumber, sponsoredRestro]);

  useEffect(() => {
    data && data.length > 0
      ? props.setDataPresent(true)
      : props.setDataPresent(false);
  }, [data, props]);

  if (props.latitude === null || props.longitude === null) {
    return <Navigate to="/" />;
  } else {
    return (
      <>
        <div className="flex items-center sm:justify-start justify-center">
          {data && data.length > 0 ? (
            <div>
              <SeeAll
                title="Sponsored"
                data={sponsoredRestro}
                link="/toprestaurant"
                scrollRef={scrollRef}
                seeAll={props.seeAll}
                showline={true}
              />

              <ul
                className={`mt-4  ${
                  data.length == 1 &&
                  "w-full flex  items-center justify-center sm:justify-start "
                }`}
              >
                <div className="relative flex items-center">
                  <div
                    ref={scrollRef}
                    className={`${
                      props.seeAll === true
                        ? "flex flex-col sm:flex-row flex-wrap "
                        : "overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative"
                    }`}
                  >
                    {data &&
                      Array.isArray(data) &&
                      data.map((item: any) => (
                        <RestroCard
                          key={item._id}
                          id={item.restaurant}
                          imgSrc={item.image}
                          name={item.restaurantdetails.name}
                          address={item.restaurantdetails.address}
                        />
                      ))}
                  </div>
                </div>
              </ul>
            </div>
          ) : null}
        </div>
      </>
    );
  }
}
