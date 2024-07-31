import { TextEditor } from "@/common";
import Buttons from "@/common/Button";
import { ViewInputField } from "@/dashboard/component/viewRoute/ViewInputField";
import { RootState, useAppSelector } from "@/redux/store";
import { baseImgUrl } from "@/routes";
import { plan } from "@/types";

const ViewBanquet = () => {
  const selectedItem: plan = useAppSelector(
    (state: RootState) => state.fetchDashData.selectedItem
  );
  return (
    <div className="w-full">
      <Buttons back variant="secondary">
        Go Back
      </Buttons>
      <div className="w-full mt-5 rounded-sm bg-white flex flex-wrap justify-between">
        <div className="w-[50%] mt-5 rounded-sm bg-white flex gap-5 flex-col">
          <ViewInputField
            value={selectedItem?.planName as string}
            label="Plan Name"
            basis={48}
          />
          <ViewInputField
            value={selectedItem?.price}
            label="Plan Price"
            basis={48}
          />
          <ViewInputField value={selectedItem?.days} label="Days" basis={48} />
          <div>
            <label htmlFor="desc">Food Description</label>
            <TextEditor
              existingDescription={selectedItem?.description || "Not available"}
              disabled
            />
          </div>
        </div>
        <div className="w-[30%] flex flex-col gap-6 mt-5">
          {selectedItem?.foods?.map((food) => (
            <div key={food._id} className="flex gap-4 items-center">
              <img
                src={`${baseImgUrl}/${food?.activeImage}`}
                alt={food.name}
                className="w-20 h-20 object-cover rounded"
              />
              <h1 className="font-bold text-sm">{food.name}</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewBanquet;
