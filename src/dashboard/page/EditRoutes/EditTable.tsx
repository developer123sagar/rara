/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormEvent, useState } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { IAllTable } from "@/types";
import { Spinner, Upload } from "@/common";
import { UpdateDataWithUpdate } from "@/redux/dashboard/fetchApiData/fetchApiDataSlice";
import NameMark from "@/common/NameMark";
import { EditInput } from "@/dashboard/component/EditRoute/EditInput";
import Buttons from "@/common/Button";
import toast from "react-hot-toast";

const EditTable = () => {
  const selectedItem: IAllTable = useAppSelector(
    (state: RootState) => state.fetchDashData.selectedItem
  );

  const { loading } = useAppSelector((state: RootState) => state.fetchDashData);
  const { token } = useAppSelector((state: RootState) => state.signin);
  const dispatch = useAppDispatch();

  const [form, setForm] = useState(selectedItem || {});

  const handleUpdateForm = async (e: FormEvent) => {
    e.preventDefault();
    const { _id, isbooked, isRemoved, status, ...formWithoutId } = form;

    const updatedForm = {
      ...formWithoutId,
      tableId: _id,
    };

    await dispatch(
      UpdateDataWithUpdate({
        api: "raratable/update_table",
        form: updatedForm,
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

  return (
    <>
      <div className="mt-16">
        <NameMark label="Edit Table Details" variant="primary" />
        <form className="mt-6">
          <div className="flex gap-8 mt-6 justify-between flex-wrap">
            <EditInput
              label="Table Number"
              basis={48}
              value={form?.tableNo}
              onChange={(e) => setForm({ ...form, tableNo: e.target.value })}
              placeH="Enter table number"
            />
            <EditInput
              label="Booking Amount"
              type="number"
              basis={48}
              value={form?.bookingamount}
              onChange={(e) =>
                setForm({ ...form, bookingamount: e.target.value })
              }
              placeH="Enter booking amount"
            />
            <EditInput
              label="Number of seats"
              min={1}
              type="number"
              basis={48}
              value={form?.number_of_seats}
              onChange={(e) =>
                setForm({ ...form, number_of_seats: parseInt(e.target.value) })
              }
              placeH="Enter booking amount"
            />
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black">Image</label>
            <div className="flex gap-2">
              <Upload
                accept=".jpg,.png,.svg,.jpeg"
                imgTitle="table"
                setForm={setForm}
                fieldName="image"
                existingImg={[form?.image]}
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
      </div>
    </>
  );
};

export default EditTable;
