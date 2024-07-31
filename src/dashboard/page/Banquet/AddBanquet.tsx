/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
import { Select, Spinner, TextEditor } from "@/common";
import Buttons from "@/common/Button";
import NameMark from "@/common/NameMark";
import { RootState, useAppSelector } from "@/redux/store";
import { url } from "@/routes";
import { IBanquetState, IFoodItem, SelectOption } from "@/types";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

const AddBanquet = () => {
  const [selectedOptions, setSelectedOptions] = useState<
    SelectOption[] | undefined
  >([]);
  const [data, setData] = useState<IFoodItem[] | []>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAppSelector((state: RootState) => state.signin);

  const [selectedPlan, setSelectedPlan] = useState("basicPlan");

  const [form, setForm] = useState<IBanquetState>({
    price: null,
    description: "",
    foods: selectedOptions?.map((option) => option.value) || [],
  });

  const handleSelectChange = (selectedItems: SelectOption[] | undefined) => {
    setSelectedOptions(selectedItems);
    const selectedFoodItemIds =
      selectedItems?.map((option) => option.value) || [];
    setForm((prevForm) => ({
      ...prevForm,
      foods: selectedFoodItemIds,
    }));
  };

  const options =
    (data &&
      data?.map((foodItem) => ({
        label: foodItem.name,
        value: foodItem._id,
      }))) ||
    [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${url}/rarafood/restaurant`, {
          headers: {
            Authorization: token,
          },
        });
        setData(res.data?.Data);
      } catch (err) {
        throw err;
      }
    };
    fetchData();
  }, []);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${url}/raraBanquet-Menu`,
        {
          [selectedPlan]: form,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (res.status === 200) {
        toast.success("Successfully created");
      }
    } catch (err: any) {
      toast.success(
        err.response.data.message || "Error occured while creating"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="mb-5 overflow-y-auto">
        <NameMark label="Add Banquet" variant="primary" />
        <form className="mt-10">
          <div className="w-full justify-between flex gap-4 flex-wrap mt-4">
            <div className="w-[48%]">
              <label htmlFor="plan">Select Plan</label>
              <select
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="form-control w-full text-sm py-3 pl-1 rounded placeholder:text-gray-500 border border-gray-200 my-1"
                name="plan"
                id="plan"
              >
                <option value="basicPlan">Basic Plan</option>
                <option value="premiumPlan">Premium Plan</option>
                <option value="VipPlan">VIP Plan</option>
              </select>
            </div>
            <div className="basis-[48%]">
              <label
                className={`text-[black] font-semibold text-[14px] mb-2`}
                htmlFor="select food"
              >
                Select Food
              </label>
              <Select
                multiple
                value={selectedOptions || []}
                onChange={handleSelectChange}
                options={options}
              />
            </div>
            <div className="basis-[48%]">
              <label className="text-sm font-semibold text-black">Price</label>
              <input
                type={"number"}
                required
                className={`form-control text-sm w-full py-2 pl-1 rounded placeholder:text-gray-500 border border-gray-200 my-1`}
                onChange={(e) =>
                  setForm({ ...form, price: parseInt(e.target.value) })
                }
              />
            </div>

            <div className="basis-[48%]"></div>
          </div>
          <div className="my-3">
            <h1 className={`text-[black] font-semibold text-[14px] mb-2`}>
              Description
            </h1>
            <TextEditor setForm={setForm} fieldName={"description"} />
          </div>
          <div className="mt-6 flex justify-end gap-10 mb-2">
            <Buttons
              disabled={loading}
              type="button"
              onClick={handleFormSubmit}
            >
              {loading ? <Spinner btn /> : "Create"}
            </Buttons>
            <Buttons back variant="destructive">
              Cancel
            </Buttons>
          </div>
        </form>
      </main>
    </>
  );
};

export default AddBanquet;
