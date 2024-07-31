import { Spinner, TextEditor } from "@/common";
import Buttons from "@/common/Button";
import NameMark from "@/common/NameMark";
import { EditInput } from "@/dashboard/component/EditRoute/EditInput";
import { RootState, useAppSelector } from "@/redux/store";
import { url } from "@/routes";
import { Saas_Plan } from "@/types";
import axios from "axios";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

const EditSaas = () => {
  const selectedItem: Saas_Plan = useAppSelector(
    (state: RootState) => state.fetchDashData.selectedItem
  );
  const { token } = useAppSelector((state: RootState) => state.signin);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(selectedItem || {});

  const desc = localStorage.getItem("desc") || "";
  const cleanedDesc = desc.replace(/^"|"$/g, "");

  const handleEditSaas = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(
        `${url}/rarasaas-plan/subscription/${form?._id}`,
        form,
        {
          headers: {
            Authorization: token!,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 200) {
        localStorage.removeItem("desc");
        toast.success("successfully updated !");
      }
    } catch (err) {
      toast.error("something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="mt-16">
        <NameMark label="Edit Saas Plan" variant="primary" />
        <div className="flex gap-8 flex-wrap">
          <EditInput
            basis={100}
            label="Saas Name"
            value={form?.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
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
          onClick={handleEditSaas}
        >
          {loading ? <Spinner btn /> : "Edit Saas"}
        </Buttons>
      </form>
    </>
  );
};

export default EditSaas;
