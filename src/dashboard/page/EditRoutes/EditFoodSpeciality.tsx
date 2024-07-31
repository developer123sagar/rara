import { Spinner, TextEditor } from "@/common";
import Buttons from "@/common/Button";
import NameMark from "@/common/NameMark";
import Breadcrumb from "@/dashboard/component/BreadCrumb/BreadCrumb";
import { EditInput } from "@/dashboard/component/EditRoute/EditInput";
import { UpdateData } from "@/redux/dashboard/fetchApiData/fetchApiDataSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { IFoodSpeciality } from "@/types";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

const EditFoodSpeciality = () => {
  const { selectedItem, loading } = useAppSelector(
    (state: RootState) => state.fetchDashData
  );
  const { token } = useAppSelector((state: RootState) => state.signin);
  const [form, setForm] = useState<IFoodSpeciality>(selectedItem || {});
  const dispatch = useAppDispatch();

  const desc = localStorage.getItem("desc") || "";
  const cleanedDesc = desc.replace(/^"|"$/g, "");

  const handleUpdateForm = async (e: FormEvent) => {
    e.preventDefault();
    await dispatch(
      UpdateData({ api: "rarafood-speciality", form, token: token! })
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

  return (
    <>
      <Breadcrumb pageName="EditFoodSpeciality" />
      <NameMark label="Edit Food Speciality Details" variant="primary" />
      <form onSubmit={handleUpdateForm}>
        <div className="w-full flex gap-5 justify-between my-5">
          <EditInput
            basis={45}
            label="Category Name"
            value={form?.name || ""}
            placeH="Enter your category name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <EditInput
            basis={45}
            label="Price"
            type="number"
            value={form?.amount || ""}
            placeH="Enter price"
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
        </div>
        <TextEditor
          existingDescription={cleanedDesc}
          setForm={setForm}
          fieldName="extra"
          width={1050}
        />
        <Buttons type="submit" className="float-right mt-4" variant="default">
          {loading ? <Spinner btn /> : "Update"}
        </Buttons>
      </form>
    </>
  );
};

export default EditFoodSpeciality;
