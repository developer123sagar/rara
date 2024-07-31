import Buttons from "@/common/Button";
import { ViewInputField } from "@/dashboard/component/viewRoute/ViewInputField";
import { RootState, useAppSelector } from "@/redux/store";
import { baseImgUrl } from "@/routes";
import { IWithdrawRider } from "@/types";

const ViewRiderWithdrawRqst = () => {
  const selectedItem: IWithdrawRider = useAppSelector(
    (state: RootState) => state.fetchDashData.selectedItem
  );
  return (
    <div>
      <div className="w-full">
        <Buttons type="button" variant="secondary" back={true}>
          Go Back
        </Buttons>
        <div className="w-full justify-between flex gap-5 flex-wrap my-6">
          <ViewInputField
            basis={48}
            value={selectedItem?.rider?.name || ""}
            label="Rider Name"
          />
          <ViewInputField
            basis={48}
            value={selectedItem?.bank?.name || ""}
            label="Bank name"
          />
          <ViewInputField
            basis={48}
            value={selectedItem?.bank?.branch || ""}
            label="Branch Name"
          />
          <ViewInputField
            basis={48}
            value={selectedItem?.bank?.accountName || ""}
            label="Account Name"
          />
          <ViewInputField
            basis={48}
            value={selectedItem?.bank?.accountNumber || ""}
            label="Account Number"
          />
          <ViewInputField
            basis={48}
            value={`AUD ${selectedItem?.amount}`}
            label="Amount"
          />
          <ViewInputField
            basis={48}
            value={`${selectedItem?.transactionStatus}`}
            label="Status"
          />
        </div>

        <div className="mt-5">
          <label className="mb-2.5 block text-black">Rider Photo</label>
          <div className="flex gap-2">
            <img
              src={`${baseImgUrl}/${selectedItem?.rider?.photo}`}
              alt={selectedItem?.name}
              className="w-[10rem]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRiderWithdrawRqst;
