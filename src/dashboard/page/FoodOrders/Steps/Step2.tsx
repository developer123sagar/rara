import { Spinner } from "@/common";
import { handleNext } from "@/redux/stepper/stepperSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { url } from "@/routes";
import { IFoodOrder, StepProps } from "@/types";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Step2: React.FC<StepProps> = () => {
  const selectedItem: IFoodOrder = useAppSelector(
    (state: RootState) => state.fetchDashData.selectedItem
  );

  const [loading, setLoading] = useState(false);

  const token = useAppSelector((state: RootState) => state.signin.token);

  const dispatch = useAppDispatch();
  const handlePreparing = async () => {
    setLoading(true);
    try {
      const res = await axios.put(
        `${url}/raraorder/status/${selectedItem?._id}`,
        {
          status: "preparing",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        dispatch(handleNext());
      }
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full h-full relative">
        <div className="w-full h-full relative flex items-center justify-center">
          <img
            src="/preparing.jpg"
            alt="preparing"
            className="w-full h-full object-cover opacity-60 z-10"
          />
          <p className="absolute top-1/2 font-bold text-2xl z-20">
            The order is preparing !
          </p>
        </div>

        <div className="absolute -bottom-20 right-0 flex gap-6 justify-end mt-8">
          <button
            className={`px-4 py-2 rounded text-white bg-blue-500 flex items-center justify-center`}
            onClick={handlePreparing}
          >
            {loading ? <Spinner btn /> : "Preparing"}
          </button>
        </div>
      </div>
      {/* <div className="flex justify-end mt-4">
        <Buttons
          onClick={handlePreparing}
          className="flex items-center justify-center"
        >
          {loading ? <Spinner btn /> : "Confirm"}
        </Buttons>
      </div> */}
    </>
  );
};

export default Step2;
