/* eslint-disable @typescript-eslint/no-explicit-any */
import { ViewInputField } from "@/dashboard/component/viewRoute/ViewInputField";
import Step1 from "@/dashboard/page/FoodOrders/Steps/Step1";
import Step2 from "@/dashboard/page/FoodOrders/Steps/Step2";
import Step3 from "@/dashboard/page/FoodOrders/Steps/Step3";
import { handleNext } from "@/redux/stepper/stepperSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { baseImgUrl } from "@/routes";
import { IFoodOrder } from "@/types";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineAccountBalanceWallet, MdPreview } from "react-icons/md";
import { VscPreview } from "react-icons/vsc";

const Stepperfun = () => {
  const { currentStep } = useAppSelector((state: RootState) => state.stepper);
  const dispatch = useAppDispatch();

  const selectedItem: IFoodOrder = useAppSelector(
    (state: RootState) => state.fetchDashData.selectedItem
  );
  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="w-full p-2 bg-white">
            <div className="w-full rounded-sm flex flex-wrap justify-between">
              <div className="w-[50%] mt-5 rounded-sm flex flex-col">
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
                  value={selectedItem?.deliveryType as string}
                  label="Delivery type"
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
            <div className="flex justify-end mb-10">
              <button
                className={`px-6 py-2 rounded bg-blue-500  text-white`}
                onClick={() => dispatch(handleNext())}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="w-full h-full">
            <Step1 />
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full">
            <Step2 />
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full">
            <Step3 />
          </div>
        );
      case 5:
        return (
          <div className="w-full p-2">
            <h1 className="font-bold text-2xl">Your Ordered Foods</h1>
            <div className="w-full flex flex-wrap gap-12 mt-5">
              {selectedItem?.food.map((food) => (
                <div
                  key={food.identity}
                  className="flex flex-col gap-4 items-center"
                >
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
            <p className="mt-20 font-bold text-lg">
              Your order has been successfully acknowledged ! Thank you{" "}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8  md:px-8 flex flex-col h-[80vh] ">
      <div className="flex flex-col md:flex-row items-stretch justify-between space-y-6 md:space-y-0 md:space-x-12  flex-grow">
        <div className="w-full md:w-[30%]">
          <div className="flex flex-col space-y-16 h-full">
            <StepIcon
              icon={<FaRegUser />}
              title="Order Info"
              currentStep={currentStep}
              stepNumber={1}
            />
            <StepIcon
              icon={<MdOutlineAccountBalanceWallet />}
              title="Acknowledge"
              currentStep={currentStep}
              stepNumber={2}
            />
            <StepIcon
              icon={<VscPreview />}
              title="Preparing"
              currentStep={currentStep}
              stepNumber={3}
            />
            <StepIcon
              icon={<MdPreview />}
              title="Delivered"
              currentStep={currentStep}
              stepNumber={4}
            />
          </div>
        </div>
        <div className="flex w-[80%] shadow-lg flex-col max-h-[500px] items-center">
          {renderContent()}
        </div>
      </div>
      {/* <div className="flex justify-end mt-8">
        <button
          className={`px-4  py-2 rounded ${
            currentStep === 1
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } ${currentStep === 1 ? "hidden" : "block"} text-white mr-4`}
          onClick={handlePrev}
          disabled={currentStep === 1}
        >
          Previous
        </button>
        <button
          className={`px-4 py-2 rounded ${
            currentStep === 4
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
          onClick={handleNext}
          disabled={currentStep === 4}
        >
          Next
        </button>
      </div> */}
    </div>
  );
};

const StepIcon = ({ icon, title, currentStep, stepNumber }: any) => {
  return (
    <div className="flex items-center space-x-4">
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 ${
          currentStep >= stepNumber ? "text-blue-500" : "text-gray-400"
        }`}
      >
        {icon}
      </div>
      <div>
        <p
          className={`font-bold ${
            currentStep >= stepNumber ? "text-blue-500 " : "text-gray-400"
          }`}
        >
          {title}
        </p>
        <p className="text-sm text-gray-500">Your details here</p>
      </div>
    </div>
  );
};

export default Stepperfun;
