/* eslint-disable @typescript-eslint/no-explicit-any */
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import {
  fetchDietarydRestro,
  fetchRestaurant,
} from "@/redux/restaurant/restaurantSlice";
import { useEffect, useState, useRef } from "react";
import SeeAll from "@/common/SeeAll";
import RestroCard from "@/common/RestroCard";
import { IRestaurant } from "@/types";

type Dietary = {
  latitude: string | null;
  longitude: string | null;
  seeAll: boolean;
  isDietry: boolean;
  sliderNumber: number;
};
const Dietaries = (props: Dietary) => {
  const dispatch = useAppDispatch();
  const [dietry, setDietry] = useState<any>([]);
  const [data, setData] = useState<IRestaurant[]>([]);

  const { dietaryRestro } = useAppSelector(
    (state: RootState) => state.restaurant
  );
  const { restaurantData } = useAppSelector(
    (state: RootState) => state.restaurant
  );

  const filterDietryRestaurant = restaurantData.filter((restaurant) =>
    dietry.some((diet: any) => diet.restaurantId === restaurant._id)
  );

  useEffect(() => {
    if (props.sliderNumber === 1) {
      const dummy = [...filterDietryRestaurant];
      const filteredData = dummy.filter((obj) => obj.hasDelivery === true);
      setData(filteredData);
    } else {
      const dummy = [...filterDietryRestaurant];
      const filteredData = dummy.filter((obj) => obj.userPickup === true);
      setData(filteredData);
    }
  }, [props.sliderNumber]);

  useEffect(() => {
    dispatch(fetchRestaurant());
  }, [dispatch]);

  useEffect(() => {
    if (dietaryRestro && dietaryRestro.dietPlans) {
      const arrayOfObjects = Object.entries(dietaryRestro.dietPlans).flatMap(
        ([restaurant, items]: [string, any]) =>
          items.map((item: any) => ({ restaurant, ...item }))
      );

      setDietry(arrayOfObjects);
    }
  }, [dietaryRestro]);

  useEffect(() => {
    dispatch(
      fetchDietarydRestro({
        latitude: props.latitude,
        longitude: props.longitude,
      })
    );
  }, [dispatch]);

  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div>
        {filterDietryRestaurant && filterDietryRestaurant.length > 0 ? (
          <div className="pt-5 ">
            <SeeAll
              data={filterDietryRestaurant}
              link="/dietries"
              title={"Dietry Plan"}
              scrollRef={scrollRef}
              seeAll={props.seeAll}
            />
            <ul
              className={`mt-4    ${
                filterDietryRestaurant.length == 1 &&
                "w-full flex  items-center justify-center sm:justify-start  "
              }`}
            >
              <div className="  relative flex items-center group">
                <div
                  ref={scrollRef}
                  className={`${
                    props.seeAll === true
                      ? "flex flex-col sm:flex-row flex-wrap "
                      : "overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative pr-10 lg:grid lg:grid-cols-4 gap-6"
                  }`}
                >
                  {data &&
                    Array.isArray(data) &&
                    data?.map((item, id) => (
                      <RestroCard key={item._id + id} restro={item} />
                    ))}
                </div>
              </div>
            </ul>
          </div>
        ) : null}
      </div>
    </>
  );
};
export default Dietaries;
