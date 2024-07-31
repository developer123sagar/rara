import { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { fetchDashboardData } from "@/redux/dashboard/fetchApiData/fetchApiDataSlice";
// import { formatDate } from "@/helpers";
// import { AdvanceTbColumn } from "@/types";
import { Spinner } from "@/common";
// interface IWallet {
//   createdDateTime: Date;
//   amount: number;
//   source: string;
//   transactionStatus: string;
//   rider: {
//     name: string;
//   };
// }

export default function RiderWallet() {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state: RootState) => state.fetchDashData);
  const { token } = useAppSelector((state: RootState) => state.signin);
  useEffect(() => {
    dispatch(
      fetchDashboardData({
        api: "rararider/wallet/Allriderwallet",
        token: token!,
      })
    );
  }, [dispatch, token]);

  // const column: AdvanceTbColumn<IWallet>[] = [
  //   {
  //     header: "Loaded on",
  //     accessor: (wallet) => <p>{formatDate(wallet.createdDateTime)}</p>,
  //   },
  //   { header: "Rider", accessor: (wallet) => <p>{wallet.rider?.name}</p> },
  //   { header: "Balance Loaded", accessor: (wallet) => <p>{wallet.amount}</p> },
  //   { header: "Source", accessor: (wallet) => <p>{wallet.source}</p> },
  //   {
  //     header: "Transaction Status",
  //     accessor: (wallet) => <p>{wallet.transactionStatus}</p>,
  //   },
  // ];

  return (
    <>
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        // <AdvanceTable columns={column} data={data} />
        <p></p>
      )}
    </>
  );
}
