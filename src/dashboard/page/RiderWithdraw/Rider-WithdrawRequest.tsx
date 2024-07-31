import { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import {
  fetchDashboardData,
  setSelectedItem,
} from "@/redux/dashboard/fetchApiData/fetchApiDataSlice";
import { formatDate } from "@/helpers";
import { AdvanceTbColumn, IWithdrawRider } from "@/types";
import { Action, AdvanceTable, Spinner } from "@/common";
import { baseImgUrl } from "@/routes";
import { useNavigate } from "react-router-dom";

export default function RiderWithdrawRequest() {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector(
    (state: RootState) => state.fetchDashData
  );
  const { token } = useAppSelector((state: RootState) => state.signin);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      fetchDashboardData({
        api: "rararider/withdraw/request",
        token: token!,
      })
    );
  }, [dispatch, token]);

  const handleView = (withdraw: IWithdrawRider) => {
    dispatch(setSelectedItem(withdraw));
    navigate(`/dashboard/rider_withdraw/request/view/${withdraw?._id}`);
  };

  const column: AdvanceTbColumn<IWithdrawRider>[] = [
    {
      header: "Photo",
      accessor: (withdraw) => (
        <div style={{ width: "120px", margin: "0 auto" }}>
          <img
            src={`${baseImgUrl}/${withdraw?.rider?.photo}`}
            className="w-24 h-20 object-cover mx-auto"
          />
        </div>
      ),
    },
    { header: "Rider", accessor: (withdraw) => <p>{withdraw?.rider?.name}</p> },
    {
      header: "Withdraw Amount",
      accessor: (withdraw) => <p>AUD {withdraw?.amount}</p>,
    },
    {
      header: "Bank",
      accessor: (withdraw) => <p>{withdraw?.bank?.name}</p>,
    },
    {
      header: "TransactionStatus ",
      accessor: (withdraw) => <p>{withdraw?.transactionStatus}</p>,
    },
    {
      header: "Date",
      accessor: (withdraw) => <p>{formatDate(withdraw?.createdDateTime)}</p>,
    },
    {
      header: "Actions",
      accessor: (withdraw) => (
        <Action
          width={55}
          hideDelete
          hideEdit
          onViewDetails={() => handleView(withdraw)}
        />
      ),
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
