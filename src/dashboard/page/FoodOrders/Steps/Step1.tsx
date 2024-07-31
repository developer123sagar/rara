// import { statusValues } from "@/constants";
import { Spinner } from "@/common";
// import Buttons from "@/common/Button";
import { connectSocket } from "@/common/global/socket";
// import { connectSocket } from "@/common/global/socket";
import { checkChatAvaliability } from "@/redux/chat/chatSlice";
import { fetchRestAdminId } from "@/redux/restaurant/restaurantSlice";
import {
  handleNext,
  handlePrev,
  setStatus,
} from "@/redux/stepper/stepperSlice";
// import { checkChatAvaliability } from "@/redux/chat/chatSlice";
// import {
//   fetchIndvRestInfo,
//   fetchRestAdminId,
// } from "@/redux/restaurant/restaurantSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { url } from "@/routes";
import { IFoodOrder, StepProps } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Socket } from "socket.io-client";

const Step1: React.FC<StepProps> = ({ setActiveStep }) => {
  const selectedItem: IFoodOrder = useAppSelector(
    (state: RootState) => state.fetchDashData.selectedItem
  );
  const { token } = useAppSelector((state: RootState) => state.signin);
  const [loadingReject, setLoadingReject] = useState(false);
  const [loadingAck, setLoadingAck] = useState(false);
  const [sock, setSocket] = useState<Socket>();
  const [orderChangeNumber, setOrderChangeNumber] = useState<number>(0);
  const { chatAvaliability } = useAppSelector((state: RootState) => state.chat);
  const { restAdminId } = useAppSelector(
    (state: RootState) => state.restaurant
  );
  // const { currentStep, status } = useAppSelector(
  //   (state: RootState) => state.stepper
  // );

  const dispatch = useAppDispatch();
  const [chatId, setChatId] = useState("");

  useEffect(() => {
    setSocket(connectSocket(token));
  }, [setSocket, token]);

  // const statusValues = [
  //   { label: "Pickup", value: "pickup" },
  //   { label: "Acknowledged", value: "acknowledged" },
  //   {
  //     label: "Rejected By restaurant",
  //     value: "Rejectedbyrestaurant",
  //   },
  // ];

  useEffect(() => {
    dispatch(fetchRestAdminId(token));
  }, [dispatch, token]);

  const handleButton = async (
    args: "reject" | "ack",
    status: "acknowledged" | "Rejectedbyrestaurant"
  ) => {
    if (args === "reject") {
      setLoadingReject(true);
      dispatch(setStatus("Rejectedbyrestaurant"));
    }
    if (args === "ack") {
      setLoadingAck(true);
      dispatch(setStatus("acknowledged"));
    }

    if (status) {
      try {
        const res = await axios.put(
          `${url}/raraorder/status/${selectedItem?._id}`,
          {
            status: status,
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
          if (setActiveStep) setActiveStep(1);

          let data = orderChangeNumber;
          if (data < 5) data++;
          else data = 0;

          setOrderChangeNumber(data);
          if (chatAvaliability.status === 200) {
            if (chatAvaliability.data === null) {
              const postData = {
                senderId: restAdminId._id,
                receiverId: selectedItem.clientId._id,
              };
              try {
                const res = await axios.post(`${url}/rarachat`, postData);
                setChatId(res.data._id);
              } catch (err) {
                console.error("Error:", err);
              }
            } else {
              setChatId(chatAvaliability.data._id);
            }
          }

          if (args === "ack") {
            dispatch(handleNext());
          }
          if (args === "reject") {
            dispatch(handlePrev());
          }
          console.log(selectedItem.clientId._id);
          const messageBody = {
            receiveId: selectedItem.clientId._id,
            message: "Your order has been acknowledged",
          };
          console.log(sock);
          sock && sock.emit("CHATTING", { ...messageBody });
        }
      } catch (err) {
        toast.error("Something went wrong");
      } finally {
        setLoadingReject(false);
        setLoadingAck(false);
      }
    } else {
      toast.error("Please Choose Active Status to Acknowledge");
      setLoadingReject(false);
      setLoadingAck(false);
    }
  };

  useEffect(() => {
    return () => {
      sock && sock.disconnect();
    };
  }, [sock]);

  useEffect(() => {
    if (selectedItem && restAdminId._id && selectedItem?.clientId?._id)
      dispatch(
        checkChatAvaliability({
          senderId: restAdminId._id,
          receiverId: selectedItem.clientId._id,
          token: token,
        })
      );
  }, [dispatch, selectedItem, token, restAdminId._id]);

  useEffect(() => {
    const sendDefaultMessage = async () => {
      if (chatId !== "" && chatId !== " ") {
        const body = {
          chatId: chatId,
          senderId: restAdminId._id,
          content: "Your order has been acknowledged",
        };
        try {
          await axios.post(`${url}/raramessage`, body);
        } catch (err) {
          throw err;
        }
      }
    };
    sendDefaultMessage();
  }, [chatId, restAdminId._id]);

  // useEffect(() => {
  //   dispatch(fetchIndvRestInfo(token));
  // }, [dispatch, token]);

  return (
    <div className="w-full h-full relative">
      <div className="w-full h-full relative flex items-center justify-center">
        <img
          src="/acknowledge.svg"
          alt="acknowledge"
          className="w-full h-full object-cover opacity-60 z-10"
        />
        <p className="absolute top-1/2 font-bold text-2xl z-20">
          Acknowledge the order ?
        </p>
          {/* <div className="h z-50 absolute bottom-0 right-0">
        <label className="block text-black">Change Status</label>
        <select
          onChange={(e) => setStatus(e.target.value)}
          className={`form-control text-sm w-full py-3 pl-1 rounded placeholder:text-gray-500 border-gray-200 border-[1.5px] border-stroke`}
        >
          <option value="" disabled selected>
            Choose status
          </option>
          {statusValues
            .filter(
              (item) =>
                item.value !== "pickup" ||
                selectedItem?.deliveryType === "pickup"
            )
            .map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
        </select>
      </div> */}

        {/* <div className="flex justify-end mt-4">
        <Buttons
          onClick={hanldeAcknowledge}
          className="flex items-center justify-center"
        >
          {loading ? <Spinner btn /> : "Confirm"}
        </Buttons>
      </div> */}
      </div>

      {/* <div className="flex justify-end mt-8">
        <button
          className={`px-4  py-2 rounded ${
            currentStep === 1
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } ${currentStep === 1 ? "hidden" : "block"} text-white mr-4`}
          onClick={handlePrev}
          disabled={currentStep === 1}
        >
          Previous
        </button>
        <button
          className={`px-4 py-2 rounded ${
            currentStep === 4
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
          onClick={handleNext}
          disabled={currentStep === 4}
        >
          Next
        </button>
      </div> */}
      <div className="absolute -bottom-20 right-0 flex gap-6 justify-end mt-8">
        <button
          type="button"
          className={
            "px-6 py-2.5 rounded bg-red-600 text-white flex items-center justify-center"
          }
          onClick={() => handleButton("reject", "Rejectedbyrestaurant")}
        >
          {loadingReject ? <Spinner btn /> : "Reject"}
        </button>
        <button
          className={`px-4 py-2 rounded text-white bg-blue-500 flex items-center justify-center`}
          onClick={() => handleButton("ack", "acknowledged")}
        >
          {loadingAck ? <Spinner btn /> : "Acknowledge"}
        </button>
      </div>
    </div>
  );
};

export default Step1;
