import { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { fetchDashboardData } from "@/redux/dashboard/fetchApiData/fetchApiDataSlice";

export default function RiderEarn() {
  const dispatch = useAppDispatch();
  // const { data } = useAppSelector((state: RootState) => state.fetchDashData);
  const { token } = useAppSelector((state: RootState) => state.signin);

  useEffect(() => {
    dispatch(fetchDashboardData({ api: "rararider/refer", token: token! }));
  }, [dispatch, token]);

  // const column: AdvanceTbColumn<IEarn>[] = [
  //   { header: "Refer Code", accessor: (refer) => <p>{refer?.referCode}</p> },
  //   { header: "RiderName", accessor: (refer) => <p>{refer?.rider?.name}</p> },
  //   { header: "RiderEmail", accessor: (refer) => <p>{refer?.rider?.email}</p> },
  //   {
  //     header: "Rider Gender",
  //     accessor: (refer) => <p>{refer?.rider?.gender}</p>,
  //   },
  //   {
  //     header: "Is verified",
  //     accessor: (refer) => <p>{refer?.rider?.verificationStatus}</p>,
  //   },
  //   {
  //     header: "Joined At",
  //     accessor: (refer) => <p>{formatDate(refer?.rider?.joinDate)}</p>,
  //   },
  //   {
  //     header: "Actions",
  //     accessor: () => <Action width={55} />,
  //   },
  // ];

  return (
    <>
      {/* <AdvanceTable columns={column} data={data} /> */}
      <p></p>
    </>
  );
}
