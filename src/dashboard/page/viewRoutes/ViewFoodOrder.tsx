import Buttons from "@/common/Button";
import { ViewInputField } from "@/dashboard/component/viewRoute/ViewInputField";
import { RootState, useAppSelector } from "@/redux/store";
import { baseImgUrl } from "@/routes";
import { IFoodOrder } from "@/types";

const ViewFoodOrder = () => {
  const selectedItem: IFoodOrder = useAppSelector(
    (state: RootState) => state.fetchDashData.selectedItem
  );

  return (
    <div className="w-full">
      <Buttons back variant="secondary">
        Go Back
      </Buttons>
      <div className="w-full mt-5 rounded-sm bg-white flex flex-wrap justify-between">
        <div className="w-[50%] mt-5 rounded-sm bg-white flex flex-col">
          <div className="flex gap-2 mb-4">
            <h1>Order ID:</h1>
            <p className="font-bold">{selectedItem?.orderId}</p>
          </div>
          <ViewInputField
            value={selectedItem?.clientId?.name}
            label="Client Name"
            basis={48}
          />
          <ViewInputField
            value={selectedItem?.clientId?.email}
            label="Client Email"
            basis={48}
          />
          <ViewInputField
            value={selectedItem?.totalPrice.toFixed(2)}
            label="Total Price"
            basis={48}
          />
          <ViewInputField
            value={selectedItem?.paymentStatus}
            label="Payment Status"
            basis={48}
          />
          <ViewInputField
            value={selectedItem?.paymentMode}
            label="Payment Mode"
            basis={48}
          />
          <ViewInputField
            value={selectedItem?.status}
            label="Status"
            basis={48}
          />
        </div>
        <div className="w-[30%] flex flex-col gap-6 mt-5">
          {selectedItem?.food.map((food) => (
            <div key={food.identity} className="flex gap-4 items-center">
              <img
                src={`${baseImgUrl}/${food.image}`}
                alt={food.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h1 className="font-bold text-sm">{food.name}</h1>
                <p className="text-xs">Quantity: {food.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewFoodOrder;
