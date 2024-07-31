/* eslint-disable @typescript-eslint/no-explicit-any */
import { setLatLong } from "@/redux/order/orderSlice";
import { useAppDispatch } from "@/redux/store";
import { google_map_api_key } from "@/routes";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import { useCallback, useRef } from "react";
import Spinner from "./Spinner";
interface AutoCompleteProps {
  setLatitude: React.Dispatch<React.SetStateAction<string | null>>;
  setLongitude: React.Dispatch<React.SetStateAction<string | null>>;
  setScrollDown: React.Dispatch<React.SetStateAction<boolean>>;
  setPermission: React.Dispatch<React.SetStateAction<boolean>>;
  latitude: string | null;
  longitude: string | null;
  isSetLatLong: boolean;
  getAddress?: (address: string) => void;
}
type Library = "places";
const libraries: Library[] = ["places"];

const AutoComplete = (props: AutoCompleteProps) => {
  const inputTextRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const inputRef = useRef<google.maps.places.SearchBox | null>(null);
  const handlePlaceChanged = useCallback(() => {
    const places = inputRef.current?.getPlaces();
    props?.setPermission(false);

    if (places && places.length > 0) {
      const place = places[0];
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat().toString();
        const lon = place.geometry.location.lng().toString();
        if (props.isSetLatLong && props.setLatitude) {
          props.setLatitude(lat);
          props.setLongitude(lon);
        }
        if (props.isSetLatLong === false) {
          dispatch(setLatLong({ lat: lat, lon: lon }));
        }

        if (props.getAddress) {
          const address = inputTextRef?.current?.value;
          // Call getAddress function with the address value
          props.getAddress(address || "");
        }
      } else {
        console.error("Error: Unable to retrieve location geometry.");
      }
    }
  }, [props]);

  return (
    <LoadScript
      loadingElement={<Spinner btn />}
      googleMapsApiKey={google_map_api_key}
      libraries={libraries}
    >
      <StandaloneSearchBox
        onLoad={(ref) => (inputRef.current = ref)}
        onPlacesChanged={handlePlaceChanged}
      >
        <div className="rounded  mt-[18px]">
          <input
            ref={inputTextRef}
            type="text"
            className="bg-[rgb(235,235,235)] w-[100%] h-[60px]  outline-none placeholder:pl-0  sm:placeholder:pl-0 placeholder-gray-600 font-semibold pl-[40px] sm:pl-[49px] pt-[9px] pb-[9px]"
            placeholder="Enter Your Delivery Address"
            onFocus={() => props.setScrollDown(true)}
            onChange={() => {
              props.setScrollDown(false);
            }}
          />
        </div>
      </StandaloneSearchBox>
    </LoadScript>
  );
};

export default AutoComplete;
