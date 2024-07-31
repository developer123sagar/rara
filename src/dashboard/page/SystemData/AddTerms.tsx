import { FormEvent, useState } from "react";
import { url } from "@/routes";
import axios from "axios";
import { RootState, useAppSelector } from "@/redux/store";
import { Spinner, TextEditor } from "@/common";
import Buttons from "@/common/Button";
import NameMark from "@/common/NameMark";
import { EditInput } from "@/dashboard/component/EditRoute/EditInput";
import toast from "react-hot-toast";

export default function AddTerms() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    body: "",
  });
  const { token } = useAppSelector((state: RootState) => state.signin);
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${url}/raraterms-and-condition`, form, {
        headers: {
          Authorization: token!,
        },
      });
      if (res.status === 200) toast.success("Successfully created");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full mb-4 overflow-y-auto">
        <NameMark label="Add Terms & Condtions" variant="primary" />
        <form className="mt-5">
          <div className="flex flex-wrap gap-5 justify-between">
            <EditInput
              basis={100}
              label="Title"
              value={form?.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeH="Enter title"
            />
          </div>

          <div className="mt-5">
            <h1 className={`text-[black]  font-semibold text-[14px]`}>
              Description
            </h1>
            <TextEditor setForm={setForm} fieldName={"body"} />
          </div>
          <div className="mt-6 flex justify-end gap-10 mb-2">
            <Buttons
              disabled={loading}
              type="submit"
              onClick={handleFormSubmit}
            >
              {loading ? <Spinner btn /> : "Create"}
            </Buttons>
            <Buttons back variant="destructive">
              Cancel
            </Buttons>
          </div>
        </form>
      </div>
    </>
  );
}
