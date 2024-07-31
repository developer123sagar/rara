import { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { fetchDashboardData } from "@/redux/dashboard/fetchApiData/fetchApiDataSlice";
import { formatDate } from "@/helpers";
import { AdvanceTbColumn } from "@/types";
import { Action, AdvanceTable, Spinner } from "@/common";

interface ICancelled_Withdraw {
  _id: string;
  name: string;
  amount: number;
  transactionStatus: string;
  paymentMethod: string;
  activeStatus: string;
  createdDateTime: Date;
}

export default function RiderCancelledWithdraw() {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector(
    (state: RootState) => state.fetchDashData
  );
  const { token } = useAppSelector((state: RootState) => state.signin);

  useEffect(() => {
    dispatch(
      fetchDashboardData({
        api: "rararider/withdraw/payment_canceled",
        token: token!,
      })
    );
  }, [dispatch]);

  const column: AdvanceTbColumn<ICancelled_Withdraw>[] = [
    { header: "Name", accessor: (withdraw) => <p>{withdraw?.name}</p> },
    {
      header: "Withdraw Amount",
      accessor: (withdraw) => <p>{withdraw?.amount}</p>,
    },
    {
      header: "Payment Method",
      accessor: (withdraw) => <p>{withdraw?.paymentMethod}</p>,
    },
    {
      header: "Status ",
      accessor: (withdraw) => <p>{withdraw?.activeStatus}</p>,
    },
    {
      header: " Date",
      accessor: (withdraw) => <p>{formatDate(withdraw?.createdDateTime)}</p>,
    },
    {
      header: "Actions",
      accessor: () => <Action width={55} />,
    },
  ];

  return (
    <>
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <AdvanceTable columns={column} data={data} />
      )}
    </>
  );
}
