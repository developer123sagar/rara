import { Spinner, TextEditor } from "@/common";
import Buttons from "@/common/Button";
import NameMark from "@/common/NameMark";
import { EditInput } from "@/dashboard/component/EditRoute/EditInput";
import { UpdateDataWithUpdate } from "@/redux/dashboard/fetchApiData/fetchApiDataSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { PlanName } from "@/types";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

const EditSaasPlanDetails = () => {
  const selectedItem: PlanName = useAppSelector(
    (state: RootState) => state.fetchDashData.selectedItem
  );
  const { token } = useAppSelector((state: RootState) => state.signin);
  const { loading } = useAppSelector((state: RootState) => state.fetchDashData);
  const [form, setForm] = useState(selectedItem || {});
  const dispatch = useAppDispatch();
  const durationInMonths = form?.Duration ? Math.ceil(form?.Duration / 30) : 0;

  const handleUpdateForm = async (e: FormEvent) => {
    e.preventDefault();
    await dispatch(
      UpdateDataWithUpdate({
        api: `rarasaas-plan/edit/${selectedItem?._id}`,
        form: form,
        token: token!,
      })
    ).then((res) => {
      if (UpdateDataWithUpdate.fulfilled.match(res)) {
        toast.success("Successfully updated");
      } else {
        const err = res.error.message || "something went wrong";
        toast.error(err);
      }
    });
    localStorage.removeItem("desc");
  };

  const desc = localStorage.getItem("desc") || "";
  const cleanedDesc = desc.replace(/^"|"$/g, "");

  return (
    <>
      <form className="mt-16">
        <NameMark label="Edit Saas Plan" variant="primary" />
        <div className="flex gap-8 flex-wrap mt-6">
          <EditInput
            basis={48}
            label="Plan Name"
            value={form?.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <EditInput
            basis={48}
            label="Plan Duration (in month)"
            min={1}
            value={durationInMonths.toString()}
            onChange={(e) => {
              const months = parseInt(e.target.value);
              setForm({ ...form, Duration: months * 30 });
            }}
          />
          <EditInput
            basis={48}
            type="number"
            label="Plan Price"
            min={1}
            value={form?.price as number}
            onChange={(e) =>
              setForm({ ...form, price: parseInt(e.target.value) })
            }
          />
        </div>
        <div className="my-10">
          <label className="text-[black] font-semibold text-[14px]">
            Description
          </label>
          <TextEditor
            existingDescription={cleanedDesc}
            setForm={setForm}
            fieldName="description"
          />
        </div>
        <Buttons
          type="button"
          className="mt-4 float-right"
          onClick={handleUpdateForm}
        >
          {loading ? <Spinner btn /> : "Edit Plan Details"}
        </Buttons>
      </form>
    </>
  );
};

export default EditSaasPlanDetails;
