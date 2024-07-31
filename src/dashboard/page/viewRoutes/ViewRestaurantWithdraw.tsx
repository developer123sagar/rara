import Buttons from "@/common/Button";
import { ViewInputField } from "@/dashboard/component/viewRoute/ViewInputField";
import { RootState, useAppSelector } from "@/redux/store";
import { url } from "@/routes";
import { RestroWithdrawRequest } from "@/types";
import axios from "axios";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ViewRestaurantWithdraw = () => {
  const [transactionStatus, setTransactionStatus] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [verifyToken, setVerifyToken] = useState("");
  const { token } = useAppSelector((state: RootState) => state.signin);
  const selectedItem: RestroWithdrawRequest = useAppSelector(
    (state: RootState) => state.fetchDashData.selectedItem
  );

  const sendVerificationToken = async () => {
    if (transactionStatus === "DONE" || transactionStatus === "CANCELLED") {
      try {
        const res = await axios.get(
          `${url}/rarasettlement/sendverificationCode`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (res.status === 200) {
          setShowTokenInput(true);
          toast.success(res.data.message || "Success");
        }
      } catch (error) {
        throw error;
      }
    }
  };

  const handleVerifyToken = async () => {
    if (verifyToken.length == 6) {
      try {
        await axios.post(
          `${url}/rarasettlement/verifiedSettlement`,
          { cod: verifyToken },
          {
            headers: {
              Authorization: token,
            },
          }
        );
      } catch (err) {
        throw err;
      }
    }
  };

  useEffect(() => {
    if (verifyToken.length == 6) {
      handleVerifyToken();
    }
  }, [verifyToken]);

  useEffect(() => {
    if (transactionStatus) {
      sendVerificationToken();
    }
  }, [transactionStatus]);

  return (
    <div className="mt-20 w-full">
      <Buttons type="button" variant="secondary" back={true}>
        Go Back
      </Buttons>
      <div className="w-full mt-5 flex gap-5 flex-wrap justify-between mb-5">
        <ViewInputField
          basis={100}
          value={selectedItem?.restaurant?.name || ""}
          label="Restaurant Name"
        />
        <ViewInputField
          basis={100}
          value={`AUD ${selectedItem?.amount}` || ""}
          label="Amount"
        />
        <div className="w-full flex gap-10">
          <div className="basis-[48%] flex flex-col">
            <label className="text-sm font-semibold text-black">
              Transaction Status
            </label>
            <select
              name="status"
              onChange={(e) => setTransactionStatus(e.target.value)}
              className="py-3 pl-3 border border-gray-200 mt-2 text-gray-400 form-control"
            >
              <option value=""></option>
              <option value="DONE">Done</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          {showTokenInput && (
            <div>
              <label htmlFor="token">Please enter the token</label>
              <input
                type="text"
                onChange={(e) => setVerifyToken(e.target.value)}
                className="form-control w-full bg-slate-50 py-3 pl-4 rounded placeholder:text-gray-500 border border-gray-200"
                placeholder="token"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewRestaurantWithdraw;
