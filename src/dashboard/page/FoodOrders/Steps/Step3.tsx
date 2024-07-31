import { Spinner } from "@/common";
import { RootState, useAppSelector } from "@/redux/store";
import { url } from "@/routes";
import { IFoodOrder } from "@/types";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { connectSocket } from "@/common/global/socket";
import toast from "react-hot-toast";

const Step3: React.FC = () => {
  const selectedItem: IFoodOrder = useAppSelector(
    (state: RootState) => state.fetchDashData.selectedItem
  );
  const [loading, setLoading] = useState(false);
  const token = useAppSelector((state: RootState) => state.signin.token);
  const { orderId } = useParams();
  const [sock, setSocket] = useState<Socket>();

  useEffect(() => {
    setSocket(connectSocket(token));
  }, [setSocket, token]);

  const navigate = useNavigate();

  const hanldeReadyStatus = async () => {
    setLoading(true);

    try {
      const res = await axios.put(
        `${url}/raraorder/status/${selectedItem?._id}`,
        {
          status: "ready",
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

        if (sock) {
          sock.emit("FOOD_READY_TO_DELIVER", {
            orderId: orderId,
          });
        }

        navigate("/dashboard/food/neworder");
      }
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      sock && sock.disconnect();
    };
  }, [sock]);

  return (
    <>
      {/* <div className="w-full mt-5 rounded-sm bg-white flex flex-wrap gap-6 justify-between">
        <ViewInputField
          value={selectedItem?.orderId}
          label="Order Id"
          basis={48}
        />
        <ViewInputField
          value={selectedItem?.clientId?.name}
          label="Client Name"
          basis={48}
        />
        <ViewInputField
          value={selectedItem?.clientId?.email}
          label="Client Email"
          basis={48}
        />
        <ViewInputField
          value={selectedItem?.totalPrice}
          label="Total Price"
          basis={48}
        />
        <ViewInputField
          value={selectedItem?.paymentStatus}
          label="Payment Status"
          basis={48}
        />
        <ViewInputField
          value={selectedItem?.paymentMode}
          label="Payment Mode"
          basis={48}
        />
        <ViewInputField
          value={selectedItem?.status}
          label="Status"
          basis={48}
        />
        <div className="mb-4.5 basis-[48%]">
          <label className="block text-black">Change to Ready</label>
          <select
            className="form-control text-sm w-full py-3 pl-1 rounded placeholder:text-gray-500 border border-gray-200 my-1"
            name="preparing"
            id="preparing"
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Change Status</option>
            <option value="ready">Ready</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Buttons
          onClick={handleStatus}
          className="flex items-center justify-center"
        >
          {loading ? <Spinner btn /> : "Confirm"}
        </Buttons>
      </div> */}
      <div className="w-full h-full relative">
        <div className="w-full h-full relative flex items-center justify-center">
          <img
            src="/deliver.jpg"
            alt="deliver"
            className="w-full h-full object-cover opacity-60 z-10"
          />
          <p className="absolute top-1/2 font-bold text-2xl z-20">
            The order is Ready !
          </p>
        </div>

        <div className="absolute -bottom-20 right-0 flex gap-6 justify-end mt-8">
          <button
            className={`px-4 py-2 rounded text-white bg-blue-500 flex items-center justify-center`}
            onClick={hanldeReadyStatus}
          >
            {loading ? <Spinner btn /> : "Ready"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Step3;
