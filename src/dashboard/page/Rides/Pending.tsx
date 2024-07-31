import { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { fetchDashboardData } from "@/redux/dashboard/fetchApiData/fetchApiDataSlice";

export default function Pending() {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state: RootState) => state.signin);

  useEffect(() => {
    dispatch(fetchDashboardData({ api: "rararide/pending", token: token! }));
  }, [dispatch, token]);

  return <div></div>;
}
