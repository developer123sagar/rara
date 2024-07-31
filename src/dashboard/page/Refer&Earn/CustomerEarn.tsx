import { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { fetchDashboardData } from "@/redux/dashboard/fetchApiData/fetchApiDataSlice";
import { Spinner } from "@/common";

// interface IEarn {
//   referCode: string;
//   benefitedAmount: number;
//   rider: {
//     joinDate: string;
//     name?: {
//       first: string;
//       last: string;
//     };
//   };

//   first: string;
// }

export default function CustomerEarn() {
  const { loading } = useAppSelector(
    (state: RootState) => state.fetchDashData
  );
  const { token } = useAppSelector((state: RootState) => state.signin);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchDashboardData({ api: "raracustomer/refer", token: token! }));
  }, [dispatch, token]);

  // const column: AdvanceTbColumn<IEarn>[] = [
  //   { header: "Rider Code", accessor: () => <p>{}</p> },
  //   { header: "CustomerName", accessor: () => <p>{}</p> },
  //   { header: "Referredby", accessor: () => <p>{}</p> },
  //   { header: "Benefited Amount", accessor: () => <p>{}</p> },
  //   { header: "Joined At", accessor: () => <p>{}</p> },
  //   {
  //     header: "Actions",
  //     accessor: () => <Action width={55} />,
  //   },
  // ];

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        // <AdvanceTable columns={column} data={data} />
        <p></p>
      )}
    </>
  );
}
