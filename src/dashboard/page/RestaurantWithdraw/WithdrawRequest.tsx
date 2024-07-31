/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { Restaurant_Wallet } from "@/redux/restaurant/restaurantSlice";
import Buttons from "@/common/Button";
import axios from "axios";
import { url } from "@/routes";
import { Action, AdvanceTable, Spinner } from "@/common";
import { AdvanceTbColumn, RestroWithdrawRequest } from "@/types";
import {
  fetchDashboardData,
  setSelectedItem,
} from "@/redux/dashboard/fetchApiData/fetchApiDataSlice";
import { formatDate } from "@/helpers";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function WithdrawRequest() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const restaurantWalletData = useAppSelector(
    (state: RootState) => state.restaurant.restaurantWalletData
  );
  const { token, role } = useAppSelector((state: RootState) => state.signin);
  const data: any = useAppSelector(
    (state: RootState) => state.fetchDashData.data
  );

  useEffect(() => {
    if (role === "restaurant") dispatch(Restaurant_Wallet(token));
  }, [dispatch, token, role]);

  useEffect(() => {
    if (role === "admin")
      dispatch(
        fetchDashboardData({
          api: "rararestaurant/withdraw/request",
          token: token!,
        })
      );
  }, [dispatch, role, token]);

  const handleRequestWithdraw = async () => {
    setLoading(true);
    if (amount)
      if (amount < restaurantWalletData.data.availableBalance) {
        try {
          const res = await axios.post(
            `${url}/rararestaurant/withdraw`,
            { amount: amount },
            {
              headers: {
                Authorization: token,
              },
            }
          );
          toast.success(res.data.message || "Success");
        } catch (error) {
          toast.error("Error Occured");
        } finally {
          setLoading(false);
        }
      } else {
        toast.error("The Requested Amount is greater than your wallet amount");
        setLoading(false);
      }
  };

  const handleView = (withdraw: RestroWithdrawRequest) => {
    dispatch(setSelectedItem(withdraw));
    navigate(`/dashboard/restaurant_withdraw/request/view/${withdraw?._id}`);
  };

  const column: AdvanceTbColumn<RestroWithdrawRequest>[] = [
    {
      header: "Restaurant",
      accessor: (withdraw) => (
        <p className="text-xs">{withdraw?.restaurant?.name}</p>
      ),
    },
    {
      header: "Amount",
      accessor: (withdraw) => <p>AUD {withdraw?.amount}</p>,
    },
    {
      header: "Transaction Status",
      accessor: (withdraw) => <p>{withdraw?.transactionStatus}</p>,
    },
    {
      header: "Date",
      accessor: (withdraw) => <p>{formatDate(withdraw?.createdDateTime)}</p>,
    },
    {
      header: "Action",
      accessor: (withdraw) => (
        <Action
          hideDelete
          hideEdit
          onViewDetails={() => handleView(withdraw)}
        />
      ),
    },
  ];

  return (
    <div className="mt-16">
      {role === "restaurant" && (
        <>
          <div className="flex flex-col gap-10">
            <div className="flex gap-10 items-center py-2">
              <h2 className="text-gray-900 font-bold text-lg">
                Available Balance
              </h2>
              <p>AUD {restaurantWalletData?.data?.availableBalance}</p>
            </div>

            <div className={`w-[50%]`}>
              <label className="mb-1 font-bold text-[#141312]">
                Withdraw Amount
              </label>
              <input
                type="number"
                min={1}
                required
                value={`${amount}`}
                onChange={(e) => setAmount(parseInt(e.target.value))}
                placeholder={"Enter Amount"}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium form-control active:border-primary"
              />
            </div>
          </div>
          <Buttons
            type="button"
            onClick={handleRequestWithdraw}
            className="flex items-center justify-center"
          >
            {loading ? <Spinner btn /> : "Request Withdraw"}
          </Buttons>
        </>
      )}
      {role === "admin" && (
        <>
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <AdvanceTable columns={column} data={data} />
          )}
        </>
      )}
    </div>
  );
}
