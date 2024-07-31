import { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { fetchDashboardData } from "@/redux/dashboard/fetchApiData/fetchApiDataSlice";

export default function History() {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state: RootState) => state.signin);

  useEffect(() => {
    dispatch(fetchDashboardData({ api: "rararide/history", token: token! }));
  }, [token, dispatch]);

  return <div></div>;
}
