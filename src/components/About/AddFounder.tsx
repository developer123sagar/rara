/* eslint-disable @typescript-eslint/no-explicit-any */
import { Spinner, TextEditor, Upload } from "@/common";
import Buttons from "@/common/Button";
import NameMark from "@/common/NameMark";
import { EditInput } from "@/dashboard/component/EditRoute/EditInput";
import { RootState, useAppSelector } from "@/redux/store";
import { url } from "@/routes";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function AddFounder() {
  const [loading, setLoading] = useState(false);

  const initialFormState = {
    name: "",
    image: "",
    extra: "",
  };

  const [form, setForm] = useState(initialFormState);
  const { token } = useAppSelector((state: RootState) => state.signin);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!form.name) {
      toast.error("Please enter the name");
    }
    try {
      const res = await axios.post(`${url}/rarafounder`, form, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      if (res.status === 200) {
        toast.success(res.data.message);
      }
    } catch (err: any) {
      toast.error(err.response.data.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="w-full">
        <NameMark label="Add Founder" variant="primary" />
        <form className="mt-6">
          <div className="flex flex-wrap justify-between gap-8 mb-6">
            <EditInput
              basis={100}
              label="Founder Name"
              value={form?.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeH="Enter Founder Name"
            />
          </div>
          <div>
            <label className="mb-1 font-bold text-[#141312]">Description</label>
            <TextEditor setForm={setForm} fieldName={"extra"} />
          </div>
          <div className="flex justify-between">
            <div className="mt-6">
              <div className="bg-[#ededed] h-[2px] w-full mt-[30px] mb-6">
                <span className="relative -top-[20px] inline-block py-[10px] text-sm font-semibold text-black mb-2">
                  Founder Images
                </span>
              </div>
              <Upload
                setForm={setForm}
                accept=".jpg, .jpeg, .png"
                fieldName="image"
                imgTitle="founder"
              />
            </div>
          </div>
        </form>
        <div className="mt-6 flex justify-end gap-10 mb-2">
          <Buttons disabled={loading} type="button" onClick={handleFormSubmit}>
            {loading ? <Spinner btn /> : "Create"}
          </Buttons>
          <Buttons back type="button" variant="destructive">
            Cancel
          </Buttons>
        </div>
      </main>
    </>
  );
}
