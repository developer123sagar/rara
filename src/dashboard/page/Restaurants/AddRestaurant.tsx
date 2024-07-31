/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Select, Spinner, TextEditor, ToggleBtn, Upload } from "@/common";
import axios from "axios";
import {
  booleanBtn,
  days,
  initialFormState,
  inputField,
  options,
} from "@/dashboard/constants/Restaurant";
import { DaySchedule, OpenTime, IRestaurantForm, BusinessType } from "@/types";
import { formatTime } from "@/helpers";
import MultipleInput from "@/common/MultipleInput";
import Buttons from "@/common/Button";
import NameMark from "@/common/NameMark";
import { SelectOption } from "@/common/Select";
import { google_map_api_key, url } from "@/routes";
import { EditInput } from "@/dashboard/component/EditRoute/EditInput";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import toast from "react-hot-toast";

const AddRestaurant = () => {
  const [dayStates, setDayStates] = useState(
    days.map(() => ({
      open: true,
      startTime: "06:00",
      endTime: "20:00",
    }))
  );

  const [openingType, setOpeningType] = useState(true);
  const [loading, setLoading] = useState(false);
  const [clickedLocation, setClickedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [lat, setLat] = useState<number>(0);
  const [lon, setLon] = useState<number>(0);
  const [form, setForm] = useState(initialFormState);
  const [selectedOptions, setSelectedOptions] = useState<
    SelectOption[] | undefined
  >([]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: google_map_api_key,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
      },
      (error) => {
        console.error("Error getting geolocation:", error);
      }
    );
  }, []);

  const center = { lat: lat, lng: lon };
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setClickedLocation({ lat, lng });
      setForm({ ...form, geo: { type: "Point", coordinates: [lat, lng] } });
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: name === "VAT_PAN" ? parseInt(e.target.value) : value,
    }));
  };

  const handleToggleChange = (toggleName: keyof IRestaurantForm) => {
    setForm((prevForm) => ({
      ...prevForm,
      [toggleName]: !prevForm[toggleName],
    }));
  };

  const handleOpeningTypeChange = (value: boolean) => {
    setOpeningType(value);
    value;
    setForm((prevForm) => {
      const updatedOpenTime = { ...prevForm.openTime };
      updatedOpenTime.isSameTimeEveryDay = value as unknown as DaySchedule;
      return {
        ...prevForm,
        openTime: updatedOpenTime,
      };
    });
  };

  const handleDayOpenChange = (dayIndex: number, value: boolean) => {
    const updatedDayStates = [...dayStates];
    updatedDayStates[dayIndex].open = value;
    setDayStates(updatedDayStates);
    setForm((prevForm) => ({
      ...prevForm,
      openTime: {
        ...prevForm.openTime,
        [days[dayIndex].toLowerCase()]: {
          ...prevForm.openTime[days[dayIndex].toLowerCase()],
          isClosed: !value,
        },
      },
    }));
  };

  const handleTimeForDiffDay = (
    dayIndex: number,
    newValue: string,
    time: "open" | "close"
  ) => {
    if (/^\d{2}:\d{2}$/.test(newValue)) {
      const updatedForm = { ...form };
      const dayName = days[dayIndex].toLowerCase() as keyof OpenTime;
      if (!updatedForm.openTime[dayName]) {
        updatedForm.openTime[dayName] = {} as DaySchedule;
      }
      const [hours, minutes] = newValue.split(":");
      const newDate = new Date();
      newDate.setHours(parseInt(hours, 10));
      newDate.setMinutes(parseInt(minutes, 10));
      time === "open"
        ? (updatedForm.openTime[dayName].startTime = newDate)
        : (updatedForm.openTime[dayName].endTime = newDate);
      setForm(updatedForm);
    } else {
      console.error("Invalid time format");
    }
  };

  const handleTimeForSameDay = (newValue: string, time: "close" | "open") => {
    if (/^\d{2}:\d{2}$/.test(newValue)) {
      setForm((prevForm) => {
        const updatedForm = { ...prevForm };
        const [hours, minutes] = newValue.split(":");
        const newDate = new Date();
        newDate.setHours(parseInt(hours, 10));
        newDate.setMinutes(parseInt(minutes, 10));

        const updatedOpenTime: OpenTime = {
          ...updatedForm.openTime,
          everyday: {
            ...updatedForm.openTime.everyday,
            [time === "open" ? "startTime" : "endTime"]: newDate,
          },
        };
        if (time === "open") {
          days.forEach((day) => {
            updatedOpenTime[day.toLowerCase()] = {
              ...updatedForm.openTime[day.toLowerCase()],
              startTime: newDate,
            };
          });
        } else if (time === "close") {
          days.forEach((day) => {
            updatedOpenTime[day.toLowerCase()] = {
              ...updatedForm.openTime[day.toLowerCase()],
              endTime: newDate,
            };
          });
        }

        return {
          ...updatedForm,
          openTime: updatedOpenTime,
        };
      });
    } else {
      console.error("Invalid time format");
    }
  };

  const handleSelectChange = (selectedItems: SelectOption[] | undefined) => {
    setSelectedOptions(selectedItems);
    const selectedFoodItemIds =
      selectedItems?.map((option) => option.value) || [];
    setForm((prevForm) => ({
      ...prevForm,
      features: selectedFoodItemIds,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${url}/rararestaurant`, form, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        setForm(initialFormState);
        toast.success(res.data.message || "Successfully created");
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="oveflow-y-auto ">
      <NameMark label="Restaurant Details" variant="primary" />
      <form className="w-full h-auto mx-auto mt-6">
        <div className="flex flex-wrap justify-between gap-4">
          {inputField.map((item) => (
            <div className="basis-[48%]" key={item.name}>
              <EditInput
                label={item.name}
                type={item.type}
                required
                min={item.type === "number" ? 1 : ""}
                placeH={item.placeH}
                name={item.formName}
                value={form[item.formName as keyof IRestaurantForm] as string}
                onChange={handleInputChange}
              />
            </div>
          ))}
        </div>

        <div className="w-full flex gap-10 justify-between">
          <div className="my-3 basis-[48%]">
            <label className="text-sm font-semibold text-black">Tags</label>
            <MultipleInput
              initialTags={form.tags}
              placeholder="Add tags"
              setTags={(newTags) => setForm({ ...form, tags: newTags })}
            />
          </div>

          <div className="my-3 basis-[48%]">
            <label className="text-sm font-semibold text-black">Features</label>
            <Select
              multiple
              value={selectedOptions || []}
              onChange={handleSelectChange}
              options={options}
            />
          </div>
        </div>

        <div className="w-[48%]">
          <h1 className={`text-[black] font-semibold text-[14px]`}>
            Business Type
          </h1>
          <select
            value={form.bussinessType}
            onChange={(e) =>
              setForm({
                ...form,
                bussinessType: e.target.value as BusinessType,
              })
            }
            className="form-control w-full text-sm py-3 pl-1 rounded placeholder:text-gray-500 border border-gray-200 my-1"
          >
            <option value="restaurant">Restaurant</option>
            <option value="privateBussiness">Private Business</option>
          </select>
        </div>

        {/* description  */}
        <div className="w-full mt-5">
          <label className="text-sm font-semibold text-black">
            Description
          </label>
          <TextEditor setForm={setForm} fieldName={"description"} />
        </div>

        {/* active hours radio button */}
        <div className="mt-12">
          <div className="text-center bg-[#ededed] h-[2px] w-full mt-[30px] mb-6">
            <span className="relative -top-[20px] inline-block p-[10px] text-sm font-semibold text-black mb-2 bg-white">
              Active hours
            </span>
          </div>
          <div className="flex justify-between">
            <div>
              <label className="text-sm font-semibold text-black mb-2">
                Opening Type:
              </label>
              <label className="container_radio w-[152px] text-sm font-semibold text-black my-2">
                Same Time Every Day
                <input
                  type="radio"
                  value=""
                  name="active hours"
                  onChange={() => handleOpeningTypeChange(true)}
                  checked={openingType}
                />
                <span className="checkmark" />
              </label>
              <label className="container_radio w-[152px] text-sm font-semibold text-black mb-2">
                Different Time Every Day
                <input
                  type="radio"
                  value=""
                  name="active hours"
                  onChange={() => handleOpeningTypeChange(false)}
                  checked={!openingType}
                />
                <span className="checkmark" />
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-black mb-2">
                Open Time
              </label>
              <input
                type="time"
                name="time"
                id="open_time"
                className="text-sm py-2 pl-1 rounded border border-gray-200 my-1 focus:ring-0 focus:outline-none"
                disabled={!openingType}
                onChange={(e) => handleTimeForSameDay(e.target.value, "open")}
                value={formatTime(form.openTime.everyday.startTime)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-black mb-2">
                Close Time
              </label>
              <input
                type="time"
                name="time"
                id="close_time"
                className="text-sm py-2 pl-1 rounded border border-gray-200 my-1 focus:ring-0 focus:outline-none"
                onChange={(e) => handleTimeForSameDay(e.target.value, "close")}
                value={formatTime(form.openTime.everyday.endTime)}
                disabled={!openingType}
              />
            </div>
          </div>
          <AnimatePresence>
            {!openingType && (
              <>
                {days.map((day, id) => (
                  <motion.div
                    initial={{ opacity: "0", height: "0" }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: id * 0.06,
                      type: "spring",
                      stiffness: "300",
                      damping: "30",
                    }}
                    key={day}
                    className="flex justify-between mb-5"
                  >
                    <ul>
                      <label className="mr-2 text-sm font-semibold text-black mb-2">
                        {day}
                      </label>
                      <li className="flex gap-5">
                        <label className="container_radio text-sm font-semibold text-black my-2">
                          Open
                          <input
                            type="radio"
                            value=""
                            name={`active_hours_${id}`}
                            onChange={() => handleDayOpenChange(id, true)}
                            checked={dayStates[id].open}
                          />
                          <span className="checkmark" />
                        </label>
                        <label className="container_radio text-sm font-semibold text-black my-2">
                          Close
                          <input
                            type="radio"
                            value=""
                            name={`active_hours_${id}`}
                            onChange={() => handleDayOpenChange(id, false)}
                            checked={!dayStates[id].open}
                          />
                          <span className="checkmark" />
                        </label>
                      </li>
                    </ul>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-black">
                        Open Time
                      </label>
                      <input
                        type="time"
                        name={`time1_${id}`}
                        id={`open_time_${id}`}
                        className="text-sm py-2 pl-1 rounded border border-gray-200 my-1 focus:ring-0 focus:outline-none"
                        value={formatTime(
                          form.openTime[days[id].toLowerCase()].startTime
                        )}
                        onChange={(e) =>
                          handleTimeForDiffDay(id, e.target.value, "open")
                        }
                        disabled={!dayStates[id].open}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-black">
                        Close Time
                      </label>
                      <input
                        type="time"
                        name={`time2_${id}`}
                        id={`close_time_${id}`}
                        className="text-sm py-2 pl-1 rounded border border-gray-200 my-1 focus:ring-0 focus:outline-none"
                        value={formatTime(
                          form.openTime[days[id].toLowerCase()].endTime
                        )}
                        onChange={(e) =>
                          handleTimeForDiffDay(id, e.target.value, "close")
                        }
                        disabled={!dayStates[id].open}
                      />
                    </div>
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
        </div>

        {/* toggle button */}
        <ul className="w-full flex items-center justify-between mt-10">
          {booleanBtn.map((item) => (
            <li
              key={item.label}
              className="flex flex-col items-center justify-center"
            >
              <label className="text-sm font-semibold text-black mb-2">
                {item.label}
              </label>
              <ToggleBtn
                toggleName={item.toggleName}
                isOn={form[item.toggleName as keyof IRestaurantForm] as boolean}
                onToggle={(toggleName) =>
                  handleToggleChange(toggleName as keyof IRestaurantForm)
                }
              />
            </li>
          ))}
          {form.bussinessType === "restaurant" && (
            <>
              <li>
                <label className="text-sm font-semibold text-black mb-2">
                  Dining
                </label>
                <ToggleBtn
                  toggleName={"dining"}
                  isOn={form.dining}
                  onToggle={(toggleName) =>
                    handleToggleChange(toggleName as keyof IRestaurantForm)
                  }
                />
              </li>
              <li>
                <label className="text-sm font-semibold text-black mb-2">
                  User Pickup
                </label>
                <ToggleBtn
                  toggleName={"userPickup"}
                  isOn={form.userPickup}
                  onToggle={(toggleName) =>
                    handleToggleChange(toggleName as keyof IRestaurantForm)
                  }
                />
              </li>
            </>
          )}
        </ul>

        {/* google map */}
        <div className="w-full h-[400px] mt-10">
          {isLoaded ? (
            <>
              <GoogleMap
                center={center}
                mapContainerStyle={{ width: "100%", height: "100%" }}
                options={{
                  zoomControl: false,
                  streetViewControl: false,
                  mapTypeControl: false,
                }}
                zoom={15}
                onClick={handleMapClick}
              >
                {clickedLocation && <Marker position={clickedLocation} />}
              </GoogleMap>
            </>
          ) : (
            <p>Loading Google Maps...</p>
          )}
        </div>

        {/* restaurant picture and docs */}
        <div className="flex justify-between">
          <div className="flex justify-between">
            <div className="mt-6">
              <div className="h-[2px] w-full mt-[30px] mb-6">
                <span className="relative -top-[20px] inline-block py-[10px] text-sm font-semibold text-black mb-2 bg-white">
                  Restaurant Logo ?
                </span>
              </div>
              <Upload
                setForm={setForm}
                accept=".jpg, .jpeg, .png"
                fieldName="logo"
                imgTitle="restaurnat"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <div className="mt-6">
              <div className="h-[2px] w-full mt-[30px] mb-6">
                <span className="relative -top-[20px] inline-block py-[10px] text-sm font-semibold text-black mb-2 bg-white">
                  Restaurant Picture ?
                </span>
              </div>
              <Upload
                setForm={setForm}
                accept=".jpg, .jpeg, .png"
                fieldName="mainImage"
                imgTitle="restaurant"
              />
            </div>
          </div>
        </div>
        <div className="w-full flex justify-between">
          <div className="mt-6 w-full">
            <div className="text-center bg-[#cec8c8] h-[1.5px] w-full mt-[30px] mb-6 ">
              <span className="relative -top-[20px] inline-block py-[10px] px-2 text-sm font-semibold text-black mb-2 bg-white">
                Restaurant Gallery ?
              </span>
            </div>
            <Upload
              accept=".jpg, .jpeg, .png"
              multiple
              fieldName="image"
              setForm={setForm}
              imgTitle="restaurant"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-10 mb-2">
          <Buttons disabled={loading} type="button" onClick={handleFormSubmit}>
            {loading ? <Spinner btn /> : "Create"}
          </Buttons>
          <Buttons back type="button" variant="destructive">
            Cancel
          </Buttons>
        </div>
      </form>
    </main>
  );
};

export default AddRestaurant;
