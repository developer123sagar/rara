import { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { fetchDashboardData } from "@/redux/dashboard/fetchApiData/fetchApiDataSlice";
// import { AdvanceTbColumn } from "@/types";
import { Spinner } from "@/common";
// import { Dashboard_Layout } from "@/layout";

// interface IWithdraw {
//   name: string;
// }

export default function SuccessfulRequest() {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state: RootState) => state.fetchDashData);
  const { token } = useAppSelector((state: RootState) => state.signin);

  useEffect(() => {
    dispatch(
      fetchDashboardData({
        api: "rararestaurant/withdraw/success",
        token: token!,
      })
    );
  }, [dispatch, token]);

  // const column: AdvanceTbColumn<IWithdraw>[] = [
  //   { accessor: (withdraw) => <p>{withdraw.name}</p>, header: "Name" },
  //   { accessor: () => <p>{}</p>, header: "Payment" },
  //   { accessor: () => <p>{}</p>, header: "Withdraw Amount" },
  //   { accessor: () => <p>{}</p>, header: "CreatedDateTime" },
  //   { accessor: () => <p>{}</p>, header: "Status" },
  //   {
  //     header: "Actions",
  //     accessor: () => <Action width={55} />,
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
