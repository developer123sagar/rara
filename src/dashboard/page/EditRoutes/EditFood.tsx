import { Spinner, TextEditor, Upload } from "@/common";
import Buttons from "@/common/Button";
import NameMark from "@/common/NameMark";
import { EditInput } from "@/dashboard/component/EditRoute/EditInput";
import { UpdateData } from "@/redux/dashboard/fetchApiData/fetchApiDataSlice";
import { fetchFoodCategory } from "@/redux/foods/foodDetailSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { IFoodItem } from "@/types";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

const EditFood = () => {
  const selectedItem: IFoodItem = useAppSelector(
    (state: RootState) => state.fetchDashData.selectedItem
  );
  const { category } = useAppSelector((state: RootState) => state.foodDetails);

  const { loading } = useAppSelector((state: RootState) => state.fetchDashData);
  const { token } = useAppSelector((state: RootState) => state.signin);
  const [form, setForm] = useState(selectedItem || {});
  const dispatch = useAppDispatch();

  const [selectedCategory, setSelectedCategory] = useState<string>(
    form?.foodCategory
  );

  const handleUpdateForm = async (e: FormEvent) => {
    e.preventDefault();
    await dispatch(
      UpdateData({ api: "rarafood", form: form, token: token! })
    ).then((res) => {
      if (UpdateData.fulfilled.match(res)) {
        toast.success("Successfully updated");
      } else {
        const err = res.error.message || "something went wrong";
        toast.error(err);
      }
    });
    localStorage.removeItem("desc");
  };

  // handle food category
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    setSelectedCategory(selectedCategory);
    setForm((prevForm) => ({
      ...prevForm,
      foodCategory: selectedCategory,
    }));
  };

  useEffect(() => {
    dispatch(fetchFoodCategory({}));
  }, [dispatch]);

  const desc = localStorage.getItem("desc") || "";
  const cleanedDesc = desc.replace(/^"|"$/g, "");

  return (
    <>
      <form className="mt-16">
        <NameMark label="Edit Food Details" variant="primary" />
        <div className="flex gap-8 mt-6 justify-between flex-wrap">
          <EditInput
            basis={48}
            label="Food Name"
            value={form?.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeH="Enter Food name"
          />
          <EditInput
            basis={48}
            label="Price"
            type="number"
            value={form?.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeH="Enter Food price"
          />
          <EditInput
            basis={48}
            label="Quantity"
            type="number"
            value={form?.minQuantity as number}
            onChange={(e) =>
              setForm({ ...form, minQuantity: parseInt(e.target.value) })
            }
            placeH="Enter Food quantity"
          />
          <EditInput
            label="Food Making Time"
            basis={48}
            type="number"
            value={form?.foodMakingTime?.minutes as number}
            onChange={(e) =>
              setForm({
                ...form,
                foodMakingTime: { minutes: parseInt(e.target.value) },
              })
            }
            placeH="Enter food making time"
          />

          <div className="basis-[48%]">
            <h1 className={`text-[black] font-semibold`}>
              Select a food Category
            </h1>
            <select
              id="foodGroupSelect"
              className={`form-control text-sm w-full py-3 pl-1 rounded placeholder:text-gray-500 border border-gray-200 my-1`}
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              {category.map((item) => (
                <option key={item.name} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="my-10">
          <label className="text-[black] font-semibold text-[14px]">
            Description
          </label>
          <TextEditor
            existingDescription={cleanedDesc}
            setForm={setForm}
            fieldName="subTitle"
            width={1000}
          />
        </div>

        <div>
          <label className="mb-2.5 block text-black">Food Image</label>
          <div className="flex gap-2">
            <Upload
              accept=".jpg,.png,.svg,.jpeg"
              imgTitle="food"
              setForm={setForm}
              fieldName="activeImage"
              existingImg={[form?.activeImage]}
            />
          </div>
        </div>
        <Buttons
          type="submit"
          onClick={handleUpdateForm}
          className="float-right"
        >
          {loading ? <Spinner btn /> : "Update"}
        </Buttons>
      </form>
    </>
  );
};

export default EditFood;
