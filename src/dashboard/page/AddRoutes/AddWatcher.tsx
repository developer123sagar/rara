/* eslint-disable @typescript-eslint/no-explicit-any */
import { Spinner, Upload } from "@/common";
import Buttons from "@/common/Button";
import NameMark from "@/common/NameMark";
import { EditInput } from "@/dashboard/component/EditRoute/EditInput";
import { RootState, useAppSelector } from "@/redux/store";
import { url } from "@/routes";
import axios from "axios";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

const AddWatcher = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    Name: "",
    Email: "",
    password: "",
    images: "",
  });

  const { token } = useAppSelector((state: RootState) => state.signin);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${url}/rarawatcher`, form, {
        headers: {
          Authorization: token,
        },
      });
      if (res.status === 200) {
        toast.success("Successfully created");
      }
    } catch (err: any) {
      toast.error(err.response.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="w-full">
      <NameMark label="Add Watcher" variant="primary" />
      <form>
        <div className="flex flex-wrap justify-between gap-8 mt-10">
          <EditInput
            label="Watcher Name"
            basis={48}
            value={form?.Name}
            onChange={(e) => setForm({ ...form, Name: e.target.value })}
            placeH="Enter Watcher Name"
          />
          <EditInput
            label="Watcher Email"
            basis={48}
            value={form?.Email}
            onChange={(e) => setForm({ ...form, Email: e.target.value })}
            placeH="Enter Watcher Email"
          />
          <EditInput
            label="Password"
            basis={48}
            type="password"
            value={form?.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeH="Enter Password"
          />
        </div>

        <div className="flex justify-between">
          <div className="mt-6">
            <div className="bg-[#ededed] h-[2px] w-full mt-[30px] mb-6">
              <span className="relative -top-[20px] inline-block py-[10px] bg-slate-50 text-sm font-semibold text-black mb-2">
                Watcher Image ?
              </span>
            </div>
            <Upload
              accept=".jpg, .jpeg, .png"
              fieldName="images"
              imgTitle="watcher"
              setForm={setForm}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-10 mb-2">
          <Buttons disabled={loading} type="submit" onClick={handleFormSubmit}>
            {loading ? <Spinner btn /> : "Create"}
          </Buttons>
          <Buttons back variant="destructive">
            Cancel
          </Buttons>
        </div>
      </form>
    </main>
  );
};

export default AddWatcher;
