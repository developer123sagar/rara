import { AdvanceTable, Spinner } from "@/common";
import { formatDate } from "@/helpers";
import {
  fetchDashboardData,
  setCurrentPage,
  setSelectedItem,
} from "@/redux/dashboard/fetchApiData/fetchApiDataSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { AdvanceTbColumn, IFoodOrder } from "@/types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BanquetNewOrder = () => {
  const { data, loading } = useAppSelector(
    (state: RootState) => state.fetchDashData
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token } = useAppSelector((state: RootState) => state.signin);

  // const handleEdit = (order: IFoodOrder) => {
  //   dispatch(setSelectedItem(order));
  //   navigate(`/dashboard/food/neworder/edit/${order?.orderId}`);
  // };

  const handleView = (order: IFoodOrder) => {
    dispatch(setSelectedItem(order));
    navigate(`/dashboard/food/neworder/edit/${order?.orderId}`);
  };

  const column: AdvanceTbColumn<IFoodOrder>[] = [
    {
      header: "order Id",
      accessor: (order) => <p className="text-xs">{order?.orderId}</p>,
    },
    {
      header: "User Name",
      accessor: (order) => <p>{order?.clientId?.name}</p>,
    },
    {
      header: "Price",
      accessor: (order) => <p>AUD {order?.totalPrice?.toFixed(2)}</p>,
    },

    {
      header: "Date",
      accessor: (order) => <p>{formatDate(order?.createdDateTime)}</p>,
    },
    {
      header: " Payment Mode",
      accessor: (order) => <p>{order?.paymentMode}</p>,
    },
    {
      header: " Payment Status",
      accessor: (order) => <p>{order?.paymentStatus}</p>,
    },
    {
      header: "Status",
      accessor: (order) => <p>{order?.status}</p>,
    },
    // {
    //   header: "Action",
    //   accessor: (order) => (
    //     <Action
    //       hideDelete
    //       onEdit={() => handleEdit(order)}
    //       hideEdit={order.status === "ready"}
    //       onViewDetails={() => handleView(order)}
    //     />
    //   ),
    // },
  ];

  useEffect(() => {
    dispatch(setCurrentPage(1));
    dispatch(
      fetchDashboardData({
        api: "raraorder/banquetMenu/pending-order",
        token: token!,
      })
    );
  }, [dispatch, token]);

  return (
    <div>
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <AdvanceTable handleClick={handleView} columns={column} data={data} />
      )}
    </div>
  );
};

export default BanquetNewOrder;
