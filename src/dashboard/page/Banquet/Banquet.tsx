import { Action, AdvanceTable, Spinner } from "@/common";
import {
  fetchDashboardData,
  setSelectedItem,
} from "@/redux/dashboard/fetchApiData/fetchApiDataSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { AdvanceTbColumn, IBanquet, plan } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Banquet = () => {
  const data: IBanquet[] = useAppSelector(
    (state: RootState) => state.fetchDashData.data
  );
  const { loading } = useAppSelector((state: RootState) => state.fetchDashData);
  const [updatedData, setUpdatedData] = useState<plan[]>([]);
  const { token, role } = useAppSelector((state: RootState) => state.signin);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const vipPlan =
        data[0]?.VipPlan?.map((plan) => ({ ...plan, planName: "VIP Plan" })) ||
        [];
      const basicPlan =
        data[0]?.basicPlan?.map((plan) => ({
          ...plan,
          planName: "Basic Plan",
        })) || [];
      const premiumPlan =
        data[0]?.premiumPlan?.map((plan) => ({
          ...plan,
          planName: "Premium Plan",
        })) || [];
      setUpdatedData([...vipPlan, ...basicPlan, ...premiumPlan]);
    }
  }, [data]);

  const handleView = (plan: plan) => {
    dispatch(setSelectedItem(plan));
    localStorage.setItem("desc", JSON.stringify(plan?.description || ""));
    navigate(`/dashboard/banquet/view/${plan?._id}`);
  };

  useEffect(() => {
    dispatch(
      fetchDashboardData({ api: "raraBanquet-Menu/specific-banquetMenu", token: token! })
    );
  }, [dispatch, token, role]);

  const column: AdvanceTbColumn<plan>[] = [
    {
      header: "Plan Name",
      accessor: (plan) => <p>{plan?.planName}</p>,
    },
    {
      header: "Description",
      accessor: (plan) => <p>{plan?.description}</p>,
    },
    {
      header: "Price",
      accessor: (plan) => <p>AUD. {plan?.price}</p>,
    },
    {
      header: "Days",
      accessor: (plan) => <p>{plan?.days} days</p>,
    },
    {
      header: "Action",
      accessor: (plan) => (
        <Action onViewDetails={() => handleView(plan)} hideDelete hideEdit />
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
        <AdvanceTable columns={column} data={updatedData} />
      )}
    </>
  );
};

export default Banquet;
