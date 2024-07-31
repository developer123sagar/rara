/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { RootState, useAppSelector } from "@/redux/store";
import { useAppDispatch } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import { fetchDashboardData } from "@/redux/dashboard/fetchApiData/fetchApiDataSlice";
import { url } from "@/routes";

import DashboardHome from "./DashboardHome";
import axios from "axios";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { token, role } = useAppSelector((state: RootState) => state.signin);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCheckAuthorize = async () => {
      try {
        const res = await axios.get(
          `${url}/rarasaas-Subscriber/authorization`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (res.data?.message === "allow") {
          localStorage.setItem("authorized", String(true));
        } else {
          localStorage.setItem("authorized", String(false));
        }
        return res.data?.message;
      } catch (err: any) {
        toast.error(err.response.data.message);
        localStorage.setItem("authorized", String(false));
      }
    };
    if (role === "restaurant") {
      handleCheckAuthorize();
    }
    if (role === "admin") {
      localStorage.setItem("authorized", String(true));
    }
  }, [role, token, navigate, dispatch]);

  useEffect(() => {
    dispatch(
      fetchDashboardData({ api: "raraorder/pending-order", token: token! })
    );
  }, [dispatch, token]);

  return (
    <>
      <div className="dashboardHome flex-1 ml-0">
        <DashboardHome />
      </div>
    </>
  );
}
