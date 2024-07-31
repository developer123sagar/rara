/* eslint-disable no-useless-catch */
import { Spinner } from "@/common";
import AutoComplete from "@/common/AutoComplete";
import { Footers } from "@/components";
import HeaderWithSearch from "@/components/HeaderWithSearch";
import { fetchDashboardData } from "@/redux/dashboard/fetchApiData/fetchApiDataSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { url } from "@/routes";
import { Address, IDeliveryForm } from "@/types";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineHome, AiOutlineDollar } from "react-icons/ai";
import { FaLocationDot } from "react-icons/fa6";
import { FcLowPriority } from "react-icons/fc";
import { ImCross } from "react-icons/im";
import { RiDoorOpenLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

interface LocationProp {
  sliderNumber: number;
  setSliderNumber: Dispatch<SetStateAction<number>>;
  hideSlider?: boolean;
  showHamburgerr?: boolean;
  setLatitude: React.Dispatch<React.SetStateAction<string | null>>;
  setLongitude: React.Dispatch<React.SetStateAction<string | null>>;
  setScrollDown: React.Dispatch<React.SetStateAction<boolean>>;
  setPermission: React.Dispatch<React.SetStateAction<boolean>>;
  latitude: string | null;
  longitude: string | null;
  redirect?: boolean;
  openSmlFilter?: boolean;
  headerLocation?: boolean;
  setOpenSmlFilter?: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialAddress: Address = {
  address: "",
  city: "",
  street: "",
  zipCode: 4242,
  geoLocation: {
    type: "Point",
    coordinates: [0, 0],
  },
};

const DeliveryCharge = (prop: LocationProp) => {
  const [loading, setLoading] = useState(false);
  const [isModalOPen, setIsModalOpen] = useState(false);
  const [workModalOpen, setIsWorkModalOpen] = useState(false);
  const [form, setForm] = useState<IDeliveryForm>({
    home: initialAddress,
    work: initialAddress,
  });
  const [locationHome, setLocationHome] = useState("");
  const [locationWork, setLocationWork] = useState("");
  const [, setLocationDetails] = useState({
    city: "",
    street: "",
    zipCode: null,
  });
  const { userToken } = useAppSelector((state: RootState) => state.signin);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data } = useAppSelector((state: RootState) => state.fetchDashData);
  const { lat, lon } = useAppSelector((state: RootState) => state.order);

  const handleModal = () => {
    setIsModalOpen(!isModalOPen);
  };
  const handleWorkModal = () => {
    setIsWorkModalOpen(!workModalOpen);
  };
  const handleCloseWorkModal = () => {
    setIsWorkModalOpen(false);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      const [firstItem] = data;
      const { home, work } = firstItem;
      setLocationHome(home?.address || "");
      setLocationWork(work?.address || "");
      setForm({
        home: {
          address: home.address || "",
          city: home.city || "",
          street: home.street || "",
          zipCode: home.zipCode || null,
          geoLocation: {
            type: "Point",
            coordinates: home.geoLocation?.coordinates || [0, 0],
          },
        },
        work: {
          address: work.address || "",
          city: work.city || "",
          street: work.street || "",
          zipCode: work.zipCode || null,
          geoLocation: {
            type: "Point",
            coordinates: work.geoLocation?.coordinates || [0, 0],
          },
        },
      });
    }
  }, [data]);

  useEffect(() => {
    dispatch(
      fetchDashboardData({
        api: "raradeliveryAddress/user",
        token: userToken!,
      })
    );
  }, [dispatch, userToken]);

  useEffect(() => {
    const getLocationFromLatLng = async () => {
      if (lat && lon) {
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyC2Lx7yy5DsOhjhjUI-_DlimiTrCBBqYFg`
          );

          const result = response.data.results[0];
          if (result) {
            const addressComponents = result.address_components;

            const newLocationDetails = {
              city: "",
              street: "",
              zipCode: null,
            };
            const length = addressComponents.length - 1;

            newLocationDetails.street = addressComponents[1]?.long_name;
            newLocationDetails.city = addressComponents[2]?.long_name;
            newLocationDetails.zipCode =
              (addressComponents[length]?.types[0] === "postal_code" &&
                addressComponents[length]?.long_name) ||
              null;

            setLocationDetails(newLocationDetails);

            const updatedForm = {
              ...form,
              [isModalOPen ? "home" : "work"]: {
                ...form[isModalOPen ? "home" : "work"],
                city: newLocationDetails.city,
                street: newLocationDetails.street,
                zipCode: newLocationDetails.zipCode,
                geoLocation: {
                  type: "Point",
                  coordinates: [lat, lon],
                },
              },
            };
            setForm(updatedForm);
          }
        } catch (error) {
          throw error;
        }
      }
    };

    getLocationFromLatLng();
  }, [lat, lon]);

  const getHomeAddress = (location: string) => {
    setLocationHome(location);
  };
  const getWorkAddress = (location: string) => {
    setLocationWork(location);
  };

  const handleFormSubmit = async () => {
    setIsModalOpen(false);

    setLoading(true);
    const updatedForm = { ...form };
    updatedForm.home.address = locationHome;
    updatedForm.work.address = locationWork;
    setLoading(true);

    try {
      const res = await axios.post(`${url}/raradeliveryAddress`, form, {
        headers: {
          Authorization: userToken,
        },
      });
      if (res.status === 200) {
        toast.success("Delivery address saved successfully");
        navigate(-1);
      }
    } catch (err) {
      toast.error("something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-screen mt-6 min-h-[60vh]">
        <HeaderWithSearch
          headerLocation={true}
          sliderNumber={prop.sliderNumber}
          setSliderNumber={prop.setSliderNumber}
          setLongitude={prop.setLongitude}
          setLatitude={prop.setLatitude}
          setScrollDown={prop.setScrollDown}
          setPermission={prop.setPermission}
          latitude={prop.latitude}
          longitude={prop.longitude}
          hideSlider={true}
        />
        <div className=" mx-auto px-5 lg:px-12 py-8 sm:py-16 mt-20 lg:mt-0">
          <div className="bg-white rounded-lg shadow-md lg:p-6 w-full lg:w-[70rem] sm:p-8">
            <h1 className="text-3xl font-bold mb-6">Delivery Details</h1>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <AiOutlineHome className="text-2xl text-gray-600 mr-2" />
                <div>
                  <h2 className="text-lg font-bold">Home</h2>
                  <p className="text-gray-600">{locationHome}</p>
                </div>
              </div>
              <button
                className="flex items-center rounded bg-gray-200 px-4 py-2 text-gray-800 hover:text-black"
                onClick={handleModal}
              >
                <span>Edit</span>
              </button>
            </div>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <RiDoorOpenLine className="text-2xl text-gray-600 mr-2" />
                <div>
                  <h2 className="text-lg font-bold">Meet at my door</h2>
                  <p className="text-gray-500">{locationWork}</p>
                </div>
              </div>
              <button
                className="flex items-center rounded bg-gray-200 px-4 py-2 text-gray-800 hover:text-black"
                onClick={handleWorkModal}
              >
                <span>Edit</span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold mb-6">Delivery Options</h1>
              <button
                type="button"
                onClick={handleFormSubmit}
                className="py-2.5 bg-emerald-400 text-white rounded flex items-center justify-center w-[120px]"
              >
                {loading ? <Spinner btn /> : "Update"}
              </button>
            </div>
            <div className="border rounded-lg  px-2">
              <div className="mb-3 mt-3 flex items-center justify-between">
                <div className="flex items-center">
                  <FcLowPriority className="text-2xl text-gray-600 mr-2" />

                  <div>
                    <h2 className="text-lg font-bold ">Priority</h2>
                    <p className="text-gray-500 mt-2">
                      20-35 min + Delivered directly to you
                    </p>
                  </div>
                </div>
                <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800">
                  <span>+A$3.99</span>
                </button>
              </div>
            </div>
            <div className="border  mt-3 rounded px-2">
              <div className="mb-3 mt-3 flex items-center justify-between">
                <div className="flex items-center">
                  <AiOutlineDollar className="text-2xl text-gray-600 mr-2" />
                  <div>
                    <h2 className="text-lg font-bold ">Standard</h2>
                    <p className="text-gray-500 mt-2">20-35 min</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isModalOPen && (
          <div className="bg-white border-2 border-[#e6e6e6]  w-[20rem]  md:w-[26rem] fixed top-[22%] sm:top-[120px] left-[2%] sm:left-[35%] transform [-translate-x-1/2 -translate-y-1/2] r-2xl:left-[30%] r-2xl:right-[30%] p-5 z-99 flex flex-col items-center justify-center shadow-lg">
            {/* Modal content */}
            <div className=" w-full  ">
              <div className="flex justify-end">
                <ImCross
                  className="text-[20px] text-red-500 mb-[10px] cup"
                  onClick={handleCloseModal}
                />
              </div>
              <h1 className="text-[12px] sm:text-[24px] mb-6  font-bold  ">
                Pick up Near
              </h1>
              <div className="flex gap-4  items-center">
                <FaLocationDot size={24} />
                <h1>{locationHome}</h1>
              </div>
              <div className="flex items-center gap-4 ">
                <div className="w-full">
                  <AutoComplete
                    setLongitude={prop.setLongitude}
                    setLatitude={prop.setLatitude}
                    setScrollDown={prop.setScrollDown}
                    setPermission={prop.setPermission}
                    latitude={prop.latitude}
                    longitude={prop.longitude}
                    isSetLatLong={false}
                    getAddress={getHomeAddress}
                  />
                </div>
              </div>
              <hr className=" mt-3 mb-1" />

              <div className="flex gap-4 items-center justify-center">
                <button
                  className="font-bold text-[20px] bg-green-500 w-28 p-2"
                  onClick={() => {
                    handleCloseModal();
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {workModalOpen && (
          <div className="bg-white border-2 border-[#e6e6e6]  w-[20rem]  md:w-[26rem] fixed top-[22%] sm:top-[120px] left-[2%] sm:left-[35%] transform [-translate-x-1/2 -translate-y-1/2] r-2xl:left-[30%] r-2xl:right-[30%] p-5 z-99 flex flex-col items-center justify-center shadow-lg">
            {/* Modal content */}
            <div className=" w-full  ">
              <div className="flex justify-end">
                <ImCross
                  className="text-[20px] text-red-500 mb-[10px] cursor-pointer"
                  onClick={handleCloseWorkModal}
                />
              </div>
              <h1 className="text-[12px] sm:text-[24px] mb-6  font-bold  ">
                Pick up Near
              </h1>
              <div className="flex gap-4  items-center">
                <FaLocationDot size={24} />
                <h1>{locationWork}</h1>
              </div>
              <div className="flex items-center gap-4 ">
                <div className="w-full">
                  <AutoComplete
                    setLongitude={prop.setLongitude}
                    setLatitude={prop.setLatitude}
                    setScrollDown={prop.setScrollDown}
                    setPermission={prop.setPermission}
                    latitude={prop.latitude}
                    longitude={prop.longitude}
                    isSetLatLong={false}
                    getAddress={getWorkAddress}
                  />
                </div>
              </div>
              <hr className=" mt-3 mb-1" />

              <div className="flex gap-4 items-center justify-center">
                <button
                  className="font-bold text-[20px] bg-green-500 w-28 p-2"
                  onClick={() => {
                    setIsWorkModalOpen(false);
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footers />
    </>
  );
};

export default DeliveryCharge;
